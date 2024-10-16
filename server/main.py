from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import numpy as np

app = FastAPI()

# Allow CORS from any origin, or you can restrict it to certain domains
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins. You can specify certain domains here.
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

# Define the request body model
class TitlesRequest(BaseModel):
    titles: List[str]
    text: str

@app.post("/page-content")
async def get_page_content(request: TitlesRequest):
    # Access the titles list and text from the request body
    titles = request.titles
    text = request.text
    # Process the titles (for now, we will just return a random float representing confidence)
    confidence = np.random.rand()
    # Return the confidence value
    return {"confidence": confidence}

# To run the app, use uvicorn
# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000)
