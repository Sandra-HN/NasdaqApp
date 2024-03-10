import { useMemo } from "react";
import { useQuery } from "react-query";
import { getStockAggs } from "../services/stocksService";

const useGetStockAggs = (query) => {
  const queryKey = useMemo(
    () => ["v2/aggs/ticker", query.ticker],
    [, query.ticker]
  );
  return useQuery({
    queryKey: queryKey,
    queryFn: () => getStockAggs(query.ticker),
    enabled: !!query.ticker,
    refetchOnWindowFocus: false,
  });
};
export default useGetStockAggs;
