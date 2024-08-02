import dotenv from "dotenv";
dotenv.config();
import express, { Express, Request, Response } from "express";
import { getAllEVPlugs, getCloseEVPlugs } from "./opendata";
import { plug, plugRaw } from "./types";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.get("/destinations", async (req: Request, res: Response) => {
  const query = req.query;
  if(query.latitude && query.longitude && query.distance_meters){
    const lat:number = +query.latitude;
    const long:number = +query.longitude;
    const distance_meters = + query.distance_meters;
    if(Number.isNaN(lat) || Number.isNaN(long)){
      res.status(403).send("Bad request, number not formatted");
      return;
    }
    if(!Number.isNaN(lat) && !Number.isNaN(long) ){
      const plugsRaw:plugRaw[]= await getCloseEVPlugs(lat,long,distance_meters);
      let plugs:plug[]=[];
      plugsRaw.forEach(plugRaw => {
        plugs.push(
          {uuid:plugRaw.scode,
            roaDistance: 1,
            outletType: plugRaw.smetadata.outlets[0].outletTypeCode,
            powerWatt: plugRaw.smetadata.outlets[0].maxPower,
            reviews: 1,
            cost: 1}
        );
      });
      res.json(plugs);
      return;
    }
  }
  else{
    res.status(404).send("Not enough arguments");
    return;
  }
});

app.get("/getAll", async (req: Request, res: Response) => {
  const plugsRaw:plugRaw[]= await getAllEVPlugs();
  let plugs:plug[]=[];
  plugsRaw.forEach(plugRaw => {
    plugs.push(
      {uuid:plugRaw.scode,
        roaDistance: 1,
        outletType: plugRaw.smetadata.outlets[0].outletTypeCode,
        powerWatt: plugRaw.smetadata.outlets[0].maxPower,
        reviews: 1,
        cost: 1}
    );
  });
  res.json(plugs);
  return;
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

