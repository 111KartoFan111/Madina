import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import Card from '../Shared/UI/Card';
import Modal from '../Shared/UI/Modal';
import Loader from '../Shared/UI/Loader';
import MealForm from '../Shared/Forms/MealForm';
import {
  fetchMealPlans,
  fetchFoods,
  createMealPlan,
  updateMealPlan,
  deleteMealPlan
} from '../../utils/api';
import '../../styles/MealPlanner.css';

const MealPlanner = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [editingMeal, setEditingMeal] = useState(null);
  const { user } = useSelector(state => state.auth);
  const queryClient = useQueryClient();
  
  // Format date for API
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };
  
  // Fetch meal plans - Using v5 object syntax
  const { data: mealPlans, isLoading: isLoadingMeals, error: mealsError } = useQuery({
    queryKey: ['mealPlans', user?.id, formatDate(selectedDate)],
    queryFn: () => fetchMealPlans(user?.id, formatDate(selectedDate)),
    enabled: !!user?.id,
  });
  
  // Fetch foods for meal creation - Using v5 object syntax
  const { data: foods, isLoading: isLoadingFoods } = useQuery({
    queryKey: ['foods', user?.id],
    queryFn: () => fetchFoods(user?.id),
    enabled: !!user?.id,
  });
  
  // Create meal plan mutation
  const createMealMutation = useMutation({
    mutationFn: createMealPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mealPlans', user?.id, formatDate(selectedDate)] });
      setShowAddModal(false);
    }
  });
  
  const updateMealMutation = useMutation({
    mutationFn: updateMealPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mealPlans', user?.id, formatDate(selectedDate)] });
      setShowAddModal(false);
      setEditingMeal(null);
    }
  });
  
  const deleteMealMutation = useMutation({
    mutationFn: deleteMealPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mealPlans', user?.id, formatDate(selectedDate)] });
    }
  });
  
  // Handle meal form submission
  const handleMealSubmit = (mealData) => {
    const mealWithDate = {
      ...mealData,
      date: formatDate(selectedDate),
      user_id: user?.id
    };
    
    if (editingMeal) {
      updateMealMutation.mutate({ id: editingMeal.id, ...mealWithDate });
    } else {
      createMealMutation.mutate(mealWithDate);
    }
  };
  
  // Handle meal deletion
  const handleDeleteMeal = (mealId) => {
    if (window.confirm('Are you sure you want to delete this meal?')) {
      deleteMealMutation.mutate(mealId);
    }
  };
  
  // Open edit modal
  const handleEditMeal = (meal) => {
    setEditingMeal(meal);
    setShowAddModal(true);
  };
  
  // Group meals by type
  const getMealsByType = (type) => {
    return mealPlans ? mealPlans.filter(meal => meal.meal_type === type) : [];
  };
  
  // Change selected date
  const changeDate = (daysToAdd) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + daysToAdd);
    setSelectedDate(newDate);
  };
  
  const isLoading = isLoadingMeals || isLoadingFoods;
  
  if (isLoading) return <div className="loading-container"><Loader /></div>;
  
  if (mealsError) return (
    <div className="error-container">
      <h3>Error loading meal data</h3>
      <p>{mealsError.message}</p>
    </div>
  );

  return (
    <div className="meal-planner">
      <div className="page-header">
        <h1>Meal Planner</h1>
        <button 
          className="add-button" 
          onClick={() => {
            setEditingMeal(null);
            setShowAddModal(true);
          }}
        >
          Add New Meal
        </button>
      </div>
      
      <div className="date-selector">
        <button className="date-nav" onClick={() => changeDate(-1)}>
          &lt;
        </button>
        <h2>{selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h2>
        <button className="date-nav" onClick={() => changeDate(1)}>
          &gt;
        </button>
      </div>
      
      <div className="meal-sections">
        <Card className="meal-section">
          <h3>Breakfast</h3>
          {getMealsByType('breakfast').length > 0 ? (
            <div className="meals-list">
              {getMealsByType('breakfast').map(meal => (
                <div key={meal.id} className="meal-item">
                  <div className="meal-details">
                    <h4>{meal.name}</h4>
                    <div className="meal-nutritions">
                      <span>{meal.total_calories} cal</span>
                      <span>{meal.total_protein}g protein</span>
                    </div>
                  </div>
                  <div className="meal-actions">
                    <button className="edit-button" onClick={() => handleEditMeal(meal)}>Edit</button>
                    <button className="delete-button" onClick={() => handleDeleteMeal(meal.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-meals">
              <p>No breakfast planned</p>
              <button className="add-meal-button" onClick={() => {
                setEditingMeal({ meal_type: 'breakfast' });
                setShowAddModal(true);
              }}>
                Add Breakfast
              </button>
            </div>
          )}
        </Card>
        
        <Card className="meal-section">
          <h3>Lunch</h3>
          {getMealsByType('lunch').length > 0 ? (
            <div className="meals-list">
              {getMealsByType('lunch').map(meal => (
                <div key={meal.id} className="meal-item">
                  <div className="meal-details">
                    <h4>{meal.name}</h4>
                    <div className="meal-nutritions">
                      <span>{meal.total_calories} cal</span>
                      <span>{meal.total_protein}g protein</span>
                    </div>
                  </div>
                  <div className="meal-actions">
                    <button className="edit-button" onClick={() => handleEditMeal(meal)}>Edit</button>
                    <button className="delete-button" onClick={() => handleDeleteMeal(meal.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-meals">
              <p>No lunch planned</p>
              <button className="add-meal-button" onClick={() => {
                setEditingMeal({ meal_type: 'lunch' });
                setShowAddModal(true);
              }}>
                Add Lunch
              </button>
            </div>
          )}
        </Card>
        
        <Card className="meal-section">
          <h3>Dinner</h3>
          {getMealsByType('dinner').length > 0 ? (
            <div className="meals-list">
              {getMealsByType('dinner').map(meal => (
                <div key={meal.id} className="meal-item">
                  <div className="meal-details">
                    <h4>{meal.name}</h4>
                    <div className="meal-nutritions">
                      <span>{meal.total_calories} cal</span>
                      <span>{meal.total_protein}g protein</span>
                    </div>
                  </div>
                  <div className="meal-actions">
                    <button className="edit-button" onClick={() => handleEditMeal(meal)}>Edit</button>
                    <button className="delete-button" onClick={() => handleDeleteMeal(meal.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-meals">
              <p>No dinner planned</p>
              <button className="add-meal-button" onClick={() => {
                setEditingMeal({ meal_type: 'dinner' });
                setShowAddModal(true);
              }}>
                Add Dinner
              </button>
            </div>
          )}
        </Card>
        
        <Card className="meal-section">
          <h3>Snacks</h3>
          {getMealsByType('snack').length > 0 ? (
            <div className="meals-list">
              {getMealsByType('snack').map(meal => (
                <div key={meal.id} className="meal-item">
                  <div className="meal-details">
                    <h4>{meal.name}</h4>
                    <div className="meal-nutritions">
                      <span>{meal.total_calories} cal</span>
                      <span>{meal.total_protein}g protein</span>
                    </div>
                  </div>
                  <div className="meal-actions">
                    <button className="edit-button" onClick={() => handleEditMeal(meal)}>Edit</button>
                    <button className="delete-button" onClick={() => handleDeleteMeal(meal.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-meals">
              <p>No snacks planned</p>
              <button className="add-meal-button" onClick={() => {
                setEditingMeal({ meal_type: 'snack' });
                setShowAddModal(true);
              }}>
                Add Snack
              </button>
            </div>
          )}
        </Card>
      </div>
      
      {showAddModal && (
        <Modal onClose={() => {
          setShowAddModal(false);
          setEditingMeal(null);
        }}>
          <h2>{editingMeal ? 'Edit Meal' : 'Add New Meal'}</h2>
          <MealForm 
            foods={foods || []}
            initialData={editingMeal}
            onSubmit={handleMealSubmit} 
            isLoading={createMealMutation.isLoading || updateMealMutation.isLoading}
          />
        </Modal>
      )}
    </div>
  );
};

export default MealPlanner;