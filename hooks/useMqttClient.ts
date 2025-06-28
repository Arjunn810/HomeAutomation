import { Buffer } from 'buffer';
import { connect, MqttClient } from 'mqtt';
import { useEffect, useState } from 'react';

global.Buffer = Buffer;
global.process = require('process');

export function useMqttClient() {
  const [client, setClient] = useState<MqttClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const mqttUrl = 'wss://b4eede0090e842d887859ec05b1d7a3c.s1.eu.hivemq.cloud:8884/mqtt';
    const options = {
      username: 'YOUR_USERNAME_HERE',
      password: 'YOUR_PASSWORD_HERE',
      connectTimeout: 4000,
      clean: true,
      reconnectPeriod: 1000,
    };

    const mqttClient = connect(mqttUrl, options);

    mqttClient.on('connect', () => {
      console.log('MQTT connected');
      setIsConnected(true);
    });

    mqttClient.on('error', (err) => {
      console.error('MQTT connection error:', err);
      mqttClient.end();
    });

    mqttClient.on('reconnect', () => {
      console.log('MQTT reconnecting...');
    });

    setClient(mqttClient);

    return () => {
      mqttClient.end();
    };
  }, []);

  return { client, isConnected };
}
