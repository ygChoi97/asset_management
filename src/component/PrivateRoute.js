// 로그인 여부를 확인하여 리다이렉트하는 라우트 컴포넌트
import React from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

const PrivateRoute = ({ element }) => {
  // localStorage에서 토큰 값을 가져옴
  const token = localStorage.getItem('ACCESS_TOKEN');
  const location = useLocation();

  // 토큰 값이 없으면 로그인 페이지로 리다이렉트
  if (!token) {
    return <Navigate to={`/signin?redirect=${location.pathname}`} />;
  }

  // 토큰 값이 있으면 해당 라우트의 컴포넌트를 렌더링
  return <Route element={element} />;
};

export default PrivateRoute;
