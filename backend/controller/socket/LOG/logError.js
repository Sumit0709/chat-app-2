const fs = require('fs');

const logError = (dir, error) => {
    const errorMessage = `${new Date().toISOString()} - PORT::${process.env.PORT} - "${dir}" - "${error}"\n`;
    
    if(process.env.NODE_ENV === 'production') {
        fs.appendFile('socket-error.log', errorMessage, (err) => {
            if (err) {
                console.error('Error writing to log file:', err.message);
            }
            });
    }else{
        console.log(errorMessage)
    }
  }

module.exports = logError;
  