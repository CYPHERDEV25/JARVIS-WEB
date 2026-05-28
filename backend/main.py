import os
import uvicorn
from app.main import app

if __name__ == "__main__":
    # Automatically use Railway's PORT environment variable.
    # Fallback to 8000 for local development.
    port = int(os.environ.get("PORT", 8000))
    
    # Run the application
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=False)
