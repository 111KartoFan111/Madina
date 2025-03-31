import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import Card from '../Shared/UI/Card';
import Modal from '../Shared/UI/Modal';
import Loader from '../Shared/UI/Loader';
import FoodForm from '../Shared/Forms/FoodForm';
import { fetchFoods, addFood, deleteFood } from '../../utils/api';
import '../../styles/FoodTracker.css';

const FoodTracker = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const { user } = useSelector(state => state.auth);
  const queryClient = useQueryClient();

  // Fetch foods
  const { data: foods, isLoading, error } = useQuery({
    queryKey: ['foods', user?.id],
    queryFn: () => fetchFoods(user?.id),
    enabled: !!user?.id
  });

  // Add food mutation
  const addFoodMutation = useMutation({
    mutationFn: addFood,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['foods', user?.id] });
      setShowAddModal(false);
    }
  });
  
  const deleteFoodMutation = useMutation({
    mutationFn: deleteFood,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['foods', user?.id] });
    }
  });

  // Handle add food submission
  const handleAddFood = (foodData) => {
    addFoodMutation.mutate({ ...foodData, user_id: user?.id });
  };

  // Handle delete food
  const handleDeleteFood = (foodId) => {
    if (window.confirm('Are you sure you want to delete this food?')) {
      deleteFoodMutation.mutate(foodId);
    }
  };

  // Filter and search foods
  const filteredFoods = foods ? foods.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || food.category === filterType;
    return matchesSearch && matchesFilter;
  }) : [];

  if (isLoading) return <div className="loading-container"><Loader /></div>;

  if (error) return (
    <div className="error-container">
      <h3>Error loading food data</h3>
      <p>{error.message}</p>
    </div>
  );

  return (
    <div className="food-tracker">
      <div className="page-header">
        <h1>Food Tracker</h1>
        <button
          className="add-button"
          onClick={() => setShowAddModal(true)}
        >
          Add New Food
        </button>
      </div>
      <div className="filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search foods..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-options">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="protein">Protein</option>
            <option value="carbs">Carbs</option>
            <option value="fat">Fat</option>
            <option value="vegetable">Vegetables</option>
            <option value="fruit">Fruits</option>
            <option value="dairy">Dairy</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
      <div className="foods-grid">
        {filteredFoods.length > 0 ? (
          filteredFoods.map(food => (
            <Card key={food.id} className="food-card">
              <div className="food-card-content">
                <h3>{food.name}</h3>
                <div className="nutrition-info">
                  <div className="nutrition-item">
                    <span className="label">Calories:</span>
                    <span className="value">{food.calories}</span>
                  </div>
                  <div className="nutrition-item">
                    <span className="label">Protein:</span>
                    <span className="value">{food.protein}g</span>
                  </div>
                  <div className="nutrition-item">
                    <span className="label">Carbs:</span>
                    <span className="value">{food.carbs}g</span>
                  </div>
                  <div className="nutrition-item">
                    <span className="label">Fat:</span>
                    <span className="value">{food.fat}g</span>
                  </div>
                </div>
                <div className="food-serving">
                  <span>Serving size: {food.serving_size}g</span>
                </div>
                <div className="food-actions">
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteFood(food.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="no-foods">
            <p>No foods found. Add some foods to your tracker!</p>
          </div>
        )}
      </div>
      {showAddModal && (
        <Modal onClose={() => setShowAddModal(false)}>
          <h2>Add New Food</h2>
          <FoodForm
            onSubmit={handleAddFood}
            isLoading={addFoodMutation.isLoading}
          />
        </Modal>
      )}
    </div>
  );
};

export default FoodTracker;