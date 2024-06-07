const { Client } = require("cassandra-driver");

let client = null;

const cassandra ={

  connectClient: async() => {
    try{
      client = new Client({
        
        // Local DB on Docker
        contactPoints: ['127.0.0.1:49042'],
        localDataCenter: 'datacenter1',
        keyspace: 'demo_test'


        // ASTRA DB

        // cloud: {
        // secureConnectBundle: "./secure-connect-chatting-app.zip",
        // },
        // credentials: {
        // username: process.env.ASTRA_DB_CLIENT_ID, // CLIENT ID
        // password: process.env.ASTRA_DB_CLIENT_SECRET, // CLIENT SECRET
        // },
      });
      await client.connect();
      console.log("Cassandra Client Connected Successfully")

      // client.on('log', (level, loggerName, message, furtherInfo) => {
      //   console.log(`LOG RECEIVED FROM CASSANDRA :: ${level} - ${loggerName}:  ${message}`);
      // });
      
      // const timestamp = Date.now();
      // await client.execute(`INSERT INTO demo_test.table1 (listing_id, name, email, date) VALUES (?,?,?,?) USING TIMESTAMP ?`,[Math.random()*100,"Sumit","sumit@test.com", new Date(), timestamp], {prepare: true})

      // const result = await client.execute('SELECT * FROM table1');
      // console.log('Rows:', result.rows);

      return client;
    }
    catch(err){
      console.log("ERROR IN CONNECTING TO CASSANDRA CLIENT :: ", err);
    }
  },

  getClient: () => {return client},

  shutDown: async () => {
    client.shutdown();
  }
}

module.exports = cassandra