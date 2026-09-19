import { useState } from 'react';
import { useMedicationContext } from '../context/MedicationContext';
import {
  AccessibilityInfo,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type RootStackParamList from '../navigation/types';
import BottomNav from '../components/BottomNav';

type Props = NativeStackScreenProps<RootStackParamList, 'Medications'>;

export default function MedicationsScreen({ navigation }: Props) {
  const { takenMedications, markAsTaken } = useMedicationContext();
  const [search, setSearch] = useState('');

  const active = [
    { name: 'Lisinopril', dosage: '10 mg' },
    { name: 'Fingolimod', dosage: '0.5 mg' },
  ];
  const filtered = active.filter((m) => `${m.name} ${m.dosage}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Medications</Text>
        <TextInput
          style={styles.search}
          value={search}
          onChangeText={setSearch}
          placeholder="Search medications"
          accessible={true}
          accessibilityLabel="Search medications"
          accessibilityHint="Enter a medication name or dosage to filter your medications"
        />
        {filtered.map((med) =>
          takenMedications.includes(med.name) ? (
            <TakenCard key={med.name} name={med.name} dosage={med.dosage} time="Taken just now" />
          ) : (
            <MedicationCard
              key={med.name}
              name={med.name}
              dosage={med.dosage}
              onTaken={() => {
                markAsTaken(med.name);
                AccessibilityInfo.announceForAccessibility(
                  `${med.name} marked as taken`
                );
              }}
            />
          )
        )}
        <Text style={styles.takenHeading}>TAKEN TODAY</Text>
        <TakenCard name="Aspirin" dosage="81 mg" time="Taken at 8:04 AM" />
      </ScrollView>
      <BottomNav current="Medications" navigation={navigation} />
    </View>
  );
}

function MedicationCard({ name, dosage, onTaken }: { name: string; dosage: string; onTaken: () => void }) {
  return (
    <View style={styles.card}>
      <View style={styles.row}><Text style={styles.medName}>{name}</Text><Text style={styles.dosage}>{dosage}</Text></View>
      <Text style={styles.instructions}>Take 1 tablet once daily</Text>
      <View style={styles.bottomRow}>
        <Text style={styles.time}>Next Dose 09:00 AM</Text>
        <TouchableOpacity
          style={styles.takeButton}
          onPress={onTaken}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`Mark ${name} as taken`}
          accessibilityHint={`Marks ${name} as taken for today`}
        >
          <Text style={styles.takeText}>Mark as Taken</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function TakenCard({
  name,
  dosage,
  time,
}: {
  name: string;
  dosage: string;
  time: string;
}) {
  return (
    <View style={styles.takenCard}>
      <View style={styles.row}>
        <Text style={styles.takenName}>{name}</Text>
        <Text style={styles.takenName}>{dosage}</Text>
      </View>

      <Text style={styles.takenName}>Take 1 tablet once daily</Text>

      <View style={styles.bottomRow}>
        <Text style={styles.takenName}>{time}</Text>

        <View
          style={styles.takenBadge}
          accessible={true}
          accessibilityLabel={`${name} taken`}
          accessibilityLiveRegion="polite"
        >
          <Text style={styles.badgeText}>Taken</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { paddingHorizontal: 22, paddingTop: 20, paddingBottom: 35 },
  title: { fontSize: 22, fontWeight: '700', color: '#2C67BA', marginBottom: 80 },
  search: { height: 52, borderWidth: 1, borderColor: '#D5D5D5', borderRadius: 8, paddingHorizontal: 16, fontSize: 16, marginBottom: 16 },
  card: { minHeight: 135, borderWidth: 1, borderColor: '#D5D5D5', borderRadius: 10, padding: 16, marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  medName: { fontSize: 17, fontWeight: '600' },
  dosage: { fontSize: 16, fontWeight: '600' },
  instructions: { fontSize: 16, marginTop: 8 },
  bottomRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  time: { flex: 1, fontSize: 15 },
  takeButton: { minHeight: 48, backgroundColor: '#2C67BA', borderRadius: 6, paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center' },
  takeText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  takenHeading: { fontSize: 14, fontWeight: '600', color: '#767676', marginTop: 8, marginBottom: 10 },
  takenCard: { minHeight: 130, borderWidth: 1, borderColor: '#E3E3E3', borderRadius: 10, padding: 16, marginBottom: 12 },
  takenName: { fontSize: 16, color: '#767676' },
  takenBadge: { minHeight: 44, minWidth: 60, backgroundColor: '#E5F7F4', borderRadius: 6, paddingHorizontal: 12, alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: '#28665F', fontSize: 14, fontWeight: '600' },
});
