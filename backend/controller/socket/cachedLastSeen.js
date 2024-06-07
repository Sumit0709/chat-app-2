const NodeCache = require( "node-cache" );
const LastSeen = require("../../module/LastSeen");

const myCache = new NodeCache({});

const cachedLastSeen = {
    
    setLastSeen: async (mobile) => {
        const lastSeen = Date.now();
        await LastSeen.findOneAndUpdate({mobile: mobile}, {lastSeen: lastSeen}).exec()
        return myCache.set(mobile, lastSeen)
    },

    getLastSeen: async (mobile) => {
        const lastSeen = myCache.get(mobile);
        if(lastSeen){
            return {
                success: true, 
                lastSeen
            }
        }else{
            return LastSeen.findOne({mobile: mobile}).exec()
                .then(res => {
                    if(res){
                        return {
                            success: true,
                            lastSeen: res.lastSeen
                        }
                    }
                    else{
                        return {
                            success: false
                        }
                    }
                })
                .catch(err => {
                    console.error(err);
                    return {
                        success: false
                    }
                })
        }
    }

}

module.exports = cachedLastSeen;