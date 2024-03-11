import React, { RefObject, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import useGetStockList from '../hooks/useGetStockList';
import StockSkeleton from './components/StockSkeleton';
import useGetStockDetails from '../hooks/useGetStockDetails';
import useGetStockAggs from '../hooks/useGetStockAggs';
import StockDetails from './components/StockDetails';
import { StackNavigationProp } from '@react-navigation/stack';

const { width } = Dimensions.get('window');

interface ExploreScreenProps {
  navigation: StackNavigationProp<any>;
}

const ExploreScreen: React.FC<ExploreScreenProps> = ({ navigation }) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [ticker, setTicker] = useState<string | null>(null);

  const {
    data,
    isSuccess,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetStockList({
    apiurl: `${process.env.EXPO_PUBLIC_API_URL}/v3/reference/tickers`,
    pageSize: 10,
    searchText: searchQuery && searchQuery.length > 2 ? searchQuery : '',
  });

  const {
    data: selectedStockData,
    isSuccess: isSuccessStockDetails,
    isLoading: isLoadingStockDetails,
  } = useGetStockDetails({ ticker });

  const {
    data: selectedStockAggsData,
    isSuccess: isSuccessStockAggsDetails,
    isLoading: isLoadingStockAggsDetails,
  } = useGetStockAggs({ ticker });

  const stocksList = useMemo(() => {
    if (data) {
      const res = data ? data?.pages?.flatMap((page) => page.results) : [];
      return res;
    }
    return [];
  }, [data]);

  const selectedStock = useMemo(() => {
    if (selectedStockData && selectedStockAggsData) {
      let aggs = selectedStockAggsData;

      if (selectedStockData.status === 'OK') {
        let Item = selectedStockData?.results;
        Item.aggs = aggs;
        const percentage = ((aggs?.c - aggs?.o) / aggs?.o) * 100;
        Item.priceChangePercentage = percentage.toFixed(2);
        return Item;
      } else {
        return null;
      }
    }
  }, [selectedStockData, selectedStockAggsData, isSuccessStockAggsDetails]);

  const handleEndReached = () => {
    if (!isLoading && isSuccess && stocksList?.length && hasNextPage) {
      fetchNextPage();
    }
  };

  const handlePresentModal = async () => {
    if (!isLoadingStockAggsDetails && !isLoadingStockDetails) {
      bottomSheetModalRef.current?.present();
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity
        style={styles.stockContainer}
        onPress={async () => {
          await setTicker(item.ticker);
          await handlePresentModal();
        }}
      >
        <View style={styles.stockItem}>
          <View style={styles.stockIconContainer}>
            <Text style={styles.stockIcon}>{item.ticker?.slice(0, 2)}</Text>
          </View>
          <Text style={styles.stockTicker}>{item.ticker}</Text>
          <Text style={styles.stockName}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    );
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
        {isLoading ? (
          <StockSkeleton />
        ) : (
          <FlatList
            columnWrapperStyle={{
              justifyContent: 'space-between',
              paddingHorizontal: 30,
              paddingVertical: 20,
            }}
            data={stocksList}
            keyExtractor={(item, i) => item.ticker + i}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              isFetchingNextPage ? (
                <ActivityIndicator size="large" color="#323443" />
              ) : null
            }
            numColumns={2}
            renderItem={renderItem}
          />
        )}
      </View>
      <StockDetails
        selectedStock={selectedStock}
        onClose={() => setTicker(null)}
        bottomSheetModalRef={bottomSheetModalRef}
      />
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F202F',
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
    borderColor: '#323443',
    borderRadius: 25,
    height: 40,
    color: '#ffffff',
    backgroundColor: 'rgba(36, 38, 57,0.3)',
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    // alignContent: "stretch",
    flexWrap: 'wrap',
    backgroundColor: '#242639',
    borderWidth: 0.5,
    borderColor: '#323443',
    borderRadius: 20,
  },
  stockItem: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: (width - 100) / 2,
    gap: 10,
    padding: 20,
  },
  stockTicker: {
    width: 63,
    borderRadius: 10,
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 19.53,
    fontFamily: 'DMSans-Regular',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  stockName: {
    width: 108,
    borderRadius: 10,
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 15,
    fontFamily: 'DMSans-Regular',
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  stockIconContainer: {
    width: 35,
    height: 35,
    borderRadius: 10,
    backgroundColor: '#242639',
    borderWidth: 1,
    borderColor: '#323443',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stockIcon: {
    fontSize: 12,
    lineHeight: 15,
    fontFamily: 'DMSans-Regular',
    textAlign: 'center',
    color: '#FFFFFF',
  },
});

export default ExploreScreen;
