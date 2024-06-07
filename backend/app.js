const path = require('path');
const envFileName = `.env.${process.env.NODE_ENV || "development"}`
require('dotenv').config({ path: envFileName })


const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require('cors')
const mongoose = require('mongoose')
const morgan = require('morgan')
const cookieParser = require("cookie-parser");


// socket routes
const chat = require('./controller/socket/chat')

//express routes
const auth = require('./routes/auth');
const user = require('./routes/user');
const externalApi = require('./routes/externalApi');

// cassandra DB
const cassandra = require('./cassandra')


const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { 
    cors: {
        origin: ["http://localhost:3000", process.env.FRONTEND_SERVER_IP_INSECURE, process.env.FRONTEND_SERVER_IP_SECURE],
        credentials: true
      },
    cookie: true
 });

// cors
app.use(cors({
    origin: ['http://localhost:3000', process.env.FRONTEND_SERVER_IP_INSECURE, process.env.FRONTEND_SERVER_IP_SECURE],
    credentials: true
}))

// parse json body
app.use(express.json());

app.use(express.urlencoded({extended: false}))

// cookie parser
app.use(cookieParser());


// Set up logging middleware (Morgan)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }
  
  // Production environment (log to a file)
if (process.env.NODE_ENV === 'production') {
    const fs = require('fs');
    const path = require('path');
  
    const accessLogStream = fs.createWriteStream(
      path.join(__dirname, 'access.log'),
      { flags: 'a' }
    );
    app.use(morgan('combined', { stream: accessLogStream }));
  }



 // IO Middleware that will be called for every incoming requests
io.use(async (socket, next) => {
try {
    const user = "SUMIT"
    socket.user = user;
    next()
} catch (e) {
    next(new Error("unknown user"));
}
});


// socket event listener
chat(io);


// express routes
app.use('/auth', auth);
app.use('/user', user);
app.use('/', (req, res, next) => {
    req.socketIO = io;
    next()
}, externalApi) 


const port = process.env.PORT || 8080
httpServer.listen(port, async (err) => {
    if(!err){
        // Connect to datastax astra DB
        try{
        await cassandra.connectClient();
        const client = cassandra.getClient();
        console.log(process.env.PENDING_CASSANDRA_TABLE)
        console.log(process.env.PRIVATE_CHAT_CASSANDRA_TABLE)
        // Execute a query
       
        const [chat_id, sender, receiver, message, sent_at, sequence] = ['6ab09bec-e68e-48d9-a5f8-97e6fb4c9b47', 916202154736, 919155873741, "TESTING", 1691138184630, 1]
        // const r = await client.execute('DROP TABLE chat.privatechat')
        // const r2 = await client.execute('DROP TABLE chat.pending')
       
        // const r3 = await client.execute(`CREATE TABLE IF NOT EXISTS ${process.env.PRIVATE_CHAT_CASSANDRA_TABLE} (chat_id UUID, sender TEXT, receiver TEXT,message_id TEXT, message TEXT, type INT, preview TEXT, sent_at TIMESTAMP, received_at TIMESTAMP, seen_at TIMESTAMP, sequence INT, PRIMARY KEY (chat_id, message_id, sequence)) WITH CLUSTERING ORDER BY (message_id DESC, sequence DESC)`);
        // const r4 = await client.execute(`CREATE TABLE IF NOT EXISTS ${process.env.PENDING_CASSANDRA_TABLE} (user_id UUID, chat_id UUID, sender TEXT, receiver TEXT, service_type INT, message_id TEXT, message TEXT, type INT, preview TEXT, sent_at TIMESTAMP, received_at TIMESTAMP, seen_at TIMESTAMP, sequence INT, PRIMARY KEY (user_id, chat_id, service_type, message_id, sequence)) WITH CLUSTERING ORDER BY (chat_id DESC, service_type DESC, message_id DESC, sequence DESC)`);
        
        // console.log(r);

        // const inserted = await client.execute(`INSERT INTO chat.privatechat (chat_id, sender, receiver, message, sent_at, sequence) VALUES (?,?,?,?,?,?)`,[chat_id, sender, receiver, message, sent_at, parseInt(sequence)])
        // console.log(inserted);

        // const rs = await client.execute(`SELECT * FROM ${process.env.PRIVATE_CHAT_CASSANDRA_TABLE}`);
        // console.log(`Your cluster returned ${rs.rowLength} row(s)`);
        // console.log(rs.rows);
        // console.log(rs);
        

        // connect to mongo DB

        mongoose.connect(
            process.env.MONGO_URL,{
            // `mongodb+srv://web_chat_db:${process.env.MONGO_PASS}@cluster0.lzq2pgr.mongodb.net/?retryWrites=true&w=majority`,{
            // 'mongodb://127.0.0.1:27017/chatapp',{
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            // useCreateIndex: true
            }).then(()=>{
                console.log("DB CONNECTED");
            }).catch((err)=>{
                console.log(err)
                console.log("ERROR in connecting to the DATABASE");
            })
        console.log(`Server is listening to port ${port}`);
        }
        catch(err){
            console.log(err.message);
        }
        finally{

        }
    }
    else{
        console.log("ERROR IN STARTING SERVER. ERROR :: ", err.message)
    }
});