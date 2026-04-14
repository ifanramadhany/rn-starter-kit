import { MMKV } from 'react-native-mmkv';

interface StorageInterface {
  set(key: string, value: string | boolean | number): void;
  getString(key: string): string | undefined;
  delete(key: string): void;
}

class FallbackStorage implements StorageInterface {
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

function createStorage(): StorageInterface {
  try {
    return new MMKV({
      id: 'app-storage',
      encryptionKey: 'super-secret-key',
    });
  } catch (error) {
    console.warn('MMKV unavailable, using fallback storage', error);
    return new FallbackStorage();
  }
}

export const storage = createStorage();
