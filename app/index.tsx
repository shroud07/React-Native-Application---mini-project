import { useAuth } from '@clerk/expo';
import { Redirect } from 'expo-router';



export default function Home() {
  const { isLoaded, isSignedIn } = useAuth()

  if (!isLoaded) {
    return null
  }

  if (isSignedIn) {
    return <Redirect href="/(root)/(tabs)" />;
  } 
  else {
    return <Redirect href="/sign-in" />;
    
  } 
}