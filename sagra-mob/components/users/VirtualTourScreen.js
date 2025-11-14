import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  PanResponder,
  Dimensions,
  TouchableOpacity,
  Animated,
} from 'react-native';
import styles from '../styles/VirtualTourStyle';
import CustomNavbar from './CustomNavbar';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IMAGE_WIDTH = SCREEN_WIDTH * 2; // Make image 2x screen width for 360 effect

export default function VirtualTourScreen({ user, onNavigate }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  // Start at center position - image is 2x width, so center it
  const initialOffset = -SCREEN_WIDTH / 2;
  const translateX = useRef(new Animated.Value(initialOffset)).current;
  const lastOffset = useRef(initialOffset);
  const panResponderRef = useRef(null);

  const tourImages = [
    {
      id: 'facade',
      name: 'Facade',
      image: require('../assets/360facade.jpg'),
    },
    {
      id: 'altar',
      name: 'Altar',
      image: require('../assets/360altar.jpg'),
    },
    {
      id: 'pews',
      name: 'Pews',
      image: require('../assets/360pews.jpg'),
    },
  ];

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      translateX.setOffset(lastOffset.current);
      translateX.setValue(0);
    },
    onPanResponderMove: (evt, gestureState) => {
      const maxTranslate = SCREEN_WIDTH / 2; // Can move half screen width in each direction
      const minTranslate = -SCREEN_WIDTH / 2;
      const newValue = gestureState.dx + lastOffset.current;
      const clampedValue = Math.max(minTranslate, Math.min(maxTranslate, newValue));
      translateX.setValue(clampedValue - lastOffset.current);
    },
    onPanResponderRelease: (evt, gestureState) => {
      const maxTranslate = SCREEN_WIDTH / 2;
      const minTranslate = -SCREEN_WIDTH / 2;
      const newOffset = gestureState.dx + lastOffset.current;
      lastOffset.current = Math.max(minTranslate, Math.min(maxTranslate, newOffset));
      translateX.flattenOffset();
    },
  });

  if (!panResponderRef.current) {
    panResponderRef.current = panResponder;
  }

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => {
      const nextIndex = (prev + 1) % tourImages.length;
      lastOffset.current = initialOffset;
      translateX.setValue(initialOffset);
      setImageError(false);
      return nextIndex;
    });
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => {
      const prevIndex = (prev - 1 + tourImages.length) % tourImages.length;
      lastOffset.current = initialOffset;
      translateX.setValue(initialOffset);
      setImageError(false);
      return prevIndex;
    });
  };

  const currentImage = tourImages[currentImageIndex];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Virtual Tour</Text>
          <Text style={styles.subtitle}>Explore our 360° experience</Text>
        </View>

        <View style={styles.tourContainer}>
          <Text style={styles.locationName}>{currentImage.name}</Text>
          <View style={styles.imageContainer} {...panResponderRef.current.panHandlers}>
            {imageError ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Failed to load image</Text>
              </View>
            ) : (
              <Animated.View
                style={[
                  styles.panoramaWrapper,
                  {
                    transform: [{ translateX }],
                  },
                ]}
              >
                <Image
                  source={currentImage.image}
                  style={styles.panoramaImage}
                  resizeMode="cover"
                  onError={() => {
                    console.error('Image load error:', currentImage.name);
                    setImageError(true);
                  }}
                  onLoad={() => {
                    console.log('Image loaded:', currentImage.name);
                    setImageError(false);
                    setImageLoaded(true);
                  }}
                />
              </Animated.View>
            )}
          </View>

          <View style={styles.controlsContainer}>
            <TouchableOpacity
              style={styles.navButton}
              onPress={handlePrevImage}
            >
              <Text style={styles.navButtonText}>← Previous</Text>
            </TouchableOpacity>

            <View style={styles.dotsContainer}>
              {tourImages.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    index === currentImageIndex && styles.dotActive,
                  ]}
                />
              ))}
            </View>

            <TouchableOpacity
              style={styles.navButton}
              onPress={handleNextImage}
            >
              <Text style={styles.navButtonText}>Next →</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.instructionText}>
            Drag left or right to rotate the 360° view
          </Text>
        </View>
      </ScrollView>

      <CustomNavbar
        currentScreen="VirtualTourScreen"
        onNavigate={onNavigate}
      />
    </View>
  );
}
