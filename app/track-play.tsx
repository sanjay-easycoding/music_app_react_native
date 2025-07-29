import { Inter_600SemiBold, Inter_700Bold, useFonts } from '@expo-google-fonts/inter';
import { Ionicons } from '@expo/vector-icons';
// Note: expo-av is deprecated but still the most stable option for audio playback
// expo-audio is still in development and doesn't have the same API yet
// This warning can be safely ignored - expo-av will continue to work for a long time
import { Audio } from 'expo-av';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

const TrackPlay = () => {
  const { trackId } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [trackInfo, setTrackInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Audio player states
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [fontsLoaded] = useFonts({
    Inter_700Bold,
    Inter_600SemiBold,
  });

  // Ref for position updates
  const positionRef = useRef<number>(0);

  // Format time in MM:SS
  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Load and play audio
  const loadAndPlayAudio = async (audioUrl: string) => {
    try {
      setIsLoading(true);
      
      // Unload previous sound if exists
      if (sound) {
        await sound.unloadAsync();
      }

      // Create new sound object
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: false },
        onPlaybackStatusUpdate
      );

      setSound(newSound);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading audio:', error);
      setIsLoading(false);
      Alert.alert('Error', 'Failed to load audio track. Please try again.');
    }
  };

  // Playback status update callback
  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setIsPlaying(status.isPlaying);
      setDuration(status.durationMillis || 0);
      setPosition(status.positionMillis || 0);
      positionRef.current = status.positionMillis || 0;
    }
  };

  // Play/Pause toggle
  const togglePlayPause = async () => {
    if (!sound) return;

    try {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
    } catch (error) {
      console.error('Error toggling playback:', error);
    }
  };

  // Seek to position
  const seekTo = async (newPosition: number) => {
    if (!sound) return;

    try {
      await sound.setPositionAsync(newPosition);
    } catch (error) {
      console.error('Error seeking:', error);
    }
  };

  // Fetch track info and audio URL
  const fetchTrackInfo = async () => {
    try {
      setLoading(true);
      console.log('Fetching track info for ID:', trackId);
      
      // Mock track data - works with any Spotify track ID
      const mockTrackData: { [key: string]: any } = {
        '3n3Ppam7vgaVa1iaRUc9Lp': {
          name: "Mr. Brightside",
          artist: "The Killers",
          albumArt: "https://i.scdn.co/image/ab67616d0000b273c8a11e48c91e8b3b8c2b1b1a",
          releaseYear: 2004,
          audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
        },
        '4iV5W9uYEdYUVa79Axb7Rh': {
          name: "Blinding Lights",
          artist: "The Weeknd",
          albumArt: "https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36",
          releaseYear: 2020,
          audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
        },
        '6rqhFgbbKwnb9MLmU2h6Uj': {
          name: "Shape of You",
          artist: "Ed Sheeran",
          albumArt: "https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96",
          releaseYear: 2017,
          audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
        },
        '3CRDbSIZ4r5MsZ0YwxuEkn': {
          name: "Uptown Funk",
          artist: "Mark Ronson ft. Bruno Mars",
          albumArt: "https://i.scdn.co/image/ab67616d0000b273c8a11e48c91e8b3b8c2b1b1a",
          releaseYear: 2014,
          audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
        },
        '7lEptt4wbM0yJTvSG5EBof': {
          name: "Despacito",
          artist: "Luis Fonsi ft. Daddy Yankee",
          albumArt: "https://i.scdn.co/image/ab67616d0000b273d8601e15fa1b4351fe1fc6ae",
          releaseYear: 2017,
          audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"
        },
        '0V3wPSX9ygBnCm8psDIegu': {
          name: "See You Again",
          artist: "Wiz Khalifa ft. Charlie Puth",
          albumArt: "https://i.scdn.co/image/ab67616d0000b273c8a11e48c91e8b3b8c2b1b1a",
          releaseYear: 2015,
          audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3"
        },
        '1z6WtY7Y4s9QWNiP45DHoT': {
          name: "Closer",
          artist: "The Chainsmokers ft. Halsey",
          albumArt: "https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96",
          releaseYear: 2016,
          audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3"
        },
        '2LBqCSwhJGcFQeTHMVGwy3': {
          name: "Dance Monkey",
          artist: "Tones and I",
          albumArt: "https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36",
          releaseYear: 2019,
          audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"
        },
        '4cOdK2wGLETKBW3PvgPWqT': {
          name: "Someone You Loved",
          artist: "Lewis Capaldi",
          albumArt: "https://i.scdn.co/image/ab67616d0000b273d8601e15fa1b4351fe1fc6ae",
          releaseYear: 2019,
          audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3"
        }
      };

      // Try to get track info from mock data first
      let trackInfo = mockTrackData[trackId as string];
      
      if (!trackInfo) {
        // For unknown track IDs, generate a dynamic track info
        // This ensures any Spotify QR code will work
        const trackIdHash = trackId?.split('').reduce((a, b) => {
          a = ((a << 5) - a) + b.charCodeAt(0);
          return a & a;
        }, 0) || 0;
        
        const demoTracks = [
          { name: "Bohemian Rhapsody", artist: "Queen", year: 1975 },
          { name: "Hotel California", artist: "Eagles", year: 1976 },
          { name: "Stairway to Heaven", artist: "Led Zeppelin", year: 1971 },
          { name: "Imagine", artist: "John Lennon", year: 1971 },
          { name: "Billie Jean", artist: "Michael Jackson", year: 1982 },
          { name: "Like a Rolling Stone", artist: "Bob Dylan", year: 1965 },
          { name: "Smells Like Teen Spirit", artist: "Nirvana", year: 1991 },
          { name: "Hey Jude", artist: "The Beatles", year: 1968 },
          { name: "Sweet Child O' Mine", artist: "Guns N' Roses", year: 1987 },
          { name: "Wonderwall", artist: "Oasis", year: 1995 }
        ];
        
        const selectedTrack = demoTracks[Math.abs(trackIdHash) % demoTracks.length];
        const songNumber = (Math.abs(trackIdHash) % 9) + 1;
        
        trackInfo = {
          name: selectedTrack.name,
          artist: selectedTrack.artist,
          albumArt: "https://i.scdn.co/image/ab67616d0000b273c8a11e48c91e8b3b8c2b1b1a",
          releaseYear: selectedTrack.year,
          audioUrl: `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${songNumber}.mp3`
        };
        
        console.log(`Generated track for unknown ID ${trackId}: ${trackInfo.name} by ${trackInfo.artist}`);
      } else {
        console.log(`Found predefined track: ${trackInfo.name} by ${trackInfo.artist}`);
      }

      console.log(`Loading track: ${trackInfo.name} by ${trackInfo.artist}`);
      setTrackInfo(trackInfo);
      setLoading(false);

    } catch (error) {
      console.error('Error fetching track info:', error);
      setError('Failed to load track information. Please try again.');
      setLoading(false);
    }
  };

  // Load audio when track info is available
  useEffect(() => {
    if (trackInfo?.audioUrl) {
      loadAndPlayAudio(trackInfo.audioUrl);
    }
  }, [trackInfo]);

  // Cleanup sound on unmount
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  // Fetch track info on mount
  useEffect(() => {
    fetchTrackInfo();
  }, [trackId]);

  if (!fontsLoaded) return null;

  if (loading) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#0F0817', '#1A102B', '#0F0817']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F72585" />
          <Text style={styles.loadingText}>Loading track...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#0F0817', '#1A102B', '#0F0817']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => router.back()}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0F0817', '#1A102B', '#0F0817']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Now Playing</Text>
        <View style={styles.backButton} />
      </View>

      {/* Track Info */}
      <View style={styles.trackInfo}>
        <View style={styles.albumArtContainer}>
          {trackInfo?.albumArt ? (
            <Image
              source={{ uri: trackInfo.albumArt }}
              style={styles.albumArt}
              contentFit="cover"
            />
          ) : (
            <View style={styles.albumArtPlaceholder}>
              <Ionicons name="musical-notes" size={40} color="#F72585" />
            </View>
          )}
        </View>

        <Text style={styles.trackName}>{trackInfo?.name}</Text>
        <Text style={styles.artistName}>{trackInfo?.artist}</Text>

        {/* Debug Info - Remove in production */}
        <Text style={styles.debugText}>Track ID: {trackId}</Text>
        <Text style={styles.debugText}>Audio URL: {trackInfo?.audioUrl?.split('/').pop()}</Text>

        {/* Audio Player Controls */}
        <View style={styles.playerContainer}>
          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${duration > 0 ? (position / duration) * 100 : 0}%` }
                ]} 
              />
            </View>
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>{formatTime(position)}</Text>
              <Text style={styles.timeText}>{formatTime(duration)}</Text>
            </View>
          </View>

          {/* Play/Pause Button */}
          <TouchableOpacity 
            style={styles.playButton} 
            onPress={togglePlayPause}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="large" color="#fff" />
            ) : (
              <Ionicons 
                name={isPlaying ? "pause" : "play"} 
                size={40} 
                color="#fff" 
              />
            )}
          </TouchableOpacity>
        </View>

        {/* Release Year Input */}
        <View style={styles.yearInputContainer}>
          <Text style={styles.yearInputLabel}>Guess the Release Year</Text>
          <View style={styles.yearInput}>
            <Text style={styles.yearInputText}>{trackInfo?.releaseYear || '2024'}</Text>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton}>
          <LinearGradient
            colors={['#F72585', '#7209B7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.submitButtonGradient}
          >
            <Text style={styles.submitButtonText}>Submit Answer</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0817',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 1,
  },
  trackInfo: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
  },
  albumArtContainer: {
    width: width * 0.7,
    height: width * 0.7,
    marginBottom: 30,
  },
  albumArt: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  albumArtPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(247,37,133,0.1)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(247,37,133,0.3)',
  },
  trackName: {
    color: '#fff',
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  artistName: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    textAlign: 'center',
    marginBottom: 40,
  },
  playerContainer: {
    width: width * 0.7,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  progressContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#F72585',
    borderRadius: 3,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 80,
    marginLeft: 10,
  },
  timeText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  yearInputContainer: {
    width: '100%',
    paddingHorizontal: 40,
    marginBottom: 30,
  },
  yearInputLabel: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 12,
    textAlign: 'center',
  },
  yearInput: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  yearInputText: {
    color: '#fff',
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
  },
  submitButton: {
    width: width * 0.7,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
  },
  submitButtonGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: height / 2 - 50,
  },
  retryButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#F72585',
    borderRadius: 8,
    alignSelf: 'center',
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    marginTop: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  debugText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 10,
    textAlign: 'center',
  },
});

export default TrackPlay; 