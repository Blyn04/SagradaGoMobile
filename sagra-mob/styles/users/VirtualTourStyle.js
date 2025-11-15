import { StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  scrollView: {
    flex: 1,
    padding: 20,
  },

  header: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 40,
    marginBottom: 20,
  },

  title: {
    fontSize: 25,
    fontFamily: 'Poppins_700Bold',
    color: '#333',
    marginBottom: -5,
  },

  subtitle: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Poppins_500Medium',
  },

  tourContainer: {
    marginBottom: 30,
  },

  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },

  locationName: {
    fontSize: 25,
    fontFamily: 'Poppins_700Bold',
    color: '#333',
    flex: 1,
    textAlign: 'left',
  },

  fullscreenButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },

  imageContainer: {
    width: '100%',
    height: 350,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#000',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: 'relative',
  },

  panoramaWrapper: {
    width: SCREEN_WIDTH * 3,
    height: 350,
    position: 'absolute',
    left: 0,
    top: 0,
  },

  panoramaImage: {
    width: SCREEN_WIDTH * 3,
    height: 350,
  },

  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 10,
  },

  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 14,
    fontFamily: 'Poppins_400Regular'
  },

  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },

  errorText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
  },

  descriptionContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  descriptionText: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
    textAlign: 'justify',
    fontFamily: 'Poppins_500Medium'
  },

  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },

  progressContainer: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    zIndex: 5,
  },

  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },

  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  progressLabel: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },

  navButton: {
    backgroundColor: '#FFC942',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  navButtonText: {
    color: '#424242',
    fontSize: 14,
    fontFamily: 'Poppins_700Bold'
  },

  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
  },

  dotActive: {
    backgroundColor: '#dfa20aff',
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  instructionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 15,
  },

  instructionText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontFamily: 'Poppins_400Regular'
  },

  fullscreenContainer: {
    flex: 1,
    backgroundColor: '#000',
  },

  closeFullscreenButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 100,
    padding: 10,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  fullscreenImageContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#000',
  },

  fullscreenPanoramaWrapper: {
    width: SCREEN_WIDTH * 3,
    height: SCREEN_HEIGHT,
    position: 'absolute',
    left: 0,
    top: 0,
  },

  fullscreenPanoramaImage: {
    width: SCREEN_WIDTH * 3,
    height: SCREEN_HEIGHT,
  },

  fullscreenErrorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },

  fullscreenErrorText: {
    color: '#fff',
    fontSize: 18,
    marginTop: 15,
  },

  fullscreenControls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },

  fullscreenLocationName: {
    color: '#fff',
    fontSize: 24,
    fontFamily: 'Poppins_700Bold',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
});

export default styles;

