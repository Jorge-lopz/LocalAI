import requests
import subprocess

url = "https://nutrition-activists-eminem-brisbane.trycloudflare.com"
data = {
    "prompt": "Hello, world!",
    "model": "some_model_name",
    "length": "short"
}

response = requests.post(url + "/generate/", json=data)

print("Response:", response.json())

text = subprocess.run(["ollama", "list"], capture_output=True, text=True).stdout
for line in text.splitlines():
    print(line.split(" ")[0].strip())