# 📱 homeAutomatioon

**homeAutomatioon** is a smart IoT-based home automation project that lets you control your appliances like a **cooler, fan, bulb, and light** via a mobile app (built using Flutter with Expo) and a web interface served from an **ESP32** microcontroller.

It uses **secure MQTT communication (TLS)** with **HiveMQ Cloud**, allowing real-time remote control and synchronization across devices.

---

## 🚀 Features

- 🔌 Control **cooler, fan, bulb, and light** via mobile app
- 📶 Dual control: **Mobile app** and **Web interface** (served by ESP32)
- 🔒 Secure **MQTT over TLS** communication with HiveMQ Cloud
- 🔄 Real-time state sync between ESP32 and app
- 🌐 ESP32-hosted local control interface with no need for external app
- 💡 Visual status indicators via onboard LEDs
- 🔧 Easily extendable for other smart devices

---

## 🧱 Project Architecture

[Flutter App] ⇄ [HiveMQ Cloud MQTT Broker] ⇄ [ESP32 Web + MQTT Client]
⇅
[Local Web Server]



---

## 🔧 Technologies Used

| Component        | Technology                    |
|------------------|-------------------------------|
| Controller       | ESP32 (WROOM Dev Board)       |
| Mobile App       | Flutter (Expo with Dart)      |
| Communication    | MQTT over TLS (HiveMQ Cloud)  |
| Backend Protocol | PubSub MQTT with TLS (Port 8883) |
| Local Control    | ESP32 Web Server (REST API)   |
| IDE              | Arduino IDE                   |

---

## 📲 App Functionality

- A single toggle button for each appliance.
- State indicators for ON/OFF.
- App communicates with HiveMQ Cloud using secure TLS connection.
- On ESP32, each toggle publishes MQTT messages and updates GPIO states.

---

## 🛠️ Getting Started

### 1. 📥 Clone the Repo

```bash
git clone https://github.com/<your-username>/homeAutomatioon.git
cd homeAutomatioon

**2. 🔌 ESP32 Setup**

**Install libraries:**

WiFi.h

WebServer.h

WiFiClientSecure.h

PubSubClient.h

Configure your:

WiFi credentials

MQTT broker (HiveMQ Cloud credentials and TLS port)

Upload the Arduino sketch from esp32_code/ to your ESP32 board.

**3. 📱 Flutter App (Expo)**
Install Node.js and Expo CLI

**Run the app:**
cd flutter_app
npm install
npm start

Scan the QR with Expo Go on your phone to use the app.

🔐 Security
MQTT communication is secured with TLS on port 8883.

NTP time sync is used to validate the TLS handshake.

Web interface is minimal for ease of access and debugging.

📚 Folder Structure

homeAutomatioon/
│
├── esp32_code/              # Arduino code for ESP32
│   └── homeAutomatioon.ino
│
├── flutter_app/             # Flutter frontend app (Expo)
│   ├── App.js
│   └── ...
│
├── screenshots/             # UI preview images
│
└── README.md

💡 Built with ❤️ by Arjun Legha


---

Let me know if you’d like to [add a demo video or GIF preview](f) or want help with [automated GitHub Actions to deploy or test](f).


