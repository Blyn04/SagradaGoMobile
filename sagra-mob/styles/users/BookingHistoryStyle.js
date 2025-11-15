import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollView: {
    flex: 1,
    padding: 20,
  },

  header: {
    marginTop: 40,
    marginBottom: 20,
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },

  title: {
    marginBottom: 8,
  },

  subtitle: {
    marginBottom: 20,
  },

  filterContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },

  filterButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  bookingsContainer: {
    marginBottom: 20,
  },

  bookingCard: {
    padding: 16,
    marginBottom: 12,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  cardHeaderLeft: {
    flex: 1,
  },

  sacramentName: {
    marginBottom: 4,
  },

  cardDivider: {
    height: 1,
    marginVertical: 12,
  },

  cardDetails: {
    marginTop: 4,
  },

  detailRow: {
    marginBottom: 8,
  },

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },

  emptyText: {
    marginTop: 16,
    textAlign: 'center',
  },
});

export default styles;

