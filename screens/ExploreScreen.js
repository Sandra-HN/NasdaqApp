import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  useLayoutEffect,
} from "react";
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
  SafeAreaView,
  ScrollView,
  Button,
  Linking,
} from "react-native";
import axios from "axios";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
const { width, height } = Dimensions.get("window");
import StockSkeleton from "./components/StockSkeleton";

import getSymbolFromCurrency from "currency-symbol-map";
import MyWebView from "./components/MyWebView";

const ExploreScreen = ({ navigation }) => {
  const bottomSheetModalRef = useRef(null);
  const [isModalFullScreen, setIsModalFullScreen] = useState(false);

  const [stocks, setStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [openWebView, setOpenWebView] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextUrl, setNextUrl] = useState("");
  // Update navigation options dynamically
  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerShown: !isModalFullScreen,
  //   });
  // }, [navigation, isModalFullScreen]);
  const fetchStocks = async (apiurl, searchText) => {
    try {
      const response = await axios.get(apiurl, {
        params: {
          apiKey: process.env.EXPO_PUBLIC_API_KEY,
          active: true,
          limit: 10,
          search: searchText,
        },
      });
      if (response?.data?.results) {
        console.log("stocks", response?.data?.results);

        setStocks((prevStocks) => [...prevStocks, ...response.data.results]);
        setNextUrl(response?.data?.next_url);
      }

      // setStocks([
      //   {
      //     active: true,
      //     cik: "0001090872",
      //     composite_figi: "BBG000BWQYZ5",
      //     currency_name: "usd",
      //     last_updated_utc: "2021-04-25T00:00:00Z",
      //     locale: "us",
      //     market: "stocks",
      //     name: "Agilent Technologies Inc.",
      //     primary_exchange: "XNYS",
      //     share_class_figi: "BBG001SCTQY4",
      //     ticker: "A",
      //     type: "CS",
      //   },
      // ]);
      setLoading(false);
      setLoadingMore(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchStocks(
      `${process.env.EXPO_PUBLIC_API_URL}/v3/reference/tickers`,
      searchQuery
    );
  }, [searchQuery]);
  const loadMoreStocks = () => {
    if (!loadingMore) {
      setLoadingMore(true);
      if (nextUrl !== "") fetchStocks(nextUrl);
    }
  };
  const getStockAggs = async (ticker) => {
    try {
      let apiurl = `${process.env.EXPO_PUBLIC_API_URL}/v2/aggs/ticker/${ticker}/prev`;
      const response = await axios.get(apiurl, {
        params: {
          apiKey: process.env.EXPO_PUBLIC_API_KEY,
          adjusted: true,
        },
      });

      if (response.data.results && response.data.results.length > 0) {
        console.log("aggs", response?.data?.results[0]);
        return response.data.results[0];
      }
      // return {
      //   T: "AAPL",
      //   c: 115.97,
      //   h: 117.59,
      //   l: 114.13,
      //   o: 115.55,
      //   t: 1605042000000,
      //   v: 131704427,
      //   vw: 116.3058,
      // };
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };
  const getStockDetails = async (ticker) => {
    try {
      const aggs = await getStockAggs(ticker);
      let apiurl = `${process.env.EXPO_PUBLIC_API_URL}/v3/reference/tickers/${ticker}`;
      const response = await axios.get(apiurl, {
        params: {
          apiKey: process.env.EXPO_PUBLIC_API_KEY,
        },
      });

      if (response?.data?.results) {
        console.log("stock", response?.data?.results);
        const stock = response?.data?.results;
        // const stock = {
        //   ticker: "AAPL",
        //   name: "Apple Inc.",
        //   market: "stocks",
        //   locale: "us",
        //   primary_exchange: "XNAS",
        //   type: "CS",
        //   active: true,
        //   currency_name: "usd",
        //   cik: "0000320193",
        //   composite_figi: "BBG000B9XRY4",
        //   share_class_figi: "BBG001S5N8V8",
        //   market_cap: 2636392343130,
        //   phone_number: "(408) 996-1010",
        //   address: {
        //     address1: "ONE APPLE PARK WAY",
        //     city: "CUPERTINO",
        //     state: "CA",
        //     postal_code: "95014",
        //   },
        //   description:
        //     "Apple is among the largest companies in the world, with a broad portfolio of hardware and software products targeted at consumers and businesses. Apple's iPhone makes up a majority of the firm sales, and Apple's other products like Mac, iPad, and Watch are designed around the iPhone as the focal point of an expansive software ecosystem. Apple has progressively worked to add new applications, like streaming video, subscription bundles, and augmented reality. The firm designs its own software and semiconductors while working with subcontractors like Foxconn and TSMC to build its products and chips. Slightly less than half of Apple's sales come directly through its flagship stores, with a majority of sales coming indirectly through partnerships and distribution.",
        //   sic_code: "3571",
        //   sic_description: "ELECTRONIC COMPUTERS",
        //   ticker_root: "AAPL",
        //   homepage_url: "https://www.apple.com",
        //   total_employees: 161000,
        //   list_date: "1980-12-12",
        //   branding: {
        //     logo_url:
        //       "https://api.polygon.io/v1/reference/company-branding/YXBwbGUuY29t/images/2024-03-01_logo.svg",
        //     icon_url:
        //       "https://api.polygon.io/v1/reference/company-branding/YXBwbGUuY29t/images/2024-03-01_icon.jpeg",
        //   },
        //   share_class_shares_outstanding: 15441880000,
        //   weighted_shares_outstanding: 15441881000,
        //   round_lot: 100,
        // };
        console.log({
          aggs: aggs,
          priceChangePercentage: parseFloat(
            ((aggs?.c - aggs?.o) / aggs?.o) * 100
          ).toFixed(2),
          ticker: stock?.ticker ?? "",
          name: stock?.name ?? "",
          description: stock?.description ?? "",
          currency_name: stock?.currency_name ?? "",
          currency_symbol: stock?.currency_name
            ? getSymbolFromCurrency(stock?.currency_name?.toUpperCase())
            : "",
          homepage_url: stock?.homepage_url,
          branding: stock?.branding,
        });
        await setSelectedStock({
          aggs: aggs,
          priceChangePercentage: parseFloat(
            ((aggs?.c - aggs?.o) / aggs?.o) * 100
          ).toFixed(2),
          ticker: stock?.ticker ?? "",
          name: stock?.name ?? "",
          description: stock?.description ?? "",
          currency_name: stock?.currency_name ?? "",
          currency_symbol: stock?.currency_name
            ? getSymbolFromCurrency(stock?.currency_name?.toUpperCase())
            : "",
          homepage_url: stock?.homepage_url,
          branding: stock?.branding,
        });
      }
      bottomSheetModalRef.current?.present();
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };
  const handlePresentModal = async (item) => {
    await getStockDetails(item.ticker);
    bottomSheetModalRef.current?.present();
  };
  const handleCloseModal = () => {
    bottomSheetModalRef.current?.dismiss();
    setIsModalFullScreen(false);
    setOpenWebView(false);
    setSelectedStock(null);
  };
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.stockContainer}
      onPress={() => {
        setIsModalFullScreen(true);
        handlePresentModal(item);
      }}
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

  const openWebsite = () => {
    if (selectedStock.homepage_url) {
      setOpenWebView(true);
    }
  };

  return (
    <BottomSheetModalProvider>
      <View style={styles.container}>
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

      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={["92%"]}
        handleStyle={{ backgroundColor: "#1F202F", height: 0, padding: 0 }}
        backgroundStyle={{ backgroundColor: "#1F202F" }}
        enablePanDownToClose={false}
        enableContentPanningGesture={false}
        onDismiss={() => {
          setIsModalFullScreen(false);
        }}
      >
        <View style={styles.bottomSheetContent}>
          <ScrollView style={styles.bottomSheetContainer}>
            {selectedStock && (
              <View style={{ gap: 150 }}>
                <View style={{ width: "100%", gap: 20 }}>
                  {/* header */}
                  <View style={styles.bottomSheetHeader}>
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 15,
                        alignItems: "center",
                      }}
                    >
                      {selectedStock?.branding?.icon_url ? (
                        <Image
                          source={{
                            uri: `${selectedStock.branding.icon_url}?apiKey=${process.env.EXPO_PUBLIC_API_KEY}`,
                          }}
                          style={{ width: 45, height: 45 }}
                        />
                      ) : (
                        <View
                          style={{
                            width: 45,
                            height: 45,
                            justifyContent: "center",
                            alignItems: "center",
                            borderColor: "#323443",
                            borderWidth: 1,
                            backgroundColor: "#242639",
                          }}
                        >
                          <Text
                            style={{
                              color: "#FFFFFF",
                              fontSize: 20,
                              fontWeight: "700",
                            }}
                          >
                            {selectedStock.ticker.slice(0, 2)}
                          </Text>
                        </View>
                      )}
                      <View style={{ flexDirection: "column" }}>
                        <Text
                          style={{
                            fontSize: 28,
                            fontWeight: "700",
                            fontFamily: "DMSans-Regular",
                            color: "#FFFFFF",
                            lineHeight: 36.46,
                          }}
                        >
                          {selectedStock.ticker}
                        </Text>
                        <View style={{ flexDirection: "row", gap: 5 }}>
                          <Text
                            style={{
                              fontSize: 15,
                              fontWeight: "700",
                              fontFamily: "DMSans-Regular",
                              color: "#FFFFFF",
                              lineHeight: 19.53,
                            }}
                          >
                            {selectedStock?.currency_symbol}
                            {selectedStock?.aggs?.c}
                          </Text>
                          <Text
                            style={{
                              fontSize: 15,
                              fontWeight: "700",
                              fontFamily: "DMSans-Regular",
                              color:
                                selectedStock?.priceChangePercentage &&
                                selectedStock?.priceChangePercentage > 0
                                  ? "#22FF95"
                                  : selectedStock?.priceChangePercentage < 0
                                  ? "red"
                                  : "gray",
                              lineHeight: 19.53,
                            }}
                          >
                            {selectedStock?.priceChangePercentage}%
                          </Text>
                        </View>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={{
                        borderColor: "#323443",
                        borderWidth: 1,
                        backgroundColor: "#242639",
                        borderRadius: 50,
                        justifyContent: "center",
                        alignItems: "center",
                        width: 40,
                        height: 40,
                      }}
                      onPress={() => handleCloseModal()}
                    >
                      <Image
                        source={require("../assets/close.png")}
                        style={{ width: 10, height: 10 }}
                      />
                    </TouchableOpacity>
                  </View>
                  {/* body */}
                  <View
                    style={{
                      paddingBottom: 20,
                      gap: 10,
                      borderBottomWidth: 1,
                      borderBottomColor: "#323443",
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "700",
                        fontSize: 15,
                        fontFamily: "DMSans-Regular",
                        color: "#FFFFFF",
                        lineHeight: 19.53,
                        height: 26,
                      }}
                    >
                      ABOUT
                    </Text>
                    <Text
                      style={{
                        fontWeight: "400",
                        fontSize: 15,
                        fontFamily: "DMSans-Regular",
                        color: "#FFFFFF99",
                        lineHeight: 18,
                        textAlign: "justify",
                      }}
                    >
                      {selectedStock.description}
                    </Text>
                  </View>
                  {/* statistics */}
                  <View
                    style={{
                      paddingBottom: 20,
                      gap: 15,
                      borderBottomWidth: 1,
                      borderBottomColor: "#323443",
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "700",
                        fontSize: 15,
                        fontFamily: "DMSans-Regular",
                        color: "#FFFFFF",
                        lineHeight: 19.53,
                        height: 26,
                      }}
                    >
                      STATISTICS
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <View style={{ width: "45%" }}>
                        <Text
                          style={{
                            color: "#FFFFFF99",
                            fontSize: 15,
                            lineHeight: 19.53,
                            fontWeight: "400",
                            height: 25,
                          }}
                        >
                          Open
                        </Text>
                        <Text
                          style={{
                            color: "#FFFFFF",
                            fontWeight: "700",
                            fontSize: 15,
                            lineHeight: 19.53,
                          }}
                        >
                          {selectedStock?.currency_symbol}
                          {selectedStock?.aggs?.o}
                        </Text>
                      </View>
                      <View style={{ width: "45%" }}>
                        <Text
                          style={{
                            color: "#FFFFFF99",
                            fontSize: 15,
                            lineHeight: 19.53,
                            fontWeight: "400",
                            height: 25,
                          }}
                        >
                          Close
                        </Text>
                        <Text
                          style={{
                            color: "#FFFFFF",
                            fontWeight: "700",
                            fontSize: 15,
                            lineHeight: 19.53,
                          }}
                        >
                          {selectedStock?.currency_symbol}
                          {selectedStock?.aggs?.c}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <View style={{ width: "45%" }}>
                        <Text
                          style={{
                            color: "#FFFFFF99",
                            fontSize: 15,
                            lineHeight: 19.53,
                            fontWeight: "400",
                            height: 25,
                          }}
                        >
                          High
                        </Text>
                        <Text
                          style={{
                            color: "#FFFFFF",
                            fontWeight: "700",
                            fontSize: 15,
                            lineHeight: 19.53,
                          }}
                        >
                          {selectedStock?.currency_symbol}
                          {selectedStock?.aggs?.h}
                        </Text>
                      </View>
                      <View style={{ width: "45%" }}>
                        <Text
                          style={{
                            color: "#FFFFFF99",
                            fontSize: 15,
                            lineHeight: 19.53,
                            fontWeight: "400",
                            height: 25,
                          }}
                        >
                          Low
                        </Text>
                        <Text
                          style={{
                            color: "#FFFFFF",
                            fontWeight: "700",
                            fontSize: 15,
                            lineHeight: 19.53,
                          }}
                        >
                          {selectedStock?.currency_symbol}
                          {selectedStock?.aggs?.l}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    paddingBottom: 30,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      openWebsite();
                    }}
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      height: 50,
                      backgroundColor: "#1F202F",
                      borderWidth: 0.5,
                      borderColor: "#40AFFF",
                      borderRadius: 25,
                      width: "100%",
                      // Shadow properties for iOS
                      shadowColor: "#40AFFF",
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: 1,
                      shadowRadius: 10,
                      // Elevation for Android
                      elevation: 10,
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        width: "100%",
                        color: "#40AFFF",
                        fontSize: 15,
                        fontWeight: "700",
                        lineHeight: 19.53,
                      }}
                    >
                      Visit Website
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </ScrollView>
        </View>
        {selectedStock && (
          <MyWebView
            uri={selectedStock?.homepage_url}
            isVisible={openWebView}
            onClose={() => setOpenWebView(false)}
          />
        )}
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1F202F",
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
    // height: height / 6.5,
    backgroundColor: "#242639",
    borderWidth: 0.5,
    borderColor: "#323443",
    borderRadius: 20,
    gap: 10,
    padding: 20,
  },
  stockTicker: {
    width: 63,
    // height: 21,
    borderRadius: 10,
    fontWeight: "700",
    fontSize: 16,
    lineHeight: 19.53,
    fontFamily: "DMSans-Regular",
    color: "#FFFFFF",
    textAlign: "center",
  },
  stockName: {
    width: 108,
    // height: 15,
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
  bottomSheetContent: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    flex: 1,
  },
  bottomSheetContainer: {
    padding: 10,
  },
  bottomSheetHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    width: "100%",
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#323443",
  },
  logo: { width: 100, height: 30, marginLeft: 40, resizeMode: "contain" },
});

export default ExploreScreen;
