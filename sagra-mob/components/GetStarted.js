import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Alert,
    Platform,
    Image
} from 'react-native';
import styles from '../styles/GetStartedStyle';

export default function GetStartedScreen({ onLoginPress, onSignUpPress }) {
    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/sagrada.png')}
                style={{ width: 150, height: 150, marginBottom: 50 }}
                resizeMode="contain"
            />
            <Text style={styles.title}>SagradaGo</Text>
            <Text style={styles.subtitle}>Your digital guide to connection, events, and the church.</Text>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.yellowButton} onPress={onLoginPress}>
                    <Text style={styles.yellowButtonText}>Log In with Account</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.darkButton} onPress={onSignUpPress}>
                    <Text style={styles.darkButtonText}>Sign Up</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
}

