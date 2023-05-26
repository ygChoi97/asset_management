import { React, useEffect, useState } from "react";
import { Routes, Route, useNavigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import Menu from "./Menu";
import Provision from "./Provision";
import Pws from "./Pws";
import Return from "./Return";
import Disposal from "./Disposal";
import NotFoundPage from "./NotFoundPage";
import Login from "./Login";
import PrivateRoute2 from "./PrivateRoute2";



const AppRouter = () => {
    
    return (
        <div style={{ height: '100vh' }}>
            <Menu />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route element={<PrivateRoute2 authentication={true} />}>
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

/* import React, { useMemo, useState } from 'react';
import { BrowserRouter as Router, Route, Link, Routes, Outlet } from 'react-router-dom';


const Home = () => {
    // Home 페이지의 상태
    const [count, setCount] = useState(0);
  
    return (
      <div>
        <h2>Home Page</h2>
        <p>Count: {count}</p>
        <button onClick={() => setCount(count + 1)}>Increment</button>
      </div>
    );
  };
  
  const About = () => {
    // About 페이지의 상태
    const [message, setMessage] = useState('');
  
    return (
      <div>
        <h2>About Page</h2>
        <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
        <p>Message: {message}</p>
      </div>
    );
  };
  
  const Contact = () => {
    // Contact 페이지의 상태
    const [name, setName] = useState('');
  
    return (
      <div>
        <h2>Contact Page</h2>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        <p>Name: {name}</p>
      </div>
    );
  };

const AppRouter = () => {
    const [currentPage, setCurrentPage] = useState(null);

    const memoizedHome = useMemo(() => {renderPage({<Home>}); <Home />, []});
    const memoizedAbout = useMemo(() => <About />, []);
    const memoizedContact = useMemo(() => <Contact />, []);
  
    const renderPage = (Component) => {
      setCurrentPage(Component);
    };
  
    const clearPage = () => {
      setCurrentPage(null);
    };
  
    return (
      
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </nav>
  
          {currentPage ? (
            <div>
              <button onClick={clearPage}>Go Back</button>
              {currentPage}
            </div>
          ) : (
            <div>
              <Routes>
                <Route path="/" element={<Outlet />} />
                <Route index element={memoizedHome} />
                <Route path="/about" element={memoizedAbout} />
                <Route path="/contact" element={memoizedContact} />
              </Routes>
            </div>
          )}
        </div>

    );
  };

export default AppRouter; */