import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Product } from "@/constants/types";
import { useCart } from "@/context/CartContex";
import { useWishlist } from "@/context/WishlistContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "@/constants";
import { ScrollView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import api from "@/constants/api";

const { width } = Dimensions.get("window");

export default function ProductDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const { addToCart, cartItems, itemCount } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const fetchProduct = async () => {
    try {
      const { data } = await api.get(`/products/${id}`);
      setProduct(data.data);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Failed to Fetch Product",
        text2: error.response?.data?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" color={"#171717"} />
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text>Product not found</Text>
      </SafeAreaView>
    );
  }

  const isLiked = isInWishlist(product._id);
  const handleAddToCart = () => {
    if (!selectedSize) {
      Toast.show({
        type: "info",
        text1: "No Size Selected",
        text2: "Please select a size",
      });
      return;
    }
    addToCart(product, selectedSize || "");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Image Carousel */}
        <View style={styles.imageCarousel}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={(e) => {
              const slide = Math.ceil(
                e.nativeEvent.contentOffset.x /
                  e.nativeEvent.layoutMeasurement.width,
              );
              setActiveImageIndex(slide);
            }}
          >
            {product.images?.map((img, index) => (
              <Image
                key={index}
                source={{ uri: img }}
                style={{ width: width, height: 450 }}
              />
            ))}
          </ScrollView>
          {/* Header Actions */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.headerIcon}
            >
              <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => toggleWishlist(product)}
              style={styles.headerIcon}
            >
              <Ionicons
                name={isLiked ? "heart" : "heart-outline"}
                size={24}
                color={isLiked ? COLORS.accent : COLORS.primary}
              />
            </TouchableOpacity>
          </View>

          {/* Pagination Dots */}
          <View style={styles.paginationDots}>
            {product.images?.map((_, index) => (
              <View
                key={index}
                style={[
                  {
                    height: 8,
                    borderRadius: 9999,
                  },
                  index === activeImageIndex
                    ? {
                        width: 24,
                        backgroundColor: COLORS.primary,
                      }
                    : {
                        width: 8,
                        backgroundColor: "#D1D5DB", // gray-300
                      },
                ]}
              />
            ))}
          </View>
        </View>

        {/* Product Info */}
        <View style={{ padding: 20 }}>
          {/* Title & Rating */}
          <View style={styles.productInfo}>
            <Text style={styles.productInfoName}>{product.name}</Text>
            <View style={styles.infoIconPos}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={{ fontSize: 14, fontWeight: 700, marginLeft: 4 }}>
                4.6
              </Text>
              <Text
                style={{ fontSize: 12, color: COLORS.secondary, marginLeft: 4 }}
              >
                (85)
              </Text>
            </View>
          </View>

          {/* Price */}
          <Text
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: COLORS.primary,
              marginBottom: 24,
            }}
          >
            ${product.price.toFixed(2)}
          </Text>

          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  color: COLORS.primary,
                  marginBottom: 12,
                }}
              >
                Size
              </Text>
              <View
                style={{
                  flexDirection: "row", // flex-row
                  gap: 12, // gap-3
                  marginBottom: 24, // mb-6
                  flexWrap: "wrap",
                }}
              >
                {product.sizes.map((size) => (
                  <TouchableOpacity
                    key={size}
                    onPress={() => setSelectedSize(size)}
                    style={[
                      styles.sizeBox,
                      selectedSize === size
                        ? {
                            backgroundColor: COLORS.primary,
                            borderColor: COLORS.primary,
                          }
                        : {
                            backgroundColor: "#fff",
                            borderColor: "#F3F4F6",
                          },
                    ]}
                  >
                    <Text
                      style={[
                        { fontSize: 14, fontWeight: 500 },
                        selectedSize === size
                          ? { color: "#fff" }
                          : { color: "#171717" },
                      ]}
                    >
                      {size}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}
          {/* Description */}
          <Text style={styles.description}>Description</Text>

          <Text
            style={{
              color: COLORS.secondary,
              lineHeight: 24,
              marginBottom: 24,
            }}
          >
            {product.description}
          </Text>
        </View>
      </ScrollView>
      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={handleAddToCart}
          style={styles.footerAddToCart}
        >
          <Ionicons name="bag-outline" size={20} color="white" />
          <Text
            style={{
              color: "white",
              fontWeight: 700,
              fontSize: 16,
              marginLeft: 8,
            }}
          >
            Add to Cart
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(tabs)/cart")}
          style={styles.footerInCart}
        >
          <Ionicons name="cart-outline" size={24} />
          <View style={styles.footerInCartText}>
            <Text
              style={{
                color: "white",
                fontSize: 9,
              }}
            >
              {itemCount}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  imageCarousel: {
    position: "relative",
    height: 450,
    backgroundColor: "oklch(96.7% 0.003 264.542)", //gray-100
    marginBottom: 24,
  },
  header: {
    position: "absolute",
    top: 48,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 10,
  },
  headerIcon: {
    width: 40,
    height: 40,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
  },
  paginationDots: {
    position: "absolute",
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  productInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  productInfoName: {
    fontSize: 24,
    fontWeight: 700,
    color: COLORS.primary,
    flex: 1,
    marginRight: 16,
  },
  infoIconPos: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  sizeBox: {
    width: 48,
    height: 48,
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  description: {
    fontSize: 16,
    fontWeight: 700,
    color: COLORS.primary,
    marginBottom: 8,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    flexDirection: "row",
    right: 0,
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#dbdbdb",
  },
  footerAddToCart: {
    width: "80%", // w-4/5
    backgroundColor: COLORS.primary, // bg-primary
    paddingVertical: 16, // py-4 (4 * 4 = 16 if using Tailwind scale)
    borderRadius: 9999, // rounded-full
    flexDirection: "row", // flex-row
    justifyContent: "center",
    alignItems: "center",

    // shadow-lg (iOS)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,

    // shadow (Android)
    elevation: 8,
  },
  footerInCart: {
    width: "20%",
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "center",
    position: "relative",
  },
  footerInCartText: {
    position: "absolute",
    top: 8, // top-2 = 2 * 4 = 8
    right: 16, // right-4 = 4 * 4 = 16
    width: 16, // size-4 = 16
    height: 16,
    zIndex: 10,
    backgroundColor: "#000",
    borderRadius: 9999,
    justifyContent: "center",
    alignItems: "center",
  },
});
