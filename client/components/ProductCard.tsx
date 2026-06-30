import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import React from "react";
import { ProductCardProps } from "@/constants/types";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useWishlist } from "@/context/WishlistContext";

export default function ProductCard({ product }: ProductCardProps) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isLiked = isInWishlist(product._id);

  return (
    <Link href={`/product/${product._id}`} asChild>
      <TouchableOpacity style={styles.imageGallery}>
        <View style={styles.imageStyle}>
          <Image
            source={{ uri: product.images?.[0] ?? "" }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />

          {/* favorite Icon */}
          <TouchableOpacity
            style={styles.favoriteIcon}
            onPress={(e) => {
              e.stopPropagation();
              toggleWishlist(product);
            }}
          >
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={20}
              color={isLiked ? "#FF4C3B" : "#171717"}
            />
          </TouchableOpacity>

          {/* is Featured */}
          {product.isFeatured && (
            <View style={styles.productFeatuedSign}>
              <Text style={styles.productFeaturedText}>Featured</Text>
            </View>
          )}
        </View>

        {/* product info */}
        <View style={{ padding: 12 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 4,
            }}
          >
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={{ color: "#666666", fontSize: 12, marginLeft: 4 }}>
              4.6
            </Text>
          </View>
          <Text
            style={{
              color: "#171717",
              fontWeight: "500",
              fontSize: 12,
              marginBottom: 4,
            }}
            numberOfLines={1}
          >
            {product.name}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{
                color: "#171717",
                fontWeight: "700",
                fontSize: 16,
              }}
            >
              ${product.price.toFixed(2)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  imageGallery: {
    width: "48%",
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 8, // rounded-lg
    overflow: "hidden",
  },
  imageStyle: {
    position: "relative",
    height: 224, // h-56 = 56 × 4
    width: "100%",
    backgroundColor: "#f3f4f6", // bg-gray-100
  },
  favoriteIcon: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 10,
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 9999,

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
  productFeatuedSign: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#000",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  productFeaturedText: {
    color: "#fff",
    fontSize: 12, // text-xs
    fontWeight: "700", // font-bold
    textTransform: "uppercase",
  },
});
