import { getAllEVPlugs, getCloseEVPlugs } from "./opendata";
import { plug, plugRaw } from "./types";
import { getRating } from "./maps_api/reviews";
import { getTravelTime } from "./maps_api/directions";
import { assignBestCost, assignBestRating, assignBestTime } from "./classify";
import { getStreetViewImageUrl } from "./maps_api/streetView";
import { filterForPlugType } from "./filters";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tkzqhmeownsmxalsizmq.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrenFobWVvd25zbXhhbHNpem1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI2Nzc4MzEsImV4cCI6MjAzODI1MzgzMX0.xBCr-r_K-9GtrloxEscjIZbc5lgEaH8nmOwqthZbnbg"
const supabase = createClient(supabaseUrl, supabaseKey)

function getRandomValue(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }
  
export async function processPlugs(lat:number|null,lon:number|null,range:number|null,time_for_charging_hours:number|null,battery_capacity:number|null,outletTypes:string[]|null,percentage_to_charge:number|null):Promise<plug[]>{
    try {
      let time:number | null = null;
      let image:string|null = null;
      let plugsRaw:plugRaw[]= [];
      if(lat && lon){
        plugsRaw= await getCloseEVPlugs(lat,lon,range);
      }
      else{
        plugsRaw= await getAllEVPlugs();
      }
      let plugs:plug[]=[];
      try {
        let { data, error } = await supabase.from('stations').select('*');
        if(data){
          data.forEach((dato:any) => {
            if(dato.user_uuid && 
              dato.lat && dato.lon &&
              dato.street && 
              dato.outletType &&
              dato.powerWatt &&
              dato.cost){

                plugsRaw.push({scode:dato.user_uuid,
                  pcoordinate:{
                    y:dato.lat,
                    x:dato.lon,
                    srid:4326,
                  },
                  pmetadata:{city:"",state:"",capacity:1,provider:"",accessInfo:"",accessType:"",reservable:true,paymentInfo:"",address:dato.street},
                  "smetadata": {"outlets": [{"id": 1, "maxPower": dato.powerWatt, "maxCurrent": 1, "minCurrent": 1, "outletTypeCode": dato.outletType}]},
                  "pactive": true,
                  "pavailable": true,
                  "pcode": "",
                  "pname": "string",
                  "porigin": "string",
                  "ptype": "string",
                  "sactive": true,
                  "savailable": true,
                  "scoordinate": {
                    "x": 1,
                    "y": 1,
                    "srid": 1
                  },
                  "sname": "string",
                  "sorigin": "string",
                  "stype": "string"
                })
              }
          })
              
        }
        else{
          console.log(error);
          throw error;
        }
      } catch (error) {
        console.log(error);
        throw new Error("Supabase fetch failed");
      }
      const promises = plugsRaw.map( async (plugRaw) => {
        if(lat && lon){
          time = await getTravelTime(lat,lon,plugRaw.pcoordinate.y,plugRaw.pcoordinate.x);
          image = await getStreetViewImageUrl(plugRaw.pcoordinate.y,plugRaw.pcoordinate.x);
        }
        if(plugRaw.smetadata.outlets[0].maxPower>500){
          plugRaw.smetadata.outlets[0].maxPower = getRandomValue(10, 22)
        }
        plugs.push(
          {uuid:plugRaw.scode,
            coords:{
              lat:plugRaw.pcoordinate.y,
              lon:plugRaw.pcoordinate.x
            },
            recharge_time_estimate: null,
            cost_estimate: null,
            roaDistance: time,
            outletType: plugRaw.smetadata.outlets[0].outletTypeCode,
            powerWatt: plugRaw.smetadata.outlets[0].maxPower,
            rating: await getRating(plugRaw.pcoordinate.y,plugRaw.pcoordinate.x),
            cost: getRandomValue(0.025, 0.037)*plugRaw.smetadata.outlets[0].maxPower,
            street:plugRaw.pmetadata.address,
            best_cost:false,
            best_rating:false,
            best_time_recharging:false,
            count:0,
            street_view_image: image,
            best_overall:false
          }
        );
      });
      await Promise.all(promises);
      //does not work
      //collapsePlugs(plugs);
      if(lat && lon){
        if(time_for_charging_hours && battery_capacity && percentage_to_charge){
          plugs = plugs.filter(value => ((battery_capacity*percentage_to_charge*0.01) / value.powerWatt) < time_for_charging_hours);
          plugs.map((plug)=>{
            plug.recharge_time_estimate = (battery_capacity*percentage_to_charge*0.01) / plug.powerWatt;
            plug.cost_estimate = plug.recharge_time_estimate *  plug.cost * plug.powerWatt;
          })
        }
        if(outletTypes){
          plugs = filterForPlugType(outletTypes,plugs);
        }
        plugs.sort((a, b) => getScore(a)  - getScore(b));
        if(plugs[0]){
          plugs[0].best_overall =  true;
        }
        assignBestCost(plugs);
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

function getScore(plug:plug){  const roadDistanceWeight = 0.7;
  const costWeight = 0.3;

  const roadDistance = plug.roaDistance ?? Infinity;
  const cost = plug.cost ?? Infinity;

  return (roadDistanceWeight * roadDistance) + (costWeight * cost);
}
  