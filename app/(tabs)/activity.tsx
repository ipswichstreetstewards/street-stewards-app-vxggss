
import React, { useState } from "react";
import { ScrollView, StyleSheet, View, Text, Platform, Pressable, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconSymbol } from "@/components/IconSymbol";
import { colors, commonStyles } from "@/styles/commonStyles";
import { mockCleanupLogs, mockHazards, mockPlants } from "@/data/mockData";

type ActivityTab = 'cleanups' | 'hazards' | 'plants';

export default function ActivityScreen() {
  const [activeTab, setActiveTab] = useState<ActivityTab>('cleanups');

  const renderCleanups = () => (
    <View style={styles.tabContent}>
      {mockCleanupLogs.map((cleanup) => (
        <View key={cleanup.id} style={commonStyles.card}>
          <View style={styles.activityHeader}>
            <View style={styles.activityUser}>
              <IconSymbol name="person.circle.fill" size={32} color={colors.primary} />
              <View style={styles.activityUserInfo}>
                <Text style={styles.activityUserName}>{cleanup.userName}</Text>
                <Text style={styles.activityDate}>{cleanup.date}</Text>
              </View>
            </View>
            <View style={styles.pointsBadge}>
              <IconSymbol name="star.fill" size={14} color={colors.highlight} />
              <Text style={styles.pointsText}>+{cleanup.points}</Text>
            </View>
          </View>
          
          <Text style={styles.activityLocation}>📍 {cleanup.location}</Text>
          <Text style={styles.activityDetails}>
            🗑️ {cleanup.trashBags} bags • ⏱️ {cleanup.duration} minutes
          </Text>
          
          {cleanup.notes && (
            <Text style={styles.activityNotes}>{cleanup.notes}</Text>
          )}
          
          {cleanup.photos.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoScroll}>
              {cleanup.photos.map((photo, index) => (
                <Image key={index} source={{ uri: photo }} style={styles.activityPhoto} />
              ))}
            </ScrollView>
          )}
        </View>
      ))}
    </View>
  );

  const renderHazards = () => (
    <View style={styles.tabContent}>
      {mockHazards.map((hazard) => (
        <View key={hazard.id} style={commonStyles.card}>
          <View style={styles.activityHeader}>
            <View style={styles.activityUser}>
              <IconSymbol name="person.circle.fill" size={32} color={colors.primary} />
              <View style={styles.activityUserInfo}>
                <Text style={styles.activityUserName}>{hazard.userName}</Text>
                <Text style={styles.activityDate}>{hazard.reportedDate}</Text>
              </View>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(hazard.status) }]}>
              <Text style={styles.statusText}>{hazard.status}</Text>
            </View>
          </View>
          
          <View style={styles.hazardTypeRow}>
            <IconSymbol name="exclamationmark.triangle.fill" size={20} color={colors.error} />
            <Text style={styles.hazardType}>{hazard.type.replace('-', ' ').toUpperCase()}</Text>
            <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(hazard.severity) }]}>
              <Text style={styles.severityText}>{hazard.severity}</Text>
            </View>
          </View>
          
          <Text style={styles.activityLocation}>📍 {hazard.location}</Text>
          <Text style={styles.activityNotes}>{hazard.description}</Text>
          
          {hazard.photos.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoScroll}>
              {hazard.photos.map((photo, index) => (
                <Image key={index} source={{ uri: photo }} style={styles.activityPhoto} />
              ))}
            </ScrollView>
          )}
        </View>
      ))}
    </View>
  );

  const renderPlants = () => (
    <View style={styles.tabContent}>
      {mockPlants.map((plant) => (
        <View key={plant.id} style={commonStyles.card}>
          <View style={styles.activityHeader}>
            <View style={styles.activityUser}>
              <IconSymbol name="person.circle.fill" size={32} color={colors.primary} />
              <View style={styles.activityUserInfo}>
                <Text style={styles.activityUserName}>{plant.userName}</Text>
                <Text style={styles.activityDate}>{plant.postedDate}</Text>
              </View>
            </View>
            <View style={styles.likesContainer}>
              <IconSymbol name="heart.fill" size={16} color={colors.error} />
              <Text style={styles.likesText}>{plant.likes}</Text>
            </View>
          </View>
          
          <Text style={styles.plantName}>{plant.plantName}</Text>
          {plant.scientificName && (
            <Text style={styles.scientificName}>{plant.scientificName}</Text>
          )}
          
          {plant.isPollinatorFriendly && (
            <View style={styles.pollinatorBadge}>
              <IconSymbol name="leaf.fill" size={14} color={colors.secondary} />
              <Text style={styles.pollinatorText}>Pollinator Friendly 🐝</Text>
            </View>
          )}
          
          <Text style={styles.activityLocation}>📍 {plant.location}</Text>
          <Text style={styles.activityNotes}>{plant.description}</Text>
          
          {plant.careInstructions && (
            <View style={styles.careInstructionsBox}>
              <Text style={styles.careInstructionsTitle}>Care Instructions:</Text>
              <Text style={styles.careInstructionsText}>{plant.careInstructions}</Text>
            </View>
          )}
          
          {plant.photos.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoScroll}>
              {plant.photos.map((photo, index) => (
                <Image key={index} source={{ uri: photo }} style={styles.activityPhoto} />
              ))}
            </ScrollView>
          )}
        </View>
      ))}
    </View>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'reported': return colors.warning;
      case 'in-progress': return colors.accent;
      case 'resolved': return colors.success;
      default: return colors.textSecondary;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return colors.error;
      case 'medium': return colors.warning;
      case 'low': return colors.success;
      default: return colors.textSecondary;
    }
  };

  return (
    <SafeAreaView style={[commonStyles.container]} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Activity Feed</Text>
      </View>
      
      <View style={styles.tabBar}>
        <Pressable
          style={[styles.tab, activeTab === 'cleanups' && styles.activeTab]}
          onPress={() => setActiveTab('cleanups')}
        >
          <IconSymbol name="trash.fill" size={20} color={activeTab === 'cleanups' ? colors.text : colors.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'cleanups' && styles.activeTabText]}>
            Cleanups
          </Text>
        </Pressable>
        
        <Pressable
          style={[styles.tab, activeTab === 'hazards' && styles.activeTab]}
          onPress={() => setActiveTab('hazards')}
        >
          <IconSymbol name="exclamationmark.triangle.fill" size={20} color={activeTab === 'hazards' ? colors.text : colors.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'hazards' && styles.activeTabText]}>
            Hazards
          </Text>
        </Pressable>
        
        <Pressable
          style={[styles.tab, activeTab === 'plants' && styles.activeTab]}
          onPress={() => setActiveTab('plants')}
        >
          <IconSymbol name="leaf.fill" size={20} color={activeTab === 'plants' ? colors.text : colors.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'plants' && styles.activeTabText]}>
            Plants
          </Text>
        </Pressable>
      </View>
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentContainer,
          Platform.OS !== 'ios' && styles.contentContainerWithTabBar
        ]}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'cleanups' && renderCleanups()}
        {activeTab === 'hazards' && renderHazards()}
        {activeTab === 'plants' && renderPlants()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primary,
    padding: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: colors.secondary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.text,
  },
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
  tabContent: {
    gap: 12,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  activityUser: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  activityUserInfo: {
    gap: 2,
  },
  activityUserName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  activityDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.highlight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  pointsText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },
  activityLocation: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 6,
  },
  activityDetails: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  activityNotes: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 12,
  },
  photoScroll: {
    marginTop: 8,
  },
  activityPhoto: {
    width: 200,
    height: 150,
    borderRadius: 8,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.text,
    textTransform: 'uppercase',
  },
  hazardTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  hazardType: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  severityText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.text,
    textTransform: 'uppercase',
  },
  likesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  likesText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  plantName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  scientificName: {
    fontSize: 14,
    fontStyle: 'italic',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  pollinatorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.highlight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  pollinatorText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  careInstructionsBox: {
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  careInstructionsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  careInstructionsText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});
