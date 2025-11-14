import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 5,
    paddingBottom: 25,
    paddingHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 5,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  iconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navItemActive: {
    backgroundColor: '#fafafaff',
    width: 60,
    height: 55,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: -15,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  navText: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 2,
  },
  navTextActive: {
    color: '#FFC942',
    fontWeight: 'bold',
  },
});

export default styles;