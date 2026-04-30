import 'react-native-gesture-handler/jestSetup';

jest.mock('@react-native-async-storage/async-storage', () => {
  const data = new Map<string, string>();

  return {
    __esModule: true,
    default: {
      setItem: jest.fn((key: string, value: string) => {
        data.set(key, value);
        return Promise.resolve();
      }),
      getItem: jest.fn((key: string) => Promise.resolve(data.get(key) ?? null)),
      removeItem: jest.fn((key: string) => {
        data.delete(key);
        return Promise.resolve();
      }),
    },
  };
});

jest.mock('react-native-keychain', () => {
  let password: string | null = null;

  return {
    setGenericPassword: jest.fn((_username: string, value: string) => {
      password = value;
      return Promise.resolve(true);
    }),
    getGenericPassword: jest.fn(() =>
      Promise.resolve(
        password
          ? {
              username: 'access_token',
              password,
            }
          : false,
      ),
    ),
    resetGenericPassword: jest.fn(() => {
      password = null;
      return Promise.resolve(true);
    }),
  };
});
