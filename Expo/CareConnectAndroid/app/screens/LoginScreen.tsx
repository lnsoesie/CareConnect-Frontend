import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type RootStackParamList from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          allowFontScaling={true}
          accessible={true}
          accessibilityLabel="Email address"
          accessibilityHint="Enter your email address"
          placeholder="E-mail"

        />
        <View style={styles.passwordWrap}>
          <TextInput
            style={styles.passwordInput}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!passwordVisible}
            allowFontScaling={true}
            accessible={true}
            accessibilityLabel="Password"
            accessibilityHint="Enter your password"
            placeholder="Password"
          />
          <TouchableOpacity
            style={styles.eye}
            onPress={() => setPasswordVisible((v) => !v)}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={passwordVisible ? 'Hide password' : 'Show password'}
            accessibilityHint={
              passwordVisible
                ? 'Hides the password from view'
                : 'Shows the password on screen'
            }
          >
            <Ionicons name={passwordVisible ? 'eye-off-outline' : 'eye-outline'} size={23} color="#333" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.forgot}
          onPress={() => navigation.navigate('ResetPassword')}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Forgot password"
          accessibilityHint="Opens the password reset screen"
        >
          <Text style={styles.forgotText}>Forgot Password</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.replace('Home')}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Login"
          accessibilityHint="Logs you in and opens the home screen"
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  form: { paddingHorizontal: 32, paddingTop: 220 },
  input: { minHeight: 50, borderWidth: 1, borderColor: '#777', borderRadius: 4, paddingHorizontal: 14, fontSize: 16, marginBottom: 20 },
  passwordWrap: { position: 'relative', marginBottom: 8 },
  passwordInput: { minHeight: 50, borderWidth: 1, borderColor: '#777', borderRadius: 4, paddingHorizontal: 14, paddingRight: 48, fontSize: 16 },
  eye: {
    position: 'absolute',
    right: 4,
    top: 3,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  forgot: {
    alignSelf: 'flex-end',
    minHeight: 44,
    justifyContent: 'center',
  },
  forgotText: { color: '#2C67BA', fontSize: 14, fontWeight: '500' },
  loginButton: { height: 48, backgroundColor: '#2C67BA', borderRadius: 4, alignItems: 'center', justifyContent: 'center', marginTop: 12 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
