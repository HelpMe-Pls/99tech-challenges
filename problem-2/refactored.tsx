// @ts-nocheck
// SUMMARY: other than those OBVIOUS error (such as accessing `undefined` properties,
// which are safe to ignore, since this is just a demo),
// I refactored the code (with "INFO" comments) to clean up unnecessary repetitive work
// and enhance readability
//==================================================================================

//---------------- [Interfaces & Constants] ----------------
// interface WalletBalance {
//   currency: string;
//   amount: number;
// }

// interface FormattedWalletBalance {
//   currency: string;
//   amount: number;
//   formatted: string;
// }

// INFO: Here we're cleaning up the old interfaces by defining a
//  `WalletBalance` interface according to its "assumed" usage in the component
interface WalletBalance {
  currency: string;
  amount: number;
  blockchain?: string; // Added blockchain property according to the type's usage
}

interface Props extends BoxProps {}

// INFO: `getPriority` is a pure function so it doesn't need to be unnecessarily recreated on every render.
// So we're moving it outside of the main the component.
// Hot take: using a `const` object for mapping is better for readability than a `switch`.
const BLOCKCHAIN_PRIORITIES: Record<string, number> = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
};
const DEFAULT_PRIORITY = -99;

const getPriority = (blockchain: string): number => {
  return BLOCKCHAIN_PRIORITIES[blockchain] ?? DEFAULT_PRIORITY;
};

//---------------- [JSX Component] ----------------
const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  // INFO: Combined all logic into a single, performant `useMemo`
  const walletRows = useMemo(() => {
    // INFO: Filter balances with clean logic.
    const filteredBalances = balances.filter((balance) => {
      const priority = getPriority(balance.blockchain);
      // NOTE: I'm INTENTIONALLY keeping `balance.amount <= 0`, as stated in `original.tsx`
      return priority > DEFAULT_PRIORITY && balance.amount <= 0;
    });

    filteredBalances.sort((lhs, rhs) => {
      const leftPriority = getPriority(lhs.blockchain);
      const rightPriority = getPriority(rhs.blockchain);
      // INFO: Sort in descending order of priority
      // by early `return` to avoid `if-else` complexity
      return rightPriority - leftPriority;
    });

    // INFO: No more unnecessary `.map` just to add a `formatted` prop
    // We're now mapping sorted balances directly to JSX rows in a single pass.
    return filteredBalances.map((balance) => {
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow
          // INFO: Use a stable, unique `key` from the data itself rather than using indexes
          key={balance.currency}
          amount={balance.amount}
          usdValue={usdValue}
          // INFO: Inline formatting
          formattedAmount={balance.amount.toFixed()}
        />
      );
    });
  }, [balances, prices]); // INFO: The dependencies are now correct because we use both

  return <div {...rest}>{rows}</div>;
};
