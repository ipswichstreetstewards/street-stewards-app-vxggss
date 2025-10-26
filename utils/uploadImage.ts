
import { supabase } from '@/app/integrations/supabase/client';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';

export async function uploadImage(
  uri: string,
  bucket: 'avatars' | 'cleanup-photos' | 'hazard-photos' | 'plant-photos',
  userId: string
): Promise<string> {
  try {
    console.log('Uploading image to bucket:', bucket);

    // Read the file as base64
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: 'base64',
    });

    // Generate a unique filename
    const fileExt = uri.split('.').pop() || 'jpg';
    const fileName = `${userId}/${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, decode(base64), {
        contentType: `image/${fileExt}`,
        upsert: false,
      });

    if (error) {
      console.error('Error uploading image:', error);
      throw error;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    console.log('Image uploaded successfully:', urlData.publicUrl);
    return urlData.publicUrl;
  } catch (error) {
    console.error('Unexpected error uploading image:', error);
    throw error;
  }
}

export async function deleteImage(url: string, bucket: string): Promise<void> {
  try {
    // Extract the file path from the URL
    const urlParts = url.split(`/${bucket}/`);
    if (urlParts.length < 2) {
      console.error('Invalid URL format');
      return;
    }

    const filePath = urlParts[1];

    const { error } = await supabase.storage.from(bucket).remove([filePath]);

    if (error) {
      console.error('Error deleting image:', error);
      throw error;
    }

    console.log('Image deleted successfully');
  } catch (error) {
    console.error('Unexpected error deleting image:', error);
    throw error;
  }
}
