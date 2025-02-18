import os, re, subprocess, threading
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

os.system("start \"\" \"C:\\Users\\jlpen\\AppData\\Local\\Programs\\Ollama\\ollama app.exe\"")

supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))

def run(cmd, label, line_handler=None):
    proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
    for line in iter(proc.stdout.readline, ''):
        print(f"[{label}] {line.strip()}")
        if line_handler:
            line_handler(line)
    proc.stdout.close()
    proc.wait()

def handle_cloudflared(line):
    m = re.search(r"https:\/\/[a-zA-Z0-9\-]+\.trycloudflare\.com", line)
    if m:
        url = m.group(0)
        print("Tunnel URL:", url)
        supabase.table("api").update({"url": url}).eq("id", 1).execute()

cloudflare = threading.Thread(target=run, args=(["cloudflared", "tunnel", "--url", "http://localhost:8080"], "cloudflared", handle_cloudflared))
#api = threading.Thread(target=run, args=(["uvicorn", "api.api:app", "--host", "localhost", "--port", "8080", "--reload"], "api"))

cloudflare.start(); 
#api.start()
cloudflare.join(); 
#api.join()
