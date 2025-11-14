import { StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

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
    marginTop: 40,
    marginBottom: 20,
  },

  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 16,
    color: '#666',
  },

  tourContainer: {
    marginBottom: 30,
  },

  locationName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
  },

  imageContainer: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#000',
    marginBottom: 15,
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
    height: 250,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  
  panoramaImage: {
    width: SCREEN_WIDTH * 3,
    height: 250,
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
  },

  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },

  navButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },

  navButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
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
    backgroundColor: '#007AFF',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  
  instructionText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default styles;

