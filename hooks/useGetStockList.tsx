import { useMemo } from 'react';
import { QueryFunctionContext, useInfiniteQuery } from 'react-query';
import { getStocksList } from '../services/stocksService';

interface Query {
  apiurl: string;
  pageSize?: number;
  searchText?: string;
}

const useGetStockList = (query: Query) => {
  const queryKey = useMemo(
    () => [
      'v3/reference/tickers',
      query.apiurl,
      query.pageSize,
      query.searchText,
    ],
    [query.apiurl, query.pageSize, query.searchText],
  );
  return useInfiniteQuery<any, Error, any>({
    queryKey: queryKey,
    queryFn: async ({ pageParam = '' }: QueryFunctionContext<any>) => {
      const data = await getStocksList(pageParam, query.apiurl, {
        apiKey: process.env.EXPO_PUBLIC_API_KEY ?? '',
        active: true,
        limit: query.pageSize ?? 10,
        search: query.searchText ?? '',
      });
      return data;
    },
    enabled: !!query.apiurl,
    refetchOnWindowFocus: false,
    getNextPageParam(lastPage) {
      return lastPage.next_url;
    },
  });
};

export default useGetStockList;
