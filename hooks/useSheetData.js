// import { useQuery } from '@tanstack/react-query';

// const fetchSheetData = async () => {
//   const res = await fetch('/api/sheet');
//   if (!res.ok) throw new Error('Network response was not ok');
//   return res.json();
// };

// export function useSheetData() {
//   return useQuery({
//     queryKey: ['sheetData'],
//     queryFn: fetchSheetData,
//     refetchInterval: 60000, // Poll every 10 seconds
//     staleTime: 59000,        // Data considered fresh for 9 seconds
//   });
// }

import { useQuery } from '@tanstack/react-query';

const fetchSheetData = async (tab) => {
  const res = await fetch(`/api/sheet?tab=${tab}`);
  if (!res.ok) throw new Error('Network response was not ok');
  return res.json();
};

export function useSheetData(tab = "0x5649") {
  return useQuery({
    queryKey: ['sheetData', tab],
    queryFn: () => fetchSheetData(tab),
    refetchInterval: 60000,
    staleTime: 59000,
  });
}