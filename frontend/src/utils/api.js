// utils/api.js
const API_URL = 'http://localhost:8000';

// Helper function to handle errors
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.detail || `Server error: ${response.status}`;
    throw new Error(errorMessage);
  }
  return response.json();
};

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

// Authentication APIs
export const loginUser = async (credentials) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  });

  return handleResponse(response);
};

export const registerUser = async (userData) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });

  return handleResponse(response);
};

export const logoutUser = async () => {
  const response = await fetch(`${API_URL}/auth/logout`, {
    method: 'POST',
    headers: getAuthHeaders()
  });

  return handleResponse(response);
};

// User profile APIs
export const fetchUserProfile = async (userId) => {
  const response = await fetch(`${API_URL}/users/${userId}`, {
    headers: getAuthHeaders()
  });

  return handleResponse(response);
};

export const updateUserProfile = async (userData) => {
  const response = await fetch(`${API_URL}/users/${userData.id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(userData)
  });

  return handleResponse(response);
};

// Foods APIs
export const fetchFoods = async (userId) => {
  const response = await fetch(`${API_URL}/foods?user_id=${userId}`, {
    headers: getAuthHeaders()
  });

  return handleResponse(response);
};

export const addFood = async (foodData) => {
  const response = await fetch(`${API_URL}/foods`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(foodData)
  });

  return handleResponse(response);
};

export const updateFood = async (foodData) => {
  const response = await fetch(`${API_URL}/foods/${foodData.id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(foodData)
  });

  return handleResponse(response);
};

export const deleteFood = async (foodId) => {
  const response = await fetch(`${API_URL}/foods/${foodId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });

  return handleResponse(response);
};

// Meals APIs
export const fetchMealPlans = async (userId, date) => {
  const response = await fetch(`${API_URL}/meals?user_id=${userId}&date=${date}`, {
    headers: getAuthHeaders()
  });

  return handleResponse(response);
};

export const createMealPlan = async (mealData) => {
  const response = await fetch(`${API_URL}/meals`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(mealData)
  });

  return handleResponse(response);
};

export const updateMealPlan = async (mealData) => {
  const response = await fetch(`${API_URL}/meals/${mealData.id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(mealData)
  });

  return handleResponse(response);
};

export const deleteMealPlan = async (mealId) => {
  const response = await fetch(`${API_URL}/meals/${mealId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });

  return handleResponse(response);
};

// Dashboard data
export const fetchDashboardData = async (userId) => {
  const response = await fetch(`${API_URL}/dashboard?user_id=${userId}`, {
    headers: getAuthHeaders()
  });

  return handleResponse(response);
};