import {config} from "../config";

const post = async (url, body) => {
    try {
        const rawResponse = await fetch(config.api_url + url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-Trigger': 'CORS'
            },
            body: JSON.stringify(body)
        });

        return await rawResponse.json();

    } catch (e) {
        console.log("Call Error while " + url + ": ", e);
        return {type: 'error', message: JSON.stringify(e)};
    }
};

export default post;