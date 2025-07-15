import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Intro1: undefined;
  Intro2: undefined;
  Intro3: undefined;
  Game: undefined;
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>; 