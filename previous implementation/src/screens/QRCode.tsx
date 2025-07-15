import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { CameraView, BarcodeScanningResult, useCameraPermissions, FlashMode } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Linking } from 'react-native';

const { width, height } = Dimensions.get('window');
const CUTOUT_SIZE = width * 0.65;
const OVERLAY_COLOR = 'rgba(15,8,23,0.55)';
const CORNER_SIZE = 36;
const CORNER_THICKNESS = 4;
const CORNER_COLOR = '#F72585';
const CUTOUT_RADIUS = 22;

const QRCode = () => {
  const [permission] = useCameraPermissions();
  const [flash, setFlash] = useState<FlashMode>('off');
  const [scanned, setScanned] = useState(false);
  const navigation = useNavigation();

  const handleBarCodeScanned = async (result: BarcodeScanningResult) => {
    if (scanned) return;
    setScanned(true);
    const urlPattern = /^(https?:\/\/)[^\s/$.?#].[^\s]*$/i;
    if (urlPattern.test(result.data)) {
      try {
        await Linking.openURL(result.data);
      } catch (e) {
        // Optionally handle error
      }
    }
    setTimeout(() => setScanned(false), 1200);
  };

  if (!permission) return null;
  if (!permission.granted) {
    return <View style={styles.container} />;
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
        <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
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
    borderTopLeftRadius: 16,
  },
  topRight: {
    borderTopWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS,
    borderTopRightRadius: 16,
  },
  bottomLeft: {
    borderBottomWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS,
    borderBottomLeftRadius: 16,
  },
  bottomRight: {
    borderBottomWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS,
    borderBottomRightRadius: 16,
  },
});

export default QRCode;
 