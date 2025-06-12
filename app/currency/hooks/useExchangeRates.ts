"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_KEY = process.env.NEXT_PUBLIC_EXCHANGE_RATE_API_KEY;
export function useExchangeRates() {
  return useQuery({
    queryKey: ["exchangeRates"],
    queryFn: async () => {
      const res = await axios.get(
        `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/KRW`
      );
      return res.data.conversion_rates;
    },
    staleTime: 1000 * 60 * 5,
  });
}
