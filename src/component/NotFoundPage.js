import React from 'react';

const NotFoundPage = () => {
  const ACCESS_TOKEN = localStorage.getItem('ACCESS_TOKEN');
  return (
    <div style={{border: '1px solid', width: '100%', height: '90vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
      
      <div style={{fontSize: '8rem', fontWeight: '600'}}>404</div>
      <div style={{fontSize: '3rem'}}>Page not found</div>
      
      <p style={{fontSize: '2rem'}}>죄송합니다. 요청하신 페이지를 찾을 수 없습니다.</p>

      

      {/* 추가적인 컨텐츠를 여기에 추가할 수 있습니다 */}
    </div>
  );
};

export default NotFoundPage;