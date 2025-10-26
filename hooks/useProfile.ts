
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/app/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Profile {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  bio?: string;
  total_points: number;
  level: number;
  joined_date: string;
  adopted_streets?: string[];
}

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!user) return;

    try {
      console.log('Fetching profile for user:', user.id);
      
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        setLoading(false);
        return;
      }

      // Fetch adopted streets
      const { data: streetsData } = await supabase
        .from('adopted_streets')
        .select('street_name')
        .eq('user_id', user.id);

      const adoptedStreets = streetsData?.map((s) => s.street_name) || [];

      setProfile({
        ...profileData,
        adopted_streets: adoptedStreets,
      });
    } catch (error) {
      console.error('Unexpected error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user, fetchProfile]);

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return;

    try {
      console.log('Updating profile:', updates);
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) {
        console.error('Error updating profile:', error);
        throw error;
      }

      await fetchProfile();
    } catch (error) {
      console.error('Unexpected error updating profile:', error);
      throw error;
    }
  };

  return {
    profile,
    loading,
    refetch: fetchProfile,
    updateProfile,
  };
}
