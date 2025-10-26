
import { useEffect, useState } from 'react';
import { supabase } from '@/app/integrations/supabase/client';
import { useAuth } from './useAuth';

export type EventType = 'cleanup' | 'block-party' | 'planting' | 'other';

export interface CommunityEvent {
  id: string;
  organizer_id: string;
  organizer_name?: string;
  title: string;
  description: string;
  type: EventType;
  location: string;
  date: string;
  start_time: string;
  end_time: string;
  max_attendees?: number;
  attendees?: string[];
  attendee_count?: number;
  user_is_attending?: boolean;
}

export function useEvents() {
  const { user } = useAuth();
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, [user]);

  const fetchEvents = async () => {
    try {
      console.log('Fetching community events');
      
      const { data: eventsData, error } = await supabase
        .from('community_events')
        .select(`
          *,
          profiles!community_events_organizer_id_fkey(name)
        `)
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching community events:', error);
        setLoading(false);
        return;
      }

      // Fetch attendees for each event
      const eventsWithAttendees = await Promise.all(
        eventsData.map(async (event) => {
          const { data: attendeesData } = await supabase
            .from('event_attendees')
            .select('user_id')
            .eq('event_id', event.id);

          const attendeeIds = attendeesData?.map((a) => a.user_id) || [];
          const userIsAttending = user ? attendeeIds.includes(user.id) : false;

          return {
            ...event,
            organizer_name: event.profiles?.name,
            attendees: attendeeIds,
            attendee_count: attendeeIds.length,
            user_is_attending: userIsAttending,
          };
        })
      );

      setEvents(eventsWithAttendees);
    } catch (error) {
      console.error('Unexpected error fetching community events:', error);
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (eventData: Omit<CommunityEvent, 'id' | 'organizer_id' | 'organizer_name' | 'attendees' | 'attendee_count' | 'user_is_attending'>) => {
    if (!user) return;

    try {
      console.log('Creating community event:', eventData);
      
      const { data, error } = await supabase
        .from('community_events')
        .insert({
          organizer_id: user.id,
          title: eventData.title,
          description: eventData.description,
          type: eventData.type,
          location: eventData.location,
          date: eventData.date,
          start_time: eventData.start_time,
          end_time: eventData.end_time,
          max_attendees: eventData.max_attendees,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating community event:', error);
        throw error;
      }

      // Automatically add organizer as attendee
      await supabase.from('event_attendees').insert({
        event_id: data.id,
        user_id: user.id,
      });

      await fetchEvents();
      return data;
    } catch (error) {
      console.error('Unexpected error creating community event:', error);
      throw error;
    }
  };

  const toggleAttendance = async (eventId: string) => {
    if (!user) return;

    try {
      const event = events.find((e) => e.id === eventId);
      if (!event) return;

      if (event.user_is_attending) {
        // Remove attendance
        await supabase
          .from('event_attendees')
          .delete()
          .eq('event_id', eventId)
          .eq('user_id', user.id);
      } else {
        // Add attendance
        await supabase
          .from('event_attendees')
          .insert({
            event_id: eventId,
            user_id: user.id,
          });
      }

      await fetchEvents();
    } catch (error) {
      console.error('Error toggling attendance:', error);
      throw error;
    }
  };

  return {
    events,
    loading,
    refetch: fetchEvents,
    createEvent,
    toggleAttendance,
  };
}
