import { useEffect } from "react";
import {io} from 'socket.io-client'

const Home = () => {

    useEffect(() => {
        // Connect to the Socket.IO server
        const socket = io('http://localhost:8080');
    
        // Add event listeners for incoming messages
        socket.on('message', (data) => {
          console.log('Received message:', data);
        });

        socket.on('connect', (socket) => {
            console.log("Connection established");
        })
    
        // Clean up the socket connection on unmount
        return () => {
          socket.disconnect();
        };
      }, []);

    return (
        <div>
            <h1>HOME</h1>
        </div>
    )
}

export default Home