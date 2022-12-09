import { atom, selector } from "recoil"

export const supportedCurrencies = {
  KRW: {
    label: "원",
    prefix: false,
  },
  CAD: {
    label: "CAD $",
    prefix: true,
  },
  USD: {
    label: "$",
    prefix: true,
  },
  EURO: {
    label: "€",
    prefix: true,
  },
}

export const currencyCodeState = atom({
  key: "currencyCode",
  default: undefined,
})

export const currencyState = selector({
  key: "currency",
  get: ({ get }) => {
    const code = get(currencyCodeState)
    return supportedCurrencies[code]
  },
})
