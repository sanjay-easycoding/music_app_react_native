import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

const ProfileScreen = () => {
  // Placeholder user data
  const user = {
    username: 'PlayerOne',
    gamesPlayed: 42,
    winRatio: 0.67,
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#0F0817' }} contentContainerStyle={styles.container}>
      {/* Avatar */}
      <View style={styles.avatarWrap}>
        <View style={styles.avatarCircle}>
          <Ionicons name="person" size={60} color="#F72585" />
        </View>
      </View>
      {/* Username */}
      <Text style={styles.username}>{user.username}</Text>
      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <FontAwesome5 name="gamepad" size={22} color="#fff" style={{ marginBottom: 4 }} />
          <Text style={styles.statValue}>{user.gamesPlayed}</Text>
          <Text style={styles.statLabel}>Games Played</Text>
        </View>
        <View style={styles.statBox}>
          <MaterialCommunityIcons name="trophy" size={24} color="#fff" style={{ marginBottom: 4 }} />
          <Text style={styles.statValue}>{Math.round(user.winRatio * 100)}%</Text>
          <Text style={styles.statLabel}>Win Ratio</Text>
        </View>
      </View>
      {/* Edit Profile & Connect Socials */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionBtn} activeOpacity={0.8}>
          <Ionicons name="create-outline" size={22} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.actionText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} activeOpacity={0.8}>
          <Ionicons name="link" size={22} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.actionText}>Connect Socials</Text>
        </TouchableOpacity>
      </View>
      {/* Game History (optional) */}
      <Text style={styles.historyLabel}>Game History</Text>
      <View style={styles.historyCard}>
        <Text style={styles.historyPlaceholder}>No games played yet. Start a new game!</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: 32,
    backgroundColor: '#0F0817',
  },
  avatarWrap: {
    marginBottom: 16,
    alignItems: 'center',
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(247,37,133,0.10)',
    borderWidth: 3,
    borderColor: '#F72585',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#F72585',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
  },
  username: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 18,
    letterSpacing: 1,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 24,
  },
  statBox: {
    backgroundColor: 'rgba(114,9,183,0.13)',
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 28,
    alignItems: 'center',
    marginHorizontal: 10,
    minWidth: 120,
    shadowColor: '#7209B7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 4,
  },
  statValue: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statLabel: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.7,
    letterSpacing: 0.5,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 28,
    width: '100%',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(247,37,133,0.18)',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 22,
    marginHorizontal: 8,
    shadowColor: '#F72585',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  actionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  historyLabel: {
    color: '#F72585',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 8,
    letterSpacing: 1,
    alignSelf: 'flex-start',
    marginLeft: 24,
  },
  historyCard: {
    width: '92%',
    backgroundColor: 'rgba(15,8,23,0.85)',
    borderRadius: 18,
    padding: 18,
    alignItems: 'center',
    marginBottom: 18,
    shadowColor: '#F72585',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 3,
  },
  historyPlaceholder: {
    color: '#fff',
    fontSize: 15,
    opacity: 0.7,
    textAlign: 'center',
  },
});

export default ProfileScreen; 