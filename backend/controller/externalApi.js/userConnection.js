const API = `${process.env.CACHE_SERVER_URL}/user`

const path = require('path');
const logError = require('../socket/LOG/logError');
const currentFileName = path.basename(__filename);

exports.userConnected_Api = async(mobile, socketId, serverPort) => {

    const cachServerUrl = `${API}/user-connected`;
    const requestBody = JSON.stringify({
        mobile: mobile,
        socketId: socketId,
        serverPort: serverPort
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
            // console.log("CONNECTION SUCCESSFULL");
            return true;
        }
        else{
            logError(currentFileName, `CONNECTION ESTABLISHMENT FAILED :: ${response.error}`)
            return false;
        }
    })
    .catch(err => {
        logError(currentFileName, `CONNECTION ESTABLISHMENT FAILED IN CATCH :: ${err}`)
        return false;
    })

}

exports.userDisconnected_Api = async(mobile) => {
    const cachServerUrl = `${API}/user-disconnected`;
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
            // console.log("DISCONNECTION SUCCESSFULL");
            return true;
        }
        else{
            logError(currentFileName, `DISCONNECTING USER FAILED :: ${response.error}`)
            return false;
        }
    })
    .catch(err => {
        logError(currentFileName, `DISCONNECTING USER FAILED IN CATCH :: ${err}`)
        return false;
    })
}