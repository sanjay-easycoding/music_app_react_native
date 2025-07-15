import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, Inter_700Bold, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { MaterialCommunityIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

const { width, height } = Dimensions.get('window');

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const Home = () => {
  const [fontsLoaded] = useFonts({
    Inter_700Bold,
    Inter_600SemiBold,
  });
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [showMenu, setShowMenu] = useState(false);

  // Animation values
  const welcomeOpacity = useRef(new Animated.Value(0)).current;
  const welcomeTranslateY = useRef(new Animated.Value(20)).current;
  const musicBlastScale = useRef(new Animated.Value(0.5)).current;
  const musicBlastOpacity = useRef(new Animated.Value(0)).current;
  const letsStartOpacity = useRef(new Animated.Value(0)).current;
  const letsStartTranslateY = useRef(new Animated.Value(20)).current;
  const musicIconScale = useRef(new Animated.Value(0)).current;
  const musicIconRotate = useRef(new Animated.Value(0)).current;
  const musicNotes = useRef(Array.from({ length: 3 }).map(() => ({
    position: new Animated.Value(0),
    opacity: new Animated.Value(0),
    scale: new Animated.Value(0.5),
  }))).current;

  useEffect(() => {
    // Start the welcome animation sequence
    const startAnimations = () => {
      // Reset all animations
      welcomeOpacity.setValue(0);
      welcomeTranslateY.setValue(20);
      musicBlastScale.setValue(0.5);
      musicBlastOpacity.setValue(0);
      letsStartOpacity.setValue(0);
      letsStartTranslateY.setValue(20);
      musicIconScale.setValue(0);
      musicIconRotate.setValue(0);
      musicNotes.forEach(note => {
        note.position.setValue(0);
        note.opacity.setValue(0);
        note.scale.setValue(0.5);
      });

      // Start the sequence
      Animated.sequence([
        // Animate "Welcome to"
        Animated.parallel([
          Animated.timing(welcomeOpacity, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(welcomeTranslateY, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
        // Animate "Music Blast"
        Animated.parallel([
          Animated.timing(musicBlastOpacity, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.spring(musicBlastScale, {
            toValue: 1,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
          }),
        ]),
        // Animate music icon
        Animated.parallel([
          Animated.spring(musicIconScale, {
            toValue: 1,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
          }),
          Animated.timing(musicIconRotate, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
        // Animate "Let's Start the Game"
        Animated.parallel([
          Animated.timing(letsStartOpacity, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(letsStartTranslateY, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        // After all animations complete, show the menu
        setShowMenu(true);
        // Optionally, you can start continuous rotation for music icon and notes here
      });
    };

    startAnimations();
  }, []);

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0F0817', '#1A102B', '#0F0817']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Background pattern */}
      <View style={styles.backgroundPattern}>
        {Array.from({ length: 5 }).map((_, i) => (
          <View
            key={i}
            style={[styles.backgroundLine, {
              transform: [{ rotate: `${-20 + i * 12}deg` }],
              top: height * 0.2 + i * 140,
            }]}
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
            transform: [
              {
                translateY: note.position.interpolate({
                  inputRange: [0, 1],
                  outputRange: [height * 0.6, height * 0.2],
                }),
              },
              { scale: note.scale },
            ],
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

      <View style={styles.content}>
        {/* Welcome Animation */}
        {!showMenu && (
          <>
            <Animated.Text
              style={[
                styles.welcomeText,
                {
                  opacity: welcomeOpacity,
                  transform: [{ translateY: welcomeTranslateY }],
                },
              ]}
            >
              Welcome to
            </Animated.Text>

            <Animated.Text
              style={[
                styles.titleText,
                {
                  opacity: musicBlastOpacity,
                  transform: [{ scale: musicBlastScale }],
                },
              ]}
            >
              Music Blast
            </Animated.Text>

            <Animated.View
              style={[
                styles.musicIconContainer,
                {
                  transform: [
                    { scale: musicIconScale },
                    {
                      rotate: musicIconRotate.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '360deg'],
                      }),
                    },
                  ],
                },
              ]}
            >
              <MaterialCommunityIcons
                name="music-circle"
                size={80}
                color="#F72585"
              />
            </Animated.View>

            <Animated.Text
              style={[
                styles.startText,
                {
                  opacity: letsStartOpacity,
                  transform: [{ translateY: letsStartTranslateY }],
                },
              ]}
            >
              Let's Start the Game
            </Animated.Text>
          </>
        )}

        {/* Main Menu */}
        {showMenu && (
          <>
            {/* Game Logo and User Avatar */}
            <View style={styles.headerRow}>
              <View style={styles.logoShadowWrap}>
                <MaterialCommunityIcons name="music-circle" size={64} color="#F72585" style={styles.logoShadow} />
              </View>
              <TouchableOpacity style={styles.avatarBtn} activeOpacity={0.7} onPress={() => navigation.navigate({ name: 'Profile', params: undefined })}>
                {/* Avatar placeholder icon */}
                <View style={styles.avatar}>
                  <Ionicons name="person" size={24} color="#F72585" />
                </View>
              </TouchableOpacity>
            </View>
            {/* Greeting/subtitle */}
            <Text style={styles.greeting}>Welcome back, Player!</Text>
            {/* Section label and divider */}
            <View style={styles.sectionLabelWrap}>
              <Text style={styles.sectionLabel}>Main Menu</Text>
              <View style={styles.sectionDivider} />
            </View>
            {/* Menu buttons directly, no card background */}
            <View style={styles.menuButtons}>
              <TouchableOpacity style={styles.menuBtn} activeOpacity={0.85} onPress={() => navigation.navigate({ name: 'QRCode', params: undefined })}>
                <Ionicons name="play" size={26} color="#fff" />
                <Text style={styles.menuBtnText}>Start New Game</Text>
                <Ionicons name="chevron-forward" size={22} color="#fff" style={styles.menuBtnArrow} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuBtn} activeOpacity={0.85} onPress={() => navigation.navigate({ name: 'QRCodeScreen2', params: undefined })}>
                <MaterialCommunityIcons name="qrcode-scan" size={26} color="#fff" />
                <Text style={styles.menuBtnText}>Join Game</Text>
                <Ionicons name="chevron-forward" size={22} color="#fff" style={styles.menuBtnArrow} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuBtn} activeOpacity={0.85} onPress={() => navigation.navigate({ name: 'Leaderboard', params: undefined })}>
                <FontAwesome5 name="trophy" size={22} color="#fff" />
                <Text style={styles.menuBtnText}>Leaderboard</Text>
                <Ionicons name="chevron-forward" size={22} color="#fff" style={styles.menuBtnArrow} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuBtn} activeOpacity={0.85} onPress={() => navigation.navigate({ name: 'Profile', params: undefined })}>
                <Ionicons name="person-circle" size={26} color="#fff" />
                <Text style={styles.menuBtnText}>Profile</Text>
                <Ionicons name="chevron-forward" size={22} color="#fff" style={styles.menuBtnArrow} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuBtn} activeOpacity={0.85} onPress={() => navigation.navigate({ name: 'Settings', params: undefined })}>
                <Ionicons name="settings" size={26} color="#fff" />
                <Text style={styles.menuBtnText}>Settings</Text>
                <Ionicons name="chevron-forward" size={22} color="#fff" style={styles.menuBtnArrow} />
              </TouchableOpacity>
            </View>
            {/* Optional: Updates/Banners */}
            <View style={styles.bannerContainer}>
              <Text style={styles.bannerText}>🎉 New event: Summer Music Fest! Join now for exclusive rewards.</Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0817',
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.06,
  },
  backgroundLine: {
    position: 'absolute',
    width: width * 1.5,
    height: 120,
    backgroundColor: '#F72585',
    left: -width * 0.25,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    width: '100%',
    paddingTop: 40,
    paddingBottom: 40,
  },
  welcomeText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 24,
    color: '#F72585',
    marginBottom: 10,
  },
  titleText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 48,
    color: '#fff',
    marginBottom: 30,
    textAlign: 'center',
  },
  musicIconContainer: {
    marginBottom: 30,
  },
  startText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 20,
    color: '#7209B7',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    marginTop: 10,
    justifyContent: 'center',
    width: '100%',
  },
  logoShadowWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#F72585',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 8,
  },
  logoShadow: {
    // No extra style, just for possible future use
  },
  avatarBtn: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#F72585',
    backgroundColor: 'rgba(247,37,133,0.10)',
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuButtons: {
    width: '100%',
    marginBottom: 24,
  },
  menuBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(247,37,133,0.12)',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginBottom: 16,
    shadowColor: '#F72585',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    minHeight: 56,
  },
  menuBtnText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
    color: '#fff',
    letterSpacing: 0.5,
    marginLeft: 10,
    flex: 1,
    textAlignVertical: 'center',
  },
  menuBtnArrow: {
    marginLeft: 8,
  },
  greeting: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 18,
    opacity: 0.85,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  sectionLabelWrap: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 2,
  },
  sectionLabel: {
    color: '#F72585',
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    marginBottom: 2,
    marginTop: 2,
    letterSpacing: 1,
    textAlign: 'center',
  },
  sectionDivider: {
    width: 80,
    height: 3,
    backgroundColor: '#F72585',
    borderRadius: 2,
    marginTop: 2,
    marginBottom: 16,
    opacity: 0.18,
  },
  bannerContainer: {
    marginTop: 16,
    backgroundColor: 'rgba(114,9,183,0.13)',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    width: '100%',
  },
  bannerText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    textAlign: 'center',
  },
});

export default Home; 