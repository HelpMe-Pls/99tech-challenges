import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { ArrowDownUp } from "lucide-react";
import { useFetcher } from "react-router";
import { toast } from "sonner";
import { TokenCombobox } from "~/components/TokenCombobox";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form as ShadcnForm,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";

//---------------------------[ Utils ]---------------------------
export interface Token {
  currency: string;
  price: number;
}

// INFO: These `message`s will be rendered by `FormMessage`
const formSchema = z.object({
  fromAmount: z.coerce
    .number({ invalid_type_error: "Please enter a valid number" })
    .positive({ message: "Amount must be greater than 0" }),
  fromCurrency: z.string().min(1, { message: "Please select a currency" }),
  toCurrency: z.string().min(1, { message: "Please select a currency" }),
});

interface CurrencySwapFormProps {
  tokens: Token[];
}

type FetcherData = {
  success: boolean;
  message: string;
};

//---------------------------[ Main Component ]---------------------------
export function CurrencySwapForm({ tokens }: CurrencySwapFormProps) {
  const [toAmount, setToAmount] = useState("");
  const fetcher = useFetcher<FetcherData>();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fromAmount: undefined,
      fromCurrency: "ETH",
      toCurrency: "USDC",
    },
  });

  const { fromAmount, fromCurrency, toCurrency } = form.watch();

  useEffect(() => {
    if (
      typeof fromAmount === "number" &&
      fromAmount > 0 &&
      fromCurrency &&
      toCurrency
    ) {
      const fromToken = tokens.find((t) => t.currency === fromCurrency);
      const toToken = tokens.find((t) => t.currency === toCurrency);

      if (fromToken && toToken && fromToken.price > 0 && toToken.price > 0) {
        // NOTE: Some made-up formula for the sake of the demo
        const exchangeRate = fromToken.price / toToken.price;
        const calculatedToAmount = fromAmount * exchangeRate;
        setToAmount(calculatedToAmount.toFixed(6));
      } else {
        setToAmount("");
      }
    } else {
      setToAmount("");
    }
  }, [fromAmount, fromCurrency, toCurrency, tokens]);

  const handleSwapCurrencies = useCallback(() => {
    form.setValue("fromCurrency", toCurrency, { shouldValidate: true });
    form.setValue("toCurrency", fromCurrency, { shouldValidate: true });
  }, [form, fromCurrency, toCurrency]);

  const onRHFSubmit = useCallback(
    (data: z.infer<typeof formSchema>) => {
      console.log(
        "Client-side validation passed. Submitting via fetcher:",
        data
      );

      // `fetcher.submit` expects a `FormData object or `URLSearchParams`
      const formData = new FormData(); // Convert validated `data` to `FormData`
      formData.append("fromAmount", String(data.fromAmount));
      formData.append("fromCurrency", data.fromCurrency);
      formData.append("toCurrency", data.toCurrency);

      // Submits to the current route's `action`
      fetcher.submit(formData, { method: "POST" });
    },
    [fetcher]
  );

  const isSubmitting = fetcher.state === "submitting";

  useEffect(() => {
    // Check if `fetcher` has completed an operation and `fetcher.data` is available
    if (fetcher.state === "idle" && fetcher.data) {
      const { success, message } = fetcher.data;

      if (success) {
        toast.success(message);
        form.reset(); // Resets all form fields to `defaultValues`
        setToAmount(""); // Also reset the calculated field
      } else {
        toast.error(message);
      }
    }
  }, [fetcher.state, fetcher.data, form]);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Currency Swap</CardTitle>
        <CardDescription>
          Select and swap your assets seamlessly
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/*
          1. `fetcher.Form` will handle the submission to the `action` without causing a navigation.
          2. `onClick` of the button will trigger RHF validation and then `fetcher.submit()`.
        */}
        <fetcher.Form method="post">
          {/* NOTE: 
            This ShadcnForm (which is React Hook Form's `FormProvider`)
            MUST wrap all FormField, FormItem, FormLabel, FormControl, FormMessage
            components to provide the context via `useFormContext()`.
          */}
          <ShadcnForm {...form}>
            <div className="grid gap-1">
              <FormField
                control={form.control}
                name="fromAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount to send</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0.0"
                          {...field}
                          value={field.value === undefined ? "" : field.value}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ""
                                ? undefined
                                : parseFloat(e.target.value)
                            )
                          }
                          name="fromAmount"
                          className="flex-grow"
                        />
                      </FormControl>
                      <FormField
                        control={form.control}
                        name="fromCurrency"
                        render={({ field: selectField }) => (
                          <TokenCombobox
                            tokens={tokens}
                            value={selectField.value}
                            onChange={selectField.onChange}
                          />
                        )}
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="relative flex justify-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="mt-3"
                  onClick={handleSwapCurrencies}
                >
                  <ArrowDownUp className="h-4 w-4" />
                </Button>
              </div>

              {/*NOTE: 
                This uses plain HTML `label` and `Input` directly,
                as `toAmount` is a calculated, read-only field not managed `by react-hook-form`.
              */}
              <div>
                <label
                  htmlFor="to-amount-input"
                  className="text-sm font-medium leading-none"
                >
                  Amount to receive
                </label>
                <div className="flex gap-2 mt-1 mb-5">
                  <Input
                    id="to-amount-input"
                    type="number"
                    readOnly
                    placeholder="0.0"
                    value={toAmount}
                    name="toAmount" // for `FormData` clarity
                    className="flex-grow bg-muted"
                  />
                  <FormField // Managed by RHF
                    control={form.control}
                    name="toCurrency"
                    render={({ field: selectField }) => (
                      <TokenCombobox
                        tokens={tokens}
                        value={selectField.value}
                        onChange={selectField.onChange}
                      />
                    )}
                  />
                </div>
                {/* No `FormMessage` for `toAmount` itself, as it's read-only. */}
              </div>

              <Button
                type="button" // Prevents immediate native submit
                disabled={isSubmitting}
                onClick={form.handleSubmit(onRHFSubmit)} // Triggers RHF validation
                className="w-full"
              >
                {isSubmitting ? "Swapping..." : "Confirm Swap"}
              </Button>
            </div>
          </ShadcnForm>
        </fetcher.Form>
      </CardContent>
    </Card>
  );
}
