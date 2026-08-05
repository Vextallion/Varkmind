export const compose = (...fns: Function[]) =>
  fns.reduce(
    (f: Function, g: Function) =>
      (...args: any[]) =>
        f(g(...args)),
  );
