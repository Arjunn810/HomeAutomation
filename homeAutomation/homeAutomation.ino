#include <WiFi.h>
#include <WebServer.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>

// WiFi credentials
const char* ssid = "Your Wi-Fi SSID";
const char* password = "Your Password";

// HiveMQ broker settings
const char* mqtt_server = "brocker link";
const int mqtt_port = port;
const char* mqtt_user = "";
const char* mqtt_pass = "";

// MQTT topics
const char* cooler_topic = "home/cooler";
const char* fan_topic = "home/fan";
const char* bulb_topic = "home/bulb";
const char* light_topic = "home/light";

// GPIO pin definitions
const int coolerPin = 2;
const int fanPin = 18;
const int bulbPin = 19;
const int lightPin = 21;

// Appliance states
bool coolerState = false;
bool fanState = false;
bool bulbState = false;
bool lightState = false;

WiFiClientSecure espClient;
PubSubClient client(espClient);
WebServer server(80);

// JSON response for appliance states
void sendStatus() {
  String json = "{";
  json += "\"cooler\":" + String(coolerState ? "true" : "false") + ",";
  json += "\"fan\":" + String(fanState ? "true" : "false") + ",";
  json += "\"bulb\":" + String(bulbState ? "true" : "false") + ",";
  json += "\"light\":" + String(lightState ? "true" : "false");
  json += "}";
  server.send(200, "application/json", json);
}

// HTML UI with AJAX
void handleRoot() {
  String html = R"rawliteral(
<!DOCTYPE html>
<html>
<head>
  <title>Smart Home</title>
  <style>
    body { font-family: sans-serif; text-align: center; }
    button { padding: 15px 30px; font-size: 20px; margin: 10px; }
  </style>
</head>
<body>
  <h2>Smart Home Control Panel</h2>
  <p>Cooler: <b id="cooler_state">...</b></p>
  <button onclick="toggle('cooler')">Toggle Cooler</button><br>
  <p>Fan: <b id="fan_state">...</b></p>
  <button onclick="toggle('fan')">Toggle Fan</button><br>
  <p>Bulb: <b id="bulb_state">...</b></p>
  <button onclick="toggle('bulb')">Toggle Bulb</button><br>
  <p>Light: <b id="light_state">...</b></p>
  <button onclick="toggle('light')">Toggle Light</button><br>

<script>
function toggle(device) {
  fetch('/toggle/' + device)
    .then(() => updateStates());
}

function updateStates() {
  fetch('/status')
    .then(response => response.json())
    .then(data => {
      document.getElementById('cooler_state').innerText = data.cooler ? 'ON' : 'OFF';
      document.getElementById('fan_state').innerText = data.fan ? 'ON' : 'OFF';
      document.getElementById('bulb_state').innerText = data.bulb ? 'ON' : 'OFF';
      document.getElementById('light_state').innerText = data.light ? 'ON' : 'OFF';
    });
}

setInterval(updateStates, 2000); // update every 2s
window.onload = updateStates;
</script>
</body>
</html>
  )rawliteral";

  server.send(200, "text/html", html);
}

// Toggle helper
void toggleAppliance(bool& state, int pin, const char* topic) {
  state = !state;
  digitalWrite(pin, state ? HIGH : LOW);
  client.publish(topic, state ? "ON" : "OFF", true);
  server.send(200, "text/plain", "OK");
}

// WiFi setup
void setupWiFi() {
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected! IP: " + WiFi.localIP().toString());
}

// MQTT message handler
void mqttCallback(char* topic, byte* payload, unsigned int length) {
  String msg;
  for (int i = 0; i < length; i++) msg += (char)payload[i];

  if (String(topic) == cooler_topic) {
    coolerState = (msg == "ON");
    digitalWrite(coolerPin, coolerState ? HIGH : LOW);
  } else if (String(topic) == fan_topic) {
    fanState = (msg == "ON");
    digitalWrite(fanPin, fanState ? HIGH : LOW);
  } else if (String(topic) == bulb_topic) {
    bulbState = (msg == "ON");
    digitalWrite(bulbPin, bulbState ? HIGH : LOW);
  } else if (String(topic) == light_topic) {
    lightState = (msg == "ON");
    digitalWrite(lightPin, lightState ? HIGH : LOW);
  }

  Serial.printf("MQTT: [%s] %s\n", topic, msg.c_str());
}

// MQTT reconnect
void reconnectMQTT() {
  while (!client.connected()) {
    Serial.print("Connecting to MQTT...");
    if (client.connect("ESP32_SmartHome", mqtt_user, mqtt_pass)) {
      Serial.println("connected.");
      client.subscribe(cooler_topic);
      client.subscribe(fan_topic);
      client.subscribe(bulb_topic);
      client.subscribe(light_topic);
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" retrying in 5s");
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);

  pinMode(coolerPin, OUTPUT);
  pinMode(fanPin, OUTPUT);
  pinMode(bulbPin, OUTPUT);
  pinMode(lightPin, OUTPUT);

  digitalWrite(coolerPin, LOW);
  digitalWrite(fanPin, LOW);
  digitalWrite(bulbPin, LOW);
  digitalWrite(lightPin, LOW);

  setupWiFi();
  configTime(0, 0, "pool.ntp.org");
  espClient.setInsecure(); // For testing only
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(mqttCallback);

  server.on("/", handleRoot);
  server.on("/status", sendStatus);
  server.on("/toggle/cooler", []() {
    toggleAppliance(coolerState, coolerPin, cooler_topic);
  });
  server.on("/toggle/fan", []() {
    toggleAppliance(fanState, fanPin, fan_topic);
  });
  server.on("/toggle/bulb", []() {
    toggleAppliance(bulbState, bulbPin, bulb_topic);
  });
  server.on("/toggle/light", []() {
    toggleAppliance(lightState, lightPin, light_topic);
  });

  server.begin();
  Serial.println("Web server started");
}

void loop() {
  if (!client.connected()) reconnectMQTT();
  client.loop();
  server.handleClient();
}
