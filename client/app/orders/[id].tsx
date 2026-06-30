import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import { COLORS } from "@/constants";
import type { Order, Product } from "@/constants/types";
import { dummyOrders } from "@/assets/assets";

export default function OrderDetails() {
  const { id } = useLocalSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrderDetails = async () => {
    setOrder(dummyOrders.find((order) => order._id === id) as any);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text>Order not found</Text>
      </SafeAreaView>
    );
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const ORDER_STEPS = [
    {
      title: "Order Placed",
      date: formatDate(order.createdAt),
      completed: true,
    },
    {
      title: "Processing",
      date: "",
      completed: ["processing", "shipped", "delivered"].includes(
        order.orderStatus,
      ),
    },
    {
      title: "Shipped",
      date: "",
      completed: ["shipped", "delivered"].includes(order.orderStatus),
    },
    {
      title: "Delivered",
      date: "",
      completed: order.orderStatus === "delivered",
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header title={`Order #${order.orderNumber}`} showBack />

      <ScrollView style={styles.scrollContent}>
        {/* Order Status */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Order Status</Text>

          {ORDER_STEPS.map((step, index) => (
            <View key={index} style={styles.stepContainer}>
              <View style={styles.stepDotContainer}>
                <View
                  style={[
                    styles.stepDot,
                    {
                      backgroundColor: step.completed
                        ? COLORS.primary
                        : "#d1d5db",
                    }, // bg-primary : bg-gray-300
                  ]}
                />
                {index !== ORDER_STEPS.length - 1 && (
                  <View
                    style={[
                      styles.stepLine,
                      {
                        backgroundColor: step.completed
                          ? COLORS.primary
                          : "#d1d5db",
                      },
                    ]}
                  />
                )}
              </View>
              <View style={{ paddingBottom: 16 }}>
                <Text
                  style={[
                    styles.stepTitle,
                    { color: step.completed ? COLORS.primary : "#9ca3af" }, // text-primary : text-gray-400
                  ]}
                >
                  {step.title}
                </Text>
                {step.date ? (
                  <Text style={styles.stepDate}>{step.date}</Text>
                ) : null}
              </View>
            </View>
          ))}
        </View>

        {/* Items */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Products</Text>
          {order.items.map((item: any, index: number) => {
            const productData = item.product as Product;
            const image = productData?.images?.[0];

            return (
              <View
                key={index}
                style={
                  index !== order.items.length - 1
                    ? styles.productRow
                    : styles.lastProductRow
                }
              >
                {image && (
                  <Image
                    source={{ uri: image }}
                    style={styles.productImage}
                    resizeMode="contain"
                  />
                )}
                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.productDetail}>Size: {item.size}</Text>
                  <View style={styles.productPriceRow}>
                    <Text style={{ color: COLORS.primary, fontWeight: "700" }}>
                      ${item.price}
                    </Text>
                    <Text style={styles.productDetail}>
                      Qty: {item.quantity}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* Shipping Details */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Shipping Details</Text>
          <View style={styles.shippingRow}>
            <Ionicons
              name="location-outline"
              size={20}
              color={COLORS.secondary}
            />
            <Text style={styles.shippingText}>
              {order.shippingAddress?.street}, {order.shippingAddress?.city},{" "}
              {order.shippingAddress?.zipCode}, {order.shippingAddress?.country}
            </Text>
          </View>
        </View>

        {/* Payment Summary */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Payment Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Payment Method</Text>
            <Text style={styles.summaryValue}>{order.paymentMethod}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Payment Status</Text>
            <Text
              style={{
                fontWeight: "500",
                textTransform: "capitalize",
                color:
                  order.paymentStatus === "paid"
                    ? "#16a34a" // green-600
                    : order.paymentStatus === "failed"
                      ? "#dc2626" // red-600
                      : "#f59e0b", // orange-500
              }}
            >
              {order.paymentStatus}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>
              ${order.subtotal.toFixed(2)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping</Text>
            <Text style={styles.summaryValue}>
              ${order.shippingCost.toFixed(2)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax</Text>
            <Text style={styles.summaryValue}>${order.tax.toFixed(2)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>
              ${order.totalAmount.toFixed(2)}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface, // bg-surface
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.surface, // bg-surface
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  /* Card Style */
  card: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#f1f3f5", // border-gray-100
  },

  /* Order Status Section */
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primary, // text-primary
    marginBottom: 16,
  },
  stepContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  stepDotContainer: {
    alignItems: "center",
    marginRight: 16,
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    // bg-primary or bg-gray-300 will be applied dynamically
  },
  stepLine: {
    width: 2,
    flex: 1,
    // bg-primary or bg-gray-300 applied dynamically
  },
  stepContent: {
    paddingBottom: 16,
  },
  stepTitle: {
    fontWeight: "700",
    // text-primary or text-gray-400 applied dynamically
  },
  stepDate: {
    color: COLORS.secondary, // text-secondary
    fontSize: 12,
  },

  /* Products */
  productRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  lastProductRow: {
    flexDirection: "row",
  },
  productImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: "#f1f3f5", // bg-gray-100
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  productName: {
    color: COLORS.primary, // text-primary
    fontWeight: "500",
  },
  productDetail: {
    color: COLORS.secondary, // text-secondary
    fontSize: 12,
  },
  productPriceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },

  /* Shipping & Payment */
  shippingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  shippingText: {
    color: COLORS.secondary, // text-secondary
    marginLeft: 8,
    flex: 1,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: {
    color: COLORS.secondary, // text-secondary
  },
  summaryValue: {
    color: COLORS.primary, // text-primary
    fontWeight: "500",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  totalLabel: {
    color: COLORS.primary, // text-primary
    fontWeight: "700",
    fontSize: 18,
  },
  totalAmount: {
    color: COLORS.primary, // text-primary
    fontWeight: "700",
    fontSize: 18,
  },
  divider: {
    height: 1,
    backgroundColor: "#f1f3f5", // bg-gray-100
    marginVertical: 8,
  },
});
