import UrlConstants from "../constants/UrlConstants";
import { getData } from "./ApiBase";

export async function getSampleDataAsync(){
    let x = await getData(UrlConstants.sampleEndpoint, '');
    return x;
}