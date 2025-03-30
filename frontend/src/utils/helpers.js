export const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  export const calculateTotalNutrition = (items) => {
    return items.reduce(
      (acc, item) => {
        acc.calories += item.calories;
        acc.protein += item.protein;
        acc.carbs += item.carbs;
        acc.fat += item.fat;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  };

  export const calculateDailyCalories = (user) => {
    if (!user || !user.weight || !user.height || !user.age || !user.gender) {
      return 2000; // Default value
    }

    // Basic BMR calculation using Harris-Benedict formula
    let bmr;
    if (user.gender === 'male') {
      bmr = 88.362 + (13.397 * user.weight) + (4.799 * user.height) - (5.677 * user.age);
    } else {
      bmr = 447.593 + (9.247 * user.weight) + (3.098 * user.height) - (4.330 * user.age);
    }

    // Activity level multiplier
    const activityLevels = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };

    const activityMultiplier = activityLevels[user.activity_level] || 1.2;

    // Calculate TDEE (Total Daily Energy Expenditure)
    let tdee = bmr * activityMultiplier;

    // Adjust based on goal
    if (user.goal === 'lose') {
      tdee -= 500; // Deficit for weight loss
    } else if (user.goal === 'gain') {
      tdee += 500; // Surplus for weight gain
    }
    // If goal is 'maintain', no adjustment needed

    return Math.round(tdee);
  };