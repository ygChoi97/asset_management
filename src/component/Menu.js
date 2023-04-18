import React from "react";
import { Link, useLocation } from "react-router-dom";
import '../css/menu.css';
import { Button, Grid, Toolbar } from "@mui/material";
export default function Menu() {
    const USERNAME = localStorage.getItem('LOGIN_USERNAME');

    const location = useLocation();
    const logoutHandler = e => {
        // 로컬스토리지 데이터 제거
        localStorage.removeItem('ACCESS_TOKEN');
        localStorage.removeItem('LOGIN_USERNAME');
        window.location.href='/login';
    };
    const button = USERNAME 
            ? (<Button color="inherit" onClick={logoutHandler}><strong style={{color :'#fff'}}>로그아웃</strong></Button>) 
            : (
                <>
                    <Link to='/login' style={{color: '#fff', marginRight: 20, textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600' }}>로그인</Link>
                </>
            );

    return (
        <div style={{display: 'flex', backgroundColor: 'lightslategrey',flexDirection: 'row', justifyContent:'center', alignItems: 'center', borderBottom: '2px solid'}}>
        <nav className="menu">
            
            <ul className="menu-list">
                <li className="menu-item">
                    <Link
                        to="/"
                        className={`menu-link${location.pathname === '/' ? ' menu-link--active' : ''}`}
                    >
                        조회
                    </Link>
                </li>
                <li className="menu-item">
                    <Link
                        to="/provision"
                        className={`menu-link${location.pathname === '/provision' ? ' menu-link--active' : ''}`}
                    >
                        지급
                    </Link>
                </li>
                <li className="menu-item">
                    <Link
                        to="/return"
                        className={`menu-link${location.pathname === '/return' ? ' menu-link--active' : ''}`}
                    >
                        반납
                    </Link>
                </li>
                <li className="menu-item">
                    <Link
                        to="/disposal"
                        className={`menu-link${location.pathname === '/disposal' ? ' menu-link--active' : ''}`}
                    >
                        매각
                    </Link>
                </li>
            </ul>  
                    
        </nav>
        <div style={{whiteSpace: 'nowrap'}}>{button}</div>
        </div>  
    );
}