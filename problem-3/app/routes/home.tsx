import { data, useLoaderData } from "react-router";

import { Toaster } from "~/components/ui/sonner";
import { CurrencySwapForm, type Token } from "../components/CurrencySwapForm";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Currency Swap App" },
    { name: "description", content: "Swap your assets efficiently!" },
  ];
}
// Fetch token prices
export async function loader() {
  try {
    const response = await fetch("https://interview.switcheo.com/prices.json");
    if (!response.ok) {
      return data(
        { message: "Failed to fetch token prices" },
        { status: response.status }
      );
    }
    const prices: Token[] = await response.json();

    const validTokens: Token[] = [];
    const seenCurrencies = new Set<string>(); // Use a Set to track unique currencies

    // Filter out tokens that don't have a price and remove duplicates
    // Prioritize the first occurrence of a currency, assuming its price is valid.
    for (const token of prices) {
      if (token.price && !seenCurrencies.has(token.currency)) {
        validTokens.push(token);
        seenCurrencies.add(token.currency);
      }
    }

    // Sort the unique tokens alphabetically by currency
    validTokens.sort((a, b) => a.currency.localeCompare(b.currency));

    return data(validTokens);
  } catch (error) {
    console.error("Loader error fetching tokens:", error);

    return data(
      { message: "Could not load token data due to API error." },
      { status: 503 }
    );
  }
}

// Handle form submissions
export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const fromAmount = formData.get("fromAmount");
  const fromCurrency = formData.get("fromCurrency");
  const toCurrency = formData.get("toCurrency");

  // Simulate a backend API call with a delay
  await new Promise((resolve) => setTimeout(resolve, 690));

  // NOTE: Example for server-side error
  // if (parseFloat(fromAmount as string) < 10) {
  //   return data({ success: false, message: "Minimum swap amount is 10." }, { status: 400 });
  // }

  return data({
    success: true,
    message: "GOT 'EM 😝",
    data: { fromAmount, fromCurrency, toCurrency },
  });
}

export default function FormDisplay() {
  const tokens = useLoaderData() as Token[];

  return (
    <div className="container min-h-screen flex items-center justify-center p-4 bg-grid bg-[image:var(--grid-pattern)]">
      <CurrencySwapForm tokens={tokens} />
      <Toaster position="top-center" closeButton richColors />
    </div>
  );
}
