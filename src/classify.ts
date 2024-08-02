import { plug } from "./types";

export function assignBestTime(cards:plug[]){
    let max:number = Infinity;
    let index:number = 0;
    let time:number|null;
    for (let i = 0; i < cards.length; i++) {
        time = cards[i].roaDistance;
        if(time){
            if(max>time){
                max = time;
                index=i;
            }
        }
    }
    cards[index].best_time = true;
}

export function assignBestCost(cards:plug[]){
    let max:number = Infinity;
    let index:number = 0;
    for (let i = 0; i < cards.length; i++) {
        if(max>cards[i].cost){
            max = cards[i].cost
            index=i;
        }
    }
    cards[index].best_cost = true;
}

export function assignBestRating(cards:plug[]){
    let max:number = Infinity;
    let index:number = 0;
    let rating:number|null;
    for (let i = 0; i < cards.length; i++) {
        rating = cards[i].rating;
        if(rating){
            if(max<rating){
                max = rating
                index=i;
            }
        }
    }
    cards[index].best_rating = true;
}