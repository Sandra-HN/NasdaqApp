import { useMemo } from 'react';
import { useQuery } from 'react-query';
import { getStockAggs } from '../services/stocksService';

interface Query {
  ticker: string | null;
}

const useGetStockAggs = (query: Query) => {
  const queryKey = useMemo(
    () => ['v2/aggs/ticker', query.ticker],
    [query.ticker],
  );
  return useQuery<any, Error>({
    queryKey: queryKey,
    queryFn: async () => {
      if (query.ticker) {
        const data = await getStockAggs(query.ticker);
        return data;
      }
      return null;
    },
    enabled: !!query.ticker,
    refetchOnWindowFocus: false,
  });
};

export default useGetStockAggs;
