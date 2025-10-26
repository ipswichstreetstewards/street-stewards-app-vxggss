
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/app/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface PlantPost {
  id: string;
  user_id: string;
  user_name?: string;
  plant_name: string;
  scientific_name?: string;
  location: string;
  description: string;
  is_pollinator_friendly: boolean;
  care_instructions?: string;
  posted_date: string;
  likes: number;
  photos?: string[];
  user_has_liked?: boolean;
}

export function usePlants() {
  const { user } = useAuth();
  const [plants, setPlants] = useState<PlantPost[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPlants = useCallback(async () => {
    try {
      console.log('Fetching plant posts');
      
      const { data: plantsData, error } = await supabase
        .from('plant_posts')
        .select(`
          *,
          profiles!plant_posts_user_id_fkey(name)
        `)
        .order('posted_date', { ascending: false });

      if (error) {
        console.error('Error fetching plant posts:', error);
        setLoading(false);
        return;
      }

      // Fetch photos and likes for each plant
      const plantsWithDetails = await Promise.all(
        plantsData.map(async (plant) => {
          const { data: photosData } = await supabase
            .from('plant_photos')
            .select('photo_url')
            .eq('plant_post_id', plant.id);

          let userHasLiked = false;
          if (user) {
            const { data: likeData } = await supabase
              .from('plant_likes')
              .select('id')
              .eq('plant_post_id', plant.id)
              .eq('user_id', user.id)
              .single();

            userHasLiked = !!likeData;
          }

          return {
            ...plant,
            user_name: plant.profiles?.name,
            photos: photosData?.map((p) => p.photo_url) || [],
            user_has_liked: userHasLiked,
          };
        })
      );

      setPlants(plantsWithDetails);
    } catch (error) {
      console.error('Unexpected error fetching plant posts:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchPlants();
  }, [fetchPlants]);

  const createPlant = async (plantData: Omit<PlantPost, 'id' | 'user_id' | 'user_name' | 'posted_date' | 'likes' | 'user_has_liked'>) => {
    if (!user) return;

    try {
      console.log('Creating plant post:', plantData);
      
      const { data, error } = await supabase
        .from('plant_posts')
        .insert({
          user_id: user.id,
          plant_name: plantData.plant_name,
          scientific_name: plantData.scientific_name,
          location: plantData.location,
          description: plantData.description,
          is_pollinator_friendly: plantData.is_pollinator_friendly,
          care_instructions: plantData.care_instructions,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating plant post:', error);
        throw error;
      }

      // Insert photos if any
      if (plantData.photos && plantData.photos.length > 0) {
        const photosToInsert = plantData.photos.map((url) => ({
          plant_post_id: data.id,
          photo_url: url,
        }));

        await supabase.from('plant_photos').insert(photosToInsert);
      }

      await fetchPlants();
      return data;
    } catch (error) {
      console.error('Unexpected error creating plant post:', error);
      throw error;
    }
  };

  const toggleLike = async (plantId: string) => {
    if (!user) return;

    try {
      const plant = plants.find((p) => p.id === plantId);
      if (!plant) return;

      if (plant.user_has_liked) {
        // Unlike
        await supabase
          .from('plant_likes')
          .delete()
          .eq('plant_post_id', plantId)
          .eq('user_id', user.id);
      } else {
        // Like
        await supabase
          .from('plant_likes')
          .insert({
            plant_post_id: plantId,
            user_id: user.id,
          });
      }

      await fetchPlants();
    } catch (error) {
      console.error('Error toggling like:', error);
      throw error;
    }
  };

  return {
    plants,
    loading,
    refetch: fetchPlants,
    createPlant,
    toggleLike,
  };
}
