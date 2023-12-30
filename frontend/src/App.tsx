import "./App.css";
import { Route } from "react-router-dom";
import HomePage from "./pages/HomePage.js";
import ChatPage from "./pages/ChatPage.js";

function App() {
    return (
        <div className="App">
            <Route path={"/"} exact component={HomePage} />
            <Route path={"/chats"} exact component={ChatPage} />
        </div>
    );
}

export default App;
