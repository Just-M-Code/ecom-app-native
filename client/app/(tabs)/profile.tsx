import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { dummyUser } from "@/assets/assets";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import { ScrollView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, PROFILE_MENU } from "@/constants";
import { Image } from "react-native";
import { useClerk } from "@clerk/expo";
import { Alert } from "react-native";
import LogOut from "@/components/LogOut";

export default function Profile() {
  const { user } = useClerk();
  const router = useRouter();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#F9F9FF" }}
      edges={["top"]}
    >
      <Header title="profile" />
      <ScrollView
        style={{ flex: 1, paddingHorizontal: 16 }}
        contentContainerStyle={
          !user
            ? { flex: 1, justifyContent: "center", alignItems: "center" }
            : { paddingTop: 16 }
        }
      >
        {!user ? (
          // Guest User Screen
          <View style={{ alignItems: "center", width: "100%" }}>
            <View style={styles.guestIcon}>
              <Ionicons name="person" size={40} color={COLORS.secondary} />
            </View>
            <Text
              style={{
                color: COLORS.primary,
                fontWeight: 700,
                fontSize: 20,
                marginBottom: 8,
              }}
            >
              Guest User
            </Text>
            <Text style={styles.loginText}>
              Log in to vie your profile, orders, and addresses.
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/sign-in")}
              style={styles.loginSignin}
            >
              <Text style={{ color: "white", fontWeight: 700, fontSize: 18 }}>
                Login / Sign up
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Profile Info */}
            <View style={{ alignItems: "center", marginBottom: 32 }}>
              <View style={{ marginBottom: 12 }}>
                <Image
                  source={{ uri: user.imageUrl }}
                  style={styles.userImage}
                />
              </View>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: COLORS.primary,
                }}
              >
                {user.firstName + " " + user.lastName}
              </Text>
              <Text style={{ color: COLORS.secondary, fontSize: 14 }}>
                {user.emailAddresses[0].emailAddress}
              </Text>

              {/* Admin Panel Button if user is Admin */}
              {user.publicMetadata?.role === "admin" && (
                <TouchableOpacity
                  onPress={() => router.push("/admin")}
                  style={styles.adminPanelButton}
                >
                  <Text style={{ color: "white", fontWeight: 700 }}>
                    Admin Panel
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Menu */}
            <View style={styles.menuItemsBg}>
              {PROFILE_MENU.map((item, index) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.profileMenu,
                    index !== PROFILE_MENU.length - 1
                      ? styles.profileMenuBorder
                      : "",
                  ]}
                  onPress={() => router.push(item.route as any)}
                >
                  <View style={styles.menuItemIcons}>
                    <Ionicons
                      name={item.icon as any}
                      size={20}
                      color={COLORS.primary}
                    />
                  </View>
                  <Text
                    style={{ flex: 1, color: COLORS.primary, fontWeight: 500 }}
                  >
                    {item.title}
                  </Text>

                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={COLORS.secondary}
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* Logout Button */}

            <LogOut />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  guestIcon: {
    width: 96,
    height: 96,
    borderRadius: 9999,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  loginText: {
    color: COLORS.secondary,
    fontSize: 16,
    marginBottom: 32,
    textAlign: "center",
    width: "75%",
    paddingHorizontal: 16,
  },
  loginSignin: {
    backgroundColor: COLORS.primary,
    width: "60%",
    paddingVertical: 12,
    borderRadius: 9999,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,

    // Android
    elevation: 2,
  },
  userImage: {
    width: 80,
    height: 80,
    borderWidth: 2,
    borderRadius: 9999,
    borderColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,

    // Android
    elevation: 1,
  },
  adminPanelButton: {
    marginTop: 16,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 9999,
  },
  menuItemIcons: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.surface,
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  menuItemsBg: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(243, 244, 246, 0.75)",
    padding: 8,
    marginBottom: 16,
  },
  profileMenu: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  profileMenuBorder: {
    borderBottomWidth: 1,
    borderColor: "rgba(243, 244, 246)",
  },
});
