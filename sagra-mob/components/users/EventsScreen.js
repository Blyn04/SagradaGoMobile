import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../../styles/users/EventsStyle';
import CustomNavbar from '../../customs/CustomNavbar';

export default function EventsScreen({ user, onNavigate }) {

  const defaultEvents = [
    {
      id: 1,
      title: "Tree Planting Activity",
      date: "December 15, 2025",
      location: "Tagaytay City",
      image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6"
    },
    {
      id: 2,
      title: "Community Solar Installation",
      date: "January 10, 2026",
      location: "Dasmariñas, Cavite",
      image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6"
    },
    {
      id: 3,
      title: "Eco Awareness Workshop",
      date: "February 20, 2026",
      location: "Bacoor, Cavite",
      image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6"
    },
  ];

  const [search, setSearch] = useState("");

  // Filter logic
  const filteredEvents = defaultEvents.filter(e =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>

        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Hi, {user?.name || "Guest"} 👋</Text>
          <Text style={styles.title}>
            We have {defaultEvents.length} events this month!
          </Text>
        </View>

        {/* SEARCH BAR */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#777" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search events..."
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <View style={{ paddingHorizontal: 30, paddingBottom: 20 }}>
          <Text style={styles.sectiontitle}>What's coming?</Text>
          <Text style={styles.subtitle}>Upcoming events and activities.</Text>
        </View>

        {/* EVENT CARDS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ paddingHorizontal: 30, height: 450 }}
        >
          {filteredEvents.map((event) => (
            <View key={event.id} style={styles.card}>
              <Image source={{ uri: event.image }} style={styles.cardImage} />

              <View style={styles.cardContent}>
                <View>
                  <Text style={styles.cardTitle}>{event.title}</Text>
                  <Text style={styles.cardInfo}>{event.date}</Text>
                  <Text style={styles.cardInfo}>{event.location}</Text>
                </View>

                <TouchableOpacity style={styles.cardVolunteerBtn} onPress={() => onNavigate('VolunteerScreen')}
                >
                  <Ionicons name="hand-left-outline" size={20} color="#fff" />
                  <Text style={styles.cardVolunteerText}>Volunteer</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </ScrollView>

      <CustomNavbar
        currentScreen="EventsScreen"
        onNavigate={onNavigate}
      />
    </View>
  );
}
