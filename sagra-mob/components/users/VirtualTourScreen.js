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
import styles from '../../styles/users/VirtualTourStyle';
import CustomNavbar from '../../customs/CustomNavbar';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IMAGE_WIDTH = SCREEN_WIDTH * 3; 

export default function VirtualTourScreen({ user, onNavigate }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const initialOffset = -SCREEN_WIDTH;
  const translateX = useRef(new Animated.Value(initialOffset)).current;
  const currentPosition = useRef(initialOffset);
  const panStartPosition = useRef(initialOffset); 
  const panResponderRef = useRef(null);

  const tourImages = [
    {
      id: 'facade',
      name: 'Facade',
      image: require('../../assets/360facade.jpg'),
      description: 'The magnificent facade of the Sagrada Familia Parish showcases stunning architectural details and intricate designs. This grand entrance welcomes visitors with its beautiful stonework and traditional church architecture.',
    },
    {
      id: 'altar',
      name: 'Altar',
      image: require('../../assets/360altar.jpg'),
      description: 'The sacred altar is the heart of our parish, where the Holy Eucharist is celebrated. This sacred space is beautifully adorned and serves as the focal point for worship and prayer, creating a reverent atmosphere for all who visit.',
    },
    {
      id: 'pews',
      name: 'Pews',
      image: require('../../assets/360pews.jpg'),
      description: 'The pews area provides a peaceful space for congregation members to gather for Mass and prayer. The carefully arranged seating creates a sense of community and togetherness during worship services.',
    },
  ];

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt, gestureState) => {
      translateX.stopAnimation((value) => {
        panStartPosition.current = value;
        currentPosition.current = value;
        
        translateX.setOffset(value);
        translateX.setValue(0);
      });
    },

    onPanResponderMove: (evt, gestureState) => {
      const maxTranslate = 0;
      const minTranslate = -SCREEN_WIDTH * 2;
      
      const newPosition = panStartPosition.current - gestureState.dx;
      const clampedPosition = Math.max(minTranslate, Math.min(maxTranslate, newPosition));

      translateX.setValue(clampedPosition - panStartPosition.current);
    },

    onPanResponderRelease: (evt, gestureState) => {
      const maxTranslate = 0;
      const minTranslate = -SCREEN_WIDTH * 2;
  
      const finalPosition = panStartPosition.current - gestureState.dx;
      const clampedFinal = Math.max(minTranslate, Math.min(maxTranslate, finalPosition));
      
      translateX.flattenOffset();
      currentPosition.current = clampedFinal;
      translateX.setValue(clampedFinal);
    },
  });

  if (!panResponderRef.current) {
    panResponderRef.current = panResponder;
  }

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => {
      const nextIndex = (prev + 1) % tourImages.length;
      currentPosition.current = initialOffset;
      Animated.timing(translateX, {
        toValue: initialOffset,
        duration: 200,
        useNativeDriver: true,
      }).start();

      setImageError(false);
      return nextIndex;
    });
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => {
      const prevIndex = (prev - 1 + tourImages.length) % tourImages.length;
      currentPosition.current = initialOffset;
      Animated.timing(translateX, {
        toValue: initialOffset,
        duration: 200,
        useNativeDriver: true,
      }).start();
      
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
                  resizeMode="stretch"
                  onError={() => {
                    console.error('Image load error:', currentImage.name);
                    setImageError(true);
                  }}
                  onLoad={(event) => {
                    console.log('Image loaded:', currentImage.name);
                    const { width, height } = event.nativeEvent.source;
                    console.log('Image dimensions:', width, 'x', height);
                    setImageError(false);
                    setImageLoaded(true);
                  }}
                />
              </Animated.View>
            )}
          </View>

          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionText}>{currentImage.description}</Text>
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
