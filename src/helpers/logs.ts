import chalk from "chalk";

export const err = (...args: string[]) => {
  args.forEach((a) => console.log(chalk.red(a)));
};

export const success = (...args: string[]) => {
  args.forEach((a) => console.log(chalk.green(a)));
};

export const messageMagenta = (...args: string[]) => {
  args.forEach((a) => console.log(chalk.magenta.bold(a)));
};

export const messageYellow = (...args: string[]) => {
  args.forEach((a) => console.log(chalk.yellow(a)));
};
