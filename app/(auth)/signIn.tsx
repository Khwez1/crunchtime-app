import Ionicons from '@expo/vector-icons/Ionicons';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Image,
  Text,
  TextInput,
  ScrollView,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useGlobalContext } from '~/providers/GlobalProvider';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn } = useGlobalContext();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await signIn(email, password);
      Alert.alert('Success', 'Signed in successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to sign in.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View className="my-6 w-full justify-center px-4">
          <View className="w-full items-center justify-center px-4">
            <Image source={require('assets/header.png')} className="mt-5" resizeMode="contain" />
          </View>
          <Text className="mt-7 text-center text-5xl font-bold text-black">Sign In</Text>
          <Text className="mt-2 text-center text-xl">
            Welcome to Crunchtime halaal food delivery. Login to Start
          </Text>

          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            className="mt-7 rounded-lg border border-gray-300 p-4"
            keyboardType="email-address"
          />

          <View className="relative mt-7">
            <TextInput
              className="rounded-lg border border-gray-300 p-4 pr-12"
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              onPress={togglePasswordVisibility}
              className="absolute bottom-0 right-3 top-0 justify-center">
              <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="black" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className="mt-7 w-full rounded-xl bg-red-600 p-4 font-semibold text-black"
            onPress={handleSubmit}
            disabled={isSubmitting}>
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-center text-white">Sign In</Text>
            )}
          </TouchableOpacity>

          <View className="flex-row justify-center gap-2 pt-5">
            <Text className="text-lg">Don't have an account?</Text>
            <Link href="/signUp" className="text-lg font-bold text-red-600">
              Sign Up
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
