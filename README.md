# 🕊️ Viper X API

**Viper X API** is a secure, modular Node.js-based system designed for controlled WhatsApp freeze/bug test operations. It includes a login-protected frontend, a Telegram bot for user access management, and persistent uptime handling via PM2 and KeepAlive scripts.

---

## 🚀 Features

- 🔐 Login system with premium user credentials
- 🤖 Telegram bot to create, list, delete users with expiry dates
- 🛡️ Expiry-based access management (auto block expired users)
- 🌐 Frontend with real-time crash tools (Android/iOS)
- 💾 JSON-based user persistence (survives restarts)
- 🔁 Self-pinging KeepAlive system (prevents Render/VPS sleep)
- 🧠 Clean and lightweight Express server

---

---

## ⚙️ Deployment Options

### 🔧 VPS (Recommended)

```bash
# SSH into your VPS
ssh root@your_vps_ip

# Install Node.js, git, pm2
apt update && apt install curl git nodejs npm -y
npm install pm2 -g

# Clone your repo
git clone https://github.com/your-username/viperx-api.git
cd viperx-api

# Install dependencies
npm install

# Start the app
pm2 start runSc.js --name viperx
pm2 save
pm2 startup
````
## Sample Login 
Username: gabiadmin
Passkey : 1234
