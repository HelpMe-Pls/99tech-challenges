// Suboptimal brute force iterative version
// O(n) time & O(1) space
var sum_to_n_a = function (n: number) {
  let output = 0;

  for (let i = 1; i <= n; ++i) {
    output += i;
  }

  return output;
};

// Suboptimal iterative version using built-in methods
// O(n) time & space
var sum_to_n_b = function (n: number): number {
  const one_to_n = Array.from({ length: n }, (_, index) => index + 1);

  // Use reduce to sum the array elements
  const output = one_to_n.reduce(
    (sum, currentNumber) => sum + currentNumber,
    0
  );

  return output;
};

// Suboptimal recursive version
// O(n) time & O(1) space
var sum_to_n_c = function (n: number) {
  if (n <= 0) {
    return 0;
  }

  // E.g., sum(5) = 5 + sum(4)
  return n + sum_to_n_b(n - 1);
};

console.log(sum_to_n_a(6));
console.log(sum_to_n_b(9));
console.log(sum_to_n_c(69));

// There's an optimal version using mathmetical formula
// O(1) time & space
// var sum_to_n_optimal = function (n: number): number {
//   return (n * (n + 1)) / 2;
// };
