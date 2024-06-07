const API = `${process.env.CACHE_SERVER_URL}/lastSeen`


const path = require('path');
const logError = require('../socket/LOG/logError');
const currentFileName = path.basename(__filename);

exports.setLastSeen_Api = async(mobile) => {

    const cachServerUrl = `${API}/set-last-seen`;
    const requestBody = JSON.stringify({
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
            // console.log("LAST SEEN SUCCESSFULL SET");
        }
        else{
            logError(currentFileName, `SET LAST SEEN FAILED :: ${response.error}`)
        }
    })
    .catch(err => {
        logError(currentFileName, `SET LAST SEEN FAILED IN CATCH :: ${err}`)
    })

}

exports.getLastSeen_Api = async(friends) => {
    const cachServerUrl = `${API}/get-last-seen`;
    const requestBody = JSON.stringify({
        friends: friends
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
            // console.log("LAST SEEN SUCCESSFULL FETCHED");
            return response.lastSeen;
        }
        else{
            logError(currentFileName, `GET LAST SEEN FAILED :: ${response.error}`)
            return [];
        }
    })
    .catch(err => {
        logError(currentFileName, `GET LAST SEEN FAILED IN CATCH :: ${err}`)
        return [];
    })
}