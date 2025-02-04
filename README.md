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
> **TELEBIT TUNNEL:** `telebit http 8080`


## AI:
> ### Ollama:
> **Deepseek-R1 (8B)**<br>


## TOOLS: 

> **FastAPI:** https://github.com/fastapi/fastapi<br>
> 
> FastAPI is a modern, high performance, fast API framework, written in Python.

---

> **Telebit:** https://github.com/fastapi/fastapi<br>
> 
> Telebit operates by establishing a secure tunnel between your local device and a remote server, effectively bypassing network restrictions such as firewalls and NATs.
> 
> **Local Setup**: Telebit Remote client on a local device.
>
> **Relay Server**: Telebit relies on a relay server (telebit.cloud) to facilitate the connection. This server acts as an intermediary, allowing your local device to communicate with external clients.

> **Let¡s Encrypt:** https://letsencrypt.org/es/
> 