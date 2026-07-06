import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useCart } from "@/context/CartContex";
import { useRouter } from "expo-router";
import { Address } from "@/constants/types";
import { dummyAddress } from "@/assets/assets";
import Toast from "react-native-toast-message";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "@/constants";
import Header from "@/components/Header";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@clerk/expo";
import api from "@/constants/api";

export default function Checkout() {
  const { getToken } = useAuth();
  const { cartTotal, clearCart } = useCart();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "stripe">("cash");

  const shipping = 2.0;
  const tax = 0;
  const total = cartTotal + shipping + tax;

  const fetchAddress = async () => {
    try {
      const token = await getToken();
      const { data } = await api.get("/addresses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const addrList = data.data;
      if (addrList.length > 0) {
        // Find default or first
        const def = addrList.find((a: Address) => a.isDefault) || addrList[0];
        setSelectedAddress(def);
      }
    } catch (error) {
      console.error("Error fetching checkout data:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to load checkout information",
      });
    } finally {
      setPageLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please add a shipping address",
      });
      return;
    }

    if (paymentMethod === "stripe")
      return Toast.show({
        type: "error",
        text1: "Info",
        text2: "Stripe not implemented yet",
      });

    // Cash on Delivery
    setLoading(true);
    try {
      const payload = {
        shippingAddress: selectedAddress,
        notes: "Placed via App",
        paymentMethod: "cash",
      };

      const token = await getToken();
      const { data } = await api.post("/orders", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (data.success) {
        await clearCart();
        Toast.show({
          type: "success",
          text1: "Order Placed",
          text2: "Your order has been placed successfully!",
        });
        router.replace("/orders");
      }
    } catch (error: any) {
      console.log("=== ORDER ERROR DEBUG ===");
      console.log("Message:", error.message);
      console.log("Status:", error.response?.status);
      console.log("Data:", error.response?.data);
      console.log("Headers:", error.response?.headers);
      console.log("Full error:", error.toJSON?.());

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Something went wrong";

      Toast.show({
        type: "error",
        text1: "Failed to Place Order",
        text2: message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddress();
  }, []);

  if (pageLoading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: COLORS.surface,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: COLORS.surface }}
      edges={["top"]}
    >
      <Header title="Checkout" showBack />

      <ScrollView style={{ flex: 1, paddingHorizontal: 16, marginTop: 16 }}>
        {/* Address Section */}
        <Text
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: COLORS.primary,
            marginBottom: 16,
          }}
        >
          Shipping Address
        </Text>
        {selectedAddress ? (
          <View style={styles.addressPos}>
            <View style={styles.address}>
              <Text style={{ fontSize: 16, fontWeight: 700 }}>
                {selectedAddress.type}
              </Text>
              <TouchableOpacity onPress={() => router.push("/addresses")}>
                <Text style={{ color: COLORS.accent, fontSize: 14 }}>
                  Change
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={{ color: COLORS.secondary, lineHeight: 20 }}>
              {selectedAddress.street}, {selectedAddress.city}
              {"\n"}
              {selectedAddress.state}, {selectedAddress.zipCode}
              {"\n"}
              {selectedAddress.country}
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => router.push("/addresses")}
            style={styles.addressAdd}
          >
            <Text style={{ color: COLORS.primary, fontWeight: 700 }}>
              Add Address
            </Text>
          </TouchableOpacity>
        )}

        {/* Payment Section */}
        <Text
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: COLORS.primary,
            marginBottom: 16,
          }}
        >
          Payment Method
        </Text>

        {/* Cash on Delivery Option */}
        <TouchableOpacity
          onPress={() => setPaymentMethod("cash")}
          style={[
            styles.paymentMethod,
            paymentMethod === "cash"
              ? { borderColor: COLORS.primary }
              : { borderColor: "transparent" },
          ]}
        >
          <Ionicons
            name="cash-outline"
            size={24}
            color={COLORS.primary}
            style={{ marginRight: 12 }}
          />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text
              style={{ fontSize: 16, fontWeight: 700, color: COLORS.primary }}
            >
              Cash on delivery
            </Text>
            <Text
              style={{ marginTop: 4, color: COLORS.secondary, fontSize: 12 }}
            >
              Pay when you recieve the order
            </Text>
          </View>
          {paymentMethod === "cash" && (
            <Ionicons
              name="checkmark-circle"
              size={24}
              color={COLORS.primary}
            />
          )}
        </TouchableOpacity>

        {/* Stripe Option */}

        <TouchableOpacity
          onPress={() => setPaymentMethod("stripe")}
          style={[
            styles.paymentMethod,
            paymentMethod === "stripe"
              ? { borderColor: COLORS.primary }
              : { borderColor: "transparent" },
          ]}
        >
          <Ionicons
            name="card-outline"
            size={24}
            color={COLORS.primary}
            style={{ marginRight: 12 }}
          />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text
              style={{ fontSize: 16, fontWeight: 700, color: COLORS.primary }}
            >
              Pay with card
            </Text>
            <Text
              style={{ marginTop: 4, color: COLORS.secondary, fontSize: 12 }}
            >
              Credit or Debit Card
            </Text>
          </View>
          {paymentMethod === "stripe" && (
            <Ionicons
              name="checkmark-circle"
              size={24}
              color={COLORS.primary}
            />
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Order Summary */}
      <View style={styles.orderSummary}>
        <Text style={styles.orderSummaryText}>Order Summary</Text>

        {/* Subtotal */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <Text style={{ color: COLORS.secondary }}>Subtotal</Text>
          <Text style={{ fontWeight: 700 }}>${cartTotal.toFixed(2)}</Text>
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
          <Text style={{ fontWeight: 700 }}>${shipping.toFixed(2)}</Text>
        </View>

        {/* Tax */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <Text style={{ color: COLORS.secondary }}>Tax</Text>
          <Text style={{ fontWeight: 700 }}>${tax.toFixed(2)}</Text>
        </View>

        {/* Total */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 24,
          }}
        >
          <Text
            style={{ color: COLORS.primary, fontSize: 20, fontWeight: 700 }}
          >
            Total
          </Text>
          <Text
            style={{ color: COLORS.primary, fontSize: 20, fontWeight: 700 }}
          >
            ${total.toFixed(2)}
          </Text>
        </View>
        {/* Place Order Button */}
        <TouchableOpacity
          style={[
            { padding: 16, borderRadius: 12, alignItems: "center" },
            loading
              ? { backgroundColor: COLORS.gray400 }
              : { backgroundColor: COLORS.primary },
          ]}
          onPress={handlePlaceOrder}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={{ color: "#fff", fontWeight: 700, fontSize: 18 }}>
              Place Order
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  addressAdd: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: "center",
    justifyContent: "center",
    borderStyle: "dashed",
    borderWidth: 2,
    borderColor: COLORS.gray100,
  },
  addressPos: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
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
  address: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  paymentMethod: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
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
  orderSummary: {
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: COLORS.gray100,

    // shadow-lg (iOS)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    // shadow (Android)
    elevation: 8,
  },
  orderSummaryText: {
    fontSize: 18,
    fontWeight: 700,
    color: COLORS.primary,
    marginBottom: 16,
  },
});
