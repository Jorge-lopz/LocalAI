from fastapi import FastAPI
from pydantic import BaseModel
import ollama
import subprocess

HOST = "localhost"
PORT = 8080
WORKERS = 4  # Processes

app = FastAPI()

class request(BaseModel):
    prompt: str
    model: str
    length: str

def format_model_name(input_str):
    # Dividir el string en nombre y versión usando ":" como separador
    parts = input_str.split(":", 1)
    name = parts[0].strip()
    version = parts[1].strip() if len(parts) > 1 else ""

    # Capitalizar la primera letra y mantener el resto del formato original
    formatted_name = name[0].upper() + name[1:] if name else ""
    
    # Agregar la versión entre paréntesis si existe
    if version:
        return f"{formatted_name} ({version})"
    else:
        return formatted_name

def get_avatar(name):
     if name.lower().startswith('llama'):
         return "models/llama.svg"
     elif name.lower().startswith('deepseek'):
         return "models/deepseek.svg"
    
    
@app.get("/test")
async def test():
    models = subprocess.run(["ollama", "list"], capture_output=True, text=True).stdout
    lines = models.strip().split("\n")[1:]  # Divide por líneas y elimina espacios al inicio/final
    final_models = {}
    for line in lines:
        # Divide la línea por espacios y filtra los elementos vacíos
        parts = [part for part in line.split(" ") if part]

        name = format_model_name(parts[0])
        # No Imprime nada
        final_models[parts[0]] = {
            "avatar": get_avatar(name),
            "name": name,
            "id": parts[1]
            }

    return final_models

@app.post("/generate")
async def generate(request: request):
    # Send the prompt to the model on ollama
    prompt = request.prompt
    return {"response": prompt[::-1]}

@app.get("/models")
async def models():
    pass


# https://github.com/ollama/ollama-python