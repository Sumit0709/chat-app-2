

const getTime = (myTime) => {
    const time = new Date(myTime)
    const hour = time.getHours();
    let minute = time.getMinutes();
    if(minute<10)
      minute = "0"+minute;
    
    let ls = '';
    if(hour > 12){
        const fH = hour >= 22? (hour - 12) : ("0"+(hour-12)); 
      ls = fH +":"+ minute + " pm";
    }
    else if(hour==12 && minute>0){
      ls = hour +":"+ minute + " pm";
    }
    else{
      ls = hour +":"+ minute + " am";
    }

    return ls;
  }

module.exports = getTime;
// export default getTime;