import React from "react";
import { StyleSheet, View, Dimensions, ViewStyle } from "react-native";
import SkeletonLoader from "expo-skeleton-loader";

const { width, height } = Dimensions.get("window");

const numberOfStocks = new Array(10).fill(null);

export default function StockSkeleton() {
  return (
    <View style={styles.container}>
      {numberOfStocks.map((_, i) => (
        <SkeletonLoader
          highlightColor="#242639"
          boneColor="#323443"
          key={i}
          style={[
            {
              width: (width - 60) / 2,
            },
          ]}
        >
          <SkeletonLoader.Container
            style={[
              {
                flexDirection: "col",
                justifyContent: "center",
                alignItems: "center",
                width: (width - 60) / 2,
                height: height / 6.5,
                backgroundColor: "#242639",
                borderWidth: 0.5,
                borderColor: "#323443",
                gap: 10,
                borderRadius: 20,
                padding: 10,
              },
            ]}
          >
            <SkeletonLoader.Item
              style={{
                width: 35,
                height: 35,
                borderRadius: 10,
                backgroundColor: "#2C2E45",
                borderWidth: 1,
                borderRadius: 10,
                borderColor: "#323443",
              }}
            />
            <SkeletonLoader.Item
              style={{
                width: 63,
                height: 21,
                borderRadius: 10,
                backgroundColor: "#2C2E45",
                borderWidth: 1,
                borderRadius: 10,
                borderColor: "#323443",
              }}
            />
            <SkeletonLoader.Item
              style={{
                width: 108,
                height: 15,
                borderRadius: 10,
                backgroundColor: "#2C2E45",
                borderWidth: 1,
                borderRadius: 10,
                borderColor: "#323443",
              }}
            />
          </SkeletonLoader.Container>
        </SkeletonLoader>
      ))}
    </View>
  );
}

const styles = {
  container: {
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 20,
  },

  skeletonContainer: {
    paddingHorizontal: 20,
  },
  skeletonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
};
