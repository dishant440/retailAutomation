import {config} from "../config";
import {PRICETODAY} from "../Store/actions";

export default async () => {
    try {
        let rawRes = await fetch(config.api_url + '/today-fuel');
        return await rawRes.json();
    } catch (e) {
        console.log(e);
        return false;
    }
}