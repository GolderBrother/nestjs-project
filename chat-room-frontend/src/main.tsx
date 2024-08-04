import React from 'react'
import ReactDOM from 'react-dom/client'
// import App from './App.tsx'
import router from './router'
import './index.css'
import { RouterProvider } from 'react-router-dom';

// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
// )

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(<RouterProvider router={router}/>);
