import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type RootStackParamList from '../navigation/types';
import BottomNav from '../components/BottomNav';

type Props = NativeStackScreenProps<RootStackParamList, 'Appointments'>;

export default function AppointmentsScreen({ navigation }: Props) {
  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Appointments</Text>
        <Text style={styles.section}>Upcoming</Text>
        <AppointmentCard doctor="Dr. Smith" specialty="Neurology" date="September 5 | 10:00 AM" details />
        <Text style={[styles.section, { marginTop: 28 }]}>Past</Text>
        <AppointmentCard doctor="Dr. Barrow" specialty="Gastroenterology" date="March 5 | 01:00 PM" />
        <View style={{ height: 16 }} />
        <AppointmentCard doctor="Dr. George" specialty="Cardiology" date="August 15 | 08:00 AM" />
      </ScrollView>
      <BottomNav current="Appointments" navigation={navigation} />
    </View>
  );
}

function AppointmentCard({ doctor, specialty, date, details }: { doctor: string; specialty: string; date: string; details?: boolean }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardText}>
        <Text style={styles.doctor}>{doctor}</Text>
        <Text style={styles.specialty}>{specialty}</Text>
        <Text style={styles.date}>{date}</Text>
      </View>
      {details && (
        <TouchableOpacity
          style={styles.details}
          onPress={() => { }}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`See details for appointment with ${doctor}`}
          accessibilityHint="Opens the appointment details"
        >
          <Text style={styles.detailsText}>See details</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { paddingHorizontal: 32, paddingVertical: 20, paddingBottom: 35 },
  title: { fontSize: 22, fontWeight: '700', color: '#2C67BA' },
  section: { fontSize: 20, fontWeight: '600', marginTop: 28, marginBottom: 12 },
  card: { minHeight: 130, borderWidth: 1, borderColor: '#999', borderRadius: 8, padding: 16, flexDirection: 'row', alignItems: 'center' },
  cardText: { flex: 1 },
  doctor: { fontSize: 18, fontWeight: '600' },
  specialty: { fontSize: 16, fontWeight: '600', marginTop: 6 },
  date: { fontSize: 14, marginTop: 6 },
  details: { height: 48, backgroundColor: '#2C67BA', paddingHorizontal: 18, alignItems: 'center', justifyContent: 'center', borderRadius: 8, marginLeft: 12 },
  detailsText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
