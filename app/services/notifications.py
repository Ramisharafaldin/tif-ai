import smtplib
import json
import os
from email.message import EmailMessage
from typing import Optional

connected_clients: set = set()

async def notify_clients(message: dict):
    msg = json.dumps(message)
    stale = set()
    for ws in connected_clients:
        try:
            await ws.send_text(msg)
        except Exception:
            stale.add(ws)
    connected_clients.difference_update(stale)

def send_email_alert(subject: str, body: str, to: str) -> bool:
    smtp_host = os.getenv('SMTP_HOST')
    smtp_port = os.getenv('SMTP_PORT')
    smtp_user = os.getenv('SMTP_USER')
    smtp_pass = os.getenv('SMTP_PASS')
    if not smtp_host or not smtp_port:
        return False
    try:
        msg = EmailMessage()
        msg.set_content(body)
        msg['Subject'] = subject
        msg['From'] = smtp_user or 'noreply@tif-ai.local'
        msg['To'] = to
        with smtplib.SMTP(smtp_host, int(smtp_port)) as server:
            if smtp_user and smtp_pass:
                server.starttls()
                server.login(smtp_user, smtp_pass)
            server.send_message(msg)
        return True
    except Exception:
        return False
