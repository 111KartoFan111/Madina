from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import uvicorn
import time
from contextlib import asynccontextmanager

from database import init_db, get_db
from routes import (
    auth_router, users_router, foods_router, meals_router,
    meal_plans_router, dashboard_router
)

# Initialize database on startup
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database
    init_db()
    print("Database initialized")
    yield
    # Cleanup (if needed)
    print("Shutting down")

# Create FastAPI application
app = FastAPI(
    title="NutriTrack API",
    description="API for tracking and planning healthy eating",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, replace with your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add request processing time middleware
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response

# Include routers
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(foods_router)
app.include_router(meals_router)
app.include_router(meal_plans_router)
app.include_router(dashboard_router)

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to the NutriTrack API"}

# Health check endpoint
@app.get("/health")
def health_check(db: Session = Depends(get_db)):
    try:
        # Check database connection
        db.execute("SELECT 1")
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Health check failed: {str(e)}")

# Run the application
if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
