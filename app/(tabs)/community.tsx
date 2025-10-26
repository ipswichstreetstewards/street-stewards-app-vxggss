
import React, { useState } from "react";
import { ScrollView, StyleSheet, View, Text, Platform, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconSymbol } from "@/components/IconSymbol";
import { colors, commonStyles } from "@/styles/commonStyles";
import { mockEvents, mockLeaderboard, currentUser } from "@/data/mockData";
import { router } from "expo-router";

type CommunityTab = 'events' | 'leaderboard';

export default function CommunityScreen() {
  const [activeTab, setActiveTab] = useState<CommunityTab>('events');

  const renderEvents = () => (
    <View style={styles.tabContent}>
      {mockEvents.map((event) => {
        const isAttending = event.attendees.includes(currentUser.id);
        const spotsLeft = event.maxAttendees ? event.maxAttendees - event.attendees.length : null;
        
        return (
          <View key={event.id} style={commonStyles.card}>
            <View style={styles.eventHeader}>
              <View style={[styles.eventTypeIcon, { backgroundColor: getEventTypeColor(event.type) }]}>
                <IconSymbol name={getEventTypeIcon(event.type)} size={24} color="#FFFFFF" />
              </View>
              <View style={styles.eventHeaderInfo}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventOrganizer}>by {event.organizerName}</Text>
              </View>
            </View>
            
            <Text style={styles.eventDescription}>{event.description}</Text>
            
            <View style={styles.eventDetails}>
              <View style={styles.eventDetailRow}>
                <IconSymbol name="calendar" size={16} color={colors.textSecondary} />
                <Text style={styles.eventDetailText}>{event.date}</Text>
              </View>
              <View style={styles.eventDetailRow}>
                <IconSymbol name="clock.fill" size={16} color={colors.textSecondary} />
                <Text style={styles.eventDetailText}>{event.startTime} - {event.endTime}</Text>
              </View>
              <View style={styles.eventDetailRow}>
                <IconSymbol name="location.fill" size={16} color={colors.textSecondary} />
                <Text style={styles.eventDetailText}>{event.location}</Text>
              </View>
            </View>
            
            <View style={styles.eventFooter}>
              <View style={styles.attendeeInfo}>
                <IconSymbol name="person.3.fill" size={16} color={colors.primary} />
                <Text style={styles.attendeeText}>
                  {event.attendees.length} attending
                  {spotsLeft !== null && ` • ${spotsLeft} spots left`}
                </Text>
              </View>
              
              <Pressable
                style={[styles.attendButton, isAttending && styles.attendingButton]}
                onPress={() => console.log('Toggle attendance')}
              >
                <Text style={[styles.attendButtonText, isAttending && styles.attendingButtonText]}>
                  {isAttending ? 'Attending ✓' : 'Join Event'}
                </Text>
              </Pressable>
            </View>
          </View>
        );
      })}
      
      <Pressable style={styles.createEventButton} onPress={() => router.push('/create-event')}>
        <IconSymbol name="plus.circle.fill" size={24} color={colors.card} />
        <Text style={styles.createEventText}>Create New Event</Text>
      </Pressable>
    </View>
  );

  const renderLeaderboard = () => (
    <View style={styles.tabContent}>
      <View style={styles.leaderboardHeader}>
        <Text style={styles.leaderboardTitle}>🏆 Top Street Stewards</Text>
        <Text style={styles.leaderboardSubtitle}>This Month</Text>
      </View>
      
      {mockLeaderboard.map((steward, index) => {
        const isCurrentUser = steward.userId === currentUser.id;
        
        return (
          <View
            key={steward.userId}
            style={[
              commonStyles.card,
              isCurrentUser && styles.currentUserCard,
              index < 3 && styles.topThreeCard
            ]}
          >
            <View style={styles.leaderboardRow}>
              <View style={[
                styles.rankBadge,
                index === 0 && styles.goldBadge,
                index === 1 && styles.silverBadge,
                index === 2 && styles.bronzeBadge,
              ]}>
                <Text style={styles.rankText}>#{steward.rank}</Text>
              </View>
              
              <View style={styles.leaderboardInfo}>
                <Text style={[styles.leaderboardName, isCurrentUser && styles.currentUserName]}>
                  {steward.userName} {isCurrentUser && '(You)'}
                </Text>
                <Text style={styles.leaderboardStats}>
                  {steward.cleanupCount} cleanups
                </Text>
              </View>
              
              <View style={styles.leaderboardPoints}>
                <IconSymbol name="star.fill" size={20} color={colors.highlight} />
                <Text style={styles.leaderboardPointsText}>{steward.totalPoints}</Text>
              </View>
              
              {index < 3 && (
                <IconSymbol
                  name="trophy.fill"
                  size={28}
                  color={index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32'}
                />
              )}
            </View>
          </View>
        );
      })}
      
      <View style={styles.pointsInfoBox}>
        <Text style={styles.pointsInfoTitle}>How to Earn Points:</Text>
        <Text style={styles.pointsInfoText}>• Log a cleanup: 50 pts per bag</Text>
        <Text style={styles.pointsInfoText}>• Report a hazard: 25 pts</Text>
        <Text style={styles.pointsInfoText}>• Identify a plant: 15 pts</Text>
        <Text style={styles.pointsInfoText}>• Attend an event: 100 pts</Text>
        <Text style={styles.pointsInfoText}>• Organize an event: 200 pts</Text>
      </View>
    </View>
  );

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'cleanup': return colors.primary;
      case 'block-party': return colors.accent;
      case 'planting': return colors.secondary;
      default: return colors.textSecondary;
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'cleanup': return 'trash.fill';
      case 'block-party': return 'party.popper.fill';
      case 'planting': return 'leaf.fill';
      default: return 'calendar';
    }
  };

  return (
    <SafeAreaView style={[commonStyles.container]} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Community</Text>
      </View>
      
      <View style={styles.tabBar}>
        <Pressable
          style={[styles.tab, activeTab === 'events' && styles.activeTab]}
          onPress={() => setActiveTab('events')}
        >
          <IconSymbol name="calendar" size={20} color={activeTab === 'events' ? colors.text : colors.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'events' && styles.activeTabText]}>
            Events
          </Text>
        </Pressable>
        
        <Pressable
          style={[styles.tab, activeTab === 'leaderboard' && styles.activeTab]}
          onPress={() => setActiveTab('leaderboard')}
        >
          <IconSymbol name="trophy.fill" size={20} color={activeTab === 'leaderboard' ? colors.text : colors.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'leaderboard' && styles.activeTabText]}>
            Leaderboard
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
        {activeTab === 'events' && renderEvents()}
        {activeTab === 'leaderboard' && renderLeaderboard()}
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
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  eventTypeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventHeaderInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  eventOrganizer: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  eventDescription: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 12,
  },
  eventDetails: {
    gap: 8,
    marginBottom: 12,
  },
  eventDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  eventDetailText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.background,
  },
  attendeeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  attendeeText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  attendButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  attendingButton: {
    backgroundColor: colors.secondary,
  },
  attendButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  attendingButtonText: {
    color: colors.card,
  },
  createEventButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
    padding: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 8,
  },
  createEventText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.card,
  },
  leaderboardHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  leaderboardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  leaderboardSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  leaderboardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rankBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goldBadge: {
    backgroundColor: '#FFD700',
  },
  silverBadge: {
    backgroundColor: '#C0C0C0',
  },
  bronzeBadge: {
    backgroundColor: '#CD7F32',
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
  currentUserName: {
    color: colors.secondary,
  },
  leaderboardStats: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  leaderboardPoints: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  leaderboardPointsText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  topThreeCard: {
    borderWidth: 2,
    borderColor: colors.highlight,
  },
  currentUserCard: {
    backgroundColor: colors.highlight,
  },
  pointsInfoBox: {
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  pointsInfoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  pointsInfoText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 6,
    lineHeight: 20,
  },
});
