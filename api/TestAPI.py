from fastapi import FastAPI

HOST = "localhost"
PORT = 8080
WORKERS = 4  # Processes

app = FastAPI()

@app.get("/generate/")
async def generate(prompt: str, model: str, length: str):
    return {"response": prompt.lower()}
