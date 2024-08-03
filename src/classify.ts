import { plug } from "./types";

export function assignBestTime(cards:plug[]){
    let max:number = Infinity;
    let index:number = 0;
    let time:number|null;
    console.log(cards);
    for (let i = 0; i < cards.length; i++) {
        if(cards[i] && cards[i].roaDistance){
            time = cards[i].roaDistance;
            if(time){
                if(max>time){
                    max = time;
                    index=i;
                }
            }
        }
    }
    cards[index].best_time = true;
    let temp:plug;
    temp = cards[index];
    cards[index]=cards[0];
    cards[0]=temp;
}

export function assignBestCost(cards:plug[]){
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
    let temp:plug;
    temp = cards[index];
    cards[index]=cards[1];
    cards[1]=temp;
}

export function assignBestRating(cards:plug[]){
    let max:number = Infinity;
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
    let temp:plug;
    temp = cards[index];
    cards[index]=cards[2];
    cards[2]=temp;
}


//TODO
export function collapsePlugs(plugs: plug[]): plug[] {
    // 1. Creare una mappa per contare le occorrenze di ogni street
    const streetCountMap = new Map<string, number>();
    plugs.forEach(plug => {
        const count = streetCountMap.get(plug.street) || 0;
        streetCountMap.set(plug.street, count + 1);
    });

    // 2. Creare una mappa per mantenere solo un plug per ogni street
    const uniquePlugsMap = new Map<string, plug>();
    plugs.forEach(plug => {
        const existingPlug = uniquePlugsMap.get(plug.street);
        if (!existingPlug) {
            // Se non esiste un plug con la stessa street, aggiungilo e aggiorna il count
            const count = streetCountMap.get(plug.street) || 0;
            uniquePlugsMap.set(plug.street, { ...plug, count });
        }
    });

    // 3. Convertire la mappa in un array di plug
    return Array.from(uniquePlugsMap.values());
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