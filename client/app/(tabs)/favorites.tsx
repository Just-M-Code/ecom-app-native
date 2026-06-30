import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useWishlist } from "@/context/WishlistContext";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import { ScrollView } from "react-native-gesture-handler";
import { COLORS } from "@/constants";
import ProductCard from "@/components/ProductCard";

export default function Favorites() {
  const { wishlist } = useWishlist();
  const router = useRouter();
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#F9F9FF" }}
      edges={["top"]}
    >
      <Header title="Wishlist" showMenu showCart />
      {wishlist.length > 0 ? (
        <ScrollView
          style={{ flex: 1, paddingHorizontal: 16, marginTop: 16 }}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            {wishlist.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </View>
        </ScrollView>
      ) : (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text style={{ color: COLORS.secondary, fontSize: 18 }}>
            Your wishlist is empty
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/")}
            style={{ marginTop: 16 }}
          >
            <Text
              style={{ color: COLORS.primary, fontSize: 18, fontWeight: 700 }}
            >
              Start Shopping
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
