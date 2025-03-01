export const cutDecimal = (value: number | number[], decimalPlaces: number): number | number[] => {
  const factor = Math.pow(10, decimalPlaces);

  if (Array.isArray(value)) {
    return value.map(v => Math.trunc(v * factor) / factor);
  } else {
    return Math.trunc(value * factor) / factor;
  }
};