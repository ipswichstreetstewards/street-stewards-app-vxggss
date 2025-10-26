
import React, { useState } from "react";
import { ScrollView, StyleSheet, View, Text, TextInput, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconSymbol } from "@/components/IconSymbol";
import { colors, commonStyles } from "@/styles/commonStyles";
import { router } from "expo-router";
import * as ImagePicker from 'expo-image-picker';

type HazardType = 'pothole' | 'debris' | 'large-trash' | 'other';
type Severity = 'low' | 'medium' | 'high';

export default function ReportHazardScreen() {
  const [hazardType, setHazardType] = useState<HazardType>('pothole');
  const [severity, setSeverity] = useState<Severity>('medium');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);

  const hazardTypes: { type: HazardType; label: string; icon: string }[] = [
    { type: 'pothole', label: 'Pothole', icon: 'exclamationmark.triangle.fill' },
    { type: 'debris', label: 'Debris', icon: 'trash.fill' },
    { type: 'large-trash', label: 'Large Trash', icon: 'cube.fill' },
    { type: 'other', label: 'Other', icon: 'ellipsis.circle.fill' },
  ];

  const severityLevels: { level: Severity; label: string; color: string }[] = [
    { level: 'low', label: 'Low', color: colors.success },
    { level: 'medium', label: 'Medium', color: colors.warning },
    { level: 'high', label: 'High', color: colors.error },
  ];

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
    console.log('Hazard reported:', { hazardType, severity, location, description, photos });
    router.back();
  };

  return (
    <SafeAreaView style={[commonStyles.container]} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Report Hazard</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.pointsPreview}>
          <IconSymbol name="star.fill" size={24} color={colors.highlight} />
          <Text style={styles.pointsPreviewText}>Earn 25 points for reporting!</Text>
        </View>

        <View style={commonStyles.card}>
          <Text style={styles.label}>Hazard Type *</Text>
          <View style={styles.typeGrid}>
            {hazardTypes.map((item) => (
              <Pressable
                key={item.type}
                style={[
                  styles.typeButton,
                  hazardType === item.type && styles.typeButtonActive
                ]}
                onPress={() => setHazardType(item.type)}
              >
                <IconSymbol
                  name={item.icon as any}
                  size={24}
                  color={hazardType === item.type ? colors.card : colors.text}
                />
                <Text style={[
                  styles.typeButtonText,
                  hazardType === item.type && styles.typeButtonTextActive
                ]}>
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={commonStyles.card}>
          <Text style={styles.label}>Severity *</Text>
          <View style={styles.severityContainer}>
            {severityLevels.map((item) => (
              <Pressable
                key={item.level}
                style={[
                  styles.severityButton,
                  { borderColor: item.color },
                  severity === item.level && { backgroundColor: item.color }
                ]}
                onPress={() => setSeverity(item.level)}
              >
                <Text style={[
                  styles.severityButtonText,
                  severity === item.level && styles.severityButtonTextActive
                ]}>
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={commonStyles.card}>
          <Text style={styles.label}>Location *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Oak Street & 5th Ave"
            placeholderTextColor={colors.textSecondary}
            value={location}
            onChangeText={setLocation}
          />
        </View>

        <View style={commonStyles.card}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe the hazard in detail..."
            placeholderTextColor={colors.textSecondary}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={commonStyles.card}>
          <Text style={styles.label}>Photos (recommended)</Text>
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
          style={[styles.submitButton, (!location || !description) && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={!location || !description}
        >
          <IconSymbol name="exclamationmark.triangle.fill" size={24} color={colors.card} />
          <Text style={styles.submitButtonText}>Submit Report</Text>
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
    marginBottom: 12,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  typeButton: {
    width: '48%',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  typeButtonActive: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  typeButtonTextActive: {
    color: colors.card,
  },
  severityContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  severityButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
  },
  severityButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  severityButtonTextActive: {
    color: colors.card,
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
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.error,
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
