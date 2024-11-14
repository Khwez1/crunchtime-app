import React, { useState } from 'react';
import { View, Text, Alert, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import OtpInput from '~/components/OTPInput';
import { useGlobalContext } from '~/providers/GlobalProvider';

const MFAScreen = () => {
  const { completeMfa } = useGlobalContext();
  const [otp, setOtp] = useState('');

  const handleCompleteMFA = async () => {
    try {
      await completeMfa(otp); // Calls completeMfa and navigates on success
    } catch (error) {
      Alert.alert('MFA Failed', error.message || 'Failed to verify OTP. Please try again.');
    }
  };

  return (
    <SafeAreaView className="h-full">
      <ScrollView contentContainerStyle={{ height: '100%' }}>
        <View className="my-6 w-full justify-center px-4">
          <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 20 }}>
            Verify Account
          </Text>
          <Text style={{ textAlign: 'center', marginBottom: 20 }}>
            Please enter the OTP sent to your phone to verify your account.
          </Text>
          <OtpInput setOtp={setOtp} />
          <TouchableOpacity
            onPress={handleCompleteMFA}
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

export default MFAScreen;
