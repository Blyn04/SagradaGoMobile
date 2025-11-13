import { StyleSheet } from 'react-native';

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
    marginBottom: 30,
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

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  
  contentText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default styles;

