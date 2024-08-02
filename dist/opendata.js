"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCloseEVPlugs = getCloseEVPlugs;
exports.getAllEVPlugs = getAllEVPlugs;
//latitude =  y
//longitude = x
async function getCloseEVPlugs(latitude, longitude, distance_meters) {
    try {
        //4326 is the code for the formatting of the coordinates
        //usage: longitude - latitude
        const response = await fetch("https://mobility.api.opendatahub.com/v2/flat/EChargingPlug/?where=sactive.eq.true&limit=-1&where=scoordinate.dlt.(" + distance_meters + "," + longitude + "," + latitude + ",4326)");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        const plugsRaw = data.data;
        return plugsRaw;
    }
    catch (error) {
        console.error('Error fetching EV plugs data:', error);
        throw error;
    }
}
async function getAllEVPlugs() {
    try {
        //4326 is the code for the formatting of the coordinates
        const response = await fetch("https://mobility.api.opendatahub.com/v2/flat/EChargingPlug/?where=sactive.eq.true&limit=-1");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        const plugsRaw = data.data;
        return plugsRaw;
    }
    catch (error) {
        console.error('Error fetching EV plugs data:', error);
        throw error;
    }
}
