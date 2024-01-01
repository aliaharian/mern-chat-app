import "./App.css";
import { Route } from "react-router-dom";
import HomePage from "./pages/HomePage.js";
import ChatPage from "./pages/ChatPage.js";
import axios from "axios";
import { User } from "./types/types.js";

function App() {
    const userInfo: User = JSON.parse(
        localStorage.getItem("userInfo") ?? "{}",
    ) as User;
    axios.defaults.headers.common.Authorization = "Bearer " + userInfo.token;
    axios.defaults.headers.post["Content-Type"] = "application/json";
    return (
        <div className="App">
            <Route path={"/"} exact component={HomePage} />
            <Route path={"/chats"} exact component={ChatPage} />
        </div>
    );
}

export default App;
