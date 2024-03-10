import { useMemo } from 'react';
import { useQuery } from 'react-query';
import { getStockDetails } from '../services/stocksService';

interface Query {
  ticker: string | null;
}

const useGetStockDetails = (query: Query) => {
  const queryKey = useMemo(
    () => ['v3/reference/tickerdetails', query.ticker],
    [query.ticker],
  );
  return useQuery<any, Error>({
    queryKey: queryKey,
    queryFn: async () => {
      if (query.ticker) {
        const data = await getStockDetails(query.ticker);
        return data;
      }
      return null;
    },
    enabled: !!query.ticker,
    refetchOnWindowFocus: false,
  });
};

export default useGetStockDetails;
