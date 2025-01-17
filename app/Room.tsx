import FontAwesome from '@expo/vector-icons/FontAwesome';
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Permission, Role } from 'react-native-appwrite';
import { sendMessage, getMessages, deleteMessage, client } from '../lib/appwrite';
import { useGlobalContext } from '~/providers/GlobalProvider';
import { useOrderContext } from '~/providers/OrderProvider';
import { router } from 'expo-router';

export default function Room() {
  const [messages, setMessages] = useState([]);
  const [messageBody, setMessageBody] = useState('');
  const [isSubmitting, setSubmitting] = useState(false);
  const { user } = useGlobalContext();
  const { activeOrder } = useOrderContext();

  // Redirect to home page if no order is available
  useEffect(() => {
    if (!activeOrder) {
      router.push('/home'); // Change 'home' to the name of your home page
    }
  }, [activeOrder]);

  useEffect(() => {
    if (activeOrder) {
      fetchMessages();
        
      const unsubscribe = client.subscribe(
        `databases.${'669a5a3d003d47ff98c7'}.collections.${'677d5197000b1aefb3d0'}.documents`,
        (response) => {
          if (response.payload.orderId === activeOrder.$id) {
            if (response.events.includes(`databases.*.collections.*.documents.*.create`)) {
              console.log('A message was CREATED');
              setMessages((prevState) => [response.payload, ...prevState]);
            }
            if (response.events.includes(`databases.*.collections.*.documents.*.delete`)) {
              console.log('A message was DELETED');
              setMessages((messages) =>
                messages.filter((message) => message.$id !== response.payload.$id)
              );
            }
          }
        }
      );
      return () => unsubscribe();
    }
  }, [activeOrder]);

  const fetchMessages = async () => {
    try {
      const messages = await getMessages(activeOrder.$id);
      setMessages(messages);
    } catch (error) {
      Alert.alert('Failed to fetch messages:', error);
    } finally {
      console.log(messages);
    }
  };

  const handleDelete = async (message_id: string) => {
    try {
      await deleteMessage(message_id);
    } catch (error) {
      Alert.alert('Failed to delete!');
    }
  };

  const handleSubmit = async () => {
    const payload = {
      orderId: activeOrder.$id,
      userId: user.$id,
      username: user.name,
      body: messageBody,
    };

    const Permissions = [
      Permission.write(Role.user(user.$id)),
      Permission.delete(Role.user(user.$id)),
    ];

    setSubmitting(true);
    try {
      await sendMessage(payload, Permissions);
      Alert.alert('Success', 'Message sent!');
      setMessageBody('');
      fetchMessages(); // Refresh messages after sending a new one
    } catch (error) {
      Alert.alert('Error', 'Failed to send message.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="container p-4">
        <View className="room--container bg-[rgba(27,27,39,1)] p-4 rounded-b-xl border border-gray-300">
          {/* Form */}
          <View id="message--form" className="flex flex-col gap-2">
            <TextInput
              required
              className="rounded-lg border border-gray-300 p-4 text-gray-800"
              maxLength={1000}
              placeholder="Say something..."
              value={messageBody}
              onChangeText={setMessageBody}
            />
            <View className="send-btn--wrapper flex justify-end">
              <TouchableOpacity
                className="btn btn--secondary bg-red-600 rounded-lg px-4 py-2"
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-center text-white">Send</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Messages */}
          <View className="mt-4">
            {messages.map((message) => (
              <View
                key={message.$id}
                className="message--wrapper mb-4 flex flex-col gap-2 p-4 rounded-lg bg-gray-900 border border-gray-600"
              >
                {/* Header */}
                <View className="message--header flex items-center justify-between">
                  <Text className="text-white">
                    {message?.username || "Anonymous user"}
                  </Text>
                  <Text className="message-timestamp text-gray-400">
                    {new Date(message.$createdAt).toLocaleString()}
                  </Text>
                  {message.$permissions.includes(`delete("user:${user.$id}")`) && (
                    <TouchableOpacity onPress={() => handleDelete(message.$id)}>
                      <FontAwesome name="trash" size={24} color="#8db3dd" />
                    </TouchableOpacity>
                  )}
                </View>

                {/* Body */}
                <View
                  className={`message--body ${
                    message.user_id === user.$id
                      ? "message--body--owner border border-[rgba(219,26,90,1)] bg-[rgba(40,41,57,1)]"
                      : "bg-[rgba(219,26,90,1)]"
                  } p-4 rounded-xl text-gray-100`}
                >
                  <Text>{message.Body}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
