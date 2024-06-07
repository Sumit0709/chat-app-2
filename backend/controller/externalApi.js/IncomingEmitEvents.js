const fetch = require('node-fetch');

const path = require('path');
const logError = require('../socket/LOG/logError');
const currentFileName = path.basename(__filename);

const incomingEmitEvent = async(req, res, next) => {

    const eventName = req.body.eventName;
    const data = req.body.data;
    const socketId = req.body.socketId;

    try{

        if(!eventName || !data || !socketId){
            const missingEntity = !eventName? "Event Name": !data? "Data": "Mobile";

            return res.status(404).json({
                success: false,
                error: `${missingEntity} is missing`
            })
        }

        const socketIO = req.socketIO;
        if(!socketIO){
            return res.status(500).json({
                success: false,
                error: 'Socket IO missing in server!'
            })
        }
    
    
        socketIO.to(socketId).emit(eventName, data)
    }
    catch(err){
        logError(currentFileName, `INCOMING EMIT EVENT FAILED IN CATCH :: ${err}`)
        return res.status(500).json({
            success: false,
            error: err.message
        })
    }
}

module.exports = incomingEmitEvent  