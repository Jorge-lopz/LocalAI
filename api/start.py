import os, re, subprocess, threading
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()
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
        supabase.table("api").update({"url": url}).execute()

t1 = threading.Thread(target=run, args=(["cloudflared", "tunnel", "--url", "http://localhost:8080"], "cloudflared", handle_cloudflared))
t2 = threading.Thread(target=run, args=(["uvicorn", "api:app", "--host", "localhost", "--port", "8080", "--reload"], "uvicorn"))

t1.start(); t2.start()
t1.join(); t2.join()
