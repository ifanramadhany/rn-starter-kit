export const logger = {
  debug: (message: string, payload?: unknown) => {
    if (!__DEV__) {
      return;
    }

    // eslint-disable-next-line no-console
    console.log(message, payload);
  },
};
