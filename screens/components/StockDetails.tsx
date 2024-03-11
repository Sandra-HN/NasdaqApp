import { BottomSheetModal } from '@gorhom/bottom-sheet';
import React, { RefObject, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MyWebView from './MyWebView';
import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import getSymbolFromCurrency from 'currency-symbol-map';
interface StockDetailsProps {
  selectedStock: {
    branding: {
      icon_url: string;
    };
    ticker: string;
    currency_name: string;
    aggs: {
      c: number;
      o: number;
      h: number;
      l: number;
    };
    description: string;
    homepage_url: string;
    status: string;
    priceChangePercentage: number;
  } | null;
  onClose: () => void;
  bottomSheetModalRef: RefObject<BottomSheetModalMethods>;
}

const StockDetails: React.FC<StockDetailsProps> = ({
  selectedStock,
  onClose,
  bottomSheetModalRef,
}) => {
  const [openWebView, setOpenWebView] = useState(false);

  const handleCloseModal = () => {
    bottomSheetModalRef?.current?.dismiss();
    setOpenWebView(false);
    onClose();
  };

  const openWebsite = () => {
    if (selectedStock?.homepage_url) {
      setOpenWebView(true);
    }
  };
  const currency_symbol = selectedStock?.currency_name
    ? getSymbolFromCurrency(selectedStock?.currency_name?.toUpperCase()) ?? ''
    : '';

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={['92%']}
      handleStyle={{ backgroundColor: '#1F202F', height: 0, padding: 0 }}
      backgroundStyle={{ backgroundColor: '#1F202F' }}
      enablePanDownToClose={false}
      enableContentPanningGesture={false}
    >
      <View style={styles.bottomSheetContent}>
        {/* header */}
        <View style={styles.bottomSheetHeader}>
          <View style={styles.stockHeaderView}>
            {selectedStock?.branding?.icon_url ? (
              <Image
                source={{
                  uri: `${selectedStock?.branding.icon_url}?apiKey=${process.env.EXPO_PUBLIC_API_KEY}`,
                }}
                style={styles.stockLogo}
              />
            ) : (
              <View style={[styles.stockLogo, styles.stockLogoPlaceholder]}>
                <Text style={styles.logoPlaceholder}>
                  {selectedStock?.ticker.slice(0, 2)}
                </Text>
              </View>
            )}
            <View style={{ flexDirection: 'column' }}>
              <Text style={styles.ticker}>{selectedStock?.ticker}</Text>
              <View style={{ flexDirection: 'row', gap: 5 }}>
                <Text style={[{ color: '#FFFFFF' }, styles.headerText]}>
                  {currency_symbol}
                  {selectedStock?.aggs?.c?.toFixed(2)}
                </Text>
                <Text
                  style={[
                    {
                      color: selectedStock?.priceChangePercentage
                        ? selectedStock?.priceChangePercentage > 0
                          ? '#22FF95'
                          : selectedStock?.priceChangePercentage < 0
                          ? '#ff4270'
                          : '#aaaaaa'
                        : '#aaaaaa',
                    },
                    styles.headerText,
                  ]}
                >
                  {selectedStock?.priceChangePercentage &&
                    `${selectedStock?.priceChangePercentage}%`}
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleCloseModal}
          >
            <Image
              source={require('../../assets/close.png')}
              style={{ width: 10, height: 10 }}
            />
          </TouchableOpacity>
        </View>
        {!selectedStock ? (
          <ActivityIndicator size="large" color="#323443" style={{ flex: 1 }} />
        ) : (
          <ScrollView style={styles.bottomSheetContainer}>
            <View style={styles.stockMainView}>
              <View style={styles.stockBody}>
                {/* body */}
                {selectedStock?.description && (
                  <View style={styles.bodyView}>
                    <Text
                      style={[
                        { color: '#FFFFFF', height: 26 },
                        styles.headerText,
                      ]}
                    >
                      ABOUT
                    </Text>
                    <Text style={styles.about}>
                      {selectedStock?.description}
                    </Text>
                  </View>
                )}
                {/* statistics */}
                <View style={styles.statisticsView}>
                  <Text
                    style={[
                      { color: '#FFFFFF', height: 26 },
                      styles.headerText,
                    ]}
                  >
                    STATISTICS
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                  >
                    <View style={{ width: '45%' }}>
                      <Text style={styles.statisticsTitle}>Open</Text>
                      <Text style={[{ color: '#FFFFFF' }, styles.headerText]}>
                        {currency_symbol}
                        {selectedStock?.aggs?.o?.toFixed(2)}
                      </Text>
                    </View>
                    <View style={{ width: '45%' }}>
                      <Text style={styles.statisticsTitle}>Close</Text>
                      <Text style={[{ color: '#FFFFFF' }, styles.headerText]}>
                        {currency_symbol}
                        {selectedStock?.aggs?.c?.toFixed(2)}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                  >
                    <View style={{ width: '45%' }}>
                      <Text style={styles.statisticsTitle}>High</Text>
                      <Text style={[{ color: '#FFFFFF' }, styles.headerText]}>
                        {currency_symbol}
                        {selectedStock?.aggs?.h?.toFixed(2)}
                      </Text>
                    </View>
                    <View style={{ width: '45%' }}>
                      <Text style={styles.statisticsTitle}>Low</Text>
                      <Text style={[{ color: '#FFFFFF' }, styles.headerText]}>
                        {currency_symbol}
                        {selectedStock?.aggs?.l?.toFixed(2)}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              {selectedStock?.homepage_url && (
                <View style={styles.websiteButtonView}>
                  <TouchableOpacity
                    onPress={openWebsite}
                    style={styles.openWebsiteButton}
                  >
                    <Text
                      style={[
                        {
                          color: '#40AFFF',
                          textAlign: 'center',
                          width: '100%',
                        },
                        styles.headerText,
                      ]}
                    >
                      Visit Website
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </ScrollView>
        )}
      </View>
      {selectedStock?.homepage_url && (
        <MyWebView
          uri={selectedStock?.homepage_url}
          isVisible={openWebView}
          onClose={() => setOpenWebView(false)}
        />
      )}
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  bottomSheetContent: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    flex: 1,
  },
  bottomSheetContainer: {
    padding: 10,
  },
  bottomSheetHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#323443',
  },
  logo: { width: 100, height: 30, marginLeft: 40, resizeMode: 'contain' },
  stockMainView: {
    gap: 150,
  },
  stockBody: { width: '100%', gap: 20 },
  websiteButtonView: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 30,
  },
  stockHeaderView: {
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
  },
  stockLogo: { width: 45, height: 45 },
  stockLogoPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#323443',
    borderWidth: 1,
    backgroundColor: '#242639',
  },
  logoPlaceholder: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'DMSans-Regular',
  },
  ticker: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: 'DMSans-Regular',
    color: '#FFFFFF',
    lineHeight: 36.46,
  },
  headerText: {
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'DMSans-Regular',
    lineHeight: 19.53,
  },
  openWebsiteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    backgroundColor: '#1F202F',
    borderWidth: 0.5,
    borderColor: '#40AFFF',
    borderRadius: 25,
    width: '100%',
    shadowColor: '#40AFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10,
  },
  closeButton: {
    borderColor: '#323443',
    borderWidth: 1,
    backgroundColor: '#242639',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
  },
  bodyView: {
    gap: 10,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#323443',
  },
  about: {
    fontWeight: '400',
    fontSize: 15,
    fontFamily: 'DMSans-Regular',
    color: '#FFFFFF99',
    lineHeight: 18,
    textAlign: 'justify',
  },
  statisticsView: {
    paddingBottom: 20,
    gap: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#323443',
  },
  statisticsTitle: {
    color: '#FFFFFF99',
    fontSize: 15,
    lineHeight: 19.53,
    fontWeight: '400',
    height: 25,
  },
});

export default StockDetails;
