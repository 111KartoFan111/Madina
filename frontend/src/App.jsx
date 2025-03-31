import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import store from './store';
import Layout from './components/Layout/Layout';
import Loader from './components/Shared/UI/Loader';
import ProtectedRoute from './components/Shared/UI/ProtectedRoute';
import './App.css';


const Dashboard = lazy(() => import('./components/Pages/Dashboard'));
const FoodTracker = lazy(() => import('./components/Pages/FoodTracker'));
const MealPlanner = lazy(() => import('./components/Pages/MealPlanner'));
const Profile = lazy(() => import('./components/Pages/Profile'));
const Login = lazy(() => import('./components/Pages/Auth/Login'));
const Register = lazy(() => import('./components/Pages/Auth/Register'));


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 300000,
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Suspense fallback={<div className="loading-container"><Loader /></div>}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Layout />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="food-tracker" element={
                  <ProtectedRoute>
                    <FoodTracker />
                  </ProtectedRoute>
                } />
                <Route path="meal-planner" element={
                  <ProtectedRoute>
                    <MealPlanner />
                  </ProtectedRoute>
                } />
                <Route path="profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
              </Route>
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Suspense>
        </Router>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;