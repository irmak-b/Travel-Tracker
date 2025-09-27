import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { initializeAuth ,getReactNativePersistence} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDYCq8yMCPCJgXoOOi0wfRb0Mye7_WBTfw",
  projectId: "travel-tracker-ed328",
  storageBucket: "travel-tracker-ed328.firebasestorage.app",
  messagingSenderId: "813514892839",
  appId: "1:813514892839:android:3c9b30c15c30ac4abad002"
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);

export { app, auth, db };