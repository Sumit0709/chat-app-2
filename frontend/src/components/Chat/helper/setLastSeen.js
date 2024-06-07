const getTime = require("./getTime");


const onSetLastSeen = (data, setLastSeen) => {

    const monthName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
    // console.log("LS :: ", data)
    if(!data || data.length==0){
      return;
    }

    setLastSeen((prevLastSeen) => {
        const newLastSeen = new Map(prevLastSeen);
        data.forEach((friend) => {
          if(friend.lastSeen != null){
            const currTimeInMicro = Date.now();
            const currTime = new Date(currTimeInMicro)
            const friendTime = new Date(Number(friend.lastSeen))
            // console.log(friend.lastSeen, "  ", friendTime);

            const tDate = currTime.getDate();
            const fDate = friendTime.getDate();

            const tMonth = currTime.getMonth();
            const fMonth = friendTime.getMonth();
            
            const tYear = currTime.getFullYear();
            const fYear = friendTime.getFullYear();
            
            const twoMinutesInMilliseconds = 2 * 60 * 1000; // 2 minutes in milliseconds

            const difference = currTimeInMicro - friend.lastSeen;
            if(difference > twoMinutesInMilliseconds){
              let ls = getTime(friendTime)
              
              if(tYear>fYear || tMonth>fMonth || tDate>fDate){
                ls += " " + monthName[fMonth] + " " + fDate;
              }
              newLastSeen.set(friend.mobile, ls);
            }
            else{
              newLastSeen.set(friend.mobile, "Online")
            }
          }
          
        })
        return newLastSeen;
      })
}

// module.exports = onSetLastSeen
export default onSetLastSeen