import { plugRaw } from "./types";

//latitude =  y
//longitude = x

export async function getCloseEVPlugs(latitude:number,longitude:number,distance_meters:number){
    try {
        //4326 is the code for the formatting of the coordinates
        //usage: longitude - latitude
        console.log("https://mobility.api.opendatahub.com/v2/flat/EChargingPlug/?where=sactive.eq.true&limit=-1&where=scoordinate.dlt.("+distance_meters+","+longitude+","+latitude+",4326)");
        const response = await fetch("https://mobility.api.opendatahub.com/v2/flat/EChargingPlug/?where=sactive.eq.true&limit=-1&where=scoordinate.dlt.("+distance_meters+","+longitude+","+latitude+",4326)");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        const plugsRaw:plugRaw[] = data.data;
        return plugsRaw;
    } catch (error) {
        console.error('Error fetching EV plugs data:', error);
        throw error;
    }
}

export async function getAllEVPlugs(){
    try {
        //4326 is the code for the formatting of the coordinates
        const response = await fetch("https://mobility.api.opendatahub.com/v2/flat/EChargingPlug/?where=sactive.eq.true&limit=-1");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        const plugsRaw:plugRaw[] = data.data;
        return plugsRaw;
    } catch (error) {
        console.error('Error fetching EV plugs data:', error);
        throw error;
    }
}