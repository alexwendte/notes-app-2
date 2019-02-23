// eslint-disable-next-line
export const calculateCost = storage => {
  let rate
  if (storage <= 10) rate = 4
  else if (storage <= 100) rate = 2
  else rate = 1

  return rate * storage * 100
}
