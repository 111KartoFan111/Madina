import React from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import Card from '../Shared/UI/Card';
import Loader from '../Shared/UI/Loader';
import { fetchDashboardData } from '../../utils/api';
import '../../styles/Dashboard.css';

const Dashboard = () => {
  const { user } = useSelector(state => state.auth);

  const { data, isLoading, error } = useQuery(
    ['dashboardData', user?.id], 
    () => fetchDashboardData(user?.id),
    {
      enabled: !!user?.id,
      staleTime: 300000, // 5 minutes
    }
  );

  if (isLoading) return <div className="loading-container"><Loader /></div>;

  if (error) return (
    <div className="error-container">
      <h3>Error loading dashboard data</h3>
      <p>{error.message}</p>
    </div>
  );

  const { todayStats, weeklyProgress, recentMeals } = data || {
    todayStats: { calories: 0, protein: 0, carbs: 0, fat: 0 },
    weeklyProgress: [],
    recentMeals: []
  };

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="welcome-message">
        <h2>Welcome back, {user?.full_name || 'User'}!</h2>
        <p>Here's your nutrition summary</p>
      </div>
      <div className="stats-container">
        <Card className="stat-card">
          <h3>Today's Stats</h3>
          <div className="stat-grid">
            <div className="stat-item">
              <span className="stat-label">Calories</span>
              <span className="stat-value">{todayStats.calories}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Protein</span>
              <span className="stat-value">{todayStats.protein}g</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Carbs</span>
              <span className="stat-value">{todayStats.carbs}g</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Fat</span>
              <span className="stat-value">{todayStats.fat}g</span>
            </div>
          </div>
        </Card>
      </div>
      <div className="dashboard-grid">
        <Card className="recent-meals">
          <h3>Recent Meals</h3>
          {recentMeals.length > 0 ? (
            <ul className="meals-list">
              {recentMeals.map(meal => (
                <li key={meal.id} className="meal-item">
                  <div className="meal-header">
                    <h4>{meal.name}</h4>
                    <span className="meal-type">{meal.meal_type}</span>
                  </div>
                  <p className="meal-time">{new Date(meal.date).toLocaleDateString()} - {meal.time}</p>
                  <div className="meal-stats">
                    <span>{meal.calories} cal</span>
                    <span>{meal.protein}g protein</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-data">No recent meals recorded</p>
          )}
        </Card>
        <Card className="weekly-progress">
          <h3>Weekly Progress</h3>
          <div className="progress-chart">
            {/* Chart would go here - using a placeholder */}
            <div className="chart-placeholder">
              <div className="placeholder-bars">
                {weeklyProgress.map((day, index) => (
                  <div
                    key={index}
                    className="placeholder-bar"
                    style={{ height: `${(day.percentage || 0) * 100}%` }}
                  >
                    <span className="bar-label">{day.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;