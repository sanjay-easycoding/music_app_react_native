import { Inter_500Medium, Inter_600SemiBold, Inter_700Bold, useFonts } from '@expo-google-fonts/inter';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, PanResponder, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');
const NUM_SCREENS = 3;
const SWIPE_THRESHOLD = 120;

const DotsIndicator = ({ total, current }: { total: number; current: number }) => (
  <View style={styles.dotsContainer}>
    {Array.from({ length: total }).map((_, index) => (
      <View
        key={index}
        style={[
          styles.dot,
          index === current && styles.activeDot,
        ]}
      />
    ))}
  </View>
);

export default function IntroScreen() {
  const [currentScreen, setCurrentScreen] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;
  const currentIndexRef = useRef(currentScreen);

  const [fontsLoaded] = useFonts({
    Inter_700Bold,
    Inter_600SemiBold,
    Inter_500Medium,
  });

  // Animation values
  const musicBars = useRef(Array.from({ length: 4 }).map(() => new Animated.Value(1))).current;
  const yearNumbers = useRef(Array.from({ length: 5 }).map(() => new Animated.Value(0))).current;
  const trophyScale = useRef(new Animated.Value(1)).current;
  const trophyRotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    currentIndexRef.current = currentScreen;
  }, [currentScreen]);

  // PanResponder for swipe
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        translateX.stopAnimation();
      },
      onPanResponderMove: (_, { dx }) => {
        let baseIndex = currentIndexRef.current;
        let newX = -baseIndex * width + dx;
        if ((baseIndex === 0 && dx > 0) || (baseIndex === NUM_SCREENS - 1 && dx < 0)) {
          newX = -baseIndex * width + dx * 0.3;
        }
        translateX.setValue(newX);
      },
      onPanResponderRelease: (_, { dx, vx }) => {
        let baseIndex = currentIndexRef.current;
        let newIndex = baseIndex;
        if (Math.abs(dx) > SWIPE_THRESHOLD || Math.abs(vx) > 0.5) {
          if (dx < 0 && baseIndex < NUM_SCREENS - 1) newIndex++;
          if (dx > 0 && baseIndex > 0) newIndex--;
        }
        Animated.spring(translateX, {
          toValue: -newIndex * width,
          useNativeDriver: true,
        }).start();
        setCurrentScreen(newIndex);
      },
    })
  ).current;

  // Start animations when screen changes
  useEffect(() => {
    // Music bars animation
    musicBars.forEach((bar, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(bar, {
            toValue: 1.5,
            duration: 500 + index * 100,
            useNativeDriver: true,
          }),
          Animated.timing(bar, {
            toValue: 1,
            duration: 500 + index * 100,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });

    // Year numbers animation
    yearNumbers.forEach((num, index) => {
      Animated.sequence([
        Animated.delay(index * 200),
        Animated.timing(num, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    });

    // Trophy animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(trophyScale, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(trophyScale, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(trophyRotate, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(trophyRotate, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [currentScreen]);

  const handleNavigation = (screenIndex: number) => {
    const nextScreen = screenIndex + 1;
    if (nextScreen < NUM_SCREENS) {
      setCurrentScreen(nextScreen);
      Animated.spring(translateX, {
        toValue: -nextScreen * width,
        useNativeDriver: true,
      }).start();
    } else {
      router.push('/auth/login');
    }
  };

  const renderScreen1 = () => (
    <View style={[styles.screen, { width }]}>
      <LinearGradient
        colors={['#0F0817', '#1A102B', '#0F0817']}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Text style={styles.welcomeText}>Welcome to</Text>
          <Text style={styles.titleText}>Music Blast</Text>

          <View style={styles.musicBarsContainer}>
            {musicBars.map((bar, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.musicBar,
                  { transform: [{ scaleY: bar }] },
                ]}
              />
            ))}
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons name="headphones" size={32} color="#F72585" />
              </View>
              <Text style={styles.cardTitle}>Listen to a Song</Text>
            </View>
            <Text style={styles.cardText}>
              Experience music from different eras and test your knowledge of music history.
            </Text>
          </View>

          <View style={[styles.card, styles.cardSecondary]}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconContainer, styles.iconContainerSecondary]}>
                <MaterialCommunityIcons name="calendar-clock" size={32} color="#7209B7" />
              </View>
              <Text style={styles.cardTitle}>Guess the Year</Text>
            </View>
            <Text style={styles.cardText}>
              Challenge yourself to identify when each song was released and earn points.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => handleNavigation(0)}
          >
            <LinearGradient
              colors={['#F72585', '#7209B7']}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>GET STARTED</Text>
              <MaterialIcons name="arrow-forward" size={24} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );

  const renderScreen2 = () => (
    <View style={[styles.screen, { width }]}>
      <LinearGradient
        colors={['#0F0817', '#1A102B', '#0F0817']}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Text style={styles.titleText}>How to Play</Text>

          <View style={styles.yearNumbersContainer}>
            {yearNumbers.map((num, index) => (
              <Animated.Text
                key={index}
                style={[
                  styles.yearNumber,
                  {
                    opacity: num,
                    transform: [
                      {
                        translateY: num.interpolate({
                          inputRange: [0, 1],
                          outputRange: [10, -10],
                        }),
                      },
                    ],
                  },
                ]}
              >
                {1960 + index * 10}
              </Animated.Text>
            ))}
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons name="gesture-tap-hold" size={32} color="#F72585" />
              </View>
              <Text style={styles.cardTitle}>Listen Carefully</Text>
            </View>
            <Text style={styles.cardText}>
              Pay attention to the song's style, sound, and musical elements to guess its era.
            </Text>
          </View>

          <View style={[styles.card, styles.cardSecondary]}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconContainer, styles.iconContainerSecondary]}>
                <MaterialCommunityIcons name="clock-time-four" size={32} color="#7209B7" />
              </View>
              <Text style={styles.cardTitle}>Pick the Year</Text>
            </View>
            <Text style={styles.cardText}>
              Select the year you think the song was released. The closer you are, the more points you get!
            </Text>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => handleNavigation(1)}
          >
            <LinearGradient
              colors={['#F72585', '#7209B7']}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>NEXT</Text>
              <MaterialIcons name="arrow-forward" size={24} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );

  const renderScreen3 = () => (
    <View style={[styles.screen, { width }]}>
      <LinearGradient
        colors={['#0F0817', '#1A102B', '#0F0817']}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Text style={styles.titleText}>Score & Win</Text>

          <View style={styles.trophyContainer}>
            <Animated.View
              style={[
                styles.trophy,
                {
                  transform: [
                    { scale: trophyScale },
                    {
                      rotate: trophyRotate.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['-15deg', '15deg'],
                      }),
                    },
                  ],
                },
              ]}
            >
              <MaterialCommunityIcons name="trophy-award" size={60} color="#F72585" />
            </Animated.View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons name="star-four-points" size={32} color="#F72585" />
              </View>
              <Text style={styles.cardTitle}>Earn Points</Text>
            </View>
            <Text style={styles.cardText}>
              Get more points by guessing closer to the actual release year. Perfect guesses earn bonus points!
            </Text>
          </View>

          <View style={[styles.card, styles.cardSecondary]}>
            <View style={styles.cardHeader}>
              <View style={[styles.iconContainer, styles.iconContainerSecondary]}>
                <MaterialCommunityIcons name="trophy" size={32} color="#7209B7" />
              </View>
              <Text style={styles.cardTitle}>Unlock Achievements</Text>
            </View>
            <Text style={styles.cardText}>
              Complete challenges and earn special badges. Show off your music knowledge!
            </Text>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => handleNavigation(2)}
          >
            <LinearGradient
              colors={['#F72585', '#7209B7']}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>START PLAYING</Text>
              <MaterialIcons name="play-arrow" size={24} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Animated.View
        style={[
          styles.slideRow,
          { transform: [{ translateX }] },
        ]}
        {...panResponder.panHandlers}
      >
        {[renderScreen1, renderScreen2, renderScreen3].map((Screen, idx) => (
          <View key={idx} style={{ width }}>
            {Screen()}
          </View>
        ))}
      </Animated.View>
      <DotsIndicator total={NUM_SCREENS} current={currentScreen} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0817',
  },
  screen: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: height * 0.12,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  slideRow: {
    flexDirection: 'row',
    flex: 1,
  },
  welcomeText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
    color: '#B5179E',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
  titleText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 36,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
    textShadowColor: '#F72585',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  musicBarsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    marginBottom: 20,
  },
  musicBar: {
    width: 8,
    height: 40,
    backgroundColor: '#F72585',
    borderRadius: 4,
    marginHorizontal: 4,
  },
  yearNumbersContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    marginBottom: 20,
  },
  yearNumber: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 24,
    color: '#F72585',
    marginHorizontal: 8,
  },
  trophyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
    marginBottom: 20,
  },
  trophy: {
    transform: [{ scale: 1 }],
  },
  card: {
    backgroundColor: 'rgba(15, 8, 23, 0.9)',
    borderRadius: 30,
    padding: 28,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F72585',
    shadowColor: '#F72585',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  cardSecondary: {
    borderColor: '#7209B7',
    shadowColor: '#7209B7',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    backgroundColor: 'rgba(247, 37, 133, 0.15)',
    padding: 16,
    borderRadius: 20,
  },
  iconContainerSecondary: {
    backgroundColor: 'rgba(114, 9, 183, 0.15)',
  },
  cardTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 24,
    color: '#fff',
    marginLeft: 16,
  },
  cardText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 24,
  },
  button: {
    position: 'absolute',
    bottom: height * 0.12,
    left: 20,
    right: 20,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
  },
  buttonGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  buttonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    color: '#fff',
    marginRight: 8,
    textAlign: 'center',
  },
  dotsContainer: {
    position: 'absolute',
    bottom: height * 0.03,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#666',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#F72585',
    width: 20,
  },
}); 