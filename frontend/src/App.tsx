import "./App.css";
import { Route } from "react-router-dom";
import HomePage from "./pages/HomePage.js";
import ChatPage from "./pages/ChatPage.js";
import axios from "axios";

function App() {
    const token = localStorage.getItem("userInfo");
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    axios.defaults.headers.post["Content-Type"] = "application/json";
    return (
        <div className="App">
            <Route path={"/"} exact component={HomePage} />
            <Route path={"/chats"} exact component={ChatPage} />
        </div>
    );
}

export default App;
