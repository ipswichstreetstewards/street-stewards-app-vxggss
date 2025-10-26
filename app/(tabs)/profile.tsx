
import React from "react";
import { IconSymbol } from "@/components/IconSymbol";
import { colors, commonStyles } from "@/styles/commonStyles";
import { ScrollView, StyleSheet, View, Text, Platform, Pressable, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { useCleanupLogs } from "@/hooks/useCleanupLogs";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  bio: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    ...commonStyles.shadow,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    ...commonStyles.shadow,
  },
  streetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  streetName: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    padding: 20,
  },
  logoutButton: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    margin: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...commonStyles.shadow,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e74c3c',
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default function ProfileScreen() {
  const { profile, loading: profileLoading } = useProfile();
  const { signOut } = useAuth();
  const { logs } = useCleanupLogs();

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: signOut,
        },
      ]
    );
  };

  if (profileLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const userLogs = logs.filter((log) => log.user_id === profile?.id);
  const joinedDate = profile?.joined_date ? new Date(profile.joined_date).toLocaleDateString() : 'Unknown';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <IconSymbol name="person" size={50} color={colors.primary} />
          </View>
          <Text style={styles.name}>{profile?.name || 'Street Steward'}</Text>
          <Text style={styles.email}>{profile?.email}</Text>
          {profile?.bio && <Text style={styles.bio}>{profile.bio}</Text>}
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{profile?.total_points || 0}</Text>
            <Text style={styles.statLabel}>Total Points</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{profile?.level || 1}</Text>
            <Text style={styles.statLabel}>Level</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{userLogs.length}</Text>
            <Text style={styles.statLabel}>Cleanups</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Adopted Streets</Text>
          {profile?.adopted_streets && profile.adopted_streets.length > 0 ? (
            <View style={styles.card}>
              {profile.adopted_streets.map((street, index) => (
                <View key={index} style={styles.streetItem}>
                  <IconSymbol name="location" size={20} color={colors.primary} />
                  <Text style={styles.streetName}>{street}</Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.card}>
              <Text style={styles.emptyText}>No adopted streets yet</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Info</Text>
          <View style={styles.card}>
            <View style={styles.streetItem}>
              <IconSymbol name="calendar" size={20} color={colors.primary} />
              <Text style={styles.streetName}>Joined {joinedDate}</Text>
            </View>
          </View>
        </View>

        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <IconSymbol name="arrow.right.square" size={20} color="#e74c3c" />
          <Text style={styles.logoutText}>Log Out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
