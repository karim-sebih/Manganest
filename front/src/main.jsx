import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Register from './pages/Auth/Register.jsx';
import Login from './pages/Auth/Login.jsx';
import Home from './pages/Home.jsx';
import { BrowserRouter , Route , Routes} from "react-router";
import PublicLayout from './layouts/PublicLayout.jsx';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Details from './pages/Details.jsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/" element={<PublicLayout />} >
          <Route index element= {<Home/>}/>
          <Route path="/auth/register" element={<Register/>}/>
          <Route path="/auth/login" element={<Login/>}/>
          <Route path="/manga/:id" element={<Details/>}/>
          </Route>
          
        </Routes>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
)
