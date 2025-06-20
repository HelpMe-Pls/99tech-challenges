//---------------- [Interfaces] ----------------
interface WalletBalance {
  currency: string;
  amount: number;
}

// NOTE: This interface has those EXACT same fields as in `WalletBalance`,
// So a cleaner way to define it would be
// `interface FormattedWalletBalance extends WalletBalance {}`
// But that's just cleaning up the semantic aspect of it.
// To truly improve maintainability, it's recommened to UNDERSTAND how you would use it.
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

// NOTE: Safe to assume that `BoxProps` is imported from somewhere
interface Props extends BoxProps {}

//---------------- [JSX Component] ----------------
const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  // NOTE: Safe to assume that these hooks are imported from somewhere
  const balances = useWalletBalances();
  const prices = usePrices();

  // NOTE: Since `blockchain` is not from the `props`,
  // then it's safe to move this function OUTSIDE of this component
  // for better performance (see the `./refactored.tsx` file for more details)
  const getPriority = (blockchain: any): number => {
    switch (blockchain) {
      case "Osmosis":
        return 100;
      case "Ethereum":
        return 50;
      case "Arbitrum":
        return 30;
      case "Zilliqa":
        return 20;
      case "Neo":
        return 20;
      default:
        return -99;
    }
  };

  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        // NOTE: Again, assuming that `lhsPriority` is imported from somewhere
        if (lhsPriority > -99) {
          // NOTE: This filter condition looks sus
          // Maybe it's intentional, idk
          // Not enough context to decide if it's right or wrong though
          if (balance.amount <= 0) {
            return true;
          }
        }
        return false;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        // NOTE: Should've included the `blockchain` prop in `WalletBalance`
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        if (leftPriority > rightPriority) {
          return -1;
        } else if (rightPriority > leftPriority) {
          return 1;
        }
      });
  }, [balances, prices]); // NOTE: the calculation inside it only uses `balances`
  // NOT `prices`, which causes this entire filtering and sorting operation
  // to re-run unnecessarily, even though the output would be identical.
  // That defeats the whole point of using `useMemo` in the first place.

  // NOTE: This `formattedBalances` is never used, so what's the point?
  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed(),
    };
  });

  // NOTE: Aren't we supposed to use `formattedBalances` here instead?
  const rows = sortedBalances.map(
    // NOTE: We're mapping over `sortedBalances` but type it with `FormattedWalletBalance` for some reason?
    (balance: FormattedWalletBalance, index: number) => {
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow
          className={classes.row}
          key={index} // Using `index` as `key`: React won't be happy about this :D
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    }
  );

  return <div {...rest}>{rows}</div>;
};
