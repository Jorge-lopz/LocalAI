from fastapi import FastAPI

HOST = "localhost"
PORT = 8080
WORKERS = 4  # Processes

app = FastAPI()

@app.get("/api/generate/")
async def generate(prompt: str):
    return {"response": prompt.lower()}
