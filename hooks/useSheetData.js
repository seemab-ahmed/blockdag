import { useQuery } from '@tanstack/react-query';

const fetchSheetData = async (walletAddress) => {
  const res = await fetch(`/api/sheet?tab=${walletAddress}`);
  if (!res.ok) throw new Error('Network response was not ok');
  return res.json();
};

export function useSheetData(walletAddress) {
  return useQuery({
    queryKey: ['sheetData', walletAddress],
    queryFn: () => fetchSheetData(walletAddress),
    enabled: !!walletAddress,
    refetchInterval: 10000,
    staleTime: 10000,
  });
}