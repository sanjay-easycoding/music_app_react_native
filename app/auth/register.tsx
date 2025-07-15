import {
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    useFonts,
} from '@expo-google-fonts/inter';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [fontsLoaded] = useFonts({
    Inter_700Bold,
    Inter_600SemiBold,
    Inter_500Medium,
  });

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in form
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  if (!fontsLoaded) return null;

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1, backgroundColor: '#0F0817' }}>
        <LinearGradient
          colors={['#0F0817', '#1A102B', '#0F0817']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradient, { position: 'absolute', width: '100%', height: '100%' }]}
        />

        {/* Back Button */}
        <TouchableOpacity 
          style={{
            position: 'absolute',
            top: height * 0.05,
            left: 20,
            zIndex: 10,
            padding: 10,
          }}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="arrow-left" size={30} color="#F72585" />
        </TouchableOpacity>

        {/* Background pattern */}
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.06,
        }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <View
              key={i}
              style={{
                position: 'absolute',
                width: width * 1.5,
                height: 120,
                backgroundColor: '#7209B7',
                transform: [{ rotate: `${-20 + i * 12}deg` }],
                top: height * 0.2 + i * 140,
                left: -width * 0.25,
              }}
            />
          ))}
        </View>

        <View style={{ 
          flex: 1,
          paddingTop: height * 0.15,
          paddingHorizontal: 20,
        }}>
          <Text style={{
            fontFamily: 'Inter_700Bold',
            fontSize: 36,
            color: '#fff',
            textAlign: 'center',
            marginBottom: 30,
            textShadowColor: '#F72585',
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: 20,
          }}>
            Create Account
          </Text>

          <Animated.View style={{ opacity: fadeAnim }}>
            {/* Username Input */}
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="account" size={24} color="#F72585" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="rgba(255,255,255,0.3)"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                selectionColor="#F72585"
                cursorColor="#F72585"
              />
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="email" size={24} color="#7209B7" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="rgba(255,255,255,0.3)"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                selectionColor="#7209B7"
                cursorColor="#7209B7"
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="lock" size={24} color="#F72585" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="rgba(255,255,255,0.3)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                selectionColor="#F72585"
                cursorColor="#F72585"
              />
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="lock-check" size={24} color="#7209B7" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor="rgba(255,255,255,0.3)"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                selectionColor="#7209B7"
                cursorColor="#7209B7"
              />
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity 
              style={styles.buttonContainer}
              onPress={() => {
                // Here you would typically handle signup process
                router.replace('/(tabs)');
              }}
            >
              <LinearGradient
                colors={['#F72585', '#7209B7']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.button}
              >
                <Text style={styles.buttonText}>SIGN UP</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Login Link */}
            <TouchableOpacity 
              style={styles.loginLink}
              onPress={() => router.push('/auth/login')}
            >
              <Text style={styles.loginText}>
                Already have an account? <Text style={styles.loginTextHighlight}>Login</Text>
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 8, 23, 0.9)',
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(247, 37, 133, 0.2)',
    shadowColor: '#F72585',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputIcon: {
    padding: 15,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    paddingVertical: 15,
    paddingRight: 15,
    letterSpacing: 0.5,
  },
  buttonContainer: {
    marginTop: 20,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#F72585',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    color: '#fff',
  },
  loginLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
  },
  loginTextHighlight: {
    color: '#F72585',
    fontFamily: 'Inter_600SemiBold',
  },
}); 