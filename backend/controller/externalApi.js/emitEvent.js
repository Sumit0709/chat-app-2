const API = `${process.env.CACHE_SERVER_URL}/socket`

const path = require('path');
const logError = require('../socket/LOG/logError');
const currentFileName = path.basename(__filename);

exports.emitEvent_Api = async(eventName, data, mobile) => {

    const cachServerUrl = `${API}/emit-event`;
    const requestBody = JSON.stringify({
        eventName: eventName,
        data: data,
        mobile: mobile
    })

    return fetch(cachServerUrl, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: requestBody
    })
    .then(res => res.json())
    .then(response => {
        if(response.success){
            console.log("EMIT EVENT SUCCESSFULL");
        }
        else{
            logError(currentFileName,`EMIT EVENT FAILED :: ${response.error}`)
        }
    })
    .catch(err => {
        logError(currentFileName,`EMIT EVENT FAILED IN CATCH :: ${err}`)
    })

}