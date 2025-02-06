## DESCRIPTION:
> The main focus of this project is to create a private network of devices (laptops, phones, desktops...) 
> where every user can access an API with the ability to communicate with various locally hosted LLMs.
> <br><br>
> The biggest advantage this solution has is it's **privacy**, as the AIs can't directly access the network, 
> leaving the user's data completely private and trasnfered through secure protocols.


## TODO:

- [ ] Multiple LLMs running simultaneously.
- [ ] Client interface.
- [ ] LLM selection on client.
- [ ] Multimodal LLM (with images and audio).
- [ ] Voice controlled client and LLM communication.
- [ ] Authentication to be able to use the API.
- [ ] Secure DB to manage credentials and OAuth (Supabase).

    ### EXTRA:

    - [ ] P2P Chat
  

## NOTES:
> ### WSL:
> **VENV:** `source ~/.virtualenvs/LocalAI/bin/activate`<br>
> **API:** `uvicorn TestAPI:app --host localhost --port 8080 --reload`<br>
> ### CMD:
> **CLOUDFLARE TUNNEL:** `cloudflared tunnel --url http://localhost:8080`


## AI:
> ### Ollama:
> - [Llama-3.2](https://ollama.com/library/llama3.2:3b) `3B` `Tools` - *2GB* <br>
> - [Deepseek-coder](https://ollama.com/library/deepseek-coder:1.3b) `1.3B` - *776MB* <br>
> - [Deepseek-coder](https://ollama.com/library/deepseek-coder:6.7b) `6.7B` - *3.8GB* <br>
> - [Deepseek-R1](https://ollama.com/library/deepseek-r1:1.5b) `1.5B` - *1.1GB* <br>
> - [Deepseek-R1](https://ollama.com/library/deepseek-r1:7b) `8B` - *4.7GB* <br>
> - [Deepseek-llm](https://ollama.com/library/deepseek-llm:7b) `7B` - *4GB* <br>
> - [+ Llava](https://ollama.com/library/llava:7b) `7B` `Vision` - *4.7GB* <br>
> - [+ Llava-llama-3](https://ollama.com/library/llava-llama3) `8B` `Vision` - *5.5GB* <br>
> <br>
> **Total storage:** `26.6GB`


## TOOLS: 

> **FastAPI:** https://github.com/fastapi/fastapi<br><br>
> FastAPI is a modern, high performance, fast API framework, written in Python.

> **Cloudflared:** https://github.com/cloudflare/cloudflared<br><br>
> Creates a secure tunnel between your local device and a remote server, effectively bypassing network restrictions such as firewalls.

> **[OBSOLETE] Telebit:** https://github.com/fastapi/fastapi<br><br>
> Telebit operates by establishing a secure tunnel between your local device and a remote server, effectively bypassing network restrictions such as firewalls. <br><br>
> **Local Setup**: Telebit Remote client on a local device.<br><br>
> **Relay Server**: Telebit relies on a relay server (telebit.cloud) to facilitate the connection. This server acts as an intermediary, allowing your local device to communicate with external clients.