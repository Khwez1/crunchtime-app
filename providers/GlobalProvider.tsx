import { router } from 'expo-router';
import { createContext, useContext, useEffect, useState } from 'react';
import { account, ID, databases, functions, fetchProfile, updateProfile } from '../lib/appwrite';

const GlobalContext = createContext({});
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [challengeId, setChallengeId] = useState(null);
  const [profile, setProfile] = useState(null);

  const fetchUserProfile = async (userId) => {
    if (!userId) {
      throw new Error('Invalid userId provided to fetchUserProfile');
    }
    try {
      const fetchedProfile = await fetchProfile(userId);
      setProfile(fetchedProfile);
      return fetchedProfile; // Return fetched profile for direct usage
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      throw error;
    }
  };

  //Delete user
  async function deleteUser(userId) {
    try {
      const result = await functions.createExecution(
        '67628ba43c6b1d58bb38',
        JSON.stringify({ userId })
      );
      console.log('Function response:', result);
      const response = await databases.deleteDocument(
        '669a5a3d003d47ff98c7', // Database ID
        '669a5a7f000cea3cde9d', // Collection ID, users
        userId
      );
      signOut();
    } catch (error) {
      console.error('Error executing function:', error);
    }
  }

  // Register
  async function Register(email: string, password: string, username: string, phone: string) {
    try {
      // Step 1: Create the user account
      await account.create(ID.unique(), email, password, username);
      console.log('Account created!');

      // Step 2: Sign in to get session and set user
      await account.createEmailPasswordSession(email, password);
      const user = await account.get(); // Fetch user details after creating a session
      setUser(user);

      // Step 3: Update the user's phone number
      await account.updatePhone(phone, password);
      await account.createPhoneVerification();

      // Step 4: Create a user document in the database
      await databases.createDocument(
        '669a5a3d003d47ff98c7', // Database ID
        '669a5a7f000cea3cde9d', // Collection ID (Users)
        ID.unique(),
        {
          userId: user.$id,
          username,
          phone,
          email
        }
      );
      console.log('Document created with user details!');

      // Consider the account "MFA-enabled" based on phone verification
      console.log('Please verify your phone number to continue.');
    } catch (error) {
      console.error('Failed to create account:', error);
      throw error;
    }
  }

  const signIn = async (email, password) => {
    try {
      // Step 1: Attempt to sign in with email and password
      await account.createEmailPasswordSession(email, password);
  
      // Step 2: Check if the user has MFA factors enabled
      const factors = await account.listMfaFactors();
      if (factors.totp || factors.email || factors.phone) {
        // Throw an error if MFA is required
        throw { type: 'user_more_factors_required' };
      }
  
      // If no MFA is needed, log the user in directly
      const user = await account.get();
      setUser(user);
      setIsLogged(true);
      router.push('/home'); // Directly navigate to home if no MFA is needed
  
    } catch (error) {
      if (error.type === 'user_more_factors_required') {
        try {
          // Step 3: If MFA is required, create an MFA challenge using phone
          const challenge = await account.createMfaChallenge('phone');
          setChallengeId(challenge.$id); // Store the challenge ID
          router.push('/mfa'); // Navigate to the MFA screen
        } catch (mfaError) {
          console.error('Failed to create MFA challenge:', mfaError);
          Alert.alert('MFA Error', 'Unable to create MFA challenge. Please try again.');
        }
      } else {
        console.error('Failed to sign in:', error);
        Alert.alert('Sign-In Error', 'Failed to sign in. Please check your credentials.');
      }
    }
  };

  const signOut = async () => {
    await account.deleteSession('current');
    setUser(null);
    setIsLogged(false);
    router.push('/');
  };

  const completeMfa = async (otp) => {
    try {
      // Complete MFA challenge with the OTP
      await account.updateMfaChallenge(challengeId, otp);
      // Fetch user details and set them in context after successful OTP verification
      const user = await account.get();
      setUser(user);
      setIsLogged(true); // Now set the user as logged in
      router.push('/home'); // Navigate to home upon successful verification
    } catch (error) {
      console.error('Failed to complete MFA challenge:', error);
      throw new Error('Failed to verify OTP. Please try again.');
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await account.get();
        if (res) {
          setIsLogged(true);
          setUser(res);
        } else {
          setIsLogged(false);
          setUser(null);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);  

  return (
    <GlobalContext.Provider
      value={{
        challengeId,
        setChallengeId,
        isLogged,
        setIsLogged,
        user,
        setUser,
        loading,
        signOut,
        signIn,
        Register,
        completeMfa,
        deleteUser,
        fetchUserProfile,
        setProfile,
        profile
      }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;