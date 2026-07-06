import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { COLORS, getStatusColor } from "@/constants";
import { useAuth } from "@clerk/expo";
import api from "@/constants/api";

export default function AdminDashboard() {
  const { getToken } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: [],
  });

  const fetchStats = async () => {
    try {
      const token = await getToken();
      if (!token) {
        console.warn("No token available");
        return;
      }

      const { data } = await api.get("/admin/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (data.success && data.data) {
        setStats(data.data);
      } else {
        setStats({
          totalUsers: 0,
          totalProducts: 0,
          totalOrders: 0,
          totalRevenue: 0,
          recentOrders: [],
        });
      }
    } catch (error) {
      console.error("Failed to fetch admin stats:", error);
      // Keep safe defaults on error
      setStats({
        totalUsers: 0,
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
        recentOrders: [],
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={{ marginBottom: 16 }}>
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.statsContainer}>
          <StatCard
            label="Total Revenue"
            value={`$${(stats.totalRevenue ?? 0).toFixed(2)}`}
          />
          <StatCard
            label="Total Orders"
            value={(stats.totalOrders ?? 0).toString()}
          />
          <StatCard
            label="Products"
            value={(stats.totalProducts ?? 0).toString()}
          />
          <StatCard label="Users" value={(stats.totalUsers ?? 0).toString()} />
        </View>
      </View>

      <View style={{ marginBottom: 16 }}>
        <Text style={styles.sectionTitle}>Recent Orders</Text>
        {stats.recentOrders.length === 0 ? (
          <View style={styles.emptyOrders}>
            <Text style={{ color: COLORS.secondary }}>No recent orders</Text>
          </View>
        ) : (
          stats.recentOrders.map((order: any) => (
            <View key={order._id} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <View>
                  <Text
                    style={{
                      fontWeight: "700",
                      fontSize: 16,
                      color: COLORS.primary,
                    }}
                  >
                    Total Products :{" "}
                    {order.items.reduce(
                      (acc: number, item: any) => acc + item.quantity,
                      0,
                    )}
                  </Text>
                  <Text
                    style={{
                      color: COLORS.secondary,
                      fontSize: 12,
                      marginTop: 4,
                    }}
                  >
                    {new Date(order.createdAt).toLocaleDateString()}
                  </Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    getStatusColor(order.orderStatus),
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      { color: getStatusColor(order.orderStatus).color },
                    ]}
                  >
                    {order.orderStatus}
                  </Text>
                </View>
              </View>
              <View style={{ paddingBottom: 8 }}>
                {order.items.map((item: any) => (
                  <Text
                    key={item._id}
                    style={{
                      color: COLORS.secondary,
                      fontSize: 13,
                      marginTop: 2,
                    }}
                  >
                    {item.name} x {item.quantity}
                  </Text>
                ))}
              </View>

              <View style={styles.divider} />

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View style={styles.userInfo}>
                  <View style={styles.avatar}>
                    <Text
                      style={{
                        color: COLORS.primary,
                        fontWeight: "700",
                        fontSize: 13,
                      }}
                    >
                      {(order.user?.name || "?").charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <Text style={{ color: COLORS.secondary, fontSize: 14 }}>
                    {order.user?.name || "Unknown User"}
                  </Text>
                </View>
                <Text
                  style={{
                    color: COLORS.primary,
                    fontWeight: "700",
                    fontSize: 18,
                  }}
                >
                  ${order.totalAmount.toFixed(2)}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

// StatCard Component
const StatCard = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.statCard}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface, // bg-surface
    padding: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.primary, // text-primary
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f1f3f5",
    width: "48%",
    marginBottom: 16,
    justifyContent: "center",
  },
  statValue: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1e2937",
    marginBottom: 6,
  },
  statLabel: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  orderCard: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f1f3f5",
    marginBottom: 12,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    alignSelf: "flex-start",
  },
  statusText: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  divider: {
    height: 1,
    backgroundColor: "#f1f3f5",
    marginVertical: 12,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 999,
    backgroundColor: "#f1f3f5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  emptyOrders: {
    backgroundColor: "#ffffff",
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f1f3f5",
    alignItems: "center",
  },
});
