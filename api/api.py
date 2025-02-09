from fastapi import FastAPI
from pydantic import BaseModel

HOST = "localhost"
PORT = 8080
WORKERS = 4  # Processes

app = FastAPI()

class request(BaseModel):
    prompt: str
    model: str
    length: str

@app.post("/generate/")
async def generate(request: request):
    # Send the prompt to the model on ollama
    prompt = request.prompt
    return {"response": prompt[::-1]}
