import dotenv from "dotenv";
dotenv.config();
import express, { Express, Request, Response } from "express";
import { getAllEVPlugs, getCloseEVPlugs } from "./opendata";
import { plug, plugRaw } from "./types";
import swaggerUi from "swagger-ui-express";
import swaggerOutput from "./swagger_output.json";
import { getRating } from "./maps_api/reviews";
import { getTravelTime } from "./maps_api/directions";
import { assignBestCost, assignBestRating, assignBestTime } from "./classify";

dotenv.config();

const app: Express = express();
const port = 3052;
function addCORS(res: Response) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "*");
}

//app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerOutput));

app.get("/destinations", async (req: Request, res: Response) => {

  const query = req.query;
  //INPUT DESTINATION + AUTONOMY LEFT
  if(query.latitude && query.longitude && query.distance_meters){
    //getting query string params
    const lat:number = +query.latitude;
    const long:number = +query.longitude;
    const distance_meters = + query.distance_meters;
    //params are not well formatted
    if(Number.isNaN(lat) || Number.isNaN(long)){
      res.status(400).send("Bad request, number not formatted");
      return;
    }
    if(!Number.isNaN(lat) && !Number.isNaN(long) ){
      try {
        const plugs:plug[] = await processPlugs(lat,long,distance_meters);
        res.json(plugs);
        return;
      } catch (error) {
        res.status(500).send("Internal server error");
      }
    }
  }
  else{
    res.status(404).send("Not enough arguments");
    return;
  }
});

app.get("/getAll", async (req: Request, res: Response) => {
  try {
    const plugs:plug[] = await processPlugs(null,null,null);
    addCORS(res);
    res.json(plugs);
    return;
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerOutput));

app.listen(port, '0.0.0.0');

function getRandomValue(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

async function processPlugs(lat:number|null,lon:number|null,distance_meters:number|null):Promise<plug[]>{
  try {
    let time:number | null = null;
    let plugsRaw:plugRaw[]= [];
    if(lat && lon && distance_meters){
      plugsRaw= await getCloseEVPlugs(lat,lon,distance_meters);
    }
    else{
      plugsRaw= await getAllEVPlugs();
    }
    let plugs:plug[]=[];
    const promises = plugsRaw.map( async (plugRaw) => {
      if(lat && lon && distance_meters){
        time = await getTravelTime(lat,lon,plugRaw.pcoordinate.y,plugRaw.pcoordinate.x);
      }
      plugs.push(
        {uuid:plugRaw.scode,
          coords:{
            lat:plugRaw.pcoordinate.y,
            lon:plugRaw.pcoordinate.x
          },
          roaDistance: time,
          outletType: plugRaw.smetadata.outlets[0].outletTypeCode,
          powerWatt: plugRaw.smetadata.outlets[0].maxPower,
          rating: await getRating(plugRaw.pcoordinate.y,plugRaw.pcoordinate.x),
          cost: getRandomValue(0.65, 0.90),
          street:plugRaw.pmetadata.address,
          best_cost:false,
          best_rating:false,
          best_time:false
        }
      );
      //se rating è -1 vuol dire che non è riuscito a fetcharlo
    });
    await Promise.all(promises);
    assignBestCost(plugs);
    assignBestRating(plugs);
    assignBestTime(plugs);
    plugs = plugs.slice(0, 30);
    return plugs;
  }
  catch(error){
    throw new Error("Couldn't process plugs data");
  }
}

