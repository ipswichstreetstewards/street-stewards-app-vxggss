
import React from "react";
import { Stack } from "expo-router";
import { ScrollView, Pressable, StyleSheet, View, Text, Platform } from "react-native";
import { IconSymbol } from "@/components/IconSymbol";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, commonStyles } from "@/styles/commonStyles";
import { currentUser, mockCleanupLogs, mockLeaderboard } from "@/data/mockData";
import { router } from "expo-router";

export default function HomeScreen() {
  const recentCleanups = mockCleanupLogs.slice(0, 3);
  const topStewards = mockLeaderboard.slice(0, 3);

  const handleLogCleanup = () => {
    router.push('/log-cleanup');
  };

  const handleReportHazard = () => {
    router.push('/report-hazard');
  };

  const handleIdentifyPlant = () => {
    router.push('/plant-identification');
  };

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: "Street Steward",
            headerStyle: {
              backgroundColor: colors.primary,
            },
            headerTintColor: colors.text,
          }}
        />
      )}
      <SafeAreaView style={[commonStyles.container]} edges={['top']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.contentContainer,
            Platform.OS !== 'ios' && styles.contentContainerWithTabBar
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Welcome Section */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeText}>Welcome back, {currentUser.name}! 👋</Text>
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <IconSymbol name="star.fill" size={24} color={colors.highlight} />
                <Text style={styles.statNumber}>{currentUser.totalPoints}</Text>
                <Text style={styles.statLabel}>Points</Text>
              </View>
              <View style={styles.statCard}>
                <IconSymbol name="flag.fill" size={24} color={colors.secondary} />
                <Text style={styles.statNumber}>Level {currentUser.level}</Text>
                <Text style={styles.statLabel}>Steward</Text>
              </View>
              <View style={styles.statCard}>
                <IconSymbol name="map.fill" size={24} color={colors.accent} />
                <Text style={styles.statNumber}>{currentUser.adoptedStreets.length}</Text>
                <Text style={styles.statLabel}>Streets</Text>
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionGrid}>
              <Pressable style={styles.actionButton} onPress={handleLogCleanup}>
                <View style={[styles.actionIcon, { backgroundColor: colors.primary }]}>
                  <IconSymbol name="trash.fill" size={28} color="#FFFFFF" />
                </View>
                <Text style={styles.actionText}>Log Cleanup</Text>
              </Pressable>

              <Pressable style={styles.actionButton} onPress={handleReportHazard}>
                <View style={[styles.actionIcon, { backgroundColor: colors.error }]}>
                  <IconSymbol name="exclamationmark.triangle.fill" size={28} color="#FFFFFF" />
                </View>
                <Text style={styles.actionText}>Report Hazard</Text>
              </Pressable>

              <Pressable style={styles.actionButton} onPress={handleIdentifyPlant}>
                <View style={[styles.actionIcon, { backgroundColor: colors.secondary }]}>
                  <IconSymbol name="leaf.fill" size={28} color="#FFFFFF" />
                </View>
                <Text style={styles.actionText}>Identify Plant</Text>
              </Pressable>

              <Pressable style={styles.actionButton} onPress={() => router.push('/(tabs)/community')}>
                <View style={[styles.actionIcon, { backgroundColor: colors.accent }]}>
                  <IconSymbol name="calendar" size={28} color="#FFFFFF" />
                </View>
                <Text style={styles.actionText}>Events</Text>
              </Pressable>
            </View>
          </View>

          {/* Recent Activity */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Cleanups</Text>
              <Pressable onPress={() => router.push('/(tabs)/activity')}>
                <Text style={styles.seeAllText}>See All</Text>
              </Pressable>
            </View>
            {recentCleanups.map((cleanup) => (
              <View key={cleanup.id} style={commonStyles.card}>
                <View style={styles.cleanupHeader}>
                  <Text style={styles.cleanupUser}>{cleanup.userName}</Text>
                  <View style={styles.pointsBadge}>
                    <IconSymbol name="star.fill" size={14} color={colors.highlight} />
                    <Text style={styles.pointsText}>+{cleanup.points}</Text>
                  </View>
                </View>
                <Text style={styles.cleanupLocation}>{cleanup.location}</Text>
                <Text style={styles.cleanupDetails}>
                  {cleanup.trashBags} bags • {cleanup.duration} min • {cleanup.date}
                </Text>
              </View>
            ))}
          </View>

          {/* Top Stewards */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Top Stewards</Text>
              <Pressable onPress={() => router.push('/leaderboard')}>
                <Text style={styles.seeAllText}>Leaderboard</Text>
              </Pressable>
            </View>
            {topStewards.map((steward, index) => (
              <View key={steward.userId} style={commonStyles.card}>
                <View style={styles.leaderboardRow}>
                  <View style={styles.rankBadge}>
                    <Text style={styles.rankText}>#{index + 1}</Text>
                  </View>
                  <View style={styles.leaderboardInfo}>
                    <Text style={styles.leaderboardName}>{steward.userName}</Text>
                    <Text style={styles.leaderboardStats}>
                      {steward.totalPoints} pts • {steward.cleanupCount} cleanups
                    </Text>
                  </View>
                  {index === 0 && <IconSymbol name="trophy.fill" size={24} color="#FFD700" />}
                  {index === 1 && <IconSymbol name="trophy.fill" size={24} color="#C0C0C0" />}
                  {index === 2 && <IconSymbol name="trophy.fill" size={24} color="#CD7F32" />}
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  contentContainerWithTabBar: {
    paddingBottom: 100,
  },
  welcomeSection: {
    backgroundColor: colors.primary,
    padding: 20,
    paddingTop: 10,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  seeAllText: {
    fontSize: 14,
    color: colors.secondary,
    fontWeight: '600',
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  actionButton: {
    width: '48%',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  cleanupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cleanupUser: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.highlight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  pointsText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },
  cleanupLocation: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
  },
  cleanupDetails: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  leaderboardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rankBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  leaderboardInfo: {
    flex: 1,
  },
  leaderboardName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  leaderboardStats: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
