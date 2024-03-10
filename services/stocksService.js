import axios from "axios";

export const getStocksList = async (pageParam, apiurl, queryParams) => {
  try {
    console.log("calling", pageParam || apiurl, queryParams);
    const { data } = await axios.get(pageParam || apiurl, {
      params: queryParams,
    });
    console.log("data", data);

    return data;
  } catch (error) {
    console.error(error);
  }
};
export const getStockDetails = async (ticker) => {
  try {
    console.log("calling StockDetails", ticker);
    const { data } = await axios.get(
      `${process.env.EXPO_PUBLIC_API_URL}/v3/reference/tickers/${ticker}`,
      {
        params: {
          apiKey: process.env.EXPO_PUBLIC_API_KEY,
        },
      }
    );
    console.log("data", data);

    return data;
  } catch (error) {
    console.error(error);
  }
};
export const getStockAggs = async (ticker) => {
  try {
    console.log("calling StockAggs ", ticker);

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
    return null;
  } catch (error) {
    console.error(error);
  }
};
