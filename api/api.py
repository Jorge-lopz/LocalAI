from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import ollama
import subprocess
from ollama import chat, ChatResponse
from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse
import asyncio


HOST = "localhost"
PORT = 8080
WORKERS = 4  # Processes

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200", "localchat-ai.vercel.app", "https://5qng1j8r-4200.uks1.devtunnels.ms"],
    #allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Request(BaseModel):
    prompt: str
    model: str
    length: str

async def generate_stream(model: str, prompt: str):
    response = ollama.chat(model=model, messages=[{"role": "user", "content": prompt}], stream=True)
    
    for chunk in response:
        if "message" in chunk:
            yield chunk["message"]["content"]  # Solo el texto generado
            await asyncio.sleep(0)  # No bloquea el event loop

@app.post("/generate")
async def generate(request: Request):
    return StreamingResponse(generate_stream(request.model, request.prompt), media_type="text/event-stream")

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