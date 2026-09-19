import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type RootStackParamList from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'ResetPassword'>;

export default function ResetPasswordScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('Login')}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Back"
        accessibilityHint="Returns to the login screen"
      >
        <Text style={styles.back}>‹</Text>
      </TouchableOpacity>
      <View style={styles.content}>
        <View style={styles.instructionsBox}>
          <Text style={styles.instructions}>Enter your email to receive a{'\n'}password reset link:</Text>
        </View>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          accessible={true}
          accessibilityLabel="Email address"
          accessibilityHint="Enter the email address associated with your account"
          placeholder="E-mail"
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => { }}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Send reset link"
          accessibilityHint="Sends password reset instructions to your email address"
        ></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', paddingTop: 55, paddingHorizontal: 32 },
  back: {
    color: '#000000',
    fontSize: 38,
    lineHeight: 38,
  },
  content: { alignItems: 'center' },
  instructionsBox: { width: '100%', backgroundColor: '#F1F1F3', borderRadius: 3, paddingVertical: 8, paddingHorizontal: 8 },
  instructions: { textAlign: 'center', fontSize: 16, lineHeight: 22 },
  input: { width: '100%', height: 52, borderWidth: 1, borderColor: '#777', borderRadius: 4, paddingHorizontal: 14, fontSize: 16, marginTop: 48 },
  button: { width: 230, height: 48, backgroundColor: '#2C67BA', alignItems: 'center', justifyContent: 'center', marginTop: 24 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },

  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 55,
  },
});
