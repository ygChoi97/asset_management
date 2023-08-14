import { React, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Menu from "./Menu";
import Provision from "./Provision";
import Pws from "./Pws";
import Return from "./Return";
import Disposal from "./Disposal";
import NotFoundPage from "./NotFoundPage";
import Login from "./Login";
import PrivateRoute2 from "./PrivateRoute2";
import Memory from "./Memory";
import Harddisk from "./Harddisk";
import VideoEquipment from "./VideoEquipment";
import DiskRestoration from "./DiskRestoration";
import RetireeDisk from "./RetireeDisk";
import HandOver from "./HandOver";

const AppRouter = () => {

  const [account, setAccount] = useState('');
  const handleLogin = (accountData) => {
    setAccount(accountData);
  }
  console.log(process.env.NODE_ENV)
  // 배포 환경에서 console.log, console.warn 지우기
  if (process.env.NODE_ENV === 'production') {
    console.log = function no_console() { };
    console.warn = function no_console() { };
  }
  
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', userSelect: 'none' }}>
      <Menu />

      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route element={<PrivateRoute2 authentication={true} />}>
          <Route exact path="/" element={<Pws account={account} />} />
          <Route path="/provision" element={<Provision account={account} />} />
          <Route path="/return" element={<Return account={account} />} />
          <Route path="/disposal" element={<Disposal account={account} />} />
          <Route path="/handover" element={<HandOver account={account} />} />
          <Route path="/retireedisk" element={<RetireeDisk account={account} />} />
          <Route path="/diskrestoration" element={<DiskRestoration account={account} />} />
          <Route path="/memory" element={<Memory account={account} />} />
          <Route path="/harddisk" element={<Harddisk account={account} />} />
          <Route path="/videoequipment" element={<VideoEquipment account={account} />} />
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