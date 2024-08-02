"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCloseEVPlugsTest = void 0;
async function getCloseEVPlugsTest(lat, long) {
    try {
        console.log("https://mobility.api.opendatahub.com/v2/flat/EChargingPlug/?where=sactive.eq.true&limit=-1&where=scoordinate.dlt.(5000," + lat + "," + long + ",4326)");
        //4326 is the code for the formatting of the coordinates
        const response = await fetch("https://mobility.api.opendatahub.com/v2/flat/EChargingPlug/?where=sactive.eq.true&limit=-1&where=scoordinate.dlt.(5000," + lat + "," + long + ",4326)");
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
exports.getCloseEVPlugsTest = getCloseEVPlugsTest;
