import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollView: {
    flex: 1,
  },

  header: {
    marginTop: 40,
    padding: 30,
    paddingBottom: 10,
  },

  greeting: {
    fontSize: 18,
    color: '#424242',
    fontFamily: 'Poppins_600SemiBold',
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
    marginBottom: 20,
    marginHorizontal: 20,
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
  },

  title: {
    fontSize: 32,
    color: '#333',
    fontFamily: 'Poppins_700Bold'
  },

  subtitle: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'Poppins_500Medium'
  },

  sectiontitle: {
    fontSize: 16,
    color: '#424242',
    fontFamily: 'Poppins_700Bold'
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
    fontFamily: 'Poppins_500Medium'
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: 250,
    height: '75%',
    marginRight: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    overflow: 'hidden',
  },

  cardImage: {
    width: '100%',
    height: 160,
  },

  cardContent: {
    padding: 15,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },

  cardTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
    color: '#333',
  },

  cardInfo: {
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
    color: '#777',
    marginTop: 2,
  },

  cardVolunteerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#424242',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    justifyContent: 'center',
  },

  cardVolunteerText: {
    color: '#fff',
    fontFamily: 'Poppins_600SemiBold',
    marginLeft: 6,
    fontSize: 15,
  },

  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 30,
    marginBottom: 10,
    gap: 10,
  },

  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  tabActive: {
    backgroundColor: '#424242',
  },

  tabText: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#666',
  },

  tabTextActive: {
    color: '#fff',
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 30,
  },

  emptyText: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'Poppins_500Medium',
    textAlign: 'center',
  },

});

export default styles;

