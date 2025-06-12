import { useState } from "react"
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import Home from "./pages/Home";
import ForgetPassword from "./pages/ForgetPassword";
import Login from "./pages/Login";
import OTP from "./pages/OTP";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import {TostContainer} from "react-tostify";
const App=()=>{
  return(
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/password/forget" element={<ForgotPassword/>}/> 
        <Route path="/otp-verification/:email" element={<OTP/>}/>
        <Route path="/password/reset:token" element={<ResetPassword/>}/>

      </Routes>
      <TostContainer theme ="dark"/>
    </Router>
  );
};
export default App;
