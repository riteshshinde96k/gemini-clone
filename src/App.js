import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import store from './store';
import { useSelector, useDispatch } from 'react-redux';
import { setDarkMode, setIsMobile } from './store/slices/uiSlice';
import { loginSuccess } from './store/slices/authSlice';
import { setChatrooms } from './store/slices/chatSlice';
import { storage, STORAGE_KEYS } from './utils/storage';

// Components
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import ChatRoom from './pages/ChatRoom';
import Layout from './components/Layout/Layout';
import ErrorBoundary from './components/ErrorBoundary';

function AppContent() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { darkMode } = useSelector((state) => state.ui);

  useEffect(() => {
    // Load user data from localStorage
    const savedUser = storage.get(STORAGE_KEYS.AUTH_USER);
    if (savedUser) {
      dispatch(loginSuccess(savedUser));
    }

    // Load chatrooms from localStorage
    const savedChatrooms = storage.get(STORAGE_KEYS.CHATROOMS);
    if (savedChatrooms) {
      dispatch(setChatrooms(savedChatrooms));
    }

    // Load dark mode preference
    const savedDarkMode = storage.get(STORAGE_KEYS.DARK_MODE);
    if (savedDarkMode !== null) {
      dispatch(setDarkMode(savedDarkMode));
    }

    // Check if mobile
    const checkMobile = () => {
      dispatch(setIsMobile(window.innerWidth < 768));
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, [dispatch]);

  useEffect(() => {
    // Apply dark mode to document
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route 
            path="/auth" 
            element={!isAuthenticated ? <AuthPage /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/dashboard" 
            element={isAuthenticated ? <Layout><Dashboard /></Layout> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/chat/:chatroomId" 
            element={isAuthenticated ? <Layout><ChatRoom /></Layout> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/" 
            element={<Navigate to={isAuthenticated ? "/dashboard" : "/auth"} />} 
          />
        </Routes>
      </Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: darkMode ? '#374151' : '#ffffff',
            color: darkMode ? '#f9fafb' : '#111827',
            border: `1px solid ${darkMode ? '#4b5563' : '#e5e7eb'}`,
          },
        }}
      />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <AppContent />
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
