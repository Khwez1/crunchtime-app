import React, { useState, useRef } from 'react';
import { View, TextInput } from 'react-native';

const OtpInput = ({ setOtp }) => {
  const [otp, setLocalOtp] = useState(new Array(6).fill('')); // Local state for each OTP digit
  const inputs = useRef([]); // Reference to input fields

  const handleChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setLocalOtp(newOtp);
    setOtp(newOtp.join('')); // Update the OTP value in the parent component

    // Automatically move to the next input if a digit is entered
    if (text && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && index > 0 && !otp[index]) {
      inputs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const pastedText = e.nativeEvent.text;
    if (pastedText.length === 6) {
      const newOtp = pastedText.split('');
      setLocalOtp(newOtp);
      setOtp(pastedText);
      newOtp.forEach((char, index) => {
        if (inputs.current[index]) {
          inputs.current[index].focus();
        }
      });
    }
  };

  return (
    <View className="my-5 flex flex-row items-center justify-between px-5">
      {otp.map((_, index) => (
        <TextInput
          key={index}
          value={otp[index]}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          onPaste={handlePaste}
          className="h-12 w-10 rounded-lg border-2 border-red-500 text-center text-xl"
          keyboardType="numeric"
          maxLength={1}
          ref={(ref) => (inputs.current[index] = ref)}
        />
      ))}
    </View>
  );
};

export default OtpInput;
