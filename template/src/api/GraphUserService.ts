import { MakeCall } from "./GraphApiBase";

export async function getUserAsync(query: string){
    const res = await MakeCall('', query);
    return res;
}

// create DB conn on init
// Local DB service 
    // create tables
    // merge into local
// Sync on init
    // push and then pull and merge with local
// 