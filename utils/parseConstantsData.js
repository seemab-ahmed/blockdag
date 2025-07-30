export function parseConstantsData(constantsData) {
  if (!Array.isArray(constantsData) || constantsData.length < 2) return {};

  const keys = constantsData[0];
  const values = constantsData[1];
  const result = {};

  keys.forEach((key, idx) => {
    result[key.trim()] = values[idx] ?? "";
  });

  return result;
}