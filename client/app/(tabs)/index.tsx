import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import { BANNERS, dummyProducts } from "@/assets/assets";
import { useRouter } from "expo-router";
import { CATEGORIES } from "@/constants";
import CategoryItem from "@/components/CategoryItem";
import { Product } from "@/constants/types";
import ProductCard from "@/components/ProductCard";

const { width } = Dimensions.get("window");

export default function Home() {
  const router = useRouter();
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = [{ id: "all", name: "All", icon: "grid" }, ...CATEGORIES];

  const fetchProducts = async () => {
    setProducts(dummyProducts);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header title="3D Stockholm" showMenu showCart showLogo />

      <ScrollView
        style={styles.bannerContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner Slider */}
        <View style={{ marginBottom: 24 }}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={styles.bannerScrollHorizontal}
            scrollEventThrottle={16}
            onScroll={(e) => {
              const slide = Math.ceil(
                e.nativeEvent.contentOffset.x /
                  e.nativeEvent.layoutMeasurement.width,
              );
              if (slide !== activeBannerIndex) {
                setActiveBannerIndex(slide);
              }
            }}
          >
            {BANNERS.map((banner, index) => (
              <View key={index} style={styles.bannerSize}>
                <Image
                  source={{ uri: banner.image }}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                />

                <View
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                    backgroundColor: "rgba(0,0,0,0.4)",
                  }}
                />

                <View style={styles.bannerTextPos}>
                  <Text style={styles.bannerTitle}>{banner.title}</Text>

                  <Text style={styles.bannerSubtitle}>{banner.subtitle}</Text>

                  <TouchableOpacity style={styles.bannerButton}>
                    <Text style={styles.bannerButtonText}>Get Now</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
          {/* Pagination Dots */}
          <View style={styles.pagination}>
            {BANNERS.map((_, index) => {
              const isActive = index === activeBannerIndex;

              return (
                <View
                  key={index}
                  style={[
                    styles.paginationDots,
                    {
                      width: isActive ? 24 : 8,
                      backgroundColor: isActive ? "#393939" : "#b1b1b1",
                    },
                  ]}
                />
              );
            })}
          </View>
        </View>

        {/* Categories */}
        <View style={{ marginBottom: 24 }}>
          <View style={styles.categories}>
            <Text style={styles.categoriesText}>Categories</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((cat: any) => (
              <CategoryItem
                key={cat.id}
                item={cat}
                isSelected={false}
                onPress={() =>
                  router.push({
                    pathname: "/shop",
                    params: { category: cat.id === "all" ? "" : cat.name },
                  })
                }
              />
            ))}
          </ScrollView>
        </View>

        {/* Popular Products */}
        <View style={{ marginBottom: 32 }}>
          <View style={styles.popularPos}>
            <Text style={styles.popularText}>Popular</Text>

            <TouchableOpacity onPress={() => router.push("/shop")}>
              <Text style={styles.secondaryText}>See All</Text>
            </TouchableOpacity>
          </View>
          {loading ? (
            <ActivityIndicator size="large" />
          ) : (
            <View style={styles.popularGrid}>
              {products.slice(0, 4).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </View>
          )}
        </View>

        {/* Newsletter CTA */}

        <View style={styles.newsletterBg}>
          <Text style={styles.newsletterCtaTitle}>Join the revolution</Text>
          <Text
            style={{ color: "#666666", textAlign: "center", marginBottom: 16 }}
          >
            Subscribe to our newsletter and get 10% off on your first purchase.
          </Text>
          <TouchableOpacity style={styles.newsletterCtaButton}>
            <Text style={{ color: "white", fontWeight: "500", fontSize: 16 }}>
              Subscribe Now
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bannerContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  bannerSize: {
    position: "relative",
    width: width - 32,
    height: 192, // h-48 = 48 * 4
    backgroundColor: "#e5e7eb", // bg-gray-200
    overflow: "hidden",
  },
  bannerScrollHorizontal: {
    width: "100%",
    height: 192,
    borderRadius: 12,
  },
  bannerTextPos: {
    position: "absolute",
    bottom: 16,
    left: 16,
    zIndex: 10,
  },
  bannerTitle: {
    color: "white",
    fontSize: 24, // text-2xl
    fontWeight: "700",
  },
  bannerSubtitle: {
    color: "white",
    fontSize: 12, // text-xs
    fontWeight: "500",
  },
  bannerButtonText: {
    color: "#171717",
    fontSize: 12, // text-xs
    fontWeight: "700",
  },
  bannerButton: {
    marginTop: 8,
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
    alignSelf: "flex-start",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
  },
  paginationDots: {
    height: 8,
    marginRight: 8,
    borderRadius: 9999,
  },
  categories: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
  },
  categoriesText: {
    fontSize: 20,
    fontWeight: 700,
    color: "#171717",
  },
  popularText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#171717",
  },
  secondaryText: {
    fontSize: 14,
    color: "#666666",
  },
  popularPos: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  popularGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  newsletterBg: {
    padding: 24,
    alignItems: "center",
    backgroundColor: "oklch(96.7% 0.003 264.542)", //gray-100
    marginBottom: 80,
    borderRadius: 16,
  },
  newsletterCtaTitle: {
    fontSize: 24,
    fontWeight: 700,
    color: "#171717",
    marginBottom: 8,
    textAlign: "center",
  },
  newsletterCtaButton: {
    backgroundColor: "#171717",
    width: "80%", // w-4/5
    paddingVertical: 12, // py-3
    borderRadius: 9999, // rounded-full
    alignItems: "center", // items-center
  },
});
