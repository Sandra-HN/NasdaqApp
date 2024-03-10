import axios from "axios";
import { useMemo } from "react";
import { getStocksList } from "../services/stocksService";
import { useInfiniteQuery } from "react-query";

const useGetStockList = (query) => {
  const queryKey = useMemo(
    () => [
      "v3/reference/tickers",
      query.apiurl,
      query.pageSize,
      query.searchText,
    ],
    [query.apiurl, query.pageSize, query.searchText]
  );
  return useInfiniteQuery({
    queryKey: queryKey,
    queryFn: ({ pageParam = "" }) =>
      getStocksList(pageParam, query.apiurl, {
        apiKey: process.env.EXPO_PUBLIC_API_KEY,
        active: true,
        limit: query.pageSize ?? 10,
        search: query.searchText ?? "",
      }),
    enabled: !!query.apiurl,
    refetchOnWindowFocus: false,
    getNextPageParam(lastPage) {
      return lastPage.next_url;
    },
  });
};
export default useGetStockList;
