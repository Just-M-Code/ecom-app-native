import { CartProvider } from "@/context/CartContex";
import { WishListProvider } from "@/context/WishlistContext";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import { ClerkProvider } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
        <CartProvider>
          <WishListProvider>
            <Stack screenOptions={{ headerShown: false }} />
            <Toast />
          </WishListProvider>
        </CartProvider>
      </ClerkProvider>
    </GestureHandlerRootView>
  );
}
