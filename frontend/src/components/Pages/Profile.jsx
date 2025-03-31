import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useSelector, useDispatch } from 'react-redux';
import Card from '../Shared/UI/Card';
import Loader from '../Shared/UI/Loader';
import { fetchUserProfile, updateUserProfile } from '../../utils/api';
import { updateUser } from '../../store/authSlice';
import '../../styles/Profile.css';

const Profile = () => {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    gender: '',
    age: '',
    weight: '',
    height: '',
    activity_level: 'moderate',
    goal: 'maintain',
    dietary_preferences: []
  });
  
  const [errors, setErrors] = useState({});
  
  // Fetch user profile
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['userProfile', user?.id],
    queryFn: () => fetchUserProfile(user?.id),
    enabled: !!user?.id,
    onSuccess: (data) => {
      setFormData(prev => ({
        ...prev,
        ...data
      }));
    }
  });
  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (data) => {
      dispatch(updateUser(data));
    }
  });
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      const updatedPreferences = checked
        ? [...formData.dietary_preferences, value]
        : formData.dietary_preferences.filter(pref => pref !== value);
        
      setFormData(prev => ({
        ...prev,
        dietary_preferences: updatedPreferences
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.full_name) {
      newErrors.full_name = 'Full name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (formData.age && (isNaN(formData.age) || formData.age < 0)) {
      newErrors.age = 'Age must be a positive number';
    }
    
    if (formData.weight && (isNaN(formData.weight) || formData.weight < 0)) {
      newErrors.weight = 'Weight must be a positive number';
    }
    
    if (formData.height && (isNaN(formData.height) || formData.height < 0)) {
      newErrors.height = 'Height must be a positive number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      updateProfileMutation.mutate({
        id: user?.id,
        ...formData
      });
    }
  };
  
  if (isLoading) return <div className="loading-container"><Loader /></div>;
  
  if (error) return (
    <div className="error-container">
      <h3>Error loading profile data</h3>
      <p>{error.message}</p>
    </div>
  );

  return (
    <div className="profile">
      <h1>User Profile</h1>
      
      <div className="profile-container">
        <Card className="profile-card">
          <h2>Personal Information</h2>
          
          {updateProfileMutation.isSuccess && (
            <div className="success-message">
              Profile updated successfully!
            </div>
          )}
          
          {updateProfileMutation.isError && (
            <div className="error-message">
              Failed to update profile: {updateProfileMutation.error?.message}
            </div>
          )}
          
          <form className="profile-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="full_name">Full Name</label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className={errors.full_name ? 'input-error' : ''}
              />
              {errors.full_name && <span className="error">{errors.full_name}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'input-error' : ''}
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="age">Age</label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className={errors.age ? 'input-error' : ''}
                />
                {errors.age && <span className="error">{errors.age}</span>}
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="weight">Weight (kg)</label>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className={errors.weight ? 'input-error' : ''}
                />
                {errors.weight && <span className="error">{errors.weight}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="height">Height (cm)</label>
                <input
                  type="number"
                  id="height"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  className={errors.height ? 'input-error' : ''}
                />
                {errors.height && <span className="error">{errors.height}</span>}
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="activity_level">Activity Level</label>
              <select
                id="activity_level"
                name="activity_level"
                value={formData.activity_level}
                onChange={handleChange}
              >
                <option value="sedentary">Sedentary (little or no exercise)</option>
                <option value="light">Light (exercise 1-3 days/week)</option>
                <option value="moderate">Moderate (exercise 3-5 days/week)</option>
                <option value="active">Active (exercise 6-7 days/week)</option>
                <option value="very_active">Very Active (hard exercise daily)</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="goal">Fitness Goal</label>
              <select
                id="goal"
                name="goal"
                value={formData.goal}
                onChange={handleChange}
              >
                <option value="lose">Lose Weight</option>
                <option value="maintain">Maintain Weight</option>
                <option value="gain">Gain Weight</option>
                <option value="build_muscle">Build Muscle</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Dietary Preferences</label>
              <div className="checkbox-group">
                <div className="checkbox-item">
                  <input
                    type="checkbox"
                    id="vegetarian"
                    name="dietary_preferences"
                    value="vegetarian"
                    checked={formData.dietary_preferences.includes('vegetarian')}
                    onChange={handleChange}
                  />
                  <label htmlFor="vegetarian">Vegetarian</label>
                </div>
                
                <div className="checkbox-item">
                  <input
                    type="checkbox"
                    id="vegan"
                    name="dietary_preferences"
                    value="vegan"
                    checked={formData.dietary_preferences.includes('vegan')}
                    onChange={handleChange}
                  />
                  <label htmlFor="vegan">Vegan</label>
                </div>
                
                <div className="checkbox-item">
                  <input
                    type="checkbox"
                    id="gluten_free"
                    name="dietary_preferences"
                    value="gluten_free"
                    checked={formData.dietary_preferences.includes('gluten_free')}
                    onChange={handleChange}
                  />
                  <label htmlFor="gluten_free">Gluten Free</label>
                </div>
                
                <div className="checkbox-item">
                  <input
                    type="checkbox"
                    id="dairy_free"
                    name="dietary_preferences"
                    value="dairy_free"
                    checked={formData.dietary_preferences.includes('dairy_free')}
                    onChange={handleChange}
                  />
                  <label htmlFor="dairy_free">Dairy Free</label>
                </div>
                
                <div className="checkbox-item">
                  <input
                    type="checkbox"
                    id="keto"
                    name="dietary_preferences"
                    value="keto"
                    checked={formData.dietary_preferences.includes('keto')}
                    onChange={handleChange}
                  />
                  <label htmlFor="keto">Keto</label>
                </div>
                
                <div className="checkbox-item">
                  <input
                    type="checkbox"
                    id="paleo"
                    name="dietary_preferences"
                    value="paleo"
                    checked={formData.dietary_preferences.includes('paleo')}
                    onChange={handleChange}
                  />
                  <label htmlFor="paleo">Paleo</label>
                </div>
              </div>
            </div>
            
            <button 
              type="submit" 
              className="update-profile-button" 
              disabled={updateProfileMutation.isLoading}
            >
              {updateProfileMutation.isLoading ? <Loader size="small" /> : 'Update Profile'}
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Profile;