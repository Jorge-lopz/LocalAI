import requests
import ollama

print(requests.get('http://localhost:8080/models').json())

print(ollama.chat(model='deepseek-r1:1.5b',  messages=[{'role': 'user', 'content': 'What was my last question?'}]))