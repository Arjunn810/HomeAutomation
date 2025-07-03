**🏡 Home Automation with ESP32 & React Native**

This project allows users to control real-life appliances like a Cooler, Fan, Light, and Heater using a mobile app built with React Native. It uses an ESP32 microcontroller, 

a 4-channel relay, and MQTT protocol over TLS via HiveMQ Cloud to ensure secure and reliable IoT communication.


**✅ Features:-**

📱 Control 4 different appliances from your smartphone.

🌐 Real-time sync via HiveMQ Cloud MQTT Broker.

🔒 TLS-secured communication between app and device.

🧠 ESP32 microcontroller handles relay switching.

📦 React Native (Expo) based mobile interface.


**📦 Hardware Setup**

ESP32 Dev Board

4-Channel Relay Module

4 AC Devices (Cooler, Fan, Light, Heater)

USB Cable (for power & programming)

Jumper Wires

Breadboard or PCB (optional)

**Relay Channels:**

-Channel	Device	ESP32 Pin

  IN1	    Cooler	 GPIO 5

  IN2	    Fan	     GPIO 18
  
  IN3	    Light	   GPIO 19
  
  IN4	    Heater	 GPIO 21

  

⚠️ Ensure proper isolation between AC devices and low-voltage electronics.

**📲 App Setup (React Native)**

-Install Node.js, npm, and Expo CLI

-Clone the project and navigate to the app directory:

  git clone https://github.com/Arjunn810/homeAutomation.git

  cd homeAutomation

-Install dependencies:

  npm install

-Run the app:

  npx expo start

Open in the Expo Go app (Android/iOS) to control devices.

**☁️ MQTT Configuration (HiveMQ Cloud)**

-Create a free HiveMQ Cloud account.

  Set up a broker instance and note the hostname, port (TLS), username, and password.
  
  Use the same credentials in both the app and ESP32 firmware.
  
-Use topics like:

  home/devices*
  
  Messages: cooler_on, fan_off, light_on, heater_off, etc.

**🧪 Testing Instructions**

-Upload the firmware to ESP32 using Arduino IDE.

-Power the ESP32 and connect the relay to appliances.

-Launch the app.

-Tap buttons to turn each device ON/OFF.

-Watch relays switch and devices respond in real-time.

📸 Screenshots
-Added in project Dir

🙋‍♂️ Made By

Arjun Legha

GitHub:https://github.com/Arjunn810

