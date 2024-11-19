import { Redirect, Link } from 'expo-router';
import { TouchableOpacity, ScrollView, View, Text, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalContext } from '~/providers/GlobalProvider';

export default function App() {
  const { loading, isLogged } = useGlobalContext();

  if (!loading && isLogged) return <Redirect href="/one" />;
  return (
    <SafeAreaView className="h-full">
      <ScrollView contentContainerStyle={{ height: '100%' }}>
        <View className="my-6 w-full justify-center px-4">
          <View className="w-full items-center justify-center px-4">
            <Image source={require('assets/welcome.png')} className="mt-10" />
            <View className="justify-center text-center">
              <Text className="mt-5 text-center text-5xl font-bold text-black">Welcome</Text>
              <Text className="mt-3 text-center text-lg">
                Register now and begin your CrunchTime Deliveries
              </Text>

              <View className="justify-center">
                <TouchableOpacity className="mt-7 w-full rounded-xl bg-red-500 p-4 font-semibold text-black">
                  <Link href="/signUp" className="text-center font-bold text-white">
                    Create account
                  </Link>
                </TouchableOpacity>
                <TouchableOpacity className="mt-7 w-full rounded-xl border-2 !border-red-500 p-4 font-semibold">
                  <Link href="/signIn" className="text-center font-bold text-red-500">
                    Login
                  </Link>
                </TouchableOpacity>
              </View>

              <Text className="mt-5 text-center">
                By Logging In Or Registering. You Have Agreed To{' '}
                <Text className="text-red-500">The Terms And Conditions</Text> And{' '}
                <Text className="text-red-500">Privacy Policy</Text>
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
