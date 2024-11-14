import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, Alert, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import OtpInput from '~/components/OTPInput';
import { account } from '~/lib/appwrite'; // Import your configured Appwrite instance
import { useGlobalContext } from '~/providers/GlobalProvider';

const VerificationScreen = () => {
  const { user } = useGlobalContext(); // Assuming you have these in global context
  const [otp, setOtp] = useState('');
  const router = useRouter();

  const handleVerification = async () => {
    try {
      if (!otp) {
        throw new Error('Please enter the verification code.');
      }

      // The `updateVerification` method takes only the OTP/secret as a parameter
      const response = await account.updatePhoneVerification(user.$id, otp);

      Alert.alert('Verification Successful', 'Your account has been verified.');
      router.push('/one'); // Navigate to sign-in on success
    } catch (error) {
      Alert.alert('Verification Failed', error.message);
      console.log(error.message);
      console.log(otp);
    }
  };

  return (
    <SafeAreaView className="h-full">
      <ScrollView contentContainerStyle={{ height: '100%' }}>
        <View className="my-6 w-full justify-center px-4">
          <Text
            style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 20 }}>
            Verify Your Account
          </Text>
          <Text style={{ textAlign: 'center', marginBottom: 20 }}>
            Please enter the verification code sent to your email or phone to verify your account.
          </Text>
          <OtpInput setOtp={setOtp} />
          <TouchableOpacity
            onPress={handleVerification}
            style={{ backgroundColor: 'red', padding: 15, borderRadius: 5, marginTop: 20 }}>
            <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>Confirm</Text>
          </TouchableOpacity>
          <Text style={{ textAlign: 'center', marginTop: 20 }}>
            Didn't receive the code?{' '}
            <Text style={{ color: 'red', fontWeight: 'bold' }}>Request again</Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default VerificationScreen;
