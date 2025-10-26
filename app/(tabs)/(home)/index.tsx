
import { Stack } from "expo-router";
import React from "react";
import { IconSymbol } from "@/components/IconSymbol";
import { colors, commonStyles } from "@/styles/commonStyles";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, Pressable, StyleSheet, View, Text, Platform, ActivityIndicator } from "react-native";
import { useProfile } from "@/hooks/useProfile";
import { useCleanupLogs } from "@/hooks/useCleanupLogs";
import { useLeaderboard } from "@/hooks/useLeaderboard";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
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
    ...commonStyles.shadow,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  actionsContainer: {
    padding: 20,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  actionButton: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    ...commonStyles.shadow,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  recentActivity: {
    padding: 20,
  },
  activityCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    ...commonStyles.shadow,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  activityPoints: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.accent,
  },
  activityDetails: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  leaderboardPreview: {
    padding: 20,
  },
  leaderboardCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    ...commonStyles.shadow,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rank: {
    width: 32,
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textSecondary,
  },
  leaderboardName: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  leaderboardPoints: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default function HomeScreen() {
  const { profile, loading: profileLoading } = useProfile();
  const { logs, loading: logsLoading } = useCleanupLogs();
  const { leaderboard, loading: leaderboardLoading } = useLeaderboard();

  const handleLogCleanup = () => {
    router.push('/log-cleanup');
  };

  const handleReportHazard = () => {
    router.push('/report-hazard');
  };

  const handleIdentifyPlant = () => {
    router.push('/plant-identification');
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

  const recentLogs = logs.slice(0, 3);
  const topUsers = leaderboard.slice(0, 3);
  const userRank = leaderboard.findIndex((entry) => entry.user_id === profile?.id) + 1;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, {profile?.name || 'Steward'}! 👋</Text>
          <Text style={styles.subtitle}>Ready to make a difference today?</Text>
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
            <Text style={styles.statValue}>#{userRank || '-'}</Text>
            <Text style={styles.statLabel}>Rank</Text>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <Pressable style={styles.actionButton} onPress={handleLogCleanup}>
            <View style={styles.actionIcon}>
              <IconSymbol name="trash" size={24} color={colors.primary} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Log Cleanup</Text>
              <Text style={styles.actionDescription}>Record your street cleaning activity</Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
          </Pressable>

          <Pressable style={styles.actionButton} onPress={handleReportHazard}>
            <View style={styles.actionIcon}>
              <IconSymbol name="exclamationmark.triangle" size={24} color={colors.primary} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Report Hazard</Text>
              <Text style={styles.actionDescription}>Alert others about street hazards</Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
          </Pressable>

          <Pressable style={styles.actionButton} onPress={handleIdentifyPlant}>
            <View style={styles.actionIcon}>
              <IconSymbol name="leaf" size={24} color={colors.primary} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Identify Plant</Text>
              <Text style={styles.actionDescription}>Discover local flora and share</Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
          </Pressable>
        </View>

        {!logsLoading && recentLogs.length > 0 && (
          <View style={styles.recentActivity}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            {recentLogs.map((log) => (
              <View key={log.id} style={styles.activityCard}>
                <View style={styles.activityHeader}>
                  <Text style={styles.activityTitle}>{log.location}</Text>
                  <Text style={styles.activityPoints}>+{log.points} pts</Text>
                </View>
                <Text style={styles.activityDetails}>
                  {log.trash_bags} bag{log.trash_bags !== 1 ? 's' : ''} • {log.duration} min • {new Date(log.date).toLocaleDateString()}
                </Text>
              </View>
            ))}
          </View>
        )}

        {!leaderboardLoading && topUsers.length > 0 && (
          <View style={styles.leaderboardPreview}>
            <Text style={styles.sectionTitle}>Top Stewards</Text>
            <View style={styles.leaderboardCard}>
              {topUsers.map((entry) => (
                <View key={entry.user_id} style={styles.leaderboardItem}>
                  <Text style={styles.rank}>#{entry.rank}</Text>
                  <Text style={styles.leaderboardName}>{entry.user_name}</Text>
                  <Text style={styles.leaderboardPoints}>{entry.total_points} pts</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
