import type { InitialState } from '@react-navigation/native';
import { storage } from '../../shared/storage/storage';

const NAVIGATION_STATE_KEY = 'navigation_state';

export const navigationPersistence = {
  getState: async () => {
    const savedState = await storage.getString(NAVIGATION_STATE_KEY);

    if (!savedState) {
      return undefined;
    }

    try {
      return JSON.parse(savedState) as InitialState;
    } catch (error) {
      await storage.delete(NAVIGATION_STATE_KEY);

      if (__DEV__) {
        console.warn('Failed to parse saved navigation state.', error);
      }

      return undefined;
    }
  },

  setState: (state: InitialState) => {
    return storage.set(NAVIGATION_STATE_KEY, JSON.stringify(state));
  },

  clearState: () => {
    return storage.delete(NAVIGATION_STATE_KEY);
  },
};
