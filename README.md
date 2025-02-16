## DESCRIPTION:

The main focus of this project is to create a private network of devices (laptops, phones, desktops...)
where every user can access an API with the ability to communicate with various locally hosted LLMs.
<br><br>
The biggest advantage this solution has is it's **privacy**, as the AIs can't directly access the network,
leaving the user's data completely private and trasnfered through secure protocols.

## TODO:

- [x] LLM selection on client.
- [x] API creation and hosting on the server.
  - [x] JSON Conversation exporting
  - [x] Message history
- [x] Private port tunneling through Cloudflare to access the API.
- [x] Authentication to be able to use the API.
  - [x] Secure DB to manage credentials and OAuth (Supabase).
- [x] Secure DB connection and realtime events subscriptions.
- [ ] Client interface.
  - [x] Message bubbles w/ smooth animations.
  - [ ] AI response formatting (Markdown and code).
  - [x] Local storage for past messages on the conversation.
- [ ] Web search feature to allow AI to access realtime data.
- [ ] Use .env credentials
- [x] Multiple LLMs running simultaneously.
- [x] API rate limiting
- [ ] Multimodal LLM (with images and audio).
- [ ] Admin app to remotely manage the server.
- [ ] Multiple conversations

## NOTES:

#### WSL:

> **VENV:** `source ~/.virtualenvs/LocalAI/bin/activate`<br>

#### CMD:

> **API:** `uvicorn api.api:app --host localhost --port 8080 --reload`
>
> **CLOUDFLARE TUNNEL:** `cloudflared tunnel --url http://localhost:8080`

## AI:

#### Ollama:

> - [Llama-3.2](https://ollama.com/library/llama3.2:3b) `3B` `Tools` - _2GB_ <br>
> - [Deepseek-coder](https://ollama.com/library/deepseek-coder:6.7b) `6.7B` - _3.8GB_ <br>
> - [Deepseek-R1](https://ollama.com/library/deepseek-r1:1.5b) `1.5B` - _1.1GB_ <br>
> - [Deepseek-llm](https://ollama.com/library/deepseek-llm:7b) `7B` - _4GB_ <br>
> - [+ Qwen-2.5](https://ollama.com/library/qwen2.5) `0.5B` / `1.5B` / `3B` - _1.9B_<br>
> - [+ Qwen-2.5-coder](https://ollama.com/library/qwen2.5-coder)`1.5B` / `3B` - _1.9B_<br>
> - [+ Gemma-2](https://ollama.com/library/qwen2.5-coder) `2B` - _1.6GB_<br>
> - [+ Llava](https://ollama.com/library/llava:7b) `7B` `Vision` - _4.7GB_ <br>
> - [+ Llava-llama-3](https://ollama.com/library/llava-llama3) `8B` `Vision` - _5.5GB_

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **Total storage:** `11.4GB`

## TOOLS:

**FastAPI:** https://github.com/fastapi/fastapi

> FastAPI is a modern, high performance, fast API framework, written in Python.

**Cloudflared:** https://github.com/cloudflare/cloudflared

> Creates a secure tunnel between your local device and a remote server, effectively bypassing network restrictions such as firewalls.

**DuckDNS** https://www.duckdns.org

> Service to point a DuckDNS Subdomain to my IP

**Let's Encrypt** https://letsencrypt.org/es

> Generate a third-party valid certificate for your own domains

**[OBSOLETE] Telebit:** https://github.com/fastapi/fastapi

> Telebit operates by establishing a secure tunnel between your local device and a remote server, effectively bypassing network restrictions such as firewalls. <br><br> > **Local Setup**: Telebit Remote client on a local device.<br><br> > **Relay Server**: Telebit relies on a relay server (telebit.cloud) to facilitate the connection. This server acts as an intermediary, allowing your local device to communicate with external clients.
