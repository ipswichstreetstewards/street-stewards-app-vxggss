
import { useEffect, useState } from 'react';
import { supabase } from '@/app/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface CleanupLog {
  id: string;
  user_id: string;
  user_name?: string;
  date: string;
  location: string;
  duration: number;
  trash_bags: number;
  points: number;
  notes?: string;
  before_photo_url?: string;
  after_photo_url?: string;
  photos?: string[];
}

export function useCleanupLogs() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<CleanupLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, [user]);

  const fetchLogs = async () => {
    try {
      console.log('Fetching cleanup logs');
      
      const { data: logsData, error } = await supabase
        .from('cleanup_logs')
        .select(`
          *,
          profiles!cleanup_logs_user_id_fkey(name)
        `)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching cleanup logs:', error);
        setLoading(false);
        return;
      }

      // Fetch photos for each log
      const logsWithPhotos = await Promise.all(
        logsData.map(async (log) => {
          const { data: photosData } = await supabase
            .from('cleanup_photos')
            .select('photo_url')
            .eq('cleanup_log_id', log.id);

          return {
            ...log,
            user_name: log.profiles?.name,
            photos: photosData?.map((p) => p.photo_url) || [],
          };
        })
      );

      setLogs(logsWithPhotos);
    } catch (error) {
      console.error('Unexpected error fetching cleanup logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const createLog = async (logData: Omit<CleanupLog, 'id' | 'user_id' | 'user_name'>) => {
    if (!user) return;

    try {
      console.log('Creating cleanup log:', logData);
      
      const { data, error } = await supabase
        .from('cleanup_logs')
        .insert({
          user_id: user.id,
          date: logData.date,
          location: logData.location,
          duration: logData.duration,
          trash_bags: logData.trash_bags,
          points: logData.points,
          notes: logData.notes,
          before_photo_url: logData.before_photo_url,
          after_photo_url: logData.after_photo_url,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating cleanup log:', error);
        throw error;
      }

      // Insert photos if any
      if (logData.photos && logData.photos.length > 0) {
        const photosToInsert = logData.photos.map((url) => ({
          cleanup_log_id: data.id,
          photo_url: url,
        }));

        await supabase.from('cleanup_photos').insert(photosToInsert);
      }

      await fetchLogs();
      return data;
    } catch (error) {
      console.error('Unexpected error creating cleanup log:', error);
      throw error;
    }
  };

  return {
    logs,
    loading,
    refetch: fetchLogs,
    createLog,
  };
}
