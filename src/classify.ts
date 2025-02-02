import { plug } from "./types";


//This function places the element with the highest wattage first
export function assignBestTime(cards:plug[]){
    if(!cards || cards.length == 0){
        return;
    }
    else{
        let max:number = -Infinity;
        let index:number = 0;
        let time:number|null;
        for (let i = 0; i < cards.length; i++) {
            if(cards[i] && cards[i].powerWatt){
                time = cards[i].powerWatt;
                if(time){
                    if(max<time){
                        max = time;
                        index=i;
                    }
                }
            }
        }
        cards[index].best_time_recharging = true;
        cards.unshift(cards[index]);
        cards.splice(index+1,1);
    }
}

//This function places the element with the lowest cost first
export function assignBestCost(cards:plug[]){
    if(!cards || cards.length == 0){
        return;
    }
    else{
        let max:number = Infinity;
        let index:number = 0;
        for (let i = 0; i < cards.length; i++) {
            if(cards[i] && cards[i].cost){
                if(max>cards[i].cost){
                    max = cards[i].cost
                    index=i;
                }
            }
        }
        cards[index].best_cost = true;
        cards.unshift(cards[index]);
        cards.splice(index+1,1);
    }
}

//This function places the element with the highest rating first
export function assignBestRating(cards:plug[]){
    if(!cards || cards.length == 0){
        return;
    }
    else{
        let max:number = -Infinity;
        let index:number = 0;
        let rating:number|null;
        for (let i = 0; i < cards.length; i++) {
            if(cards[i] && cards[i].rating){
                rating = cards[i].rating;
                if(rating){
                    if(max<rating){
                        max = rating
                        index=i;
                    }
                }
            }
        }
        cards[index].best_rating = true;
        cards.unshift(cards[index]);
        cards.splice(index+1,1);
    }
}


//USED TO SORT WHILE CONSIDERING FACTORS
/*
export function sortPlugs(plugs: plug[]): plug[] {
    // Separare i plug con best_time, best_cost, best_rating
    const bestTimePlug = plugs.find(p => p.best_time);
    const bestCostPlug = plugs.find(p => p.best_cost);
    const bestRatingPlug = plugs.find(p => p.best_rating);

    // Filtrare i plug rimanenti
    const remainingPlugs = plugs.filter(p => !p.best_time && !p.best_cost && !p.best_rating);

    // Ordinare i plug rimanenti in base al punteggio calcolato
    remainingPlugs.sort((a, b) => calculateScore(b) - calculateScore(a));

    // Creare l'array finale con l'ordine richiesto
    const sortedPlugs = [];
    if (bestTimePlug) sortedPlugs.push(bestTimePlug);
    if (bestCostPlug) sortedPlugs.push(bestCostPlug);
    if (bestRatingPlug) sortedPlugs.push(bestRatingPlug);
    sortedPlugs.push(...remainingPlugs);
    console.log(sortedPlugs);

    return sortedPlugs;
}

function calculateScore(plug: plug): number {
    // Pesi
    const roaDistanceWeight = 0.5;
    const costPerWattWeight = 0.3;
    const ratingWeight = 0.2;

    // Normalizzazione dei valori
    const roaDistanceScore = plug.roaDistance !== null ? 1 / (1 + plug.roaDistance) : 0;
    const costPerWattScore = 1 / (1 + plug.cost / plug.powerWatt);
    const ratingScore = plug.rating !== null ? plug.rating / 5 : 0;

    // Calcolo del punteggio finale
    const finalScore = (roaDistanceScore * roaDistanceWeight) +
                       (costPerWattScore * costPerWattWeight) +
                       (ratingScore * ratingWeight);

    return finalScore;
}
    */