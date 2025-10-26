
import { useEffect, useState } from 'react';
import { supabase } from '@/app/integrations/supabase/client';

export interface LeaderboardEntry {
  user_id: string;
  user_name: string;
  avatar_url?: string;
  total_points: number;
  cleanup_count: number;
  rank: number;
}

export function useLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      console.log('Fetching leaderboard');
      
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .limit(50);

      if (error) {
        console.error('Error fetching leaderboard:', error);
        setLoading(false);
        return;
      }

      setLeaderboard(data || []);
    } catch (error) {
      console.error('Unexpected error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    leaderboard,
    loading,
    refetch: fetchLeaderboard,
  };
}
