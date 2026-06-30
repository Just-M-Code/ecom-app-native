import { Redirect, Stack } from "expo-router";
import { useAuth } from "@clerk/expo";

export default function AuthRoutesLayout() {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return <Redirect href={"/"} />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false, // ← This removes the unwanted "Sign in" header
        animation: "slide_from_right",
      }}
    />
  );
}
