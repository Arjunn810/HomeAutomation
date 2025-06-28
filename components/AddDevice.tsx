// components/AddDevice.tsx

import React, { useState } from 'react';
import { Button, StyleSheet, TextInput, View } from 'react-native';

interface Props {
  onAddDevice: (name: string, topic: string) => void;
}

export default function AddDevice({ onAddDevice }: Props) {
  const [name, setName] = useState('');
  const [topic, setTopic] = useState('');

  const handleAdd = () => {
    if (name && topic) {
      onAddDevice(name, topic);
      setName('');
      setTopic('');
    }
  };

  return (
    <View style={styles.form}>
      <TextInput
        placeholder="Device Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="MQTT Topic"
        value={topic}
        onChangeText={setTopic}
        style={styles.input}
      />
      <Button title="Add Device" onPress={handleAdd} />
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});
