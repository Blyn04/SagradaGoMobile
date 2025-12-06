import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/SignUpStyle';

const CustomPicker = ({
    value,
    onValueChange,
    options,
    iconName,
    error,
    placeholder,
    style,
    disabled = false,
}) => {
    const [showModal, setShowModal] = useState(false);

    const handleSelect = (selected) => {
        onValueChange(selected);
        setShowModal(false);
    };

    return (
        <View style={[{ marginBottom: 5 }, style]}>
            <TouchableOpacity
                style={[
                    styles.inputContainer,
                    error && styles.inputContainerError,
                    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 45 },
                    disabled && { opacity: 0.6 },
                ]}
                onPress={() => {
                    if (!disabled) setShowModal(true);
                }}
                activeOpacity={disabled ? 1 : 0.7}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    {iconName && <Ionicons name={iconName} size={20} color="#999" style={styles.inputIcon} />}
                    <Text
                        style={{
                            flex: 1,
                            color: value ? '#333' : '#999',
                            fontSize: 16,
                            fontFamily: 'Poppins_500Medium',
                            textAlignVertical: 'center',
                        }}
                    >
                        {value || placeholder}
                    </Text>
                </View>
                <Ionicons name="chevron-down-outline" size={20} color="#999" />
            </TouchableOpacity>

            {error && <Text style={styles.errorText}>{error}</Text>}

            {!disabled && (
                <Modal
                    visible={showModal}
                    transparent
                    animationType="slide"
                    onRequestClose={() => setShowModal(false)}
                >
                    <TouchableOpacity
                        style={styles.modalOverlay}
                        activeOpacity={1}
                        onPressOut={() => setShowModal(false)}
                    >
                        <View style={[styles.modalContent, { maxHeight: 170 }]}>
                            <FlatList
                                data={options}
                                keyExtractor={(item) => item.value}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={{ padding: 5 }}
                                        onPress={() => handleSelect(item.value)}
                                    >
                                        <Text style={[styles.input, { marginBottom: -10, textAlign: 'center' }]}>{item.label}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    </TouchableOpacity>
                </Modal>
            )}
        </View>
    );
};

export default CustomPicker;
