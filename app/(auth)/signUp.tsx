import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Image,
  Text,
  ScrollView,
  Alert,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import { useGlobalContext } from '~/providers/GlobalProvider';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [phone, setphone] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isSubmitting, setSubmitting] = useState(false);
  const { Register } = useGlobalContext();

  const handleSignUp = async () => {
    setSubmitting(true);
    try {
      await Register(email, password, username, phone);
      Alert.alert('Success', 'Account created successfully!');
      router.push('/verify');
    } catch (error) {
      Alert.alert('Error', 'Failed to create account.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View className="my-6 w-full justify-center px-4">
          <View className="mt-5 w-full items-center justify-center px-4">
            <Image source={require('assets/header.png')} className="mt-5" resizeMode="contain" />
          </View>
          <Text className="mt-5 text-center text-5xl font-bold text-black">Create Account</Text>
          <Text className="mt-3 text-center text-xl">
            {' '}
            Welcome to Crunchtime halaal food delivery. Signup to create a free delivery. Signup to
            create an account to start delivering
          </Text>

          <TextInput
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            className="mt-10 rounded-lg border border-gray-300 p-4"
          />

          <TextInput
            placeholder="Phone"
            value={phone}
            onChangeText={setphone}
            className="mt-7 rounded-lg border border-gray-300 p-4"
          />

          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            className="mt-7 rounded-lg border border-gray-300 p-4"
            keyboardType="email-address"
          />

          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            className="mt-7 rounded-lg border border-gray-300 p-4"
            secureTextEntry
          />

          <TouchableOpacity
            className="mt-7 w-full rounded-xl bg-red-500 p-4 font-semibold text-black"
            onPress={handleSignUp}
            disabled={isSubmitting}>
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-center text-white">Sign Up</Text>
            )}
          </TouchableOpacity>

          <View className="flex-row justify-center gap-2 pt-5">
            <Text className="text-lg">Already have an account?</Text>
            <Link href="/signIn" className="text-lg font-bold text-red-500">
              Sign in
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
