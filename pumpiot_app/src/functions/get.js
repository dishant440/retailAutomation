import {config} from "../config";

const get = async (url) => {
    try {
        let rawRes = await fetch(config.api_url + url);
        return await rawRes.json();
    } catch (e) {
        console.log(e);
        return false;
    }
};

export default get;