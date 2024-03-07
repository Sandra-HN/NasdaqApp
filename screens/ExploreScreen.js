import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import axios from "axios";
const { width, height } = Dimensions.get("window");
import StockSkeleton from "./components/StockSkeleton";
const ExploreScreen = ({ navigation }) => {
  const [stocks, setStocks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextUrl, setNextUrl] = useState("");
  const fetchStocks = async (apiurl) => {
    try {
      const response = await axios.get(apiurl, {
        params: {
          apiKey: process.env.EXPO_PUBLIC_API_KEY,
          active: true,
          limit: 10,
        },
      });
      if (response?.data?.results)
        setStocks((prevStocks) => [...prevStocks, ...response.data.results]);

      setNextUrl(response.data.next_url);
      setLoading(false);
      setLoadingMore(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchStocks(`${process.env.EXPO_PUBLIC_API_URL}/v3/reference/tickers`);
  }, []);
  const loadMoreStocks = () => {
    if (!loadingMore) {
      setLoadingMore(true);
      if (nextUrl !== "") fetchStocks(nextUrl);
    }
  };
  const filteredStocks = stocks?.filter(
    (stock) =>
      stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.ticker.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const OpenStockDetails = async (item) => {
    try {
      let apiurl = `${process.env.EXPO_PUBLIC_API_URL}/v3/reference/tickers/${item.ticker}`;

      const response = await axios.get(apiurl, {
        params: {
          apiKey: process.env.EXPO_PUBLIC_API_KEY,
        },
      });

      if (response?.data?.results)
        navigation.navigate("StockDetails", { stock: response.data.results });
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };
  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      key={index}
      style={styles.stockContainer}
      onPress={() => OpenStockDetails(item)}
    >
      <View style={styles.stockItem}>
        <View style={styles.stockIconContainer}>
          <Text style={styles.stockIcon}>{item.ticker.slice(0, 2)}</Text>
        </View>
        <Text style={styles.stockTicker}>{item.ticker}</Text>
        <Text style={styles.stockName}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../assets/nasdaq-logo.png")}
          style={styles.logo}
        />
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a stock"
          placeholderTextColor="rgba(255,255,255,0.25)"
          onChangeText={(text) => setSearchQuery(text)}
        />
      </View>
      {loading ? (
        <StockSkeleton />
      ) : (
        <FlatList
          columnWrapperStyle={{
            justifyContent: "space-between",
            paddingHorizontal: 30,
            paddingVertical: 20,
          }}
          data={stocks}
          keyExtractor={(item, i) => item.ticker + i}
          onEndReached={loadMoreStocks}
          onEndReachedThreshold={1}
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator size="large" color="#323443" />
            ) : null
          }
          numColumns={2}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1F202F",
  },
  header: {
    backgroundColor: "#191A28",
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 0,
    alignItems: "flex-start",
    height: 90,
  },
  logo: {
    width: 100,
    height: 30,
    resizeMode: "contain",
    tintColor: "#FFFFFF",
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  searchInput: {
    margin: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#323443",
    borderRadius: 25,
    height: 40,
    color: "#ffffff",
    backgroundColor: "rgba(36, 38, 57,0.3)",
  },
  stockContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  stockItem: {
    flexDirection: "col",
    justifyContent: "center",
    alignItems: "center",
    width: (width - 100) / 2,
    height: height / 6.5,
    backgroundColor: "#242639",
    borderWidth: 0.5,
    borderColor: "#323443",
    borderRadius: 20,
    gap: 10,
    padding: 10,
  },
  stockTicker: {
    width: 63,
    height: 21,
    borderRadius: 10,
    fontWeight: "700",
    fontSize: 16,
    lineHeight: 20,
    fontFamily: "DMSans-Regular",
    color: "#FFFFFF",
    textAlign: "center",
  },
  stockName: {
    width: 108,
    height: 15,
    borderRadius: 10,
    fontWeight: "400",
    fontSize: 12,
    lineHeight: 15,
    fontFamily: "DMSans-Regular",
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
  },
  stockIconContainer: {
    width: 35,
    height: 35,
    borderRadius: 10,
    backgroundColor: "#242639",
    borderWidth: 1,
    borderRadius: 10,

    borderColor: "#323443",

    alignItems: "center",
    justifyContent: "center",
  },
  stockIcon: {
    fontSize: 12,
    lineHeight: 15,
    fontFamily: "DMSans-Regular",
    textAlign: "center",
    color: "#FFFFFF",
  },
});

export default ExploreScreen;
