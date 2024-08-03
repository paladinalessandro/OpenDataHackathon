export interface coordinates{
    latitude: number,
    longitude: number
}

export interface plug{
    coords:{
      lat: number;
	    lon: number;
    }
    uuid:string,
    roaDistance: number | null,
    powerWatt:number,
    outletType:string,
    cost_estimate:number|null,
    rating: number | null,
    cost: number,
    count:number,
    recharge_time_estimate:number|null,
    street_view_image:string|null,
    street:string,
    best_cost:boolean,
    best_time_recharging:boolean,
    best_rating:boolean 
}


export interface plugRaw{
    "pactive": boolean,
    "pavailable": boolean,
    "pcode": string,
    "pcoordinate": {
      "x": number,
      "y": number,
      "srid": number
    },
    "pmetadata": {"city": string, "state": string, "address": string, "capacity": number, "provider": string, "accessInfo": string, "accessType": string, "reservable": boolean, "paymentInfo": string},
    "pname": string,
    "porigin": string,
    "ptype": string,
    "sactive": boolean,
    "savailable": boolean,
    "scode": string,
    "scoordinate": {
      "x": number,
      "y": number,
      "srid": number
    },
    "smetadata": {"outlets": [{"id": number, "maxPower": number, "maxCurrent": number, "minCurrent": number, "outletTypeCode": string}]},
    "sname": string,
    "sorigin": string,
    "stype": string
}