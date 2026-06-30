import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  ScrollView,
  Image,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import { COLORS, getStatusColor } from "@/constants";
import type { Order } from "@/constants/types";
import { dummyOrders, formatDate } from "@/assets/assets";

export default function Orders() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setOrders(dummyOrders as any[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header title="My Orders" showBack />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No orders found</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={styles.orderCard}
              onPress={() => router.push(`/orders/${item._id}`)}
            >
              <View style={styles.orderHeader}>
                <Text style={styles.orderNumber}>
                  Order #{item.orderNumber}
                </Text>
                <Text style={styles.orderDate}>
                  {formatDate(item.createdAt)}
                </Text>
              </View>

              {/* Status Badges */}
              <View style={styles.badgesContainer}>
                <View
                  style={[styles.statusBadge, getStatusColor(item.orderStatus)]}
                >
                  <Text style={styles.badgeText}>{item.orderStatus}</Text>
                </View>

                <View
                  style={[
                    styles.paymentBadge,
                    {
                      backgroundColor:
                        item.paymentStatus === "paid" ? "#dcfce7" : "#f1f5f9", // bg-green-100 : bg-gray-100
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      {
                        color:
                          item.paymentStatus === "paid" ? "#166534" : "#374151", // text-green-700 : text-gray-700
                      },
                    ]}
                  >
                    {item.paymentStatus}
                  </Text>
                </View>
              </View>

              <View style={styles.paymentMethodRow}>
                <Text style={styles.paymentMethodText}>
                  Payment Method:{" "}
                  <Text
                    style={{
                      color: COLORS.primary,
                      fontWeight: "500",
                      textTransform: "capitalize",
                    }}
                  >
                    {item.paymentMethod}
                  </Text>
                </Text>
              </View>

              {/* Product Images */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginBottom: 12 }}
              >
                {item.items.map((prod: any, idx) => {
                  const image = prod.product?.images?.[0];
                  return (
                    <View key={idx} style={styles.imageContainer}>
                      {image ? (
                        <Image
                          source={{ uri: image }}
                          style={styles.productImage}
                          resizeMode="cover"
                        />
                      ) : (
                        <View style={styles.noImageContainer}>
                          <Ionicons
                            name="image-outline"
                            size={20}
                            color={COLORS.secondary}
                          />
                        </View>
                      )}
                    </View>
                  );
                })}
              </ScrollView>

              <View style={styles.footerRow}>
                <Text style={{ color: COLORS.secondary }}>
                  Items: {item.items.length}
                </Text>
                <Text style={styles.totalAmount}>
                  ${item.totalAmount.toFixed(2)}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa", // bg-surface
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#64748b", // text-secondary
    fontSize: 18,
  },
  orderCard: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#f1f3f5", // border-gray-100
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  orderNumber: {
    color: "#1e2937", // text-primary
    fontWeight: "700",
  },
  orderDate: {
    color: "#64748b", // text-secondary
    fontSize: 14,
  },
  badgesContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    // getStatusColor will be applied dynamically
  },
  paymentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    // bg-green-100 or bg-gray-100 applied dynamically
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  paymentMethodRow: {
    marginBottom: 12,
  },
  paymentMethodText: {
    color: "#64748b", // text-secondary
    fontSize: 13,
  },
  productImagesScroll: {
    marginBottom: 12,
  },
  imageContainer: {
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#f1f3f5", // border-gray-100
    borderRadius: 6,
    padding: 4,
    backgroundColor: "#f8fafc", // bg-gray-50
  },
  productImage: {
    width: 48,
    height: 48,
    borderRadius: 6,
  },
  noImageContainer: {
    width: 48,
    height: 48,
    borderRadius: 6,
    backgroundColor: "#e5e7eb", // bg-gray-200
    justifyContent: "center",
    alignItems: "center",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f1f3f5", // border-gray-100
  },
  itemsCount: {
    color: "#64748b", // text-secondary
  },
  totalAmount: {
    color: "#1e2937", // text-primary
    fontWeight: "700",
    fontSize: 18,
  },
});
