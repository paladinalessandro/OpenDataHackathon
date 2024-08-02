"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const opendata_1 = require("./opendata");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.get("/", (req, res) => {
    res.send("Express + TypeScript Server");
});
app.get("/destinations", async (req, res) => {
    const query = req.query;
    if (query.latitude && query.longitude && query.distance_meters) {
        const lat = +query.latitude;
        const long = +query.longitude;
        const distance_meters = +query.distance_meters;
        if (Number.isNaN(lat) || Number.isNaN(long)) {
            res.status(403).send("Bad request, number not formatted");
            return;
        }
        if (!Number.isNaN(lat) && !Number.isNaN(long)) {
            const plugsRaw = await (0, opendata_1.getCloseEVPlugs)(lat, long, distance_meters);
            let plugs = [];
            plugsRaw.forEach(plugRaw => {
                plugs.push({ uuid: plugRaw.scode,
                    roaDistance: 1,
                    outletType: plugRaw.smetadata.outlets[0].outletTypeCode,
                    powerWatt: plugRaw.smetadata.outlets[0].maxPower,
                    reviews: 1,
                    cost: 1 });
            });
            res.json(plugs);
            return;
        }
    }
    else {
        res.status(404).send("Not enough arguments");
        return;
    }
});
app.get("/getAll", async (req, res) => {
    const plugsRaw = await (0, opendata_1.getAllEVPlugs)();
    let plugs = [];
    plugsRaw.forEach(plugRaw => {
        plugs.push({ uuid: plugRaw.scode,
            roaDistance: 1,
            outletType: plugRaw.smetadata.outlets[0].outletTypeCode,
            powerWatt: plugRaw.smetadata.outlets[0].maxPower,
            reviews: 1,
            cost: 1 });
    });
    res.json(plugs);
    return;
});
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
