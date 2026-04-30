import 'react-native-gesture-handler/jestSetup';

jest.mock('react-native-mmkv', () => {
  class MMKV {
    private data = new Map<string, string>();

    set(key: string, value: string | boolean | number) {
      this.data.set(key, String(value));
    }

    getString(key: string) {
      return this.data.get(key);
    }

    delete(key: string) {
      this.data.delete(key);
    }
  }

  return { MMKV };
});
