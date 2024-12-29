import { FontAwesome5 } from "@expo/vector-icons";
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { View, Pressable, TouchableOpacity, Image, Text } from "react-native";
import { useGlobalContext } from "~/providers/GlobalProvider";

export default function CustomDrawerContent(props: any) {
    const { signOut, profile, user, fetchUserProfile } = useGlobalContext();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const loadProfile = async () => {
        if (user && user.$id) {
          try {
            setLoading(true);
            await fetchUserProfile(user.$id);
          } finally {
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      };
      loadProfile();
    }, [user]);

    if (loading) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Loading...</Text>
        </View>
      );
    }

    return (
      <View style={{ flex: 1, backgroundColor: '#ffc700' }}>
        <DrawerContentScrollView {...props} scrollEnabled={false}>
          {/* user information */}
          <View>
            <Pressable onPress={() => router.push('/profile')}>
              <Image
                source={{
                  uri: profile?.pfp
                    ? `${profile.pfp}?project=66bb50ba003a365f917d&mode=admin`
                    : `https://cloud.appwrite.io/v1/avatars/initials?name=${encodeURIComponent(profile?.username)}&project=66694f2c003d7561352e`,
                }}
                style={{ width: 96, height: 96, borderRadius: 48, marginBottom: 16, marginLeft: 10 }}
              />
            </Pressable>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16, marginLeft: 10 }}>
                👋 Welcome! {profile?.username}
            </Text>
            <Text style={{ fontSize: 20, fontWeight: 'semi-bold', marginBottom: 16, marginLeft: 10 }}>
                {profile?.email}
            </Text>
          </View>
          {/* Drawer navigation items */}
          <DrawerItemList {...props} style={{ marginTop: 40 }} />
        </DrawerContentScrollView>
        {/* Footer section with social media icons and logout button */}
        <View className='p-[20px]'>
          <Text className='text-white text-[28px] mb-[10px]'>Follow Us</Text>
          <View className='flex-row justify-between w-[100px] mb-[20px]'>
            <FontAwesome5 name="facebook" size={24} color="white" />
            <FontAwesome5 name="instagram" size={24} color="white" />
          </View>
          <TouchableOpacity className='bg-white py-[10px] px-[20px] rounded-[5px] mb-[10px] items-center' onPress={() => signOut()}>
            <Text className='font-bold text-[#ffc700]'>Log Out</Text>
          </TouchableOpacity>
          <Text className='text-white mt-[10px] text-[20px]'>Terms and Conditions Apply</Text>
        </View>
      </View>
    );
};