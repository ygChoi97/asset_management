import React from "react";
// 라우팅에 사용할 라이브러리
import { Routes, Route } from "react-router-dom";
import App from "./App";
import Menu from "./Menu";
import Start from "./Start";


const AppRouter = () => {

    return (
        <>
            <Menu />
            <Routes>
                {/* '/' 경로로 요청하면 App컴포넌트를 렌더링하세요 */}
                <Route exact path="/" element={<Start />} />
                {/* '/login' 경로로 요청하면 Login컴포넌트를 렌더링하세요 */}
                <Route path="/provide" element={<App />} />
                <Route path="/return" element={<App />} />

            </Routes>    
        </>
    );
};

export default AppRouter;