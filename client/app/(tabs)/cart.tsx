import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { useCart } from "@/context/CartContex";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import { COLORS } from "@/constants";
import { ScrollView } from "react-native-gesture-handler";
import CartItem from "@/components/CartItem";

export default function Cart() {
  const { cartItems, cartTotal, removeFromCart, updateQuantity } = useCart();
  const router = useRouter();
  const shipping = 2.0;
  const total = cartTotal + shipping;

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#F9F9FF" }}
      edges={["top"]}
    >
      <Header title="My Cart" showBack />

      {cartItems.length > 0 ? (
        <>
          <ScrollView style={{ flex: 1, paddingHorizontal: 16, marginTop: 16 }}>
            {cartItems.map((item, index) => (
              <CartItem
                key={index}
                item={item}
                onRemove={() => removeFromCart(item.id, item.size)}
                onUpdateQuantity={(q) => updateQuantity(item.id, q, item.size)}
              />
            ))}
          </ScrollView>

          <View style={styles.cartSubTotal}>
            {/* Subtotal */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <Text style={{ color: COLORS.secondary }}>Subtotal</Text>
              <Text style={{ color: COLORS.primary, fontWeight: 700 }}>
                ${cartTotal.toFixed(2)}
              </Text>
            </View>
            {/* Shipping */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <Text style={{ color: COLORS.secondary }}>Shipping</Text>
              <Text style={{ color: COLORS.primary, fontWeight: 700 }}>
                ${shipping.toFixed(2)}
              </Text>
            </View>
            {/* Border */}
            <View
              style={{
                borderTopWidth: 1,
                borderTopColor: "#ebebeb",
                marginBottom: 16,
              }}
            />

            {/* Total */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 24,
              }}
            >
              <Text
                style={{ color: COLORS.primary, fontWeight: 700, fontSize: 18 }}
              >
                Total
              </Text>
              <Text
                style={{ color: COLORS.primary, fontWeight: 700, fontSize: 18 }}
              >
                ${total.toFixed(2)}
              </Text>
            </View>

            {/* Checkout button */}
            <TouchableOpacity
              style={styles.checkOutButton}
              onPress={() => router.push("/checkout")}
            >
              <Text style={{ color: "white", fontWeight: 700, fontSize: 16 }}>
                Checkout
              </Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text style={{ color: COLORS.secondary, fontSize: 18 }}>
            Your cart is empty
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

const styles = StyleSheet.create({
  cartSubTotal: {
    padding: 16,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,

    // shadow-sm
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
  checkOutButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 9999,
    alignItems: "center",
  },
});
