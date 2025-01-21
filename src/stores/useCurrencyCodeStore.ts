import { create } from 'zustand';

interface CurrencyCodeState {
  currencyCode: 'KRW' | 'USD';
  setCurrencyCode: (code: 'KRW' | 'USD') => void;
}

const useCurrencyCodeStore = create<CurrencyCodeState>((set) => ({
  currencyCode: 'KRW',
  setCurrencyCode: (code) => set({ currencyCode: code }),
}));

export default useCurrencyCodeStore;
