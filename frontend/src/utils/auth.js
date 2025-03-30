// utils/auth.js
export const checkAuthToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }
    
    // Check if token is expired (would need to decode JWT)
    // For simplicity, just checking if token exists
    return true;
  };
  