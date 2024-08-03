import {plug} from "./types"
const possibleTypes = ["Type2 - 400Vac","CCS","Type2 - 230Vac","700 bar small vehicles","CHAdeMO","Type2Mennekes","Type 3A"];

export function filterForPlugType(outletType:string[],plugs:plug[]){
    if(outletType.length == 0){
        return plugs;
    }
    else{
        const filteredPlugs = plugs.filter(plug => outletType.includes(plug.outletType));
        console.log(filteredPlugs);
        return filteredPlugs;
    }
}