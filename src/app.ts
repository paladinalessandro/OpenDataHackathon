import dotenv from "dotenv";
dotenv.config();
import express, { Express, Request, Response } from "express";
import { plug, plugRaw } from "./types";
import swaggerUi from "swagger-ui-express";
import swaggerOutput from "./swagger_output.json";
import { processPlugs } from "./apilogic";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
const host = process.env.HOST || '127.0.0.1'
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
  let percentage_to_charge:number|null = null;
  let outletTypes:string[] = [];
  let range:number|null = null;
  if(query.latitude && query.longitude){
    //getting query string params
    const lat:number = +query.latitude;
    const long:number = +query.longitude;
    if(query.range){
      range = +query.range;
    }
    if(query.time_for_charging_hours && query.battery_capacity && query.percentage_to_charge){
      time_for_charging_hours = + query.time_for_charging_hours;
      battery_capacity = + query.battery_capacity;
      percentage_to_charge = + query.percentage_to_charge;
      if(Number.isNaN(time_for_charging_hours) && Number.isNaN(battery_capacity) && Number.isNaN(percentage_to_charge)){
        res.status(400).send("Bad request, number not formatted");
        return;
      }
    }
    if(query.outlet_types){
      outletTypes = query.outlet_types as string[];
    }
    //params are not well formatted
    if(Number.isNaN(lat) || Number.isNaN(long)){
      res.status(400).send("Bad request, number not formatted");
      return;
    }
    //params are well formatted
    if(!Number.isNaN(lat) && !Number.isNaN(long) ){
      try {
        const plugs:plug[] = await processPlugs(lat,long,range,time_for_charging_hours,battery_capacity,outletTypes,percentage_to_charge);
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
    const plugs:plug[] = await processPlugs(null,null,null,null,null,null,null);
    addCORS(res);
    res.json(plugs);
    return;
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
});

app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerOutput));

app.listen(port as number, host);



