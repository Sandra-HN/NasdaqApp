import axios, { AxiosResponse } from 'axios';

interface QueryParams {
  [key: string]: string | boolean | number;
}

export const getStocksList = async (
  pageParam: string,
  apiurl: string,
  queryParams: QueryParams,
): Promise<any> => {
  try {
    console.log('calling', pageParam || apiurl, queryParams);
    const { data }: AxiosResponse<any> = await axios.get(pageParam || apiurl, {
      params: queryParams,
    });
    console.log('data', data);

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getStockDetails = async (ticker: string): Promise<any> => {
  try {
    console.log('calling StockDetails', ticker);
    const { data }: AxiosResponse<any> = await axios.get(
      `${process.env.EXPO_PUBLIC_API_URL}/v3/reference/tickers/${ticker}`,
      {
        params: {
          apiKey: process.env.EXPO_PUBLIC_API_KEY,
        },
      },
    );
    console.log('data', data);

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getStockAggs = async (ticker: string): Promise<any> => {
  try {
    console.log('calling StockAggs ', ticker);

    let apiurl = `${process.env.EXPO_PUBLIC_API_URL}/v2/aggs/ticker/${ticker}/prev`;
    const { data }: AxiosResponse<any> = await axios.get(apiurl, {
      params: {
        apiKey: process.env.EXPO_PUBLIC_API_KEY,
        adjusted: true,
      },
    });
    console.log('data', data);

    return data?.count > 0 && data?.results[0];
  } catch (error) {
    console.error(error);
    throw error;
  }
};
