import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";
import type { Token } from "./CurrencySwapForm";

interface TokenComboboxProps {
  tokens: Token[];
  value: string; // The currently selected token's currency (e.g., "ETH")
  onChange: (value: string) => void; // Callback when a new token is selected
}

const ICON_BASE_URL =
  "https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/";

const DEFAULT_ICON_URL = "/coin.png";

export function TokenCombobox({ tokens, value, onChange }: TokenComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const getIconUrl = (currency: string) => `${ICON_BASE_URL}${currency}.svg`;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {/* The trigger button for the combobox */}
      <PopoverTrigger asChild>
        <Button
          variant="outline" // ShadCN button variant
          role="combobox" // ARIA role for accessibility
          aria-expanded={open} // ARIA attribute indicating if the popover is open
          className="w-[150px] justify-between" // Tailwind classes for styling
        >
          {/* Display selected token's icon and currency, or a placeholder */}
          {value ? (
            <div className="flex items-center gap-2">
              <img
                src={getIconUrl(value)} // Source for the token icon
                alt={value} // Alt text for accessibility
                className="w-5 h-5" // Size of the icon
                // Fallback to `DEFAULT_ICON_URL` if the image fails to load
                onError={(e) => {
                  e.currentTarget.src = DEFAULT_ICON_URL;
                  e.currentTarget.alt = "Missing Icon";
                }}
              />
              {value} {/* Display the selected currency text */}
            </div>
          ) : (
            "Pick one..." // Placeholder text when no token is selected
          )}
          {/* Chevron icon to indicate dropdown */}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      {/* The content of the popover (the searchable & scrollable list of tokens) */}
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search token..." />
          <CommandEmpty>No token found.</CommandEmpty>
          <CommandGroup className="max-h-72 overflow-y-auto">
            {/* Map over the list of tokens to create searchable command items */}
            {tokens.map((token) => (
              <CommandItem
                key={token.currency} // Unique key for React list rendering
                value={token.currency} // Value for the command item, used in search
                onSelect={(currentValue) => {
                  // When an item is selected, call the onChange prop with its currency
                  onChange(currentValue);
                  setOpen(false); // Close the popover after selection
                }}
              >
                {/* Checkmark icon to indicate selected item */}
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === token.currency ? "opacity-100" : "opacity-0" // Show/hide checkmark based on selection
                  )}
                />
                {/* Display token icon and currency in the list item */}
                <div className="flex items-center gap-2">
                  <img
                    src={getIconUrl(token.currency)}
                    alt={token.currency}
                    className="w-5 h-5"
                    onError={(e) => {
                      e.currentTarget.src = DEFAULT_ICON_URL;
                      e.currentTarget.alt = "Missing Icon";
                    }}
                  />
                  {token.currency}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
