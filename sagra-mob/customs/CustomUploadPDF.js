import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/users/CustomBookingStyle';

let DocumentPicker = null;
try {
  DocumentPicker = require('expo-document-picker');
} catch (error) {
  console.warn('expo-document-picker is not available in this environment.');
}

export default function CustomUploadPDF({
  visible,
  onClose,
  sacrament,
  requirements = [],
  uploadedDocs = {},
  onUpload,
  onRemove,
}) {
  const handlePickDocument = async (requirement) => {
    if (!DocumentPicker) {
      Alert.alert(
        'Module Missing',
        'Please install expo-document-picker to enable PDF uploads:\n\nnpx expo install expo-document-picker'
      );
      return;
    }

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        multiple: false,
        copyToCacheDirectory: true,
      });

      if (result.canceled || result.type === 'cancel') {
        return;
      }

      const asset = result.assets ? result.assets[0] : result;
      const fileInfo = {
        uri: asset.uri,
        name: asset.name || asset.fileName || `${requirement.id}.pdf`,
        size: asset.size,
        mimeType: asset.mimeType || asset.type || 'application/pdf',
      };

      onUpload?.(requirement.id, fileInfo);
      
    } catch (error) {
      console.error('PDF upload error:', error);
      Alert.alert('Upload Failed', 'Could not select a PDF. Please try again.');
    }
  };

  const renderRequirementItem = (requirement) => {
    const uploadedFile = uploadedDocs[requirement.id];
    return (
      <View key={requirement.id} style={styles.uploadRequirementItem}>
        <View style={styles.uploadRequirementInfo}>
          <Text style={styles.inputLabel}>{requirement.label}</Text>
          {uploadedFile ? (
            <View style={styles.uploadFileInfo}>
              <Ionicons name="document-attach-outline" size={18} color="#4CAF50" />
              <Text style={styles.uploadFileName}>{uploadedFile.name}</Text>
            </View>
          ) : (
            <Text style={styles.uploadHelperText}>
              No file uploaded yet. PDF format only.
            </Text>
          )}
        </View>

        <View style={styles.uploadRequirementActions}>
          <TouchableOpacity
            style={styles.uploadRequirementButton}
            onPress={() => handlePickDocument(requirement)}
          >
            <Ionicons name="cloud-upload-outline" size={18} color="#424242" style={{ marginRight: 6 }} />
            <Text style={styles.uploadRequirementButtonText}>
              {uploadedFile ? 'Replace PDF' : 'Upload PDF'}
            </Text>
          </TouchableOpacity>
          {uploadedFile && (
            <TouchableOpacity
              style={styles.uploadRequirementButtonSecondary}
              onPress={() => onRemove?.(requirement.id)}
            >
              <Ionicons name="trash-outline" size={16} color="#ff4444" style={{ marginRight: 4 }} />
              <Text style={styles.uploadRequirementButtonSecondaryText}>Remove</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.uploadModalOverlay}>
        <View style={styles.uploadModalContent}>
          <View style={styles.uploadModalHeader}>
            <View>
              <Text style={styles.modalTitle}>Upload Documents</Text>
              <Text style={styles.uploadModalSubtitle}>
                {sacrament ? `Required PDFs for ${sacrament}` : 'Select a sacrament first.'}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color="#333" />
            </TouchableOpacity>
          </View>

          {requirements.length === 0 ? (
            <View style={styles.uploadEmptyState}>
              <Ionicons name="cloud-offline-outline" size={48} color="#999" />
              <Text style={styles.uploadHelperText}>
                There are no PDF requirements for this sacrament.
              </Text>
            </View>
          ) : (
            <ScrollView
              style={{ flex: 1 }}
              showsVerticalScrollIndicator={false}
            >
              {requirements.map(renderRequirementItem)}
            </ScrollView>
          )}

          <TouchableOpacity style={styles.uploadModalCloseButton} onPress={onClose}>
            <Text style={styles.qrCodeCloseButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

