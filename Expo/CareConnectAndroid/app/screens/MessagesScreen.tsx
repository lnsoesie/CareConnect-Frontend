import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type RootStackParamList from '../navigation/types';
import BottomNav from '../components/BottomNav';

type Props = NativeStackScreenProps<RootStackParamList, 'Messages'>;

export default function MessagesScreen({ navigation }: Props) {
  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Messages</Text>
        <TouchableOpacity
          style={styles.newButton}
          onPress={() => navigation.navigate('NewMessage')}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="New message"
          accessibilityHint="Opens the screen to compose a new message"
        >
          <Text style={styles.newText}>+ New message</Text>
        </TouchableOpacity>
        <View style={{ height: 90 }} />
        <MessageCard doctor="Dr. Barrow" specialty="Gastroenterology" preview="Your test results are ready" time="Today 09:00 AM" onDetails={() => navigation.navigate('DoctorMessaging')} />
        <View style={{ height: 56 }} />
        <MessageCard doctor="Dr. Smith" specialty="Neurology" preview="Please let us know if..." time="Yesterday 03:00 PM" onDetails={() => navigation.navigate('DoctorMessaging')} />
      </ScrollView>
      <BottomNav current="Messages" navigation={navigation} />
    </View>
  );
}

function MessageCard({ doctor, specialty, preview, time, onDetails }: { doctor: string; specialty: string; preview: string; time: string; onDetails: () => void }) {
  return (
    <View style={styles.card}>
      <Text style={styles.doctor}>{doctor}</Text>
      <Text style={styles.specialty}>{specialty}</Text>
      <Text style={styles.preview}>{preview}</Text>
      <View style={styles.cardBottom}>
        <Text style={styles.time}>{time}</Text>
        <TouchableOpacity
          style={styles.details}
          onPress={onDetails}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`See message details from ${doctor}`}
          accessibilityHint="Opens the conversation with this provider"
        >
          <Text style={styles.detailsText}>See details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { paddingHorizontal: 32, paddingVertical: 20, paddingBottom: 35 },
  title: { fontSize: 22, fontWeight: '700', color: '#2C67BA' },
  newButton: { alignSelf: 'center', height: 48, backgroundColor: '#2C67BA', borderRadius: 4, paddingHorizontal: 28, justifyContent: 'center', marginTop: 44 },
  newText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  card: { minHeight: 145, borderWidth: 1, borderColor: '#555', borderRadius: 8, padding: 16 },
  doctor: { fontSize: 17, fontWeight: '600' },
  specialty: { fontSize: 16, fontWeight: '600', marginTop: 4 },
  preview: { fontSize: 16, marginTop: 14 },
  cardBottom: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  time: { flex: 1, fontSize: 15 },
  details: { height: 48, backgroundColor: '#2C67BA', borderRadius: 6, paddingHorizontal: 14, justifyContent: 'center' },
  detailsText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
});
