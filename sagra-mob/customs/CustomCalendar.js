import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import styles from '../styles/CalendarStyle';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CALENDAR_WIDTH = SCREEN_WIDTH - 40;

dayjs.extend(isoWeek);

export default function CustomCalendar({
  selectedDate = null,
  onDateSelect = () => { },
  minDate = null,
  maxDate = null,
  markedDates = [],
  showNavigation = true,
  initialDate = dayjs(),
  isPriestView = false,
}) {
  const getInitialMonth = () => {
    if (selectedDate) {
      const selected = dayjs(selectedDate);
      if (selected.isValid()) return selected.startOf('month');
    }
    const initial = dayjs(initialDate);
    return initial.isValid() ? initial.startOf('month') : dayjs().startOf('month');
  };

  const [currentMonth, setCurrentMonth] = useState(getInitialMonth());

  useEffect(() => {
    if (selectedDate) {
      const selected = dayjs(selectedDate);
      if (selected.isValid()) {
        const selectedMonth = selected.startOf('month');
        setCurrentMonth(prevMonth => {
          const prev = dayjs(prevMonth);
          if (!selectedMonth.isSame(prev, 'month')) {
            return selectedMonth;
          }
          return prevMonth;
        });
      }
    }
  }, [selectedDate]);

  const calendarWeeks = useMemo(() => {
    const monthStart = dayjs(currentMonth).startOf('month');
    const monthEnd = monthStart.endOf('month');

    const firstDayWeekday = monthStart.isoWeekday();

    const daysToSubtract = firstDayWeekday - 1;
    const startDate = monthStart.subtract(daysToSubtract, 'day');

    const weeks = [];
    for (let week = 0; week < 6; week++) {
      const weekDays = [];

      for (let day = 0; day < 7; day++) {
        const date = startDate.add(week * 7 + day, 'day');
        weekDays.push(date.clone());
      }
      weeks.push(weekDays);
    }

    return {
      monthStart,
      monthEnd,
      weeks,
    };
  }, [currentMonth]);

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const goToPreviousMonth = () => {
    setCurrentMonth(prev => dayjs(prev).subtract(1, 'month').startOf('month'));
  };

  const goToNextMonth = () => {
    setCurrentMonth(prev => dayjs(prev).add(1, 'month').startOf('month'));
  };

  const goToToday = () => {
    setCurrentMonth(dayjs().startOf('month'));
  };

  const isDateDisabled = (date) => {
    if (minDate && date.isBefore(dayjs(minDate), 'day')) return true;
    if (maxDate && date.isAfter(dayjs(maxDate), 'day')) return true;
    return false;
  };

  const eventsForDate = (date) => {
    if (!markedDates || markedDates.length === 0) return [];
    return markedDates.filter((event) => {
      if (!event) return false;
      const eventDate = dayjs(event.date || event);
      return eventDate.isValid() && eventDate.isSame(date, 'day');
    });
  };

  const isDateSelected = (date) => {
    if (!selectedDate) return false;
    const selected = dayjs(selectedDate);
    return selected.isValid() && selected.isSame(date, 'day');
  };

  const isCurrentMonth = (date) => {
    return date.isSame(calendarWeeks.monthStart, 'month');
  };

  const isToday = (date) => {
    return date.isSame(dayjs(), 'day');
  };

  const handleDatePress = (date) => {
    if (!isDateDisabled(date)) {
      onDateSelect(date.toDate());
    }
  };

  const renderDay = (date) => {
    const disabled = isDateDisabled(date);
    const selected = isDateSelected(date);
    const currentMonthDay = isCurrentMonth(date);
    const today = isToday(date);
    const dayEvents = eventsForDate(date);

    return (
      <TouchableOpacity
        key={date.format('YYYY-MM-DD')}
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

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 2 }}>
          {dayEvents.map((event, idx) => {
            let backgroundColor;

            if (isPriestView) {
              const now = dayjs();
              let bookingDateTime;
              
              if (event.date) {
                const bookingDate = dayjs(event.date);
                
                if (event.time) {
                  const timeObj = dayjs(event.time);
                  if (timeObj.isValid()) {
                    bookingDateTime = bookingDate.hour(timeObj.hour()).minute(timeObj.minute()).second(0);
                 
                  } else {
                    const timeStr = event.time.toString();
                    const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})/);
                    if (timeMatch) {
                      let hours = parseInt(timeMatch[1]);
                      const minutes = parseInt(timeMatch[2]);
                      
                      if (timeStr.toUpperCase().includes('PM') && hours !== 12) {
                        hours += 12;
                      
                      } else if (timeStr.toUpperCase().includes('AM') && hours === 12) {
                        hours = 0;
                      }
                      
                      bookingDateTime = bookingDate.hour(hours).minute(minutes).second(0);
                   
                    } else {
                      bookingDateTime = bookingDate.endOf('day');
                    }
                  }

                } else {
                  bookingDateTime = bookingDate.endOf('day');
                }

                if (bookingDateTime.isBefore(now)) {
                  backgroundColor = '#f5222d'; 

                } else {
                  backgroundColor = '#52c41a';
                }

              } else {
                backgroundColor = '#d9d9d9';
              }

            } else {
              if ((event.status || '').toLowerCase() === 'confirmed') {
                backgroundColor = '#52c41a';
                
              } else {
                switch (event.type) {
                  case 'Wedding': backgroundColor = '#52c41a'; break;
                  case 'Baptism': backgroundColor = '#1890ff'; break;
                  case 'Burial': backgroundColor = '#f5222d'; break;
                  case 'First Communion':
                  case 'Communion': backgroundColor = '#faad14'; break;
                  case 'Confirmation': backgroundColor = '#1890ff'; break;
                  case 'Anointing of the Sick':
                  case 'Anointing': backgroundColor = '#faad14'; break;
                  case 'Confession': backgroundColor = '#722ed1'; break;
                  default: backgroundColor = '#d9d9d9'; break;
                }
              }
            }

            return (
              <TouchableOpacity
                key={idx}
                style={[styles.eventBadge, { backgroundColor: 'transparent' }]}
                onPress={() => onDateSelect(event)}
                activeOpacity={0.7}
              >
                <View style={[styles.dot, { backgroundColor }]} />
              </TouchableOpacity>
            );
          })}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.calendarContainer}>
      {showNavigation && (
        <View style={styles.header}>
          <TouchableOpacity onPress={goToPreviousMonth} style={styles.navButton} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={24} color="#a8862fff" />
          </TouchableOpacity>

          <TouchableOpacity onPress={goToToday} style={styles.monthYearContainer} activeOpacity={0.7}>
            <Text style={styles.monthYearText}>{calendarWeeks.monthStart.format('MMMM YYYY')}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={goToNextMonth} style={styles.navButton} activeOpacity={0.7}>
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

      <View style={{ width: '100%', overflow: 'hidden' }}>
        {calendarWeeks.weeks.map((week, weekIndex) => (
          <View
            key={weekIndex}
            style={{
              flexDirection: 'row',
              width: CALENDAR_WIDTH,
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
            }}
          >
            {week.map((date) => renderDay(date))}
          </View>
        ))}
      </View>
    </View>
  );
}
