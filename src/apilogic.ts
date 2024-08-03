import { getAllEVPlugs, getCloseEVPlugs } from "./opendata";
import { plug, plugRaw } from "./types";
import { getRating } from "./maps_api/reviews";
import { getTravelTime } from "./maps_api/directions";
import { assignBestCost, assignBestRating, assignBestTime, collapsePlugs } from "./classify";
import { getStreetViewImageUrl } from "./maps_api/streetView";
import { filterForPlugType } from "./filters";

function getRandomValue(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }
  
export async function processPlugs(lat:number|null,lon:number|null,time_for_charging_hours:number|null,battery_capacity:number|null,outletTypes:string[]|null):Promise<plug[]>{
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
  
  const roadDistanceWeight = 0.4;
  const costWeight = 0.6;

  const roadDistance = plug.roaDistance ?? Infinity;
  const cost = plug.cost ?? Infinity;

  return (roadDistanceWeight * roadDistance) + (costWeight * cost);
}
  