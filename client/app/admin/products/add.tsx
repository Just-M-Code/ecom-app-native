import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Switch,
  Image,
  ActivityIndicator,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
  StyleSheet,
} from "react-native";
import Toast from "react-native-toast-message";
import { COLORS } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { CATEGORIES } from "@/constants";
import { useAuth } from "@clerk/expo";
import { useRouter } from "expo-router";
import api from "@/constants/api";

export default function AddProduct() {
  const router = useRouter();
  const { getToken } = useAuth();

  const [submitting, setSubmitting] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("Men");
  const [sizes, setSizes] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);

  // PICK MULTIPLE IMAGES (MAX 5)
  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 5,
      quality: 0.8,
    });

    if (!result.canceled) {
      const uris = result.assets.map((asset) => asset.uri);
      setImages(uris.slice(0, 5));
    }
  };

  // Add Product
  const handleSubmit = async () => {
    if (!name || !price || !category || sizes.length < 1) {
      Toast.show({
        type: "error",
        text1: "Missing Fields",
        text2: "Please fill in all required fields",
      });
      return;
    }
    try {
      setSubmitting(true);
      const token = await getToken();
      const formData = new FormData();

      // basic fields
      const fields = {
        name,
        description,
        price,
        stock: stock || "0",
        category,
        isFeatured: String(isFeatured),
        sizes,
      };

      Object.entries(fields).forEach(([key, value]) =>
        formData.append(key, value),
      );

      // Images
      for (const [i, uri] of images.entries()) {
        const filename = `images-${1}.jpg`;

        formData.append("images", {
          uri,
          name: filename,
          type: "image/jpeg",
        } as any);
      }

      const { data } = await api.post("/products", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!data?.success) throw new Error("Upload failed");

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Product created",
      });
      router.replace("/admin/products");
    } catch (error: any) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Failed to Create Product",
        text2: error.response?.data?.message || "Something went wrong",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        {/* NAME */}
        <Text style={styles.label}>Product Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Wireless Headphones"
          value={name}
          onChangeText={setName}
        />

        {/* PRICE */}
        <Text style={styles.label}>Price ($) *</Text>
        <TextInput
          style={styles.input}
          placeholder="0.00"
          keyboardType="decimal-pad"
          value={price}
          onChangeText={setPrice}
        />

        {/* CATEGORY */}
        <Text style={styles.label}>Category</Text>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.categoryButton}
        >
          <Text style={{ color: COLORS.primary }}>{category}</Text>
          <Ionicons name="chevron-down" size={20} color={COLORS.secondary} />
        </TouchableOpacity>

        {/* CATEGORY MODAL */}
        <Modal visible={modalVisible} animationType="slide" transparent>
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select Category</Text>

                <FlatList
                  data={CATEGORIES}
                  keyExtractor={(item) => String(item.id)}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.categoryItem,
                        category === item.name && styles.selectedCategoryItem,
                      ]}
                      onPress={() => {
                        setCategory(item.name);
                        setModalVisible(false);
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text
                          style={[
                            { fontSize: 16 },
                            category === item.name && {
                              fontWeight: "700",
                              color: "#3b82f6",
                            },
                          ]}
                        >
                          {item.name}
                        </Text>
                        {category === item.name && (
                          <Ionicons
                            name="checkmark"
                            size={20}
                            color={COLORS.primary}
                          />
                        )}
                      </View>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* STOCK */}
        <Text style={styles.label}>Stock Level</Text>
        <TextInput
          style={styles.stockInput}
          placeholder="0"
          keyboardType="number-pad"
          value={stock}
          onChangeText={setStock}
        />

        {/* SIZES */}
        <Text style={styles.label}>Sizes (comma separated)</Text>
        <TextInput
          style={styles.sizesInput}
          placeholder="e.g. S, M, L, XL"
          value={sizes}
          onChangeText={setSizes}
        />

        {/* IMAGE PICKER */}
        <Text style={styles.label}>Product Images (max 5)</Text>

        <TouchableOpacity onPress={pickImages} style={{ marginBottom: 16 }}>
          {images.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {images.map((uri, i) => (
                <Image
                  key={i}
                  source={{ uri }}
                  style={{
                    width: 128,
                    height: 128,
                    borderRadius: 8,
                    marginRight: 8,
                  }}
                />
              ))}
            </ScrollView>
          ) : (
            <View style={styles.imageUploadContainer}>
              <Ionicons
                name="cloud-upload-outline"
                size={32}
                color={COLORS.secondary}
              />
              <Text
                style={{ color: COLORS.secondary, fontSize: 12, marginTop: 8 }}
              >
                Tap to upload images
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* DESCRIPTION */}
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.descriptionInput}
          multiline
          value={description}
          onChangeText={setDescription}
        />

        {/* FEATURED */}
        <View style={styles.featuredRow}>
          <Text style={styles.featuredText}>Featured Product</Text>
          <Switch
            value={isFeatured}
            onValueChange={setIsFeatured}
            trackColor={{ false: "#eee", true: COLORS.primary }}
          />
        </View>

        {/* SUBMIT */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={submitting}
          style={[
            styles.submitButton,
            submitting && styles.submitButtonDisabled,
          ]}
        >
          {submitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.submitText}>Create Product</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface, // bg-surface (adjust color as needed)
    padding: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 80,
  },
  label: {
    color: COLORS.primary, // text-secondary
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  input: {
    backgroundColor: COLORS.surface, // bg-surface
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    color: COLORS.primary, // text-primary
    fontSize: 16,
  },
  categoryButton: {
    backgroundColor: "#f1f3f5",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    maxHeight: "50%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 16,
  },
  categoryItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  selectedCategoryItem: {
    backgroundColor: "#1111110d", // primary/5
  },
  stockInput: {
    backgroundColor: "#f1f3f5",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    color: "#1e2937",
    fontSize: 16,
  },
  sizesInput: {
    backgroundColor: "#f1f3f5",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    color: "#1e2937",
    fontSize: 16,
  },
  imageUploadContainer: {
    width: "100%",
    height: 128,
    borderRadius: 8,
    backgroundColor: "#f8fafc",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#cbd5e1",
    marginBottom: 16,
  },
  descriptionInput: {
    backgroundColor: "#f1f3f5",
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
    color: "#1e2937",
    fontSize: 16,
    height: 96,
    textAlignVertical: "top",
  },
  featuredRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  featuredText: {
    color: "#1e2937",
    fontWeight: "700",
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: COLORS.primary, // bg-primary
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 18,
  },
});
