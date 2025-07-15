import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  useFonts,
  Inter_700Bold,
  Inter_600SemiBold,
  Inter_500Medium,
} from '@expo-google-fonts/inter';

type RootStackParamList = {
  IntroScreens: undefined;
  Login: undefined;
  Signup: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

const { width, height } = Dimensions.get('window');

const Login: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fontsLoaded] = useFonts({
    Inter_700Bold,
    Inter_600SemiBold,
    Inter_500Medium,
  });

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const musicNotes = useRef(Array.from({ length: 3 }).map(() => ({
    position: new Animated.Value(0),
    opacity: new Animated.Value(0),
  }))).current;

  useEffect(() => {
    // Fade in form
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Animate music notes
    const animateNotes = () => {
      musicNotes.forEach((note, index) => {
        Animated.loop(
          Animated.sequence([
            Animated.delay(index * 400),
            Animated.parallel([
              Animated.timing(note.position, {
                toValue: 1,
                duration: 2000,
                useNativeDriver: true,
              }),
              Animated.timing(note.opacity, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
              }),
              Animated.sequence([
                Animated.timing(note.opacity, {
                  toValue: 1,
                  duration: 1800,
                  useNativeDriver: true,
                }),
                Animated.timing(note.opacity, {
                  toValue: 0,
                  duration: 200,
                  useNativeDriver: true,
                }),
              ]),
            ]),
            Animated.timing(note.position, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
          ])
        ).start();
      });
    };

    animateNotes();
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
          onPress={() => navigation.navigate('IntroScreens')}
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
                backgroundColor: '#F72585',
                transform: [{ rotate: `${-20 + i * 12}deg` }],
                top: height * 0.2 + i * 140,
                left: -width * 0.25,
              }}
            />
          ))}
        </View>

        {/* Floating Music Notes */}
        {musicNotes.map((note, index) => (
          <Animated.View
            key={index}
            style={{
              position: 'absolute',
              right: 40 + index * 30,
              transform: [{
                translateY: note.position.interpolate({
                  inputRange: [0, 1],
                  outputRange: [height * 0.6, height * 0.2],
                }),
              }],
              opacity: note.opacity,
            }}
          >
            <MaterialCommunityIcons
              name="music-note"
              size={24}
              color={index % 2 === 0 ? '#F72585' : '#7209B7'}
            />
          </Animated.View>
        ))}

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
            marginBottom: 40,
            textShadowColor: '#F72585',
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: 20,
          }}>
            Welcome Back
          </Text>

          <Animated.View style={{ opacity: fadeAnim }}>
            {/* Email Input */}
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="email" size={24} color="#F72585" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="rgba(255,255,255,0.3)"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                selectionColor="#F72585"
                cursorColor="#F72585"
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="lock" size={24} color="#7209B7" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="rgba(255,255,255,0.3)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                selectionColor="#7209B7"
                cursorColor="#7209B7"
              />
            </View>

            {/* Login Button */}
            <TouchableOpacity 
              style={styles.buttonContainer}
              onPress={() => {
                // Here you would typically handle login authentication
                // For now, we'll just navigate to Home
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Home' }],
                });
              }}
            >
              <LinearGradient
                colors={['#F72585', '#7209B7']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.button}
              >
                <Text style={styles.buttonText}>LOGIN</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Sign Up Link */}
            <TouchableOpacity 
              style={styles.signupLink}
              onPress={() => navigation.navigate('Signup')}
            >
              <Text style={styles.signupText}>
                Don't have an account? <Text style={styles.signupTextHighlight}>Sign Up</Text>
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

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
  signupLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  signupText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
  },
  signupTextHighlight: {
    color: '#F72585',
    fontFamily: 'Inter_600SemiBold',
  },
});

export default Login; 