import {React, useEffect} from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Menu from "./Menu";
import Provision from "./Provision";
import Pws from "./Pws";
import Return from "./Return";
import Disposal from "./Disposal";
import Signin from "./Signin";
import NotFoundPage from "./NotFoundPage";
import Login from "./Login";
import PrivateRoute from "./PrivateRoute";
import PrivateRoute2 from "./PrivateRoute2";

const AppRouter = () => {
    
    return (
        <div style={{height: '100vh'}}>
            <Menu />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route element={<PrivateRoute2 authentication={true}/>}>
                    <Route exact path="/" element={<Pws />} />
                    <Route path="/provision" element={<Provision />} />
                    <Route path="/return" element={<Return />} />
                    <Route path="/disposal" element={<Disposal />} />
                </Route>
                
                <Route path="/*" element={<NotFoundPage />} />
            </Routes>


        </div>

    );
};

export default AppRouter;