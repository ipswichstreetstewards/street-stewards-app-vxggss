
import React, { useState } from "react";
import { ScrollView, StyleSheet, View, Text, TextInput, Pressable, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconSymbol } from "@/components/IconSymbol";
import { colors, commonStyles } from "@/styles/commonStyles";
import { router } from "expo-router";
import * as ImagePicker from 'expo-image-picker';

export default function PlantIdentificationScreen() {
  const [plantName, setPlantName] = useState('');
  const [scientificName, setScientificName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [isPollinatorFriendly, setIsPollinatorFriendly] = useState(false);
  const [careInstructions, setCareInstructions] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const newPhotos = result.assets.map(asset => asset.uri);
      setPhotos([...photos, ...newPhotos]);
    }
  };

  const handleTakePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) {
      setPhotos([...photos, result.assets[0].uri]);
    }
  };

  const handleIdentifyPlant = () => {
    console.log('Opening plant identification app integration...');
  };

  const handleSubmit = () => {
    console.log('Plant posted:', {
      plantName,
      scientificName,
      location,
      description,
      isPollinatorFriendly,
      careInstructions,
      photos
    });
    router.back();
  };

  return (
    <SafeAreaView style={[commonStyles.container]} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Plant Identification</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.pointsPreview}>
          <IconSymbol name="star.fill" size={24} color={colors.highlight} />
          <Text style={styles.pointsPreviewText}>Earn 15 points for sharing!</Text>
        </View>

        <View style={commonStyles.card}>
          <Text style={styles.label}>Plant Photo *</Text>
          <View style={styles.photoButtons}>
            <Pressable style={styles.photoButton} onPress={handleTakePhoto}>
              <IconSymbol name="camera.fill" size={24} color={colors.card} />
              <Text style={styles.photoButtonText}>Take Photo</Text>
            </Pressable>
            <Pressable style={styles.photoButton} onPress={handlePickImage}>
              <IconSymbol name="photo.fill" size={24} color={colors.card} />
              <Text style={styles.photoButtonText}>Choose Photo</Text>
            </Pressable>
          </View>
          {photos.length > 0 && (
            <Text style={styles.photoCount}>{photos.length} photo(s) selected</Text>
          )}
        </View>

        <Pressable style={styles.identifyButton} onPress={handleIdentifyPlant}>
          <IconSymbol name="sparkles" size={24} color={colors.card} />
          <View style={styles.identifyButtonContent}>
            <Text style={styles.identifyButtonText}>Identify with Plant App</Text>
            <Text style={styles.identifyButtonSubtext}>
              Opens external plant identification app
            </Text>
          </View>
        </Pressable>

        <View style={commonStyles.card}>
          <Text style={styles.label}>Plant Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Purple Coneflower"
            placeholderTextColor={colors.textSecondary}
            value={plantName}
            onChangeText={setPlantName}
          />
        </View>

        <View style={commonStyles.card}>
          <Text style={styles.label}>Scientific Name (optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Echinacea purpurea"
            placeholderTextColor={colors.textSecondary}
            value={scientificName}
            onChangeText={setScientificName}
          />
        </View>

        <View style={commonStyles.card}>
          <Text style={styles.label}>Location *</Text>
          <TextInput
            style={styles.input}
            placeholder="Where did you find this plant?"
            placeholderTextColor={colors.textSecondary}
            value={location}
            onChangeText={setLocation}
          />
        </View>

        <View style={commonStyles.card}>
          <View style={styles.switchRow}>
            <View style={styles.switchLabel}>
              <IconSymbol name="leaf.fill" size={24} color={colors.secondary} />
              <Text style={styles.label}>Pollinator Friendly 🐝</Text>
            </View>
            <Switch
              value={isPollinatorFriendly}
              onValueChange={setIsPollinatorFriendly}
              trackColor={{ false: colors.textSecondary, true: colors.secondary }}
              thumbColor={colors.card}
            />
          </View>
        </View>

        <View style={commonStyles.card}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe the plant, its features, and why you love it..."
            placeholderTextColor={colors.textSecondary}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={commonStyles.card}>
          <Text style={styles.label}>Care Instructions (optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Sunlight, water, soil requirements, etc."
            placeholderTextColor={colors.textSecondary}
            value={careInstructions}
            onChangeText={setCareInstructions}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.infoBox}>
          <IconSymbol name="info.circle.fill" size={20} color={colors.accent} />
          <Text style={styles.infoText}>
            Share your plant discoveries to help others learn about local flora and create a greener community!
          </Text>
        </View>

        <Pressable
          style={[styles.submitButton, (!plantName || !location || !description || photos.length === 0) && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={!plantName || !location || !description || photos.length === 0}
        >
          <IconSymbol name="leaf.fill" size={24} color={colors.card} />
          <Text style={styles.submitButtonText}>Share Plant</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primary,
    padding: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  pointsPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.highlight,
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
  },
  pointsPreviewText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  photoButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  photoButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  photoButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.card,
  },
  photoCount: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  identifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    gap: 12,
  },
  identifyButtonContent: {
    flex: 1,
  },
  identifyButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  identifyButtonSubtext: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    padding: 12,
    borderRadius: 8,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.accent,
    marginBottom: 16,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  submitButtonDisabled: {
    backgroundColor: colors.textSecondary,
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.card,
  },
});
