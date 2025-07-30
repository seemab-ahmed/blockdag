import { useQuery } from '@tanstack/react-query';

const fetchConstantsData = async () => {
  const res = await fetch('/api/sheet?tab=Constants');
  if (!res.ok) throw new Error('Network response was not ok');
  return res.json();
};

export function useConstantsData() {
  return useQuery({
    queryKey: ['constantsData'],
    queryFn: fetchConstantsData,
    refetchInterval: 60000,
    staleTime: 59000,
  });
}