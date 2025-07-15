import React, { useRef, useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, PanResponder, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
  useFonts,
  Inter_700Bold,
  Inter_600SemiBold,
  Inter_500Medium,
} from '@expo-google-fonts/inter';
import { StackNavigationProp } from '@react-navigation/stack';
import DotsIndicator from './DotsIndicator';
import { MaterialIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';

type RootStackParamList = {
  IntroScreens: undefined;
  Login: undefined;
  Signup: undefined;
};

type IntroScreensNavigationProp = StackNavigationProp<RootStackParamList, 'IntroScreens'>;

type Props = {
  navigation: IntroScreensNavigationProp;
};

const { width, height } = Dimensions.get('window');
const NUM_SCREENS = 3;
const SWIPE_THRESHOLD = width * 0.2;

// Add type definition
interface BubbleAnimation {
  top: number;
  left: number;
  scale: number;
  floatAnim: Animated.Value;
}

const IntroScreens: React.FC<Props> = ({ navigation }) => {
  const [currentScreen, setCurrentScreen] = useState(0);
  const currentIndexRef = useRef(currentScreen);
  useEffect(() => { currentIndexRef.current = currentScreen; }, [currentScreen]);

  const [fontsLoaded] = useFonts({
    Inter_700Bold,
    Inter_600SemiBold,
    Inter_500Medium,
  });

  // Animations for backgrounds
  const [speakerAnimation] = useState(new Animated.Value(1));
  const [cardAnimation] = useState(new Animated.Value(0));
  const [tokenAnimation] = useState(new Animated.Value(0));

  // Carousel translation
  const translateX = useRef(new Animated.Value(0)).current;

  // Animation values
  const barAnims = useRef(Array.from({ length: 7 }).map(() => new Animated.Value(1))).current;
  const playPulse = useRef(new Animated.Value(1)).current;

  // Create bubble animations with proper typing
  const bubblesRef = useRef<BubbleAnimation[]>(
    Array.from({ length: 16 }).map(() => ({
      top: Math.random() * height * 0.7 + 10,
      left: Math.random() * width * 0.8 + 10,
      scale: 0.7 + Math.random() * 1.1,
      floatAnim: new Animated.Value(Math.random()),
    }))
  ).current;

  // Animation values for music bars
  const musicBars = useRef(Array.from({ length: 4 }).map(() => new Animated.Value(1))).current;
  const yearNumbers = useRef(Array.from({ length: 5 }).map(() => new Animated.Value(0))).current;
  const trophyScale = useRef(new Animated.Value(1)).current;
  const trophyRotate = useRef(new Animated.Value(0)).current;

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

  // Snap to current screen on index change
  useEffect(() => {
    Animated.spring(translateX, {
      toValue: -currentScreen * width,
      useNativeDriver: true,
    }).start();
  }, [currentScreen]);

  // Background Animations
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(speakerAnimation, { toValue: 1.2, duration: 1500, useNativeDriver: true }),
        Animated.timing(speakerAnimation, { toValue: 1, duration: 1500, useNativeDriver: true }),
      ])
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(cardAnimation, { toValue: 1, duration: 2500, useNativeDriver: true }),
        Animated.timing(cardAnimation, { toValue: 0, duration: 2500, useNativeDriver: true }),
      ])
    ).start();
    Animated.loop(
      Animated.timing(tokenAnimation, { toValue: 1, duration: 4000, useNativeDriver: true })
    ).start();
  }, []);

  // Start animations
  useEffect(() => {
    // Animate year numbers with stagger
    const animateYearNumbers = () => {
      const animations = yearNumbers.map((num, index) => {
        return Animated.sequence([
          Animated.delay(index * 200),  // Add staggered delay
          Animated.loop(
            Animated.sequence([
              Animated.timing(num, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
              }),
              Animated.timing(num, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
              }),
            ])
          )
        ]);
      });

      Animated.parallel(animations).start();
    };

    if (currentScreen === 1) {
      animateYearNumbers();
    }

    return () => {
      yearNumbers.forEach(num => {
        num.stopAnimation();
        num.setValue(0);
      });
    };
  }, [currentScreen]);

  // Optimize animation starts with useCallback
  const startAnimations = useCallback(() => {
    if (currentScreen === 0) {
      // Only run music bar animations on first screen
      musicBars.forEach((bar, i) =>
        Animated.loop(
          Animated.sequence([
            Animated.timing(bar, {
              toValue: 1.7,
              duration: 600 + i * 80,
              useNativeDriver: true
            }),
            Animated.timing(bar, {
              toValue: 1,
              duration: 600 + i * 80,
              useNativeDriver: true
            }),
          ])
        ).start()
      );
    } else if (currentScreen === 1) {
      // Only run year number animations on second screen
      const createYearAnimation = (index: number) => {
        Animated.sequence([
          // Reset all numbers
          ...yearNumbers.map(num => Animated.timing(num, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true
          })),
          // Animate current number
          Animated.timing(yearNumbers[index], {
            toValue: 1,
            duration: 300,
            useNativeDriver: true
          }),
          Animated.timing(yearNumbers[index], {
            toValue: 0,
            duration: 300,
            useNativeDriver: true
          })
        ]).start(() => {
          // Move to next number
          if (currentScreen === 1) {
            createYearAnimation((index + 1) % yearNumbers.length);
          }
        });
      };

      createYearAnimation(0);
    } else if (currentScreen === 2) {
      // Only run trophy animations on third screen
      Animated.loop(
        Animated.parallel([
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
          ]),
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
          ]),
        ])
      ).start();
    }
  }, [currentScreen]);

  // Stop all animations for the current screen
  const stopCurrentAnimations = useCallback(() => {
    if (currentScreen === 0) {
      musicBars.forEach(bar => bar.stopAnimation());
    } else if (currentScreen === 1) {
      yearNumbers.forEach(num => num.stopAnimation());
    } else if (currentScreen === 2) {
      trophyScale.stopAnimation();
      trophyRotate.stopAnimation();
    }
  }, [currentScreen]);

  // Modify the handleNavigation function to be more responsive
  const isNavigating = useRef(false);
  const handleNavigation = useCallback((screenIndex: number) => {
    // Prevent multiple rapid taps
    if (isNavigating.current) return;
    isNavigating.current = true;

    const nextScreen = screenIndex + 1;
    if (nextScreen < NUM_SCREENS) {
      // Stop current animations before moving to next screen
      stopCurrentAnimations();
      
      // Move to next screen
      setCurrentScreen(nextScreen);
      Animated.spring(translateX, {
        toValue: -nextScreen * width,
        useNativeDriver: true,
        tension: 100,
        friction: 10,
        restSpeedThreshold: 100,
        restDisplacementThreshold: 40,
      }).start(() => {
        // Start animations for the new screen after transition
        startAnimations();
        isNavigating.current = false;
      });
    } else {
      // Stop all animations immediately before navigation
      stopCurrentAnimations();
      bubblesRef.forEach(bubble => bubble.floatAnim.stopAnimation());
      
      // Reset and navigate immediately
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
      
      // Reset navigation flag after a short delay
      setTimeout(() => {
        isNavigating.current = false;
      }, 300);
    }
  }, [currentScreen, navigation, stopCurrentAnimations, startAnimations]);

  // Start screen-specific animations when screen changes
  useEffect(() => {
    startAnimations();
    return () => stopCurrentAnimations();
  }, [currentScreen, startAnimations, stopCurrentAnimations]);

  // Cleanup all animations on unmount
  useEffect(() => {
    return () => {
      musicBars.forEach(bar => bar.stopAnimation());
      yearNumbers.forEach(num => num.stopAnimation());
      trophyScale.stopAnimation();
      trophyRotate.stopAnimation();
      translateX.stopAnimation();
      barAnims.forEach(anim => anim.stopAnimation());
      playPulse.stopAnimation();
      speakerAnimation.stopAnimation();
      cardAnimation.stopAnimation();
      tokenAnimation.stopAnimation();
      bubblesRef.forEach(bubble => bubble.floatAnim.stopAnimation());
    };
  }, []);

  // Screens
  const renderScreen1 = () => (
    <View style={{ flex: 1, backgroundColor: '#0F0817' }}>
      <LinearGradient
        colors={['#0F0817', '#1A102B', '#0F0817']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradient, { position: 'absolute', width: '100%', height: '100%' }]}
      />

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

      <View style={{ 
        flex: 1,
        paddingTop: height * 0.12,
        paddingHorizontal: 20,
        paddingBottom: 100,
      }}>
        {/* Title Section */}
        <View style={{ marginBottom: 40 }}>
          <Text style={{
            fontFamily: 'Inter_700Bold',
            fontSize: 20,
            color: '#B5179E',
            textAlign: 'center',
            marginBottom: 8,
            letterSpacing: 4,
            textTransform: 'uppercase',
          }}>
            Welcome to
          </Text>
          <Text style={{
            fontFamily: 'Inter_700Bold',
            fontSize: 36,
            color: '#fff',
            textAlign: 'center',
            textShadowColor: '#F72585',
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: 20,
          }}>
            Music Blast
          </Text>
        </View>

        {/* Music Bars Animation */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          height: 60,
          marginBottom: 20,
        }}>
          {musicBars.map((bar, index) => (
            <Animated.View
              key={index}
              style={{
                width: 8,
                height: 40,
                backgroundColor: index % 2 === 0 ? '#F72585' : '#7209B7',
                borderRadius: 4,
                marginHorizontal: 4,
                transform: [{ scaleY: bar }],
              }}
            />
          ))}
        </View>

        {/* Listen Card */}
        <View style={{
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
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <View style={{
              backgroundColor: 'rgba(247, 37, 133, 0.15)',
              padding: 16,
              borderRadius: 20,
            }}>
              <MaterialCommunityIcons name="headphones" size={32} color="#F72585" />
            </View>
            <Text style={{
              fontFamily: 'Inter_600SemiBold',
              fontSize: 24,
              color: '#fff',
              marginLeft: 16,
            }}>
              Listen to a Song
            </Text>
          </View>
          <Text style={{
            fontFamily: 'Inter_500Medium',
            fontSize: 16,
            color: 'rgba(255,255,255,0.7)',
            lineHeight: 24,
          }}>
            Experience music from different eras and test your knowledge of music history.
          </Text>
        </View>

        {/* Guess Card */}
        <View style={{
          backgroundColor: 'rgba(15, 8, 23, 0.9)',
          borderRadius: 30,
          padding: 28,
          marginBottom: 20,
          borderWidth: 1,
          borderColor: '#7209B7',
          shadowColor: '#7209B7',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 10,
          elevation: 8,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <View style={{
              backgroundColor: 'rgba(114, 9, 183, 0.15)',
              padding: 16,
              borderRadius: 20,
            }}>
              <MaterialCommunityIcons name="calendar-clock" size={32} color="#7209B7" />
            </View>
            <Text style={{
              fontFamily: 'Inter_600SemiBold',
              fontSize: 24,
              color: '#fff',
              marginLeft: 16,
            }}>
              Guess the Year
            </Text>
          </View>
          <Text style={{
            fontFamily: 'Inter_500Medium',
            fontSize: 16,
            color: 'rgba(255,255,255,0.7)',
            lineHeight: 24,
          }}>
            Challenge yourself to identify when each song was released and earn points.
          </Text>
        </View>

        {/* Start Button */}
        <View style={{
          position: 'absolute',
          bottom: height * 0.12,
          left: 20,
          right: 20,
          alignItems: 'center',
        }}>
          <TouchableOpacity 
            style={{
              width: width * 0.7,
              height: 60,
              borderRadius: 30,
              overflow: 'hidden',
            }}
            onPress={() => handleNavigation(0)}
            activeOpacity={0.8}
            delayPressIn={0}
            pressRetentionOffset={{ top: 20, left: 20, right: 20, bottom: 20 }}
          >
            <LinearGradient
              colors={['#F72585', '#7209B7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 20,
              }}
            >
              <Text style={{
                fontFamily: 'Inter_600SemiBold',
                fontSize: 18,
                color: '#fff',
                marginRight: 8,
                textAlign: 'center',
              }}>
                GET STARTED
              </Text>
              <MaterialIcons name="arrow-forward" size={24} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderScreen2 = () => (
    <View style={{ flex: 1, backgroundColor: '#0F0817' }}>
      <LinearGradient
        colors={['#0F0817', '#1A102B', '#0F0817']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradient, { position: 'absolute', width: '100%', height: '100%' }]}
      />

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
        paddingTop: height * 0.12,
        paddingHorizontal: 20,
        paddingBottom: 100,
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
          How to Play
        </Text>

        {/* Year Numbers Animation */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          height: 60,
          marginBottom: 20,
        }}>
          {yearNumbers.map((num, index) => (
            <Animated.Text
              key={index}
              style={{
                fontFamily: 'Inter_600SemiBold',
                fontSize: 24,
                color: index % 2 === 0 ? '#F72585' : '#7209B7',
                marginHorizontal: 8,
                opacity: num,
                transform: [
                  { translateY: num.interpolate({
                    inputRange: [0, 1],
                    outputRange: [10, -10],
                  })},
                ],
              }}
            >
              {1960 + index * 10}
            </Animated.Text>
          ))}
        </View>

        {/* Step 1 */}
        <View style={{
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
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <View style={{
              backgroundColor: 'rgba(247, 37, 133, 0.15)',
              padding: 16,
              borderRadius: 20,
            }}>
              <MaterialCommunityIcons name="gesture-tap-hold" size={32} color="#F72585" />
            </View>
            <Text style={{
              fontFamily: 'Inter_600SemiBold',
              fontSize: 24,
              color: '#fff',
              marginLeft: 16,
            }}>
              Listen Carefully
            </Text>
          </View>
          <Text style={{
            fontFamily: 'Inter_500Medium',
            fontSize: 16,
            color: 'rgba(255,255,255,0.7)',
            lineHeight: 24,
          }}>
            Pay attention to the song's style, sound, and musical elements to guess its era.
          </Text>
        </View>

        {/* Step 2 */}
        <View style={{
          backgroundColor: 'rgba(15, 8, 23, 0.9)',
          borderRadius: 30,
          padding: 28,
          marginBottom: 20,
          borderWidth: 1,
          borderColor: '#7209B7',
          shadowColor: '#7209B7',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 10,
          elevation: 8,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <View style={{
              backgroundColor: 'rgba(114, 9, 183, 0.15)',
              padding: 16,
              borderRadius: 20,
            }}>
              <MaterialCommunityIcons name="clock-time-four" size={32} color="#7209B7" />
            </View>
            <Text style={{
              fontFamily: 'Inter_600SemiBold',
              fontSize: 24,
              color: '#fff',
              marginLeft: 16,
            }}>
              Pick the Year
            </Text>
          </View>
          <Text style={{
            fontFamily: 'Inter_500Medium',
            fontSize: 16,
            color: 'rgba(255,255,255,0.7)',
            lineHeight: 24,
          }}>
            Select the year you think the song was released. The closer you are, the more points you get!
          </Text>
        </View>

        {/* Next Button */}
        <View style={{
          position: 'absolute',
          bottom: height * 0.12,
          left: 20,
          right: 20,
          alignItems: 'center',
        }}>
          <TouchableOpacity 
            style={{
              width: width * 0.7,
              height: 60,
              borderRadius: 30,
              overflow: 'hidden',
            }}
            onPress={() => handleNavigation(1)}
            activeOpacity={0.8}
            delayPressIn={0}
            pressRetentionOffset={{ top: 20, left: 20, right: 20, bottom: 20 }}
          >
            <LinearGradient
              colors={['#F72585', '#7209B7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 20,
              }}
            >
              <Text style={{
                fontFamily: 'Inter_600SemiBold',
                fontSize: 18,
                color: '#fff',
                marginRight: 8,
                textAlign: 'center',
              }}>
                NEXT
              </Text>
              <MaterialIcons name="arrow-forward" size={24} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderScreen3 = () => (
    <View style={{ flex: 1, backgroundColor: '#0F0817' }}>
      <LinearGradient
        colors={['#0F0817', '#1A102B', '#0F0817']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradient, { position: 'absolute', width: '100%', height: '100%' }]}
      />

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

      <View style={{ 
        flex: 1,
        paddingTop: height * 0.12,
        paddingHorizontal: 20,
        paddingBottom: 100,
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
          Score & Win
        </Text>

        {/* Trophy Animation */}
        <View style={{
          justifyContent: 'center',
          alignItems: 'center',
          height: 80,
          marginBottom: 20,
        }}>
          <Animated.View style={{
            transform: [
              { scale: trophyScale },
              { rotate: trophyRotate.interpolate({
                inputRange: [0, 1],
                outputRange: ['-15deg', '15deg'],
              })},
            ],
          }}>
            <MaterialCommunityIcons 
              name="trophy-award" 
              size={60} 
              color="#F72585"
            />
          </Animated.View>
        </View>

        {/* Points Card */}
        <View style={{
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
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <View style={{
              backgroundColor: 'rgba(247, 37, 133, 0.15)',
              padding: 16,
              borderRadius: 20,
            }}>
              <MaterialCommunityIcons name="star-four-points" size={32} color="#F72585" />
            </View>
            <Text style={{
              fontFamily: 'Inter_600SemiBold',
              fontSize: 24,
              color: '#fff',
              marginLeft: 16,
            }}>
              Earn Points
            </Text>
          </View>
          <Text style={{
            fontFamily: 'Inter_500Medium',
            fontSize: 16,
            color: 'rgba(255,255,255,0.7)',
            lineHeight: 24,
          }}>
            Get more points by guessing closer to the actual release year. Perfect guesses earn bonus points!
          </Text>
        </View>

        {/* Achievements Card */}
        <View style={{
          backgroundColor: 'rgba(15, 8, 23, 0.9)',
          borderRadius: 30,
          padding: 28,
          marginBottom: 20,
          borderWidth: 1,
          borderColor: '#7209B7',
          shadowColor: '#7209B7',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 10,
          elevation: 8,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <View style={{
              backgroundColor: 'rgba(114, 9, 183, 0.15)',
              padding: 16,
              borderRadius: 20,
            }}>
              <MaterialCommunityIcons name="trophy" size={32} color="#7209B7" />
            </View>
            <Text style={{
              fontFamily: 'Inter_600SemiBold',
              fontSize: 24,
              color: '#fff',
              marginLeft: 16,
            }}>
              Unlock Achievements
            </Text>
          </View>
          <Text style={{
            fontFamily: 'Inter_500Medium',
            fontSize: 16,
            color: 'rgba(255,255,255,0.7)',
            lineHeight: 24,
          }}>
            Complete challenges and earn special badges. Show off your music knowledge!
          </Text>
        </View>

        {/* Start Playing Button */}
        <View style={{
          position: 'absolute',
          bottom: height * 0.12,
          left: 20,
          right: 20,
          alignItems: 'center',
        }}>
          <TouchableOpacity 
            style={{
              width: width * 0.7,
              height: 60,
              borderRadius: 30,
              overflow: 'hidden',
            }}
            onPress={() => handleNavigation(2)}
            activeOpacity={0.8}
            delayPressIn={0}
            pressRetentionOffset={{ top: 20, left: 20, right: 20, bottom: 20 }}
          >
            <LinearGradient
              colors={['#F72585', '#7209B7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 20,
              }}
            >
              <Text style={{
                fontFamily: 'Inter_600SemiBold',
                fontSize: 18,
                color: '#fff',
                marginRight: 8,
                textAlign: 'center',
              }}>
                START PLAYING
              </Text>
              <MaterialIcons name="play-arrow" size={24} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const screens = [renderScreen1, renderScreen2, renderScreen3];

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.slideRow,
          { width: width * NUM_SCREENS, transform: [{ translateX }] },
        ]}
        {...panResponder.panHandlers}
      >
        {screens.map((Screen, idx) => (
          <View key={idx} style={{ width, flex: 1 }}>
            {Screen()}
          </View>
        ))}
      </Animated.View>
      <View style={{
        position: 'absolute',
        bottom: height * 0.03,
        left: 0,
        right: 0,
        alignItems: 'center',
        paddingBottom: 10,
      }}>
        <DotsIndicator total={NUM_SCREENS} current={currentScreen} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    borderRadius: 0,
    overflow: 'hidden',
  },
  slideRow: {
    flexDirection: 'row',
    flex: 1,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  speaker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 120,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
  },
  token: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 30,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    paddingTop: 120,
  },
  textContainerYouth: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 25,
    padding: 30,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  emoji: {
    fontSize: 56,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  titleYouth: {
    fontFamily: 'Inter_700Bold',
    fontSize: 32,
    color: '#191654',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  subtitleYouth: {
    fontFamily: 'Inter_500Medium',
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    letterSpacing: 0.3,
  },
  screenTitleYouth: {
    fontFamily: 'Inter_700Bold',
    fontSize: 32,
    color: '#fff',
    marginBottom: 30,
    textAlign: 'center',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
  },
});

export default IntroScreens; 