import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { dummyProducts } from "@/assets/assets";
import { Product } from "@/constants/types";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import { Ionicons } from "@expo/vector-icons";
import { FlatList, TextInput } from "react-native-gesture-handler";
import { COLORS } from "@/constants";
import ProductCard from "@/components/ProductCard";

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchProducts = async (pageNumber = 1) => {
    if (pageNumber === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    try {
      const start = (pageNumber - 1) * 10;
      const end = start + 10;
      const paginatedData = dummyProducts.slice();
      if (pageNumber === 1) {
        setProducts(paginatedData);
      } else {
        setProducts((prev) => [...prev, ...paginatedData]);
      }

      setHasMore(end < dummyProducts.length);
      setPage(pageNumber);
    } catch (error) {
      console.error("Pagination error", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (!loadingMore && !loading && hasMore) {
      fetchProducts(page + 1);
    }
  };

  useEffect(() => {
    fetchProducts(1);
  }, []);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#F9F9FF" }}
      edges={["top"]}
    >
      <Header title="shop" showBack showCart />
      <View style={styles.header}>
        {/* Search bar */}
        <View style={styles.searchIconHold}>
          <Ionicons
            name="search"
            style={{ marginLeft: 16 }}
            size={20}
            color={COLORS.secondary}
          />
          <TextInput
            style={styles.searchIcon}
            placeholder="Search products..."
            returnKeyType="search"
            placeholderTextColor={COLORS.secondary}
          />
        </View>

        {/* Filter icon */}
        <TouchableOpacity style={styles.filterIcon}>
          <Ionicons name="options-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item._id}
          numColumns={2}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          renderItem={({ item }) => <ProductCard product={item} />}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? (
              <View style={{ paddingVertical: 16 }}>
                <ActivityIndicator size="small" color={COLORS.primary} />
              </View>
            ) : null
          }
          ListEmptyComponent={
            !loading && (
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: 80,
                }}
              >
                <Text style={{ color: COLORS.secondary }}>
                  No products found
                </Text>
              </View>
            )
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  searchIconHold: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#f3f4f6",
  },
  searchIcon: {
    flex: 1,
    marginLeft: 8,
    color: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterIcon: {
    backgroundColor: "#1f2937",
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
});
