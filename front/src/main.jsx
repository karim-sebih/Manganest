import "./utils/i18n";

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Register from './pages/Auth/Register.jsx';
import Login from './pages/Auth/Login.jsx';
import Home from './pages/Home.jsx';
import { BrowserRouter, Route, Routes } from "react-router";
import PublicLayout from './layouts/PublicLayout.jsx';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MangaDetails from './pages/MangaDetails.jsx'
import Filter from './pages/Filter.jsx'
import Booksmark from './pages/Booksmark.jsx';
import Settings from './pages/Settings.jsx';
import Profile from './pages/Profile.jsx';
import Chapter from './pages/Chapter.jsx';
import ChapterLayout from './layouts/ChapterLayout.jsx'

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
            <Route index element={<Home />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/manga/:id" element={<MangaDetails />} />
            <Route path="/filter" element={<Filter />} />
            <Route path="/title/:mangaid/:chapterid" element={<Chapter />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/booksmark/:id" element={<Booksmark />} />
          </Route>

          <Route path='/chapter/:id' element={<ChapterLayout />} >
            <Route index element={<Chapter />} />
          </Route>


        </Routes>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
)
