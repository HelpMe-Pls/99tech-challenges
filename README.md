# 99tech-challenges

PLEASE read the comments in my code.

## Problem 1

I used the [Bun](https://bun.sh) runtime to test the code.
To replicate that experience, you can install Bun (if not already) then run `cd problem-1` and `bun index --hot`.

## Problem 2

Please read the [original.tsx](./problem-2/original.tsx) first where I explain what's wrong with it (with the "NOTE" comments).

Then, in [refactored.tsx](./problem-2/refactored.tsx) is where you can find my proposal for refactoring it (with the "INFO" comments).

> This one is actually **Problem 3** in your code challenge. So sorry that I messed up the order.

## Problem 3

Here are the 3 main files of the solution. Have a look at the comments to see what's going on:

- [home.tsx](./problem-3/app/routes/home.tsx)
- [CurrencySwapForm](./problem-3/app/components/CurrencySwapForm.tsx)
- [TokenCombobox](./problem-3/app/components/TokenCombobox.tsx)

What I've done:

1. Used Vite (with fullstack [`react-router`](https://reactrouter.com/start/modes) to handle form submission).
2. Used [`react-hook-form`](https://react-hook-form.com/) for form validation.
3. Used ShadCN components for UI.
4. Deployed to [Netlify](https://fancy-form-problem-2.netlify.app) so that you can view my solution _without any pain_.

Caveat: I haven't implemented the UI for errors. Also, no tests available (yet).

In case you want to run the dev server (which I doubt you would, since you'd probably see it as a _painful thing_ to do):

1. `cd problem-3`
2. [Install Bun](https://bun.sh/docs/installation) - as mentioned in Problem 1 above
3. `bun i`
4. `bunx react-router dev`

> This one is actually **Problem 2** in your code challenge. Again, sorry about that 😝
