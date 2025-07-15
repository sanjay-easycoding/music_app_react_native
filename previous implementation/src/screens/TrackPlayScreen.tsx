import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { WebView } from 'react-native-webview';
import { RootStackParamList } from '../navigation/AppNavigator';

const { width, height } = Dimensions.get('window');

type TrackPlayScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TrackPlayScreen'>;
type TrackPlayScreenRouteProp = RouteProp<RootStackParamList, 'TrackPlayScreen'>;

const TrackPlayScreen = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const webViewRef = useRef<WebView>(null);
  const navigation = useNavigation<TrackPlayScreenNavigationProp>();
  const route = useRoute<TrackPlayScreenRouteProp>();
  const { trackId } = route.params;

  const createSpotifyEmbedHTML = (trackId: string) => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              margin: 0;
              padding: 0;
              background-color: #121212;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
            }
            iframe {
              border-radius: 12px;
              border: none;
            }
          </style>
        </head>
        <body>
          <iframe 
            src="https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0" 
            width="100%" 
            height="152" 
            frameBorder="0" 
            allowfullscreen="" 
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
            loading="lazy">
          </iframe>
        </body>
      </html>
    `;
  };

  const handlePlayPress = () => {
    setIsPlaying(true);
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={handleBackPress}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ready to Play</Text>
        <View style={styles.headerButton} />
      </View>

      {!isPlaying ? (
        /* Play Button Screen */
        <View style={styles.playScreen}>
          <View style={styles.iconContainer}>
            <Ionicons name="musical-notes" size={80} color="#1DB954" />
          </View>
          
          <Text style={styles.title}>Track Ready!</Text>
          <Text style={styles.subtitle}>Your Spotify track is ready to play</Text>

          <TouchableOpacity style={styles.playButton} onPress={handlePlayPress}>
            <Ionicons name="play" size={60} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.playText}>Tap to Play</Text>
        </View>
      ) : (
        /* Player Screen */
        <View style={styles.playerScreen}>
          <Text style={styles.nowPlayingText}>Now Playing</Text>
          
          <View style={styles.playerContainer}>
            <WebView
              ref={webViewRef}
              source={{ html: createSpotifyEmbedHTML(trackId) }}
              style={styles.webView}
              startInLoadingState={true}
              renderLoading={() => (
                <View style={styles.loadingContainer}>
                  <Text style={styles.loadingText}>Loading track...</Text>
                </View>
              )}
            />
          </View>

          <TouchableOpacity 
            style={styles.backToPlayButton} 
            onPress={() => setIsPlaying(false)}
          >
            <Text style={styles.backToPlayText}>Back to Play Button</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  playScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    marginBottom: 40,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    color: '#B3B3B3',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 60,
    lineHeight: 22,
  },
  playButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#1DB954',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1DB954',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
    marginBottom: 24,
  },
  playText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  playerScreen: {
    flex: 1,
    padding: 20,
  },
  nowPlayingText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  playerContainer: {
    flex: 1,
    backgroundColor: '#121212',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 30,
  },
  webView: {
    flex: 1,
    backgroundColor: '#121212',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#121212',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
  },
  backToPlayButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignSelf: 'center',
  },
  backToPlayText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default TrackPlayScreen; 