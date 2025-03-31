from datetime import datetime
from typing import List, Optional
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Table, Boolean, create_engine, Index, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker, Session
from pydantic import BaseModel, EmailStr, validator, Field, conlist
import os
from passlib.context import CryptContext

# SQLAlchemy setup
DATABASE_URL = "sqlite:///./nutritrack.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Association tables
meal_food_association = Table(
    'meal_food_association',
    Base.metadata,
    Column('meal_id', Integer, ForeignKey('meals.id'), primary_key=True),
    Column('food_id', Integer, ForeignKey('foods.id'), primary_key=True),
    Column('quantity', Float, nullable=False, default=0.0)
)

# Database Models
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Profile fields
    gender = Column(String, nullable=True)
    age = Column(Integer, nullable=True)
    weight = Column(Float, nullable=True)
    height = Column(Float, nullable=True)
    activity_level = Column(String, default="moderate")
    goal = Column(String, default="maintain")
    dietary_preferences = Column(String, nullable=True)  # Stored as comma-separated values
    
    # Relationships
    foods = relationship("Food", back_populates="created_by")
    meals = relationship("Meal", back_populates="user")
    meal_plans = relationship("MealPlan", back_populates="user")
    
    # Indexes
    __table_args__ = (
        Index('idx_user_email', email),
    )

class Food(Base):
    __tablename__ = "foods"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    calories = Column(Float)
    protein = Column(Float)
    carbs = Column(Float)
    fat = Column(Float)
    fiber = Column(Float, nullable=True)
    sugar = Column(Float, nullable=True)
    serving_size = Column(Float)
    category = Column(String, nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    created_by = relationship("User", back_populates="foods")
    meals = relationship("Meal", secondary=meal_food_association, back_populates="foods")
    
    # Indexes
    __table_args__ = (
        Index('idx_food_name', name),
        Index('idx_food_user', user_id),
    )

class Meal(Base):
    __tablename__ = "meals"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    meal_type = Column(String)  # breakfast, lunch, dinner, snack
    date = Column(String, index=True)  # YYYY-MM-DD format
    time = Column(String, nullable=True)  # HH:MM format
    user_id = Column(Integer, ForeignKey("users.id"))
    total_calories = Column(Float, default=0.0)
    total_protein = Column(Float, default=0.0)
    total_carbs = Column(Float, default=0.0)
    total_fat = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="meals")
    foods = relationship("Food", secondary=meal_food_association, back_populates="meals")
    meal_items = relationship("MealItem", back_populates="meal", cascade="all, delete-orphan")
    
    # Indexes
    __table_args__ = (
        Index('idx_meal_date', date),
        Index('idx_meal_user', user_id),
    )

class MealItem(Base):
    __tablename__ = "meal_items"
    
    id = Column(Integer, primary_key=True, index=True)
    meal_id = Column(Integer, ForeignKey("meals.id"))
    food_id = Column(Integer, ForeignKey("foods.id"))
    quantity = Column(Float)
    calories = Column(Float)
    protein = Column(Float)
    carbs = Column(Float)
    fat = Column(Float)
    
    # Relationships
    meal = relationship("Meal", back_populates="meal_items")
    food = relationship("Food")

class MealPlan(Base):
    __tablename__ = "meal_plans"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    start_date = Column(String, index=True)  # YYYY-MM-DD format
    end_date = Column(String, index=True)    # YYYY-MM-DD format
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="meal_plans")
    
    # Indexes
    __table_args__ = (
        Index('idx_mealplan_dates', start_date, end_date),
        Index('idx_mealplan_user', user_id),
    )


# Pydantic models for validation
class UserBase(BaseModel):
    email: EmailStr
    full_name: str

class UserCreate(UserBase):
    password: str
    
    @validator('password')
    def password_strength(cls, v):
        if len(v) < 6:
            raise ValueError('Password must be at least 6 characters')
        return v

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserProfile(BaseModel):
    gender: Optional[str] = None
    age: Optional[int] = None
    weight: Optional[float] = None
    height: Optional[float] = None
    activity_level: Optional[str] = "moderate"
    goal: Optional[str] = "maintain"
    dietary_preferences: Optional[List[str]] = []

class UserUpdate(UserBase):
    gender: Optional[str] = None
    age: Optional[int] = None
    weight: Optional[float] = None
    height: Optional[float] = None
    activity_level: Optional[str] = None
    goal: Optional[str] = None
    dietary_preferences: Optional[List[str]] = None

class UserOut(UserBase):
    id: int
    gender: Optional[str] = None
    age: Optional[int] = None
    weight: Optional[float] = None
    height: Optional[float] = None
    activity_level: Optional[str] = None
    goal: Optional[str] = None
    dietary_preferences: Optional[List[str]] = []
    created_at: datetime
    
    class Config:
        from_attributes = True  # Change this from orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut

class FoodBase(BaseModel):
    name: str
    calories: float
    protein: float
    carbs: float
    fat: float
    fiber: Optional[float] = 0.0
    sugar: Optional[float] = 0.0
    serving_size: float
    category: Optional[str] = "other"

class FoodCreate(FoodBase):
    pass

class FoodUpdate(FoodBase):
    pass

class FoodOut(FoodBase):
    id: int
    user_id: int
    created_at: datetime
    
    class Config:
        orm_mode = True

class MealItemBase(BaseModel):
    food_id: int
    quantity: float

class MealItemCreate(MealItemBase):
    pass

class MealItemOut(BaseModel):
    id: int
    food_id: int
    food_name: str
    quantity: float
    calories: float
    protein: float
    carbs: float
    fat: float
    
    class Config:
        orm_mode = True

class MealBase(BaseModel):
    name: str
    meal_type: str
    date: str
    time: Optional[str] = None

class MealCreate(MealBase):
    items: List[MealItemCreate]

class MealUpdate(MealBase):
    items: List[MealItemCreate]

class MealOut(MealBase):
    id: int
    user_id: int
    total_calories: float
    total_protein: float
    total_carbs: float
    total_fat: float
    items: List[MealItemOut]
    created_at: datetime
    
    class Config:
        orm_mode = True

class MealPlanBase(BaseModel):
    name: str
    start_date: str
    end_date: str

class MealPlanCreate(MealPlanBase):
    pass

class MealPlanUpdate(MealPlanBase):
    pass

class MealPlanOut(MealPlanBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class DashboardData(BaseModel):
    today_stats: dict
    weekly_progress: list
    recent_meals: list


# Database helper functions
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    Base.metadata.create_all(bind=engine)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)
