import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { CategoryItemProps } from "@/constants/types";
import { Ionicons } from "@expo/vector-icons";

export default function CategoryItem({
  item,
  isSelected,
  onPress,
}: CategoryItemProps) {
  const backgroundColor = isSelected ? "#171717" : "#F7F7F7";
  const textColor = isSelected ? "#171717" : "#666666";
  return (
    <TouchableOpacity style={styles.iconPos}>
      <View style={[styles.iconStyle, { backgroundColor }]}>
        <Ionicons
          name={item.icon as any}
          size={24}
          color={isSelected ? "#fff" : "#171717"}
        />
      </View>
      <Text style={[styles.iconText, { color: textColor }]}>{item.name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  iconPos: {
    marginRight: 16, // mr-4
    alignItems: "center", // items-center
  },
  iconStyle: {
    width: 56, // w-14
    height: 56, // h-14
    borderRadius: 9999, // rounded-full
    alignItems: "center", // items-center
    justifyContent: "center", // justify-center
    marginBottom: 8, // mb-2
  },
  iconText: {
    fontSize: 14, // text-sm
    fontWeight: "500", // font-medium
  },
});
