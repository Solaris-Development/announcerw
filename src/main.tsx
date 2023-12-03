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
import Stage2 from './Verification/Stage2';
import Stage3 from './Verification/Stage3';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<App />} errorElement={<ErrorElement />} />
      <Route path="/terms" element={<Terms />}/>
      <Route path="/privacy" element={<Privacy />}/>
      <Route path="/verification" element={<Stage0 />}/>
      <Route path="/verification/stage1" element={<Stage1 />}/>
      <Route path="/verification/stage2" element={<Stage2 />}/>
      <Route path="/verification/stage3" element={<Stage3 />}/>
    </>
  )
);


ReactDOM.createRoot(document.getElementById('root')!).render(
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
  </ThemeProvider>,
)
