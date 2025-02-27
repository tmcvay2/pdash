export const cutDecimal = (value: number, decimalPlaces: number): number => {
  const factor = Math.pow(10, decimalPlaces);
  return Math.trunc(value * factor) / factor;
};
