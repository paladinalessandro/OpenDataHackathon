import dotenv from "dotenv";
dotenv.config();
import express, { Express, Request, Response } from "express";
import { getAllEVPlugs, getCloseEVPlugs } from "./opendata";
import { plug, plugRaw } from "./types";
import swaggerUi from "swagger-ui-express";
import swaggerOutput from "./swagger_output.json";
import { getRating } from "./maps_api/reviews";
import { getTravelTime } from "./maps_api/directions";
import { assignBestCost, assignBestRating, assignBestTime, collapsePlugs } from "./classify";
import { getStreetViewImageUrl } from "./maps_api/streetView";
import { filterForPlugType } from "./filters";

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
  let time_for_charging_hours:number|null = null;
  let battery_capacity:number|null = null;
  let outletTypes:string[] = [];
  //INPUT DESTINATION + AUTONOMY LEFT
  if(query.latitude && query.longitude){
    //getting query string params
    const lat:number = +query.latitude;
    const long:number = +query.longitude;
    if(query.time_for_charging_hours && query.battery_capacity){
      time_for_charging_hours = + query.time_for_charging_hours;
      battery_capacity = + query.battery_capacity;
    }
    if(query.outlet_types){
      outletTypes = query.outlet_types as string[];
    }
    //params are not well formatted
    if(Number.isNaN(lat) || Number.isNaN(long)){
      res.status(400).send("Bad request, number not formatted");
      return;
    }
    if(!Number.isNaN(lat) && !Number.isNaN(long) ){
      try {
        const plugs:plug[] = await processPlugs(lat,long,time_for_charging_hours,battery_capacity,outletTypes);
        addCORS(res);
        res.json(plugs);
        return;
      } catch (error) {
        console.log(error);
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
    const plugs:plug[] = await processPlugs(null,null,null,null,null);
    addCORS(res);
    res.json(plugs);
    return;
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
});

app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerOutput));

app.listen(port, '0.0.0.0');

function getRandomValue(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

async function processPlugs(lat:number|null,lon:number|null,time_for_charging_hours:number|null,battery_capacity:number|null,outletTypes:string[]|null):Promise<plug[]>{
  try {
    let time:number | null = null;
    let image:string|null = null;
    let plugsRaw:plugRaw[]= [];
    if(lat && lon){
      plugsRaw= await getCloseEVPlugs(lat,lon);
    }
    else{
      plugsRaw= await getAllEVPlugs();
    }
    let plugs:plug[]=[];
    const promises = plugsRaw.map( async (plugRaw) => {
      if(lat && lon){
        time = await getTravelTime(lat,lon,plugRaw.pcoordinate.y,plugRaw.pcoordinate.x);
        image = await getStreetViewImageUrl(lat,lon);
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
          best_time_recharging:false,
          count:0,
          street_view_image: image
        }
      );
    });
    await Promise.all(promises);
    //does not work
    //collapsePlugs(plugs);
    if(lat && lon){
      if(time_for_charging_hours && battery_capacity ){
        plugs = plugs.filter(value => (battery_capacity / value.powerWatt) < time_for_charging_hours);
      }
      if(outletTypes){
        plugs = filterForPlugType(outletTypes,plugs);
      }
      plugs.sort((a, b) => getScore(a)  - getScore(b));
      assignBestCost(plugs);
      assignBestRating(plugs);
      assignBestTime(plugs);
      plugs = plugs.slice(0, 30);
    }
    plugs = plugs.filter(value => value !== undefined);
    plugs = plugs.filter(value => value !== null);
    return plugs;
  }
  catch(error){
    console.log(error);
    throw new Error("Couldn't process plugs data");
  }
}

function getScore(plug:plug){
  if(plug.roaDistance){
    return plug.roaDistance;
  }
  return Infinity;
}

