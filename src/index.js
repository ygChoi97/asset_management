import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, RouterProvider, createBrowserRouter } from 'react-router-dom';
import AppRouter from './component/AppRouter';
import { RouterInfo } from './component/Router';
import Menu from './component/Menu';
{/* <BrowserRouter>
    <AppRouter />
  </BrowserRouter> */}

  {/* <React.StrictMode>
    <RouterProvider router={RouterInfo} />
  </React.StrictMode> */}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={RouterInfo} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
