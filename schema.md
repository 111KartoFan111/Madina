nutrition-tracker/
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── assets/
│   └── src/
│       ├── components/
│       │   ├── Layout/
│       │   │   ├── Navbar.jsx
│       │   │   ├── Sidebar.jsx
│       │   │   └── Footer.jsx
│       │   ├── Pages/
│       │   │   ├── Dashboard.jsx
│       │   │   ├── FoodTracker.jsx
│       │   │   ├── MealPlanner.jsx
│       │   │   ├── Profile.jsx
│       │   │   └── Auth/
│       │   │       ├── Login.jsx
│       │   │       └── Register.jsx
│       │   └── Shared/
│       │       ├── UI/
│       │       │   ├── Button.jsx
│       │       │   ├── Card.jsx
│       │       │   ├── Modal.jsx
│       │       │   └── Loader.jsx
│       │       └── Forms/
│       │           ├── FoodForm.jsx
│       │           └── MealForm.jsx
│       ├── store/
│       │   ├── index.js
│       │   ├── authSlice.js
│       │   ├── foodSlice.js
│       │   └── mealSlice.js
│       ├── utils/
│       │   ├── api.js
│       │   ├── auth.js
│       │   └── helpers.js
│       ├── App.jsx
│       └── index.jsx
└── backend/
    ├── app.py
    ├── database.py
    ├── routes.py
    └── nutritrack.db