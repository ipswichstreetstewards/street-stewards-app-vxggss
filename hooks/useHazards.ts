
import { useEffect, useState } from 'react';
import { supabase } from '@/app/integrations/supabase/client';
import { useAuth } from './useAuth';

export type HazardType = 'pothole' | 'debris' | 'large-trash' | 'other';
export type HazardStatus = 'reported' | 'in-progress' | 'resolved';
export type HazardSeverity = 'low' | 'medium' | 'high';

export interface HazardReport {
  id: string;
  user_id: string;
  user_name?: string;
  type: HazardType;
  location: string;
  description: string;
  reported_date: string;
  status: HazardStatus;
  severity: HazardSeverity;
  photos?: string[];
}

export function useHazards() {
  const { user } = useAuth();
  const [hazards, setHazards] = useState<HazardReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHazards();
  }, [user]);

  const fetchHazards = async () => {
    try {
      console.log('Fetching hazard reports');
      
      const { data: hazardsData, error } = await supabase
        .from('hazard_reports')
        .select(`
          *,
          profiles!hazard_reports_user_id_fkey(name)
        `)
        .order('reported_date', { ascending: false });

      if (error) {
        console.error('Error fetching hazard reports:', error);
        setLoading(false);
        return;
      }

      // Fetch photos for each hazard
      const hazardsWithPhotos = await Promise.all(
        hazardsData.map(async (hazard) => {
          const { data: photosData } = await supabase
            .from('hazard_photos')
            .select('photo_url')
            .eq('hazard_report_id', hazard.id);

          return {
            ...hazard,
            user_name: hazard.profiles?.name,
            photos: photosData?.map((p) => p.photo_url) || [],
          };
        })
      );

      setHazards(hazardsWithPhotos);
    } catch (error) {
      console.error('Unexpected error fetching hazard reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const createHazard = async (hazardData: Omit<HazardReport, 'id' | 'user_id' | 'user_name' | 'reported_date'>) => {
    if (!user) return;

    try {
      console.log('Creating hazard report:', hazardData);
      
      const { data, error } = await supabase
        .from('hazard_reports')
        .insert({
          user_id: user.id,
          type: hazardData.type,
          location: hazardData.location,
          description: hazardData.description,
          status: hazardData.status,
          severity: hazardData.severity,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating hazard report:', error);
        throw error;
      }

      // Insert photos if any
      if (hazardData.photos && hazardData.photos.length > 0) {
        const photosToInsert = hazardData.photos.map((url) => ({
          hazard_report_id: data.id,
          photo_url: url,
        }));

        await supabase.from('hazard_photos').insert(photosToInsert);
      }

      await fetchHazards();
      return data;
    } catch (error) {
      console.error('Unexpected error creating hazard report:', error);
      throw error;
    }
  };

  return {
    hazards,
    loading,
    refetch: fetchHazards,
    createHazard,
  };
}
