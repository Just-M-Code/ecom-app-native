import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Modal,
  TouchableWithoutFeedback,
  FlatList,
  StyleSheet,
} from "react-native";
import { COLORS, getStatusColor } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { dummyOrders, dummyUser } from "@/assets/assets";

export default function AdminOrders() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [orders, setOrders] = useState([]);

  // Status Modal State
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [updating, setUpdating] = useState(false);

  const STATUSES = [
    "placed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  const fetchOrders = async () => {
    setOrders(
      dummyOrders.map((order: any) => ({
        ...order,
        user: dummyUser,
      })) as any,
    );
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const openStatusModal = (order: any) => {
    setSelectedOrder(order);
    setStatusModalVisible(true);
  };

  const updateStatus = async (newStatus: string) => {
    if (!selectedOrder) return;
    setOrders(
      orders.map((order: any) =>
        order._id === selectedOrder._id
          ? { ...order, orderStatus: newStatus }
          : order,
      ) as any,
    );
    setStatusModalVisible(false);
    setUpdating(false);
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {orders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No orders found</Text>
          </View>
        ) : (
          orders.map((order: any) => (
            <View key={order._id} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderId}>Order ID : #{order._id}</Text>
                <Text style={styles.orderDate}>
                  {new Date(order.createdAt).toLocaleDateString()}
                </Text>
              </View>

              <View style={styles.customerCard}>
                <Text style={styles.cardTitle}>CUSTOMER</Text>
                <Text style={styles.customerName}>
                  {order.user?.name || "Unknown User"}
                </Text>
                <Text style={styles.customerEmail}>
                  {order.user?.email || "No email"}
                </Text>
                {!order.user && (
                  <Text
                    style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}
                  >
                    ID: {order.user?._id || "N/A"}
                  </Text>
                )}
              </View>

              <View style={styles.shippingCard}>
                <Text style={styles.cardTitle}>SHIPPING ADDRESS</Text>
                <Text style={{ color: "#1e2937", fontSize: 13 }}>
                  {order.shippingAddress?.street}, {order.shippingAddress?.city}
                </Text>
                <Text style={{ color: "#1e2937", fontSize: 13 }}>
                  {order.shippingAddress?.state},{" "}
                  {order.shippingAddress?.zipCode},{" "}
                  {order.shippingAddress?.country}
                </Text>
              </View>

              <View style={styles.itemsSection}>
                <Text style={styles.cardTitle}>ITEMS</Text>
                {order.items.map((item: any) => (
                  <View key={item._id} style={styles.itemRow}>
                    <Text style={styles.itemText}>
                      {item.quantity}x {item.product?.name || item.name}
                      {item.size && (
                        <Text style={{ color: "#9ca3af" }}>
                          {" "}
                          ({item.size || "-"})
                        </Text>
                      )}
                    </Text>
                    <Text style={styles.itemPrice}>
                      ${item.price.toFixed(2)}
                    </Text>
                  </View>
                ))}
              </View>

              <View style={styles.footerRow}>
                <Text style={styles.totalAmount}>
                  ${order.totalAmount.toFixed(2)}
                </Text>

                <TouchableOpacity
                  onPress={() => openStatusModal(order)}
                  className={`flex-row items-center px-4 py-2 rounded-full ${getStatusColor(order.orderStatus)}`}
                >
                  <Text style={styles.statusButtonText}>
                    {order.orderStatus}
                  </Text>
                  <Ionicons
                    name="pencil"
                    size={12}
                    color="black"
                    style={{ opacity: 0.5 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* STATUS MODAL */}
      <Modal visible={statusModalVisible} animationType="fade" transparent>
        <TouchableWithoutFeedback onPress={() => setStatusModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Update Order Status</Text>
                <TouchableOpacity onPress={() => setStatusModalVisible(false)}>
                  <Ionicons name="close" size={24} color={COLORS.secondary} />
                </TouchableOpacity>
              </View>

              {updating ? (
                <View style={{ paddingVertical: 32 }}>
                  <ActivityIndicator size="large" color={COLORS.primary} />
                  <Text style={styles.updatingText}>Updating status...</Text>
                </View>
              ) : (
                <FlatList
                  data={STATUSES}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.statusOption,
                        selectedOrder?.orderStatus === item
                          ? { backgroundColor: "#eff6ff" } // bg-primary/10
                          : { backgroundColor: "#f8fafc" }, // bg-gray-50
                      ]}
                      onPress={() => updateStatus(item)}
                    >
                      <Text
                        style={[
                          styles.statusOptionText,
                          selectedOrder?.orderStatus === item
                            ? { color: COLORS.primary, fontWeight: "700" }
                            : { color: "#64748b" },
                        ]}
                      >
                        {item}
                      </Text>
                      {selectedOrder?.orderStatus === item && (
                        <Ionicons
                          name="checkmark-circle"
                          size={20}
                          color={COLORS.primary}
                        />
                      )}
                    </TouchableOpacity>
                  )}
                />
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface, // bg-surface
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.surface, // bg-surface
  },
  scrollContent: {
    flex: 1,
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 80,
  },
  emptyText: {
    color: COLORS.secondary, // text-secondary
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
    marginBottom: 12,
  },
  orderId: {
    fontSize: 13,
    fontWeight: "500",
    color: "#9ca3af", // text-gray-400
  },
  orderDate: {
    color: COLORS.secondary, // text-secondary
    fontSize: 12,
  },
  customerCard: {
    backgroundColor: "#f8fafc", // bg-gray-50
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.secondary, // text-secondary
    marginBottom: 4,
    textTransform: "uppercase",
  },
  customerName: {
    color: COLORS.primary, // text-primary
    fontWeight: "500",
  },
  customerEmail: {
    color: COLORS.secondary, // text-secondary
    fontSize: 12,
  },
  shippingCard: {
    backgroundColor: "#f8fafc", // bg-gray-50
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  itemsSection: {
    marginBottom: 12,
  },
  itemsTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.secondary, // text-secondary
    marginBottom: 8,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  itemText: {
    color: COLORS.secondary, // text-secondary
    fontSize: 13,
    flex: 1,
  },
  itemPrice: {
    color: COLORS.secondary, // text-secondary
    fontSize: 13,
    fontWeight: "700",
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
  totalAmount: {
    color: COLORS.primary, // text-primary
    fontWeight: "700",
    fontSize: 18,
  },
  statusButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    // getStatusColor will be applied dynamically
  },
  statusButtonText: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginRight: 6,
  },

  /* Modal Styles */
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)", // bg-black/50
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    maxHeight: "60%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f3f5", // border-gray-100
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primary, // text-primary
  },
  updatingContainer: {
    paddingVertical: 32,
    alignItems: "center",
  },
  updatingText: {
    color: COLORS.secondary, // text-secondary
    marginTop: 8,
  },
  statusOption: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // bg-primary/10 or bg-gray-50 applied dynamically
  },
  statusOptionText: {
    fontWeight: "500",
    textTransform: "capitalize",
    // text-primary or text-secondary applied dynamically
  },
});
