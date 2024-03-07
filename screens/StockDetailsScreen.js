import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  StyleSheet,
} from "react-native";
import { BottomSheet } from "@gorhom/bottom-sheet";

const StockDetailsScreen = ({ route }) => {
  const { stock } = route.params;

  const openWebsite = () => {
    if (stock.website) {
      Linking.openURL(stock.website);
    }
  };

  const priceChangePercentage =
    ((stock.closePrice - stock.openPrice) / stock.openPrice) * 100;

  return (
    <BottomSheet snapPoints={["50%"]}>
      <View style={styles.container}>
        <Text style={styles.stockSymbol}>{stock.symbol}</Text>
        <Text style={styles.stockName}>{stock.name}</Text>
        <Text
          style={[
            styles.priceChangePercentage,
            {
              color:
                priceChangePercentage > 0
                  ? "green"
                  : priceChangePercentage < 0
                  ? "red"
                  : "grey",
            },
          ]}
        >
          {priceChangePercentage.toFixed(2)}%
        </Text>
        <Text style={styles.description}>{stock.description}</Text>
        <View style={styles.statistics}>
          <Text>Close: {stock.closePrice}</Text>
          <Text>Open: {stock.openPrice}</Text>
          <Text>High: {stock.highPrice}</Text>
          <Text>Low: {stock.lowPrice}</Text>
        </View>
        <TouchableOpacity
          style={styles.openWebsiteButton}
          onPress={openWebsite}
          disabled={!stock.website}
        >
          <Text style={styles.buttonText}>Open Website</Text>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  stockSymbol: {
    fontSize: 24,
    fontWeight: "bold",
  },
  stockName: {
    fontSize: 18,
    marginBottom: 8,
  },
  priceChangePercentage: {
    fontSize: 18,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 8,
  },
  statistics: {
    marginBottom: 8,
  },
  openWebsiteButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
  },
});

export default StockDetailsScreen;
