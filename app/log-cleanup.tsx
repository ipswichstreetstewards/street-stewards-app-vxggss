
import React, { useState } from "react";
import { ScrollView, StyleSheet, View, Text, TextInput, Pressable, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconSymbol } from "@/components/IconSymbol";
import { colors, commonStyles } from "@/styles/commonStyles";
import { router } from "expo-router";
import * as ImagePicker from 'expo-image-picker';

export default function LogCleanupScreen() {
  const [location, setLocation] = useState('');
  const [trashBags, setTrashBags] = useState('1');
  const [duration, setDuration] = useState('30');
  const [notes, setNotes] = useState('');
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

  const handleSubmit = () => {
    const points = parseInt(trashBags) * 50;
    console.log('Cleanup logged:', { location, trashBags, duration, notes, photos, points });
    router.back();
  };

  return (
    <SafeAreaView style={[commonStyles.container]} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Log Cleanup</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.pointsPreview}>
          <IconSymbol name="star.fill" size={32} color={colors.highlight} />
          <Text style={styles.pointsPreviewText}>
            Earn {parseInt(trashBags || '0') * 50} points!
          </Text>
        </View>

        <View style={commonStyles.card}>
          <Text style={styles.label}>Location *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Oak Street"
            placeholderTextColor={colors.textSecondary}
            value={location}
            onChangeText={setLocation}
          />
        </View>

        <View style={commonStyles.card}>
          <Text style={styles.label}>Number of Trash Bags *</Text>
          <View style={styles.counterContainer}>
            <Pressable
              style={styles.counterButton}
              onPress={() => setTrashBags(Math.max(1, parseInt(trashBags) - 1).toString())}
            >
              <IconSymbol name="minus" size={20} color={colors.text} />
            </Pressable>
            <TextInput
              style={styles.counterInput}
              keyboardType="number-pad"
              value={trashBags}
              onChangeText={setTrashBags}
            />
            <Pressable
              style={styles.counterButton}
              onPress={() => setTrashBags((parseInt(trashBags) + 1).toString())}
            >
              <IconSymbol name="plus" size={20} color={colors.text} />
            </Pressable>
          </View>
          <Text style={styles.helperText}>50 points per bag</Text>
        </View>

        <View style={commonStyles.card}>
          <Text style={styles.label}>Duration (minutes) *</Text>
          <View style={styles.counterContainer}>
            <Pressable
              style={styles.counterButton}
              onPress={() => setDuration(Math.max(5, parseInt(duration) - 5).toString())}
            >
              <IconSymbol name="minus" size={20} color={colors.text} />
            </Pressable>
            <TextInput
              style={styles.counterInput}
              keyboardType="number-pad"
              value={duration}
              onChangeText={setDuration}
            />
            <Pressable
              style={styles.counterButton}
              onPress={() => setDuration((parseInt(duration) + 5).toString())}
            >
              <IconSymbol name="plus" size={20} color={colors.text} />
            </Pressable>
          </View>
        </View>

        <View style={commonStyles.card}>
          <Text style={styles.label}>Notes (optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="What did you find? Any interesting observations?"
            placeholderTextColor={colors.textSecondary}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={commonStyles.card}>
          <Text style={styles.label}>Photos (optional)</Text>
          <View style={styles.photoButtons}>
            <Pressable style={styles.photoButton} onPress={handleTakePhoto}>
              <IconSymbol name="camera.fill" size={24} color={colors.card} />
              <Text style={styles.photoButtonText}>Take Photo</Text>
            </Pressable>
            <Pressable style={styles.photoButton} onPress={handlePickImage}>
              <IconSymbol name="photo.fill" size={24} color={colors.card} />
              <Text style={styles.photoButtonText}>Choose Photos</Text>
            </Pressable>
          </View>
          {photos.length > 0 && (
            <Text style={styles.photoCount}>{photos.length} photo(s) selected</Text>
          )}
        </View>

        <Pressable
          style={[styles.submitButton, (!location || !trashBags || !duration) && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={!location || !trashBags || !duration}
        >
          <IconSymbol name="checkmark.circle.fill" size={24} color={colors.card} />
          <Text style={styles.submitButtonText}>Log Cleanup</Text>
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
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    gap: 12,
  },
  pointsPreviewText: {
    fontSize: 18,
    fontWeight: '700',
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
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  counterButton: {
    backgroundColor: colors.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterInput: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    minWidth: 80,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  helperText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
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
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
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
