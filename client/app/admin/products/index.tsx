import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  RefreshControl,
  Image,
  Alert,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants";
import { useAuth } from "@clerk/expo";
import api from "@/constants/api";
import Toast from "react-native-toast-message";

export default function AdminProducts() {
  const { getToken } = useAuth();

  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get("/products", { params: { limit: 999 } });

      if (data.success) {
        setProducts(data.data);
      } else {
        // Optional: show message if success = false
        console.warn("API returned success: false");
      }
    } catch (error: any) {
      console.error("Failed to fetch products:", error);
      Toast.show({
        type: "error",
        text1: "Failed to Fetch Products",
        text2: error.response?.data?.message || "Something went wrong",
      });
    } finally {
      setLoading(false); // ← This is the most important line
      setRefreshing(false); // ← Also reset refreshing
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  const performDelete = async (id: string) => {
    try {
      const token = await getToken();
      const { data } = await api.delete(`/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        Toast.show({
          type: "success",
          text1: "success",
          text2: "product deleted",
        });
        fetchProducts();
      }
    } catch (error: any) {
      console.error("Failed to delete product:", error);
      Toast.show({
        type: "error",
        text1: "Failed to Delete Product",
        text2: error.response?.data?.message || "Something went wrong",
      });
    }
  };

  const deleteProduct = async (id: string) => {
    Alert.alert(
      "Delete Product",
      "Are you sure you want to delete this product?",
      [
        { text: "Cancel", style: "cancel" as const },
        {
          text: "Delete",
          style: "destructive" as const,
          onPress: () => performDelete(id),
        },
      ],
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Total Products ({products.length})
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/admin/products/add")}
          style={styles.addButton}
        >
          <Ionicons name="add" size={20} color="white" />
          <Text style={styles.addButtonText}>Add Product</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {products.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={{ color: COLORS.secondary }}>No products found</Text>
          </View>
        ) : (
          products.map((product: any) => (
            <View key={product._id} style={styles.productCard}>
              <Image
                source={{
                  uri:
                    product.images && product.images.length > 0
                      ? product.images[0]
                      : "https://via.placeholder.com/150",
                }}
                style={styles.productImage}
                resizeMode="cover"
              />

              <View style={{ flex: 1 }}>
                <Text style={styles.productName} numberOfLines={1}>
                  {product.name}
                </Text>
                <Text style={styles.productDetail}>
                  Category : {product.category || "Others"}
                </Text>
                <Text style={styles.productDetail}>
                  Stock : {product.stock}
                </Text>
                <Text style={styles.productDetail}>
                  Sizes : {product.sizes?.join(", ") || "N/A"}
                </Text>
                <Text style={styles.productPrice}>
                  ${product.price.toFixed(2)}
                </Text>
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity
                  onPress={() =>
                    router.push(`/admin/products/edit/${product._id}`)
                  }
                  style={styles.actionButton}
                >
                  <Ionicons name="create-outline" size={18} color="#333333" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => deleteProduct(product._id)}
                  style={styles.ActionButtonTwo}
                >
                  <Ionicons name="trash-outline" size={18} color="#333333" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface, // bg-surface
  },
  header: {
    padding: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f3f5",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.primary, // text-primary
  },
  addButton: {
    backgroundColor: "#1f2937",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
  },
  addButtonText: {
    color: "#ffffff",
    fontWeight: "500",
    marginLeft: 4,
  },
  scrollContainer: {
    flex: 1,
    padding: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 80,
  },
  emptyText: {
    color: COLORS.secondary, // text-secondary
    fontSize: 16,
  },
  productCard: {
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#f1f3f5",
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  productImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: "#f1f3f5",
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontWeight: "700",
    fontSize: 16,
    color: "#1e2937",
    marginBottom: 2,
  },
  productDetail: {
    color: COLORS.secondary,
    fontSize: 12,
    marginBottom: 2,
  },
  productPrice: {
    color: "#1e2937",
    fontWeight: "700",
    fontSize: 16,
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    padding: 8,
    backgroundColor: "#f8fafc",
    borderRadius: 9999,
    marginLeft: 6,
  },
  ActionButtonTwo: {
    padding: 8,
    backgroundColor: "#f9fafb",
    borderRadius: 9999,
  },
});
