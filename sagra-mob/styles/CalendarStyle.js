import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  calendarContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    paddingBottom: -10,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    height: 'auto',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  navButton: {
    padding: 8,
    borderRadius: 8,
  },
  monthYearContainer: {
    flex: 1,
    alignItems: 'center',
  },
  monthYearText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'Poppins_600SemiBold',
  },
  weekDaysContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDay: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  weekDayText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    fontFamily: 'Poppins_600SemiBold',
    textTransform: 'uppercase',
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayContainer: {
    width: width / 7 - 8,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 2,
    borderRadius: 8,
    position: 'relative',
  },
  dayText: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Poppins_400Regular',
  },
  otherMonthDay: {
    opacity: 0.3,
  },
  otherMonthText: {
    color: '#999',
  },
  selectedDay: {
    backgroundColor: '#a8862fff',
    borderRadius: 8,
  },
  selectedDayText: {
    color: '#ffffff',
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
  },
  todayDay: {
    backgroundColor: '#f5f5f5',
    borderWidth: 2,
    borderColor: '#a8862fff',
  },
  todayText: {
    color: '#a8862fff',
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
  },
  disabledDay: {
    opacity: 0.3,
  },
  disabledText: {
    color: '#ccc',
  },
  markedDot: {
    position: 'absolute',
    bottom: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#a8862fff',
  },
});

export default styles;

