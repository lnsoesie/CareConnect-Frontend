import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type RootStackParamList from '../navigation/types';
import BottomNav from '../components/BottomNav';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;
type IconName = ComponentProps<typeof Ionicons>['name'];

export default function HomeScreen({ navigation }: Props) {
  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.brand}>CareConnect</Text>
        <Text style={styles.welcome}>Welcome back!</Text>

        <View style={styles.appointment}>
          <Text style={styles.appointmentTitle}>Upcoming Appointment</Text>
          <Text style={styles.appointmentText}>
            Dr. Smith{`\n`}
            September 5 | 10:00 AM{`\n`}
            Neurology
          </Text>
          <TouchableOpacity
            style={styles.smallButton}
            onPress={() => { }}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="See appointment details"
            accessibilityHint="Opens details for your upcoming appointment"
          >
            <Text style={styles.smallButtonText}>See details</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Quick access</Text>

        <View style={styles.tileRow}>
          <QuickAccess
            icon="calendar-outline"
            label="Appointments"
            onPress={() => navigation.navigate('Appointments')}
          />
          <QuickAccess
            icon="chatbubble-outline"
            label="Messages"
            onPress={() => navigation.navigate('Messages')}
          />
        </View>

        <View style={styles.tileRow}>
          <QuickAccess
            icon="medkit-outline"
            label="Medications"
            onPress={() => navigation.navigate('Medications')}
          />
          <QuickAccess
            icon="person-outline"
            label="Profile"
            onPress={() => navigation.navigate('Profile')}
          />
        </View>
      </ScrollView>

      <BottomNav current="Home" navigation={navigation} />
    </View>
  );
}

function QuickAccess({
  icon,
  label,
  onPress,
}: {
  icon: IconName;
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.tile}
      onPress={onPress}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={`Opens the ${label} screen`}
    >
      <Ionicons name={icon} size={32} color="#000000" />
      <Text style={styles.tileText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scroll: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 32,
    paddingTop: 18,
    paddingBottom: 32,
  },
  brand: {
    color: '#2C67BA',
    fontSize: 20,
    fontWeight: '700',
  },
  welcome: {
    marginTop: 18,
    fontSize: 16,
    fontWeight: '600',
  },
  appointment: {
    marginTop: 30,
    borderWidth: 1,
    borderColor: '#555555',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  appointmentTitle: {
    fontSize: 16,
    fontWeight: '600',
    paddingTop: 12,
    paddingHorizontal: 28,
  },
  appointmentText: {
    fontSize: 14,
    lineHeight: 20,
    paddingHorizontal: 28,
    paddingTop: 6,
    paddingBottom: 14,
  },
  smallButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#2C67BA',
    paddingHorizontal: 16,
    minHeight: 44,
    justifyContent: 'center',
    borderTopLeftRadius: 4,
  },
  smallButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 40,
    marginBottom: 28,
  },
  tileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  tile: {
    width: '46%',
    minHeight: 90,
    borderWidth: 1,
    borderColor: '#555555',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  tileText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 5,
    textAlign: 'center',
  },
});
