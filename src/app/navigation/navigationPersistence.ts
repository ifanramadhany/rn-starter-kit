import type { InitialState } from '@react-navigation/native';
import { mainRouteNames } from '../../shared/navigation/routes';
import { storage } from '../../shared/storage/storage';

const NAVIGATION_STATE_KEY = 'navigation_state';
const mainRouteNameSet = new Set<string>(mainRouteNames);

function hasOnlyMainRoutes(state: InitialState): boolean {
  return state.routes.every((route) => {
    const hasValidRouteName = mainRouteNameSet.has(route.name);
    const hasValidNestedState = route.state ? hasOnlyMainRoutes(route.state as InitialState) : true;

    return hasValidRouteName && hasValidNestedState;
  });
}

export const navigationPersistence = {
  getState: async () => {
    const savedState = await storage.getString(NAVIGATION_STATE_KEY);

    if (!savedState) {
      return undefined;
    }

    try {
      const state = JSON.parse(savedState) as InitialState;

      if (!hasOnlyMainRoutes(state)) {
        await storage.delete(NAVIGATION_STATE_KEY);

        return undefined;
      }

      return state;
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
