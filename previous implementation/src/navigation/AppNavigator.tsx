import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { Dimensions, View, Text } from 'react-native';

import IntroScreens from '../components/IntroScreens';
import Login from '../components/Login';
import Signup from '../components/Signup';
import Home from '../screens/Home';
import QRCode from '../screens/QRCode';
import QRCodeScreen2 from '../screens/QRCodeScreen2';
import TrackPlayScreen from '../screens/TrackPlayScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Placeholder screens
const Game = () => <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0F0817' }}><Text style={{ color: '#fff', fontSize: 24 }}>Game Screen</Text></View>;
const Leaderboard = () => <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0F0817' }}><Text style={{ color: '#fff', fontSize: 24 }}>Leaderboard Screen</Text></View>;
const Settings = () => <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0F0817' }}><Text style={{ color: '#fff', fontSize: 24 }}>Settings Screen</Text></View>;

const { width } = Dimensions.get('window');

export type RootStackParamList = {
  IntroScreens: undefined;
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  QRCode: undefined;
  QRCodeScreen2: undefined;
  TrackPlayScreen: { trackId: string };
  Profile: undefined;
  Game: undefined;
  Leaderboard: undefined;
  Settings: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="IntroScreens"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#0F0817' },
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
          transitionSpec: {
            open: {
              animation: 'timing',
              config: {
                duration: 500,
              },
            },
            close: {
              animation: 'timing',
              config: {
                duration: 500,
              },
            },
          },
        }}
      >
        <Stack.Screen 
          name="IntroScreens" 
          component={IntroScreens}
        />
        <Stack.Screen 
          name="Login" 
          component={Login}
        />
        <Stack.Screen 
          name="Signup" 
          component={Signup}
        />
        <Stack.Screen 
          name="Home" 
          component={Home}
          options={{
            gestureEnabled: false,
          }}
        />
        <Stack.Screen 
          name="QRCode" 
          component={QRCode}
          options={{
            gestureEnabled: false,
          }}
        />
        <Stack.Screen 
          name="QRCodeScreen2" 
          component={QRCodeScreen2}
          options={{
            gestureEnabled: false,
          }}
        />
        <Stack.Screen 
          name="TrackPlayScreen" 
          component={TrackPlayScreen}
          options={{
            gestureEnabled: true,
            cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
          }}
        />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Game" component={Game} />
        <Stack.Screen name="Leaderboard" component={Leaderboard} />
        <Stack.Screen name="Settings" component={Settings} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 