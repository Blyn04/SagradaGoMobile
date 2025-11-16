import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/API';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    loadUserFromStorage();
  }, []);

  const loadUserFromStorage = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        
        if (!userData.profilePicture && userData.gender) {
          const gender = userData.gender.toLowerCase();

          if (gender === 'female') {
            userData.profilePicture = 'female-avatar';

          } else if (gender === 'male') {
            userData.profilePicture = 'male-avatar';
          }
          
          await saveUserToStorage(userData);
        }
        
        setUser(userData);
        setIsAuthenticated(true);
      }

    } catch (error) {
      console.error('Error loading user from storage:', error);

    } finally {
      setLoading(false);
    }
  };

  const saveUserToStorage = async (userData) => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(userData));

    } catch (error) {
      console.error('Error saving user to storage:', error);
      throw error;
    }
  };

  const removeUserFromStorage = async () => {
    try {
      await AsyncStorage.removeItem('user');

    } catch (error) {
      console.error('Error removing user from storage:', error);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const userData = data.user;

        if (!userData.profilePicture && userData.gender) {
          const gender = userData.gender.toLowerCase();

          if (gender === 'female') {
            userData.profilePicture = 'female-avatar';

          } else if (gender === 'male') {
            userData.profilePicture = 'male-avatar';
          }
        }
        
        await saveUserToStorage(userData);
        setUser(userData);
        setIsAuthenticated(true);
        return { success: true, user: userData, message: data.message };

      } else {
        return { success: false, message: data.message || 'Invalid email or password' };
      }

    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Network error. Please check your connection and try again.' };
      
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    try {
      setLoading(true);
      const { 
        first_name, 
        middle_name, 
        last_name, 
        gender, 
        contact_number, 
        civil_status, 
        birthday, 
        email, 
        password,
        uid 
      } = userData;

      const signUpData = {
        first_name: first_name.trim(),
        middle_name: middle_name ? middle_name.trim() : '',
        last_name: last_name.trim(),
        gender: gender.trim(),
        contact_number: contact_number.trim(),
        civil_status: civil_status ? civil_status.trim() : '',
        birthday: birthday.trim(),
        email: email.trim(),
        password: password,
        uid: uid || generateUID(),
      };

      const response = await fetch(`${API_BASE_URL}/createUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signUpData),
      });

      const data = await response.json();

      if (response.ok) {
        const newUserData = {
          uid: data.newUser.uid,
          email: data.newUser.email,
          first_name: data.newUser.first_name,
          middle_name: data.newUser.middle_name,
          last_name: data.newUser.last_name,
          gender: data.newUser.gender,
          contact_number: data.newUser.contact_number,
          civil_status: data.newUser.civil_status,
          birthday: data.newUser.birthday,
          is_admin: data.newUser.is_admin || false,
        };

        if (!newUserData.profilePicture && newUserData.gender) {
          const gender = newUserData.gender.toLowerCase();

          if (gender === 'female') {
            newUserData.profilePicture = 'female-avatar';

          } else if (gender === 'male') {
            newUserData.profilePicture = 'male-avatar';
          }
        }

        await saveUserToStorage(newUserData);
        setUser(newUserData);
        setIsAuthenticated(true);
        return { success: true, user: newUserData, message: data.message };

      } else {
        return { success: false, message: data.message || 'Failed to create account. Please try again.' };
      }

    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, message: 'Network error. Please check your connection and try again.' };

    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await removeUserFromStorage();
      setUser(null);
      setIsAuthenticated(false);

    } catch (error) {
      console.error('Logout error:', error);

    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (updatedUserData) => {
    try {
      setLoading(true);
      
      if (!user || !user.uid) {
        return { success: false, message: 'User not found. Please login again.' };
      }

      const response = await fetch(`${API_BASE_URL}/updateUser`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: user.uid,
          ...updatedUserData,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const updatedUser = data.user;

        if (!updatedUser.profilePicture && updatedUser.gender) {
          const gender = updatedUser.gender.toLowerCase();

          if (gender === 'female') {
            updatedUser.profilePicture = 'female-avatar';

          } else if (gender === 'male') {
            updatedUser.profilePicture = 'male-avatar';
          }
        }
        
        await saveUserToStorage(updatedUser);
        setUser(updatedUser);
        return { success: true, user: updatedUser, message: data.message };

      } else {
        return { success: false, message: data.message || 'Failed to update profile. Please try again.' };
      }

    } catch (error) {
      console.error('Update user error:', error);
      return { success: false, message: 'Network error. Please check your connection and try again.' };

    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetails = async (uid) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/findUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uid }),
      });

      const data = await response.json();

      if (response.ok) {
        const userData = data.user;

        if (!userData.profilePicture && userData.gender) {
          const gender = userData.gender.toLowerCase();

          if (gender === 'female') {
            userData.profilePicture = 'female-avatar';
            
          } else if (gender === 'male') {
            userData.profilePicture = 'male-avatar';
          }
        }
        
        await saveUserToStorage(userData);
        setUser(userData);
        return { success: true, user: userData };

      } else {
        return { success: false, message: data.message || 'User not found.' };
      }

    } catch (error) {
      console.error('Fetch user error:', error);
      return { success: false, message: 'Network error. Please check your connection and try again.' };

    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/forgotPassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, message: data.message };

      } else {
        return { success: false, message: data.message || 'Something went wrong. Please try again.' };
      }

    } catch (error) {
      console.error('Forgot password error:', error);
      return { success: false, message: 'Network error. Please check your connection and try again.' };
      
    } finally {
      setLoading(false);
    }
  };

  const generateUID = () => {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      isAuthenticated, 
      login, 
      signup, 
      logout, 
      updateUser, 
      fetchUserDetails, 
      forgotPassword 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

