import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

const SendMessage = ({ navigation }) => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await fetch('/api/send_message/');
      if (response.ok) {
        const data = await response.json();
        setSubjects(data.subjects);
        if (data.subjects.length > 0) {
          setForm(prev => ({ ...prev, subject: data.subjects[0] }));
        }
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const handleSend = async () => {
    if (!form.name || !form.email || !form.message) {
      if (Platform.OS === 'web') alert('Please fill in all fields.');
      else Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      const response = await fetch('/api/send_message/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        const data = await response.json();
        if (Platform.OS === 'web') {
          window.location.href = data.redirect_url || '/message_sent';
        } else {
          Alert.alert('Success', 'Message sent successfully!');
          navigation.navigate('Home');
        }
      } else {
        const errorData = await response.json();
        if (Platform.OS === 'web') alert('Failed to send message: ' + (errorData.detail || 'Unknown error'));
        else Alert.alert('Error', 'Failed to send message.');
      }
    } catch (error) {
      console.error(error);
      if (Platform.OS === 'web') alert('An error occurred.');
      else Alert.alert('Error', 'An error occurred.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#831843" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Send Message</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.formCard}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Your Name"
            value={form.name}
            onChangeText={(text) => setForm({ ...form, name: text })}
          />

          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Your Email"
            keyboardType="email-address"
            value={form.email}
            onChangeText={(text) => setForm({ ...form, email: text })}
          />

          <Text style={styles.label}>Subject</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={form.subject}
              onValueChange={(itemValue) => setForm({ ...form, subject: itemValue })}
              style={styles.picker}
            >
              {subjects.map((subj, index) => (
                <Picker.Item key={index} label={subj} value={subj} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Message</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Your Message"
            multiline
            numberOfLines={5}
            value={form.message}
            onChangeText={(text) => setForm({ ...form, message: text })}
          />

          <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
            <Text style={styles.sendBtnText}>Send to PinkCycle</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff1f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#fce7f3',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#831843',
  },
  container: {
    padding: 20,
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#db2777',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#831843',
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#fce7f3',
    padding: 15,
    borderRadius: 12,
    fontSize: 16,
    color: '#831843',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#fce7f3',
    borderRadius: 12,
    marginBottom: 10,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  sendBtn: {
    backgroundColor: '#db2777',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  sendBtnText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
  },
});

export default SendMessage;
