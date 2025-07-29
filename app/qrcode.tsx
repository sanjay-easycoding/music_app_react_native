import { Ionicons } from '@expo/vector-icons';
import { BarcodeScanningResult, CameraView, FlashMode, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Dimensions, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');
const CUTOUT_SIZE = width * 0.65;
const OVERLAY_COLOR = 'rgba(15,8,23,0.55)';
const CORNER_SIZE = 36;
const CORNER_THICKNESS = 4;
const CORNER_COLOR = '#F72585';
const CUTOUT_RADIUS = 22;

const QRCode = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [flash, setFlash] = useState<FlashMode>('off');
  const [scanned, setScanned] = useState(false);

  const handleBarCodeScanned = async (result: BarcodeScanningResult) => {
    if (scanned) return;
    setScanned(true);

    try {
      // Check if it's a Spotify track URL
      if (result.data.includes('open.spotify.com/track/')) {
        // Extract track ID from the URL
        const trackIdMatch = result.data.match(/track\/([a-zA-Z0-9]+)/);
        if (trackIdMatch) {
          const trackId = trackIdMatch[1];
          
          // Create Spotify deep link to open the track directly in the app
          const spotifyDeepLink = `spotify://track/${trackId}`;
          
          // Try to open Spotify with the track
          const canOpenSpotify = await Linking.canOpenURL(spotifyDeepLink);
          
          if (canOpenSpotify) {
            // Open Spotify with the track
            await Linking.openURL(spotifyDeepLink);
            
            // Show success message
            Alert.alert(
              'Success!',
              'Opening Spotify with the selected track. Enjoy your music!',
              [
                {
                  text: 'OK',
                  onPress: () => router.back()
                }
              ]
            );
          } else {
            // Fallback to web URL if Spotify app can't be opened
            await Linking.openURL(result.data);
            
            Alert.alert(
              'Spotify Web',
              'Opening Spotify in your browser since the app couldn\'t be launched.',
              [
                {
                  text: 'OK',
                  onPress: () => router.back()
                }
              ]
            );
          }
        } else {
          Alert.alert(
            'Invalid Spotify URL',
            'The QR code contains an invalid Spotify track URL.',
            [{ text: 'OK' }]
          );
        }
      } else if (result.data.includes('spotify.com/playlist/')) {
        // Handle Spotify playlist URLs
        const playlistIdMatch = result.data.match(/playlist\/([a-zA-Z0-9]+)/);
        if (playlistIdMatch) {
          const playlistId = playlistIdMatch[1];
          const spotifyDeepLink = `spotify://playlist/${playlistId}`;
          
          const canOpenSpotify = await Linking.canOpenURL(spotifyDeepLink);
          
          if (canOpenSpotify) {
            await Linking.openURL(spotifyDeepLink);
            Alert.alert(
              'Success!',
              'Opening Spotify with the selected playlist. Enjoy your music!',
              [
                {
                  text: 'OK',
                  onPress: () => router.back()
                }
              ]
            );
          } else {
            await Linking.openURL(result.data);
            Alert.alert(
              'Spotify Web',
              'Opening Spotify in your browser since the app couldn\'t be launched.',
              [
                {
                  text: 'OK',
                  onPress: () => router.back()
                }
              ]
            );
          }
        }
      } else if (result.data.includes('spotify.com/album/')) {
        // Handle Spotify album URLs
        const albumIdMatch = result.data.match(/album\/([a-zA-Z0-9]+)/);
        if (albumIdMatch) {
          const albumId = albumIdMatch[1];
          const spotifyDeepLink = `spotify://album/${albumId}`;
          
          const canOpenSpotify = await Linking.canOpenURL(spotifyDeepLink);
          
          if (canOpenSpotify) {
            await Linking.openURL(spotifyDeepLink);
            Alert.alert(
              'Success!',
              'Opening Spotify with the selected album. Enjoy your music!',
              [
                {
                  text: 'OK',
                  onPress: () => router.back()
                }
              ]
            );
          } else {
            await Linking.openURL(result.data);
            Alert.alert(
              'Spotify Web',
              'Opening Spotify in your browser since the app couldn\'t be launched.',
              [
                {
                  text: 'OK',
                  onPress: () => router.back()
                }
              ]
            );
          }
        }
      } else {
        // For other URLs, try to open in the device's browser
        const urlPattern = /^(https?:\/\/)[^\s/$.?#].[^\s]*$/i;
        if (urlPattern.test(result.data)) {
          await Linking.openURL(result.data);
          Alert.alert(
            'URL Opened',
            'Opening the link in your browser.',
            [
              {
                text: 'OK',
                onPress: () => router.back()
              }
            ]
          );
        } else {
          Alert.alert(
            'Invalid QR Code',
            'Please scan a valid URL or Spotify track/playlist/album QR code.',
            [{ text: 'OK' }]
          );
        }
      }
    } catch (error) {
      console.error('Error processing QR code:', error);
      Alert.alert(
        'Error',
        'Failed to process the QR code. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setTimeout(() => setScanned(false), 1200);
    }
  };

  // Show loading state while permission is being checked
  if (!permission) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  // Show permission request screen if permission is not granted
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <View style={styles.permissionIconContainer}>
            <Ionicons name="camera" size={80} color="#F72585" />
          </View>
          <Text style={styles.permissionTitle}>Camera Permission Required</Text>
          <Text style={styles.permissionDescription}>
            To start a new game, we need access to your camera to scan QR codes. 
            This allows you to join games and access music tracks.
          </Text>
          <TouchableOpacity 
            style={styles.permissionButton} 
            onPress={requestPermission}
            activeOpacity={0.8}
          >
            <Text style={styles.permissionButtonText}>Grant Camera Permission</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Calculate cutout position
  const cutoutTop = (height - CUTOUT_SIZE) / 2;
  const cutoutLeft = (width - CUTOUT_SIZE) / 2;

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFill}
        onBarcodeScanned={handleBarCodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        flash={flash}
      />
      {/* Top bar always visible */}
      <View style={styles.topBar} pointerEvents="box-none">
        <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
          <Ionicons name="close" size={30} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Scan QR Code</Text>
        <TouchableOpacity style={styles.flashBtn} onPress={() => setFlash(flash === 'off' ? 'on' : 'off')}>
          <Ionicons name={flash === 'off' ? 'flash-off' : 'flash'} size={28} color="#fff" />
        </TouchableOpacity>
      </View>
      {/* Four overlay rectangles around the cutout */}
      <View style={[styles.overlay, { top: 0, left: 0, right: 0, height: cutoutTop }]} pointerEvents="none" />
      <View style={[styles.overlay, { top: cutoutTop, left: 0, width: cutoutLeft, height: CUTOUT_SIZE }]} pointerEvents="none" />
      <View style={[styles.overlay, { top: cutoutTop, right: 0, width: cutoutLeft, height: CUTOUT_SIZE }]} pointerEvents="none" />
      <View style={[styles.overlay, { left: 0, right: 0, top: cutoutTop + CUTOUT_SIZE, bottom: 0 }]} pointerEvents="none" />
      {/* Corner markers absolutely positioned over the camera, not as a child of a cutout View */}
      <View style={[styles.corner, styles.topLeft, { top: cutoutTop, left: cutoutLeft }]} pointerEvents="none" />
      <View style={[styles.corner, styles.topRight, { top: cutoutTop, left: cutoutLeft + CUTOUT_SIZE - CORNER_SIZE }]} pointerEvents="none" />
      <View style={[styles.corner, styles.bottomLeft, { top: cutoutTop + CUTOUT_SIZE - CORNER_SIZE, left: cutoutLeft }]} pointerEvents="none" />
      <View style={[styles.corner, styles.bottomRight, { top: cutoutTop + CUTOUT_SIZE - CORNER_SIZE, left: cutoutLeft + CUTOUT_SIZE - CORNER_SIZE }]} pointerEvents="none" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0817',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  permissionIconContainer: {
    marginBottom: 30,
    padding: 20,
    borderRadius: 50,
    backgroundColor: 'rgba(247, 37, 133, 0.1)',
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionDescription: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  permissionButton: {
    backgroundColor: '#F72585',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 20,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    paddingHorizontal: 30,
    paddingVertical: 15,
  },
  backButtonText: {
    color: '#F72585',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
  overlay: {
    position: 'absolute',
    backgroundColor: OVERLAY_COLOR,
    zIndex: 2,
    borderRadius: 0,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 48,
    paddingHorizontal: 18,
    zIndex: 10,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  flashBtn: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  title: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    letterSpacing: 1,
    opacity: 0.92,
    textAlign: 'center',
    flex: 1,
  },
  corner: {
    position: 'absolute',
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderColor: CORNER_COLOR,
    zIndex: 5,
    backgroundColor: 'transparent',
  },
  topLeft: {
    borderTopWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS,
    borderTopLeftRadius: CUTOUT_RADIUS,
  },
  topRight: {
    borderTopWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS,
    borderTopRightRadius: CUTOUT_RADIUS,
  },
  bottomLeft: {
    borderBottomWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS,
    borderBottomLeftRadius: CUTOUT_RADIUS,
  },
  bottomRight: {
    borderBottomWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS,
    borderBottomRightRadius: CUTOUT_RADIUS,
  },
});

export default QRCode; 