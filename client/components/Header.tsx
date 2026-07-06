import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import React from "react";
import { HeaderProps } from "@/constants/types";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants";
import { useRouter } from "expo-router";
import { useCart } from "@/context/CartContex";

export default function Header({
  title,
  showBack,
  showSearch,
  showCart,
  showMenu,
  showLogo,
}: HeaderProps) {
  const router = useRouter();
  const { itemCount } = useCart();

  return (
    <View style={styles.header}>
      {/* left side */}
      <View style={styles.menulogo}>
        {showBack && (
          <TouchableOpacity style={styles.mr} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        )}

        {showMenu && (
          <TouchableOpacity style={styles.mr}>
            <Ionicons name="menu-outline" size={28} color={COLORS.primary} />
          </TouchableOpacity>
        )}

        {showLogo ? (
          <View style={styles.menuLogoPos}>
            <Image
              source={require("@/assets/logo.png")}
              style={styles.menuLogoSize}
              resizeMode="contain"
            />
          </View>
        ) : (
          title && <Text style={styles.titleNoLogo}>{title}</Text>
        )}

        {!title && !showSearch && <View style={{ flex: 1 }} />}
      </View>
      {/* right side */}
      <View style={styles.rightSide}>
        {showSearch && (
          <TouchableOpacity>
            <Ionicons name="search-outline" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        )}
        {showCart && (
          <TouchableOpacity onPress={() => router.push("/(tabs)/cart")}>
            <View style={{ position: "relative" }}>
              <Ionicons name="bag-outline" size={24} color={COLORS.primary} />
              <View style={styles.itemCounter}>
                <Text style={styles.itemCounterText}>{itemCount}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

// className = "text-white text-[10px] font-bold"
// className = "relative absolute -top-1 -right-1 bg-accent w-4 h-4 rounded full"
// className = "flex-row items-center justify-between px-4 py-3 bg-white";
// className = "text-xl font-bold text-primary text-center flex-1 mr-8"

const styles = StyleSheet.create({
  header: {
    flexDirection: "row", // flex-row
    alignItems: "center", // items-center
    justifyContent: "space-between", // justify-between
    paddingHorizontal: 16, // px-4 (4 × 4)
    paddingVertical: 12, // py-3 (3 × 4)
    backgroundColor: "#fff", // bg-white
  },
  menulogo: {
    flexDirection: "row", // flex-row
    alignItems: "center", // items-center
    flex: 1,
  },
  mr: {
    marginRight: 12, // equivalent to mr-3
  },
  menuLogoPos: {
    flex: 1,
  },
  menuLogoSize: {
    width: "100%",
    height: 24,
  },
  titleNoLogo: {
    fontSize: 20, // text-xl
    fontWeight: "bold", // font-bold
    color: COLORS.primary, // text-primary
    textAlign: "center", // text-center
    flex: 1, // flex-1
    marginRight: 32, // mr-8
  },
  rightSide: {
    flexDirection: "row", // flex-row
    alignItems: "center", // items-center
    gap: 16,
  },
  itemCounter: {
    position: "absolute",
    top: -4, // -top-1 (4px)
    right: -4, // -right-1 (4px)
    backgroundColor: "#FF4C3B",
    width: 16, // w-4
    height: 16, // h-4
    borderRadius: 9999, // rounded-full
    alignItems: "center", // items-center
    justifyContent: "center", // justify-center
  },
  itemCounterText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
});
