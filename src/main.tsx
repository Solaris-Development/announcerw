import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { ThemeProvider } from './Components/ThemeProvider'
import './index.css'

import ErrorElement from './ErrorElement';
import App from './App';
import Terms from './Terms';
import Privacy from './Privacy';
import Stage0 from './Verification/Stage0';
import Stage1 from './Verification/Stage1';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<App />} errorElement={<ErrorElement />} />
      <Route path="/terms" element={<Terms />}/>
      <Route path="/privacy" element={<Privacy />}/>
      <Route path="/verification" element={<Stage0 />}/>
      <Route path="/verification/stage1" element={<Stage1 />}/>
    </>
  ), { basename: import.meta.env.DEV ? '/' : '/announcerw/' }
);


ReactDOM.createRoot(document.getElementById('root')!).render(
  <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
  </ThemeProvider>,
)
