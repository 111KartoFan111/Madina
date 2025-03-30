import React, { useState, useEffect } from 'react';
import Loader from '../UI/Loader';
import '../../styles/Forms.css';

const MealForm = ({ foods, initialData, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    meal_type: 'breakfast',
    items: []
  });

  const [selectedFood, setSelectedFood] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [errors, setErrors] = useState({});

  // Set initial data if editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        meal_type: initialData.meal_type || 'breakfast',
        items: initialData.items || []
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFoodSelect = (e) => {
    setSelectedFood(e.target.value);
  };

  const handleQuantityChange = (e) => {
    setSelectedQuantity(Number(e.target.value));
  };

  const addFoodItem = () => {
    if (!selectedFood) {
      setErrors(prev => ({ ...prev, selectedFood: 'Please select a food' }));
      return;
    }

    if (selectedQuantity <= 0) {
      setErrors(prev => ({ ...prev, selectedQuantity: 'Quantity must be positive' }));
      return;
    }

    setErrors({});

    const selectedFoodObj = foods.find(food => food.id === selectedFood);

    if (selectedFoodObj) {
      const newItem = {
        id: Date.now().toString(), // Temporary ID for frontend
        food_id: selectedFoodObj.id,
        food_name: selectedFoodObj.name,
        quantity: selectedQuantity,
        calories: Math.round(selectedFoodObj.calories * selectedQuantity / 100),
        protein: Math.round(selectedFoodObj.protein * selectedQuantity / 100 * 10) / 10,
        carbs: Math.round(selectedFoodObj.carbs * selectedQuantity / 100 * 10) / 10,
        fat: Math.round(selectedFoodObj.fat * selectedQuantity / 100 * 10) / 10
      };

      setFormData(prev => ({
        ...prev,
        items: [...prev.items, newItem]
      }));

      setSelectedFood('');
      setSelectedQuantity(1);
    }
  };

  const removeFoodItem = (itemId) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId)
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Meal name is required';
    }

    if (formData.items.length === 0) {
      newErrors.items = 'Please add at least one food item';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const totalNutrition = formData.items.reduce(
        (acc, item) => {
          acc.calories += item.calories;
          acc.protein += item.protein;
          acc.carbs += item.carbs;
          acc.fat += item.fat;
          return acc;
        },
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      );

      onSubmit({
        ...formData,
        total_calories: totalNutrition.calories,
        total_protein: totalNutrition.protein,
        total_carbs: totalNutrition.carbs,
        total_fat: totalNutrition.fat
      });
    }
  };

  // Calculate totals
  const totals = formData.items.reduce(
    (acc, item) => {
      acc.calories += item.calories;
      acc.protein += item.protein;
      acc.carbs += item.carbs;
      acc.fat += item.fat;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Meal Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={errors.name ? 'input-error' : ''}
        />
        {errors.name && <span className="error">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="meal_type">Meal Type</label>
        <select
          id="meal_type"
          name="meal_type"
          value={formData.meal_type}
          onChange={handleChange}
        >
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
          <option value="snack">Snack</option>
        </select>
      </div>

      <div className="food-selection-container">
        <h3>Add Food Items</h3>

        <div className="food-selection">
          <div className="form-group">
            <label htmlFor="food">Select Food</label>
            <select
              id="food"
              name="food"
              value={selectedFood}
              onChange={handleFoodSelect}
              className={errors.selectedFood ? 'input-error' : ''}
            >
              <option value="">Select a food...</option>
              {foods.map(food => (
                <option key={food.id} value={food.id}>
                  {food.name} ({food.calories} cal per 100g)
                </option>
              ))}
            </select>
            {errors.selectedFood && <span className="error">{errors.selectedFood}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="quantity">Quantity (g)</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={selectedQuantity}
              onChange={handleQuantityChange}
              min="1"
              className={errors.selectedQuantity ? 'input-error' : ''}
            />
            {errors.selectedQuantity && <span className="error">{errors.selectedQuantity}</span>}
          </div>

          <button
            type="button"
            className="add-food-button"
            onClick={addFoodItem}
          >
            Add Food
          </button>
        </div>
      </div>
      {errors.items && <span className="error center">{errors.items}</span>}
      <div className="meal-items-container">
        <h3>Meal Items</h3>
        {formData.items.length > 0 ? (
          <div className="meal-items">
            <div className="meal-items-header">
              <span>Food</span>
              <span>Quantity</span>
              <span>Calories</span>
              <span>Action</span>
            </div>

            {formData.items.map(item => (
              <div key={item.id} className="meal-item">
                <span className="food-name">{item.food_name}</span>
                <span className="food-quantity">{item.quantity}g</span>
                <span className="food-calories">{item.calories} cal</span>
                <button
                  type="button"
                  className="remove-button"
                  onClick={() => removeFoodItem(item.id)}
                >
                  Remove
                </button>
              </div>
            ))}

            <div className="meal-totals">
              <span>Totals:</span>
              <span></span>
              <span>{totals.calories} cal</span>
              <span></span>
            </div>

            <div className="nutrition-summary">
              <div className="nutrition-item">
                <span>Protein:</span>
                <span>{totals.protein.toFixed(1)}g</span>
              </div>
              <div className="nutrition-item">
                <span>Carbs:</span>
                <span>{totals.carbs.toFixed(1)}g</span>
              </div>
              <div className="nutrition-item">
                <span>Fat:</span>
                <span>{totals.fat.toFixed(1)}g</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="no-items">
            <p>No food items added yet</p>
          </div>
        )}
      </div>

      <button
        type="submit"
        className="submit-button"
        disabled={isLoading}
      >
        {isLoading ? <Loader size="small" /> : (initialData ? 'Update Meal' : 'Create Meal')}
      </button>
    </form>
  );
};

export default MealForm;