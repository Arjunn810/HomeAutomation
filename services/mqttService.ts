import Paho, { Message } from 'paho-mqtt';

const host = 'b4eede0090e842d887859ec05b1d7a3c.s1.eu.hivemq.cloud';
const port = 8884;
const path = '/mqtt';
const clientId = 'client_' + Math.random().toString(16).substr(2, 8);
const username = 'Arjun';
const password = 'Arjun@123';

let client: any; // We skip types here because Paho lacks TypeScript declarations

const topic = 'home/device/cooler';

export const connectMqtt = (onConnect: () => void) => {
  client = new Paho.Client(host, port, path, clientId);

  client.onConnectionLost = (err: any) => {
    console.log('❌ MQTT connection lost:', err.errorMessage);
  };

  client.onMessageArrived = (message: any) => {
    console.log('📩 MQTT message received:', message.payloadString);
  };

  client.connect({
    useSSL: true,
    userName: username,
    password: password,
    onSuccess: () => {
      console.log('✅ Connected to MQTT WebSocket');
      onConnect();
    },
    onFailure: (e: any) => {
      console.log('❌ Failed to connect:', e.errorMessage);
    },
  });
};

export const publishCoolerToggle = (isOn: boolean) => {
  if (client && client.isConnected()) {
    const message = new Message(isOn ? 'ON' : 'OFF');
    message.destinationName = topic;
    client.send(message);
    console.log(`📤 Sent ${isOn ? 'ON' : 'OFF'} to topic "${topic}"`);
  } else {
    console.warn('⚠️ MQTT client not connected');
  }
};
