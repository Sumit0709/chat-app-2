const NodeCache = require( "node-cache" );

const myCache = new NodeCache({
    stdTTL: 3600000,
    checkperiod: 120
});

const cachedSocket = {
    
    setSocket: async (mobile, socketId) => {
        return myCache.set(mobile, socketId)
    },

    getSocket: async (mobile) => {
        const socketId = myCache.get(mobile);
        if(socketId){
            return {
                success: true, 
                socketId
            }
        }else{
            return {
                success: false
            }
        }
    },

    deleteSocket: async (mobile) => {
        return myCache.del(mobile);
    }

}

module.exports = cachedSocket;