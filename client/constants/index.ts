export const COLORS = {
  primary: "#111111",
  secondary: "#666666",
  background: "#FFFFFF",
  surface: "#F7F7F7",
  accent: "#FF4C3B",
  border: "#EEEEEE",
  error: "#FF4444",
  gray100: "#f3f4f6",
  gray400: "#9ca3af",
};

export const CATEGORIES = [
  { id: 1, name: "Men", icon: "man-outline" },
  { id: 2, name: "Women", icon: "woman-outline" },
  { id: 3, name: "Kids", icon: "happy-outline" },
  { id: 4, name: "Shoes", icon: "footsteps-outline" },
  { id: 5, name: "Bag", icon: "briefcase-outline" },
  { id: 6, name: "Other", icon: "grid-outline" },
];

export const PROFILE_MENU = [
  { id: 1, title: "My Orders", icon: "receipt-outline", route: "/orders" },
  {
    id: 2,
    title: "Shipping Addresses",
    icon: "location-outline",
    route: "/addresses",
  },
  { id: 4, title: "My Reviews", icon: "star-outline", route: "/" },
  { id: 5, title: "Settings", icon: "settings-outline", route: "/" },
];

export const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "placed":
      return {
        backgroundColor: "#fefce8", // yellow-50
        color: "#854d0e", // yellow-900
      };
    case "processing":
      return {
        backgroundColor: "#e0e7ff", // indigo-50
        color: "#312e81", // indigo-900
      };
    case "shipped":
      return {
        backgroundColor: "#f3e8ff", // purple-50
        color: "#4c1d95", // purple-900
      };
    case "delivered":
      return {
        backgroundColor: "#ecfdf5", // green-50
        color: "#14532d", // green-900
      };
    case "cancelled":
      return {
        backgroundColor: "#fef2f2", // red-50
        color: "#7f1d1d", // red-900
      };
    default:
      return {
        backgroundColor: "#f1f5f9", // gray-50
        color: "#1e2937", // gray-900
      };
  }
};
