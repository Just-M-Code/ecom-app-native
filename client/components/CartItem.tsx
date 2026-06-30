import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { CartItemProps } from "@/constants/types";
import { COLORS } from "@/constants";
import { Ionicons } from "@expo/vector-icons";

export default function CartItem({
  item,
  onRemove,
  onUpdateQuantity,
}: CartItemProps) {
  const imageUrl = item.product.images[0];

  return (
    <View
      style={{
        flexDirection: "row",
        marginBottom: 16,
        backgroundColor: "#fff",
        padding: 12,
        borderRadius: 12,
      }}
    >
      <View style={styles.cartItemImg}>
        <Image
          source={{ uri: imageUrl }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
      </View>

      <View style={{ flex: 1, justifyContent: "space-between" }}>
        {/* Product Details */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <View>
            <Text
              style={{ color: COLORS.primary, fontWeight: 500, fontSize: 14 }}
            >
              {item.product.name}
            </Text>
            <Text style={{ color: COLORS.secondary, fontSize: 12 }}>
              Size: {item.size}
            </Text>
          </View>

          <TouchableOpacity onPress={onRemove}>
            <Ionicons name="close-circle-outline" size={20} color="#FF4C3B" />
          </TouchableOpacity>
        </View>

        {/* price and quantity */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 8,
          }}
        >
          <Text
            style={{ color: COLORS.primary, fontWeight: 700, fontSize: 16 }}
          >
            ${item.product.price.toFixed(2)}
          </Text>
          <View style={styles.cartItemRemove}>
            <TouchableOpacity
              style={{ padding: 4 }}
              onPress={() =>
                onUpdateQuantity && onUpdateQuantity(item.quantity - 1)
              }
            >
              <Ionicons name="remove" size={16} color={COLORS.primary} />
            </TouchableOpacity>

            <Text
              style={{
                color: COLORS.primary,
                fontWeight: 500,
                marginHorizontal: 12,
              }}
            >
              {item.quantity}
            </Text>

            <TouchableOpacity
              style={{ padding: 4 }}
              onPress={() =>
                onUpdateQuantity && onUpdateQuantity(item.quantity + 1)
              }
            >
              <Ionicons name="add" size={16} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cartItemImg: {
    width: 80,
    height: 80,
    backgroundColor: "#f3f4f6", // bg-gray-100
    borderRadius: 8,
    overflow: "hidden",
    marginRight: 12,
  },
  cartItemRemove: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F9FF",
    borderRadius: 9999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});
