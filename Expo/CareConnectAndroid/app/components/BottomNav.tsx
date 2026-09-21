import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { NavigationProp } from '@react-navigation/native';
import type RootStackParamList from '../navigation/types';

type Props = {
  current: 'Home' | 'Appointments' | 'Messages' | 'Medications' | 'Profile';
  navigation: Pick<NavigationProp<RootStackParamList>, 'navigate'>;
};

const items = [
  { key: 'Home' as const, label: 'Home', icon: 'home-outline' as const, activeIcon: 'home' as const },
  { key: 'Appointments' as const, label: 'Appointments', icon: 'calendar-outline' as const, activeIcon: 'calendar' as const },
  { key: 'Messages' as const, label: 'Messages', icon: 'chatbubble-outline' as const, activeIcon: 'chatbubble' as const },
  { key: 'Medications' as const, label: 'Medications', icon: 'medkit-outline' as const, activeIcon: 'medkit' as const },
  { key: 'Profile' as const, label: 'Profile', icon: 'person-outline' as const, activeIcon: 'person' as const },
];

export default function BottomNav({ current, navigation }: Props) {
  return (
    <View style={styles.bar} accessibilityRole="tablist">
      {items.map((item) => {
        const selected = item.key === current;
        return (
          <TouchableOpacity
            key={item.key}
            style={styles.item}
            onPress={() => navigation.navigate(item.key)}
            accessible={true}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            accessibilityLabel={item.label}
            accessibilityHint={`Opens the ${item.label} screen`}
          >
            <Ionicons name={selected ? item.activeIcon : item.icon} size={28} color={selected ? '#2C67BA' : '#000000'} />
            <Text style={[styles.label, selected && styles.selected]}>{item.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#D0D0D0', paddingTop: 7, paddingBottom: 8 },
  item: {
    flex: 1,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { marginTop: 2, fontSize: 14, color: '#000000' },
  selected: { color: '#2C67BA' },
});
