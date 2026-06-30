import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import { COLORS } from "@/constants";
import type { Address } from "@/constants/types";
import { dummyAddress } from "@/assets/assets";

export default function Addresses() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  // Form state
  const [type, setType] = useState("Home");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    setAddresses(dummyAddress as any);
    setLoading(false);
  };

  const handleEditSearch = (item: Address) => {
    setIsEditing(true);
    setEditingId(item._id);
    setType(item.type);
    setStreet(item.street);
    setCity(item.city);
    setState(item.state);
    setZipCode(item.zipCode);
    setCountry(item.country);
    setIsDefault(item.isDefault);
    setModalVisible(true);
  };

  const handleSaveAddress = async () => {
    setModalVisible(false);
    resetForm();
    fetchAddresses();
  };

  const handleDeleteAddress = async (id: string) => {};

  const resetForm = () => {
    setStreet("");
    setCity("");
    setState("");
    setZipCode("");
    setCountry("");
    setType("Home");
    setIsDefault(false);
    setIsEditing(false);
    setEditingId(null);
  };

  const openAddModal = () => {
    resetForm();
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header title="Shipping Addresses" showBack />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <ScrollView style={styles.scrollContent}>
          {addresses.length === 0 ? (
            <Text style={styles.emptyText}>No addresses found</Text>
          ) : (
            addresses.map((item) => (
              <View key={item._id} style={styles.addressCard}>
                <View style={styles.addressHeader}>
                  <View style={styles.addressTypeContainer}>
                    <Ionicons
                      name={
                        item.type === "Home"
                          ? "home-outline"
                          : "briefcase-outline"
                      }
                      size={20}
                      color={COLORS.primary}
                    />
                    <Text style={styles.addressType}>{item.type}</Text>
                    {item.isDefault && (
                      <View style={styles.defaultBadge}>
                        <Text style={styles.defaultBadgeText}>Default</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.actionButtons}>
                    <TouchableOpacity onPress={() => handleEditSearch(item)}>
                      <Ionicons
                        name="pencil-outline"
                        size={20}
                        color={COLORS.secondary}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDeleteAddress(item._id)}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={20}
                        color={COLORS.error || "#ff4444"}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <Text style={styles.addressText}>
                  {item.street}, {item.city}, {item.state} {item.zipCode},{" "}
                  {item.country}
                </Text>
              </View>
            ))
          )}

          <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
            <Ionicons name="add" size={24} color={COLORS.secondary} />
            <Text style={styles.addButtonText}>Add New Address</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* Add Address Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {isEditing ? "Edit Address" : "Add New Address"}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.primary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.label}>Label</Text>
              <View style={styles.typeButtonContainer}>
                {["Home", "Work", "Other"].map((t) => (
                  <TouchableOpacity
                    key={t}
                    onPress={() => setType(t)}
                    style={[
                      styles.typeButton,
                      type === t
                        ? styles.typeButtonActive
                        : {
                            backgroundColor: "#ffffff",
                            borderColor: "#d1d5db",
                          },
                    ]}
                  >
                    <Text
                      style={
                        type === t
                          ? styles.typeButtonTextActive
                          : { color: "#1e2937" }
                      }
                    >
                      {t}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Street Address</Text>
              <TextInput
                style={styles.input}
                placeholder="123 Main St"
                value={street}
                onChangeText={setStreet}
              />

              <View style={{ flexDirection: "row", gap: 16, marginBottom: 16 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>City</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="New York"
                    value={city}
                    onChangeText={setCity}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>State</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="NY"
                    value={state}
                    onChangeText={setState}
                  />
                </View>
              </View>

              <View style={{ flexDirection: "row", gap: 16, marginBottom: 16 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Zip Code</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="10001"
                    value={zipCode}
                    onChangeText={setZipCode}
                    keyboardType="numeric"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Country</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="USA"
                    value={country}
                    onChangeText={setCountry}
                  />
                </View>
              </View>

              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => setIsDefault(!isDefault)}
              >
                <View
                  style={[
                    styles.checkbox,
                    isDefault
                      ? {
                          backgroundColor: COLORS.primary,
                          borderColor: COLORS.primary,
                        }
                      : { borderColor: "#d1d5db" },
                  ]}
                >
                  {isDefault && (
                    <Ionicons name="checkmark" size={14} color="white" />
                  )}
                </View>
                <Text style={{ color: COLORS.primary }}>
                  Set as default address
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveAddress}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.saveButtonText}>Save Address</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa", // bg-surface
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  emptyText: {
    textAlign: "center",
    color: COLORS.secondary, // text-secondary
    marginTop: 40,
    fontSize: 16,
  },
  addressCard: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  addressHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  addressTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  addressType: {
    color: COLORS.primary, // text-primary
    fontWeight: "700",
    fontSize: 16,
    marginLeft: 8,
  },
  defaultBadge: {
    backgroundColor: "#1111111A", // bg-primary/10
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  defaultBadgeText: {
    color: COLORS.primary, // text-primary (using primary color)
    fontSize: 12,
    fontWeight: "700",
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  addressText: {
    color: COLORS.secondary, // text-secondary
    lineHeight: 22,
    marginLeft: 28,
  },

  /* Add New Button */
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#d1d5db", // border-gray-300
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 32,
  },
  addButtonText: {
    color: COLORS.secondary, // text-secondary
    fontWeight: "500",
    marginLeft: 8,
  },

  /* Modal */
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)", // bg-black/50
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    height: "85%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.primary, // text-primary
  },
  label: {
    color: COLORS.primary, // text-primary
    fontWeight: "500",
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.surface, // bg-surface
    padding: 16,
    borderRadius: 12,
    color: COLORS.primary, // text-primary
    marginBottom: 16,
  },
  typeButtonContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
  typeButtonActive: {
    backgroundColor: COLORS.primary, // bg-primary (using primary color)
    borderColor: COLORS.primary, // border-primary
  },
  typeButtonTextActive: {
    color: "#ffffff",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: 4,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButton: {
    backgroundColor: COLORS.primary, // bg-primary
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 18,
  },
});
