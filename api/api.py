from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import ollama
import subprocess

HOST = "localhost"
PORT = 8080
WORKERS = 4  # Processes

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200", "localchat-ai.vercel.app"],
    #allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Request(BaseModel):
    prompt: str
    #model: str
    #length: str
    
@app.post("/generate")
async def generate(request: Request):
    # Send the prompt to the model on ollama
    prompt = request.prompt
    return {"response": prompt[::-1]}

@app.get("/models")
async def models():
    models = subprocess.run(["ollama", "list"], capture_output=True, text=True).stdout
    lines = models.strip().split("\n")[1:]
    models = {}
    for line in lines:
        parts = [part for part in line.split(" ") if part]

        key = parts[0]
        name, version = (key.split(":", 1) + [""])[0].strip(), (key.split(":", 1) + [""])[1].strip()
        models[parts[0]] = {
            "avatar": 'models/' + ("llama.svg" if key.startswith('llama') else "deepseek.svg" if key.startswith('deepseek') else 'ia.svg'),
            "name": f"{name[0].upper() + name[1:]} ({version})" if version else name[0].upper() + name[1:] if name else "",
            "id": parts[1]
        }

    return {"response": models}


# https://github.com/ollama/ollama-python