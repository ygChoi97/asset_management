// 로그인 여부를 확인하여 리다이렉트하는 라우트 컴포넌트
import React from 'react';
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';

const PrivateRoute2 = ({ authentication }) => {
  // localStorage에서 토큰 값을 가져옴
  const isAuthenticated  = localStorage.getItem('ACCESS_TOKEN');

  if(authentication) {
    // 인증이 반드시 필요한 페이지
  
    // 인증을 안했을 경우 로그인 페이지로, 했을 경우 해당 페이지로
    return (isAuthenticated === null || isAuthenticated === 'false') ? <Navigate to="/login"/> : <Outlet/>;

  } else {
    // 인증이 반드시 필요 없는 페이지

    // 인증을 안햇을 경우 해당 페이지로 인증을 한 상태일 경우 main페이지로
    return (isAuthenticated === null || isAuthenticated === 'false') ? <Outlet/> : <Navigate to='/'/>;  
  }
};

export default PrivateRoute2;
