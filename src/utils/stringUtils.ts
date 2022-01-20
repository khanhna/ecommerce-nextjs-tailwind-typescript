export const isStringNullOrUndefinedOrEmprty = (data: string | undefined | null) => {
  if (!data) return true;
  else return data === '';
};

export const simpleCurrencyFormat = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});
