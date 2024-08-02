"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAirDistance = getAirDistance;
const geolib_1 = require("geolib");
function getAirDistance(cord1, cord2) {
    return (0, geolib_1.getDistance)(cord1, cord2) / 1000;
}
