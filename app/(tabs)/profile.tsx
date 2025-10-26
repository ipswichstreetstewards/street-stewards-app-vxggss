
import React from "react";
import { ScrollView, StyleSheet, View, Text, Platform, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconSymbol } from "@/components/IconSymbol";
import { colors, commonStyles } from "@/styles/commonStyles";
import { currentUser } from "@/data/mockData";
import { router } from "expo-router";

export default function ProfileScreen() {
  const levelProgress = (currentUser.totalPoints % 500) / 500;
  const pointsToNextLevel = 500 - (currentUser.totalPoints % 500);

  return (
    <SafeAreaView style={[commonStyles.container]} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentContainer,
          Platform.OS !== 'ios' && styles.contentContainerWithTabBar
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <IconSymbol name="person.circle.fill" size={100} color={colors.primary} />
            <Pressable style={styles.editAvatarButton}>
              <IconSymbol name="camera.fill" size={20} color={colors.card} />
            </Pressable>
          </View>
          
          <Text style={styles.userName}>{currentUser.name}</Text>
          <Text style={styles.userEmail}>{currentUser.email}</Text>
          
          {currentUser.bio && (
            <Text style={styles.userBio}>{currentUser.bio}</Text>
          )}
          
          <View style={styles.levelBadge}>
            <IconSymbol name="star.fill" size={20} color={colors.highlight} />
            <Text style={styles.levelText}>Level {currentUser.level} Steward</Text>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <IconSymbol name="star.fill" size={32} color={colors.highlight} />
            <Text style={styles.statNumber}>{currentUser.totalPoints}</Text>
            <Text style={styles.statLabel}>Total Points</Text>
          </View>
          
          <View style={styles.statBox}>
            <IconSymbol name="map.fill" size={32} color={colors.accent} />
            <Text style={styles.statNumber}>{currentUser.adoptedStreets.length}</Text>
            <Text style={styles.statLabel}>Adopted Streets</Text>
          </View>
          
          <View style={styles.statBox}>
            <IconSymbol name="calendar" size={32} color={colors.secondary} />
            <Text style={styles.statNumber}>
              {Math.floor((Date.now() - new Date(currentUser.joinedDate).getTime()) / (1000 * 60 * 60 * 24))}
            </Text>
            <Text style={styles.statLabel}>Days Active</Text>
          </View>
        </View>

        {/* Level Progress */}
        <View style={commonStyles.card}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Level Progress</Text>
            <Text style={styles.progressPoints}>{pointsToNextLevel} pts to Level {currentUser.level + 1}</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${levelProgress * 100}%` }]} />
          </View>
        </View>

        {/* Adopted Streets */}
        <View style={commonStyles.card}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Adopted Streets</Text>
            <Pressable onPress={() => console.log('Add street')}>
              <IconSymbol name="plus.circle.fill" size={24} color={colors.primary} />
            </Pressable>
          </View>
          {currentUser.adoptedStreets.map((street, index) => (
            <View key={index} style={styles.streetItem}>
              <IconSymbol name="map.fill" size={20} color={colors.secondary} />
              <Text style={styles.streetName}>{street}</Text>
            </View>
          ))}
        </View>

        {/* Achievements */}
        <View style={commonStyles.card}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.achievementsGrid}>
            <View style={styles.achievementBadge}>
              <IconSymbol name="trophy.fill" size={32} color="#FFD700" />
              <Text style={styles.achievementName}>First Cleanup</Text>
            </View>
            <View style={styles.achievementBadge}>
              <IconSymbol name="leaf.fill" size={32} color={colors.secondary} />
              <Text style={styles.achievementName}>Plant Expert</Text>
            </View>
            <View style={styles.achievementBadge}>
              <IconSymbol name="person.3.fill" size={32} color={colors.accent} />
              <Text style={styles.achievementName}>Community Hero</Text>
            </View>
            <View style={[styles.achievementBadge, styles.lockedBadge]}>
              <IconSymbol name="lock.fill" size={32} color={colors.textSecondary} />
              <Text style={styles.achievementName}>???</Text>
            </View>
          </View>
        </View>

        {/* Settings */}
        <View style={commonStyles.card}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <Pressable style={styles.settingItem} onPress={() => router.push('/edit-profile')}>
            <IconSymbol name="person.fill" size={20} color={colors.text} />
            <Text style={styles.settingText}>Edit Profile</Text>
            <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
          </Pressable>
          
          <Pressable style={styles.settingItem} onPress={() => console.log('Notifications')}>
            <IconSymbol name="bell.fill" size={20} color={colors.text} />
            <Text style={styles.settingText}>Notifications</Text>
            <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
          </Pressable>
          
          <Pressable style={styles.settingItem} onPress={() => console.log('Privacy')}>
            <IconSymbol name="lock.fill" size={20} color={colors.text} />
            <Text style={styles.settingText}>Privacy</Text>
            <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
          </Pressable>
          
          <Pressable style={styles.settingItem} onPress={() => console.log('Help')}>
            <IconSymbol name="questionmark.circle.fill" size={20} color={colors.text} />
            <Text style={styles.settingText}>Help & Support</Text>
            <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
          </Pressable>
        </View>

        {/* Share Profile */}
        <Pressable style={styles.shareButton} onPress={() => console.log('Share profile')}>
          <IconSymbol name="square.and.arrow.up" size={20} color={colors.card} />
          <Text style={styles.shareButtonText}>Share My Profile</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 20,
  },
  contentContainerWithTabBar: {
    paddingBottom: 100,
  },
  profileHeader: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.card,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  userBio: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 20,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.highlight,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  levelText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  progressPoints: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: colors.background,
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.highlight,
    borderRadius: 6,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  streetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
  },
  streetName: {
    fontSize: 15,
    color: colors.text,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  achievementBadge: {
    width: '48%',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  lockedBadge: {
    opacity: 0.5,
  },
  achievementName: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
  },
  settingText: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
    padding: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 8,
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.card,
  },
});
