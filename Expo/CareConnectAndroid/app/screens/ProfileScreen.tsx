import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type RootStackParamList from '../navigation/types';
import BottomNav from '../components/BottomNav';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

export default function ProfileScreen({ navigation }: Props) {
  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Profile</Text>
        <View style={styles.identity}>
          <Ionicons name="person" size={38} color="#000" />
          <Text style={styles.name}>John Doe</Text>
          <Text style={styles.patient}>Patient</Text>
        </View>
        <Text style={styles.section}>Personal Information</Text>
        <Info label="Name" value="John Doe" />
        <Info label="Email" value="john.doe@gmail.com" />
        <Info label="Phone" value="(111) 111-1111" />
        <Setting label="Account Settings" />
        <Setting label="Accessibility Settings" />
        <Setting label="Notification Settings" />
        <Setting label="Privacy and Security" />
        <TouchableOpacity
          style={styles.logout}
          onPress={() => navigation.replace('Login')}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Log out"
          accessibilityHint="Logs you out and returns to the login screen"
        >
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </ScrollView>
      <BottomNav current="Profile" navigation={navigation} />
    </View>
  );
}
function Info({ label, value }: { label: string; value: string }) { return <View style={styles.info}><Text style={styles.infoLabel}>{label}</Text><Text style={styles.infoValue}>{value}</Text></View>; }
function Setting({ label }: { label: string }) {
  return (
    <TouchableOpacity
      style={styles.setting}
      onPress={() => { }}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={`Opens ${label}`}
    >
      <Text style={styles.settingText}>{label}</Text>
      <Ionicons
        name="chevron-forward"
        size={22}
        color="#2C67BA"
      />
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFF' }, content: { paddingHorizontal: 32, paddingTop: 20, paddingBottom: 40 }, title: { fontSize: 22, fontWeight: '700', color: '#2C67BA' }, identity: { alignItems: 'center', marginTop: 10 }, name: { fontSize: 17, fontWeight: '600', marginTop: 8 }, patient: { fontSize: 15, marginTop: 4 }, section: { fontSize: 20, fontWeight: '600', marginTop: 10, marginBottom: 20 },
  info: { marginBottom: 16 }, infoLabel: { fontSize: 15, fontWeight: '600' }, infoValue: { fontSize: 16, marginTop: 6 }, setting: { height: 48, borderWidth: 1, borderColor: '#D0D0D0', borderRadius: 6, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 10 }, settingText: { flex: 1, fontSize: 15 }, logout: { height: 48, backgroundColor: '#087568', borderRadius: 6, alignItems: 'center', justifyContent: 'center', marginTop: 0 }, logoutText: { color: '#FFF', fontSize: 16, fontWeight: '600' }
});
