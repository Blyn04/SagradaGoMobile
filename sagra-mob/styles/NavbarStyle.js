import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 10,
    paddingHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },

  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderRadius: 8,
    gap: 4,
  },

  navItemActive: {
    backgroundColor: '#f0f7ff',
  },

  navText: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 2,
  },
  
  navTextActive: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
});

export default styles;

