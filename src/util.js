export const getDescriptiveAmount = (currency, amount) => {
  if (!currency || !currency.label) {
    return amount
  }
  if (currency.prefix) {
    return `${currency.label}${amount}`
  }
  return `${amount} ${currency.label}`
}
