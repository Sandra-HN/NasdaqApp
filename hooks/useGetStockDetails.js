import { useMemo } from "react";
import { useQuery } from "react-query";
import { getStockDetails } from "../services/stocksService";

const useGetStockDetails = (query) => {
  const queryKey = useMemo(
    () => ["v3/reference/tickerdetails", query.ticker],
    [, query.ticker]
  );
  return useQuery({
    queryKey: queryKey,
    queryFn: () => getStockDetails(query.ticker),
    enabled: !!query.ticker,
    refetchOnWindowFocus: false,
  });
};
export default useGetStockDetails;
