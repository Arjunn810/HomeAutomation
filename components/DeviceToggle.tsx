// components/DeviceToggle.tsx

import React from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Props {
  id: string;
  name: string;
  isOn: boolean;
  onToggle: () => void;
  onDelete: () => void;
}

export default function DeviceToggle({ id, name, isOn, onToggle, onDelete }: Props) {
  return (
    <View style={styles.deviceItem}>
      <Text style={styles.deviceName}>{name}</Text>
      <View style={styles.actions}>
        <Switch value={isOn} onValueChange={onToggle} />
        <TouchableOpacity onPress={onDelete} style={styles.deleteBtn}>
          <Icon name="delete" size={24} color="#f55" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  deleteBtn: {
    marginLeft: 10,
  },
});
