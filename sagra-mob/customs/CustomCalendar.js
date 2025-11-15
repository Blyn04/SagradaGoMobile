import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import styles from '../styles/CalendarStyle';

export default function CustomCalendar({
  selectedDate = null,
  onDateSelect = () => {},
  minDate = null,
  maxDate = null,
  markedDates = [],
  showNavigation = true,
  initialDate = dayjs(),
}) {
  const [currentMonth, setCurrentMonth] = useState(initialDate);

  const monthStart = dayjs(currentMonth).startOf('month');
  const monthEnd = dayjs(currentMonth).endOf('month');
  const startDate = monthStart.startOf('week');
  const endDate = monthEnd.endOf('week');
  const daysInMonth = [];
  let day = startDate;

  while (day.isBefore(endDate) || day.isSame(endDate, 'day')) {
    daysInMonth.push(day);
    day = day.add(1, 'day');
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const goToPreviousMonth = () => {
    setCurrentMonth(dayjs(currentMonth).subtract(1, 'month'));
  };

  const goToNextMonth = () => {
    setCurrentMonth(dayjs(currentMonth).add(1, 'month'));
  };

  const goToToday = () => {
    setCurrentMonth(dayjs());
  };

  const isDateDisabled = (date) => {
    if (minDate && dayjs(date).isBefore(dayjs(minDate), 'day')) {
      return true;
    }

    if (maxDate && dayjs(date).isAfter(dayjs(maxDate), 'day')) {
      return true;
    }

    return false;
  };

  const isDateMarked = (date) => {
    return markedDates.some((markedDate) =>
      dayjs(markedDate).isSame(date, 'day')
    );
  };

  const isDateSelected = (date) => {
    return selectedDate && dayjs(selectedDate).isSame(date, 'day');
  };

  const isCurrentMonth = (date) => {
    return dayjs(date).isSame(currentMonth, 'month');
  };

  const isToday = (date) => {
    return dayjs(date).isSame(dayjs(), 'day');
  };

  const handleDatePress = (date) => {
    if (!isDateDisabled(date)) {
      onDateSelect(date.toDate());
    }
  };

  const renderDay = (date, index) => {
    const disabled = isDateDisabled(date);
    const marked = isDateMarked(date);
    const selected = isDateSelected(date);
    const currentMonthDay = isCurrentMonth(date);
    const today = isToday(date);

    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.dayContainer,
          !currentMonthDay && styles.otherMonthDay,
          selected && styles.selectedDay,
          today && !selected && styles.todayDay,
          disabled && styles.disabledDay,
        ]}
        onPress={() => handleDatePress(date)}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.dayText,
            !currentMonthDay && styles.otherMonthText,
            selected && styles.selectedDayText,
            today && !selected && styles.todayText,
            disabled && styles.disabledText,
          ]}
        >
          {date.format('D')}
        </Text>
        {marked && !selected && (
          <View style={styles.markedDot} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.calendarContainer}>
      {showNavigation && (
        <View style={styles.header}>
          <TouchableOpacity
            onPress={goToPreviousMonth}
            style={styles.navButton}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={24} color="#a8862fff" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={goToToday}
            style={styles.monthYearContainer}
            activeOpacity={0.7}
          >
            <Text style={styles.monthYearText}>
              {currentMonth.format('MMMM YYYY')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={goToNextMonth}
            style={styles.navButton}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-forward" size={24} color="#a8862fff" />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.weekDaysContainer}>
        {weekDays.map((day, index) => (
          <View key={index} style={styles.weekDay}>
            <Text style={styles.weekDayText}>{day}</Text>
          </View>
        ))}
      </View>

      <View style={styles.daysContainer}>
        {daysInMonth.map((date, index) => renderDay(date, index))}
      </View>
    </View>
  );
}

