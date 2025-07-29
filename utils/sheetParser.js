export function parseSheetData(sheetData) {
  if (!Array.isArray(sheetData) || sheetData.length === 0) return { profile: {}, transactions: [] };

  const profileKeys = sheetData[0];
  const profileValues = sheetData[1];
  const profile = {};
  profileKeys.forEach((key, idx) => {
    profile[key] = profileValues[idx] ?? "";
  });

  const transactionHeaderIdx = sheetData.findIndex(row => row[0] === "Transaction");
  let transactions = [];
  if (transactionHeaderIdx !== -1 && sheetData[transactionHeaderIdx + 1]) {
    const transactionKeys = sheetData[transactionHeaderIdx + 1];
    for (let i = transactionHeaderIdx + 2; i < sheetData.length; i++) {
      const row = sheetData[i];
      if (!row || row.length === 0 || row.every(cell => cell === "")) continue;
      const tx = {};
      transactionKeys.forEach((key, idx) => {
        tx[key] = row[idx] ?? "";
      });
      transactions.push(tx);
    }
  }

  return { profile, transactions };
}