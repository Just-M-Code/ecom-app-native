import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Switch,
  Image,
  ActivityIndicator,
  Platform,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
  StyleSheet,
} from "react-native";
import Toast from "react-native-toast-message";
import { COLORS, CATEGORIES } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "@clerk/expo";
import api from "@/constants/api";

export default function EditProduct() {
  const { getToken } = useAuth();
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [sizes, setSizes] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);

  // Image State
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        if (data.success) {
          const product = data.data;
          setName(product.name);
          setDescription(product.description || "");
          setPrice(product.price.toString());
          setStock(product.stock.toString());
          setCategory(
            typeof product.category === "object"
              ? product.category.name
              : product.category,
          );
          setIsFeatured(product.isFeatured);

          if (product.sizes)
            setSizes(
              Array.isArray(product.sizes)
                ? product.sizes.join(", ")
                : product.sizes,
            );

          if (product.images && Array.isArray(product.images)) {
            setExistingImages(product.images);
          } else if (product.images) {
            setExistingImages([product.images]);
          }
        }
      } catch (error: any) {
        console.error("Failed to fetch product:", error);
        Toast.show({
          type: "error",
          text1: "Failed to Fetch Product",
          text2: error.response?.data?.message || "Something went wrong",
        });
        router.back();
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 5 - (existingImages.length + newImages.length),
      quality: 0.8,
    });

    if (!result.canceled) {
      const uris = result.assets.map((asset) => asset.uri);
      setNewImages([...newImages, ...uris]);
    }
  };

  const removeExistingImage = (index: number) => {
    const updated = [...existingImages];
    updated.splice(index, 1);
    setExistingImages(updated);
  };

  const removeNewImage = (index: number) => {
    const updated = [...newImages];
    updated.splice(index, 1);
    setNewImages(updated);
  };

  const handleSubmit = async () => {
    if (!name || !price || sizes.length < 1) {
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

      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("stock", stock);
      formData.append("category", category);
      formData.append("isFeatured", String(isFeatured));
      formData.append("sizes", sizes);

      // Append existing images
      existingImages.forEach((img) => {
        formData.append("existingImages", img);
      });

      // Append new images
      for (const [i, uri] of newImages.entries()) {
        const filename = `new-image-${i}.jpg`;
        if (Platform.OS === "web") {
          const blob = await (await fetch(uri)).blob();
          formData.append(
            "images",
            new File([blob], filename, { type: "image/jpeg" }),
          );
        } else {
          formData.append("images", {
            uri,
            name: filename,
            type: "image/jpeg",
          } as any);
        }
      }
      const { data } = await api.put(`/products/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.success) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Product updated successfully",
        });
        router.replace("/admin/products");
      }
    } catch (error: any) {
      console.error("Failed to update product:", error);
      Toast.show({
        type: "error",
        text1: "Failed to Update Product",
        text2: error.response?.data?.message || "Something went wrong",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.surface, padding: 16 }}
    >
      <View style={styles.card}>
        <Text style={styles.label}>Product Name *</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />

        <Text style={styles.label}>Price ($) *</Text>
        <TextInput
          style={styles.input}
          keyboardType="decimal-pad"
          value={price}
          onChangeText={setPrice}
        />

        <Text style={styles.label}>Stock Level</Text>
        <TextInput
          style={styles.input}
          keyboardType="number-pad"
          value={stock}
          onChangeText={setStock}
        />

        <Text style={styles.label}>Sizes (comma separated)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. S, M, L"
          value={sizes}
          onChangeText={setSizes}
        />

        <Text style={styles.label}>Category</Text>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.categoryButton}
        >
          <Text style={{ color: COLORS.primary }}>
            {category || "Select Category"}
          </Text>
          <Ionicons name="chevron-down" size={20} color={COLORS.secondary} />
        </TouchableOpacity>

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
                        { padding: 16, borderBottomWidth: 1 },
                        category === item.name
                          ? { backgroundColor: "rgba(17, 17, 17, 0.05)" }
                          : "",
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
                            category === item.name
                              ? { fontWeight: 700, color: COLORS.primary }
                              : "",
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

        <Text style={styles.label}>Images</Text>
        <View style={{ marginBottom: 16 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {existingImages.map((uri, index) => (
              <View
                key={`existing-${index}`}
                style={{ position: "relative", marginRight: 8 }}
              >
                <Image
                  source={{ uri }}
                  style={{ width: 96, height: 96, borderRadius: 8 }}
                />
                <TouchableOpacity
                  onPress={() => removeExistingImage(index)}
                  style={styles.removeButton}
                >
                  <Ionicons name="close" size={12} color="white" />
                </TouchableOpacity>
              </View>
            ))}
            {newImages.map((uri, index) => (
              <View
                key={`new-${index}`}
                style={{ position: "relative", marginRight: 8 }}
              >
                <Image source={{ uri }} style={styles.newImage} />
                <TouchableOpacity
                  onPress={() => removeNewImage(index)}
                  style={styles.removeButtonPrimary}
                >
                  <Ionicons name="close" size={12} color="white" />
                </TouchableOpacity>
              </View>
            ))}
            {existingImages.length + newImages.length < 5 && (
              <TouchableOpacity
                onPress={pickImages}
                style={styles.addImageButton}
              >
                <Ionicons name="add" size={24} color={COLORS.secondary} />
                <Text
                  style={{
                    fontSize: 12,
                    color: COLORS.secondary,
                    marginTop: 4,
                  }}
                >
                  Add
                </Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.descriptionInput}
          multiline
          textAlignVertical="top"
          value={description}
          onChangeText={setDescription}
        />

        <View style={styles.featuredRow}>
          <Text style={{ color: COLORS.primary, fontWeight: 700 }}>
            Featured Product
          </Text>
          <Switch
            value={isFeatured}
            onValueChange={setIsFeatured}
            trackColor={{ false: "#eee", true: COLORS.primary }}
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, submitting ? { opacity: 0.7 } : ""]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={{ color: "#fff", fontWeight: 500, fontSize: 18 }}>
              Update Product
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.surface,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.gray100,
    marginBottom: 80,
  },
  label: {
    color: COLORS.secondary,
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 1,
    textTransform: "uppercase",
  },
  input: {
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: 8,
    color: COLORS.primary,
  },
  categoryButton: {
    backgroundColor: COLORS.surface,
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
    backgroundColor: "#00000050",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    maxHeight: "50%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 700,
    textAlign: "center",
    marginBottom: 16,
  },
  removeButton: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "#00000050",
    borderRadius: 9999,
    padding: 4,
  },
  removeButtonPrimary: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: COLORS.primary,
    borderRadius: 9999,
    padding: 4,
  },
  newImage: {
    width: 96,
    height: 96,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  descriptionInput: {
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
    color: COLORS.primary,
    height: 96,
  },
  addImageButton: {
    width: 96,
    height: 96,
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#d1d5db",
  },
  featuredRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
});
