import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { CameraView, BarcodeScanningResult, useCameraPermissions, FlashMode } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

const { width, height } = Dimensions.get('window');

type QRCodeScreen2NavigationProp = StackNavigationProp<RootStackParamList, 'QRCodeScreen2'>;

const QRCodeScreen2 = () => {
  const [permission] = useCameraPermissions();
  const [flash, setFlash] = useState<FlashMode>('off');
  const [scanned, setScanned] = useState(false);
  const navigation = useNavigation<QRCodeScreen2NavigationProp>();

  const extractTrackId = (qrData: string): string | null => {
    // Handle Spotify URI format: spotify:track:1A2B3C4D5E6F7G8H9I0J1K
    if (qrData.startsWith('spotify:track:')) {
      return qrData.split(':')[2];
    }
    
    // Handle Spotify URL format: https://open.spotify.com/track/1A2B3C4D5E6F7G8H9I0J1K
    if (qrData.includes('open.spotify.com/track/')) {
      const trackId = qrData.split('/track/')[1];
      return trackId.split('?')[0]; // Remove any query parameters
    }
    
    return null;
  };

  const handleBarCodeScanned = async (result: BarcodeScanningResult) => {
    if (scanned) return;
    
    setScanned(true);
    
    try {
      const trackId = extractTrackId(result.data);
      
      if (!trackId) {
        Alert.alert(
          'Invalid QR Code', 
          'Please scan a valid Spotify track QR code.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Navigate to play screen with track ID
      navigation.navigate('TrackPlayScreen', { trackId });
      
    } catch (error) {
      console.error('Error processing QR code:', error);
      Alert.alert(
        'Error', 
        'Failed to load the track. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      // Reset scan state after 2 seconds
      setTimeout(() => setScanned(false), 2000);
    }
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>Camera permission is required to scan QR codes.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Camera View */}
      <CameraView
        style={StyleSheet.absoluteFill}
        onBarcodeScanned={handleBarCodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        flash={flash}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan Spotify Track</Text>
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => setFlash(flash === 'off' ? 'on' : 'off')}
        >
          <Ionicons name={flash === 'off' ? 'flash-off' : 'flash'} size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Scanning Frame */}
      <View style={styles.scanFrame}>
        <View style={[styles.corner, styles.topLeft]} />
        <View style={[styles.corner, styles.topRight]} />
        <View style={[styles.corner, styles.bottomLeft]} />
        <View style={[styles.corner, styles.bottomRight]} />
      </View>

      {/* Instructions */}
      <View style={styles.instructions}>
        <Text style={styles.instructionText}>
          Point your camera at a Spotify track QR code
        </Text>
      </View>

      {/* Status Indicator */}
      <View style={styles.statusContainer}>
        <View style={[styles.statusDot, { backgroundColor: scanned ? '#1DB954' : '#FFF' }]} />
        <Text style={styles.statusText}>
          {scanned ? 'Processing...' : 'Ready to Scan'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  permissionText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: height / 2 - 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    zIndex: 10,
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
  scanFrame: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: width * 0.7,
    height: width * 0.7,
    marginTop: -(width * 0.35),
    marginLeft: -(width * 0.35),
    zIndex: 5,
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#1DB954',
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  instructions: {
    position: 'absolute',
    bottom: 120,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 5,
  },
  instructionText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  statusContainer: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default QRCodeScreen2; 