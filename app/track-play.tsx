import { Inter_600SemiBold, Inter_700Bold, useFonts } from '@expo-google-fonts/inter';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

const TrackPlay = () => {
  const { trackId } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [trackInfo, setTrackInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const [fontsLoaded] = useFonts({
    Inter_700Bold,
    Inter_600SemiBold,
  });

  useEffect(() => {
    // Here you would typically fetch track info from Spotify API
    // For now, we'll simulate loading
    setTimeout(() => {
      setLoading(false);
      setTrackInfo({
        name: "Sample Track",
        artist: "Sample Artist",
        albumArt: "https://example.com/album-art.jpg",
        releaseYear: 2020
      });
    }, 2000);
  }, [trackId]);

  if (!fontsLoaded) return null;

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#F72585" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => router.back()}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
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
        <Text style={styles.headerTitle}>Track Details</Text>
        <View style={styles.backButton} />
      </View>

      {/* Track Info */}
      <View style={styles.trackInfo}>
        <View style={styles.albumArtContainer}>
          <View style={styles.albumArtPlaceholder}>
            <Ionicons name="musical-notes" size={40} color="#F72585" />
          </View>
        </View>

        <Text style={styles.trackName}>{trackInfo?.name}</Text>
        <Text style={styles.artistName}>{trackInfo?.artist}</Text>

        {/* Release Year Input */}
        <View style={styles.yearInputContainer}>
          <Text style={styles.yearInputLabel}>Guess the Release Year</Text>
          <View style={styles.yearInput}>
            <Text style={styles.yearInputText}>2024</Text>
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
            <Text style={styles.submitButtonText}>Submit Guess</Text>
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
});

export default TrackPlay; 