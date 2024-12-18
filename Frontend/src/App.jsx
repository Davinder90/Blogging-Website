import Navbar from "./Components/Navbar/Navbar.jsx";
import './App.css';
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import {useDispatch} from "react-redux";
import {lookInSession} from "./Common/Session.jsx";
import { userContextActions } from "./Store/userContext.js";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    let userInSession = lookInSession("user");
    userInSession ? dispatch(userContextActions.setUserAuth(JSON.parse(userInSession))) : dispatch(userContextActions.setUserAuth({access_token : null}));
  },[]);

  return <div className = "app-container">
    <Navbar/>
    <Outlet/>
  </div> 
}

export default App
