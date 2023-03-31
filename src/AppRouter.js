import React from "react";
import { Routes, Route } from "react-router-dom";
import Menu from "./Menu";
import Provision from "./Provision";
import Pws from "./Pws";
import Return from "./Return";

const AppRouter = () => {

    return (
        <>
            <Menu />
            <Routes>
                {/* '/' 경로로 요청하면 App컴포넌트를 렌더링하세요 */}
                <Route exact path="/" element={<Pws />} />
                {/* '/login' 경로로 요청하면 Login컴포넌트를 렌더링하세요 */}
                <Route path="/provision" element={<Provision />} />
                <Route path="/return" element={<Return />} />

            </Routes>    
        </>
    );
};

export default AppRouter;