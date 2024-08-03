/*
user_uuid text null,
    lat double precision not null,
    lon double precision not null,
    street text not null,
    "outletType" text not null,
    "powerWatt" double precision not null,
    cost double precision not null,
    station_uuid text not null,
    constraint stations_pkey primary key (station_uuid
*/

export interface DBPlug{
    user_uuid:string,
    lat:number,
    lon:number,
    street:string,
    outletType: string[],
    powerWatt:number,
    cost:number,
    station_uuid:string
}