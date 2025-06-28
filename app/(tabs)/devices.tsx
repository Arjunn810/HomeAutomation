// devices.tsx

import Paho from 'paho-mqtt'; // Default import
import React, { useEffect, useRef, useState } from 'react';
import { Alert, FlatList, StyleSheet, Switch, Text, View } from 'react-native';

const devices = [
  { id: '1', name: 'Cooler', topic: 'home/cooler' },
  // You can add more devices here
];

export default function DevicesScreen() {
  const [deviceStates, setDeviceStates] = useState<{ [key: string]: boolean }>({ '1': false });
  const client = useRef<any>(null); // Use 'any' if TS errors persist; otherwise use 'Paho.Client'

  useEffect(() => {
    client.current = new Paho.Client(
      'b4eede0090e842d887859ec05b1d7a3c.s1.eu.hivemq.cloud',
      Number(8884),
      '/mqtt', // Important for WebSocket over TLS
      `clientId-${Math.random().toString(16).slice(2)}`
    );

    client.current.onConnectionLost = (responseObject: any) => {
      if (responseObject.errorCode !== 0) {
        console.log('MQTT connection lost:', responseObject.errorMessage);
      }
    };

    client.current.onMessageArrived = (message: any) => {
      console.log('📩 Message arrived:', message.payloadString);
    };

    client.current.connect({
      useSSL: true,
      userName: 'Arjun',
      password: 'Arjun@123',
      onSuccess: () => {
        console.log('✅ MQTT connected');
      },
      onFailure: (err: any) => {
        console.log('❌ MQTT connect failed:', err.errorMessage);
        Alert.alert('MQTT Connection Failed', err.errorMessage || 'Unknown error');
      },
    });

    return () => {
      if (client.current?.isConnected()) {
        client.current.disconnect();
      }
    };
  }, []);

  const toggleDevice = (id: string, topic: string) => {
    const newState = !deviceStates[id];

    setDeviceStates(prev => ({
      ...prev,
      [id]: newState,
    }));

    if (client.current?.isConnected()) {
      const message = new Paho.Message(newState ? 'ON' : 'OFF');
      message.destinationName = topic;
      client.current.send(message);
      console.log(`📤 Published to ${topic}: ${message.payloadString}`);
    } else {
      console.log('⚠️ MQTT client not connected');
    }
  };

  const renderItem = ({ item }: { item: { id: string; name: string; topic: string } }) => (
    <View style={styles.deviceItem}>
      <Text style={styles.deviceName}>{item.name}</Text>
      <Switch
        value={deviceStates[item.id]}
        onValueChange={() => toggleDevice(item.id, item.topic)}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Devices</Text>
      <FlatList
        data={devices}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  deviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  deviceName: {
    fontSize: 20,
  },
});
