import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Home from "./components/core/Home";
import Register from "./components/core/Register";
import Login from "./components/core/Login";
import Chat2 from "./components/Chat/Chat2";
import AddFriend from "./components/Chat/AddFriend";
import FriendRequests from "./components/Chat/FriendRequests";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Chat2/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/add_friend" element={<AddFriend/>}/>
        <Route path="/friend_requests" element={<FriendRequests/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
