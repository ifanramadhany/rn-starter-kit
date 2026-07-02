import 'react-native-gesture-handler/jestSetup';
import type { ReactNode } from 'react';

jest.mock('react-native-reanimated', () => {
  const mockReactNative = jest.requireActual('react-native');
  const mockAnimated = mockReactNative.Animated;
  const mockNoop = () => {};
  const mockIdentity = (value: unknown) => value;
  const mockCreateSharedValue = (initialValue: unknown) => {
    let currentValue = initialValue;

    return {
      get: () => currentValue,
      set: (nextValue: unknown) => {
        currentValue =
          typeof nextValue === 'function'
            ? nextValue(currentValue)
            : nextValue;
      },
      get value() {
        return currentValue;
      },
      set value(nextValue) {
        currentValue = nextValue;
      },
    };
  };

  const mockModule = {
    __esModule: true,
    Extrapolation: {
      CLAMP: 'clamp',
      EXTEND: 'extend',
      IDENTITY: 'identity',
    },
    ReduceMotion: {
      Always: 'always',
      Never: 'never',
      System: 'system',
    },
    Easing: {
      linear: mockIdentity,
      ease: mockIdentity,
      quad: mockIdentity,
      cubic: mockIdentity,
      poly: mockIdentity,
      sin: mockIdentity,
      circle: mockIdentity,
      exp: mockIdentity,
      elastic: mockIdentity,
      back: mockIdentity,
      bounce: mockIdentity,
      bezier: () => ({ factory: mockIdentity }),
      bezierFn: mockIdentity,
      steps: mockIdentity,
      in: mockIdentity,
      out: mockIdentity,
      inOut: mockIdentity,
    },
    cancelAnimation: mockNoop,
    clamp: mockNoop,
    createAnimatedComponent: mockIdentity,
    createSerializable: mockIdentity,
    createWorkletRuntime: mockNoop,
    default: {
      ...mockAnimated,
      createAnimatedComponent: mockIdentity,
    },
    enableLayoutAnimations: mockNoop,
    interpolate: (value: number, _input: number[], output: number[]) => output[0] ?? value,
    interpolateColor: mockNoop,
    makeMutable: mockCreateSharedValue,
    measure: () => ({
      height: 0,
      pageX: 0,
      pageY: 0,
      width: 0,
      x: 0,
      y: 0,
    }),
    runOnJS: mockIdentity,
    runOnRuntime: mockNoop,
    runOnUI: mockIdentity,
    scrollTo: mockNoop,
    useAnimatedProps: (updater: () => unknown) => updater(),
    useAnimatedReaction: mockNoop,
    useAnimatedRef: () => ({ current: null }),
    useAnimatedScrollHandler: () => mockNoop,
    useAnimatedSensor: () => ({
      config: {
        adjustToInterfaceOrientation: false,
        interval: 0,
        iosReferenceFrame: 0,
      },
      isAvailable: false,
      sensor: {
        value: {
          interfaceOrientation: 0,
          pitch: 0,
          qx: 0,
          qy: 0,
          qz: 0,
          qw: 0,
          roll: 0,
          x: 0,
          y: 0,
          yaw: 0,
          z: 0,
        },
      },
      unregister: mockNoop,
    }),
    useAnimatedStyle: (updater: () => unknown) => updater(),
    useAnimatedKeyboard: () => ({ height: 0, state: 0 }),
    useDerivedValue: (updater: () => unknown) => ({
      get: () => updater(),
      value: updater(),
    }),
    useEvent: () => mockNoop,
    useScrollOffset: () => ({ value: 0 }),
    useScrollViewOffset: () => ({ value: 0 }),
    useSharedValue: mockCreateSharedValue,
    withDelay: (_delayMs: number, nextValue: unknown) => nextValue,
    withRepeat: mockIdentity,
    withSequence: (...values: unknown[]) => values[values.length - 1] ?? 0,
    withSpring: (toValue: unknown) => toValue,
    withTiming: (toValue: unknown) => toValue,
  };

  return new Proxy(mockModule, {
    get(target, property) {
      if (property in target) {
        return target[property as keyof typeof target];
      }

      return mockNoop;
    },
  });
});

jest.mock('react-native-draggable-flatlist', () => {
  const mockReact = jest.requireActual('react');
  const mockFlatList = jest.requireActual('react-native').FlatList;

  return {
    __esModule: true,
    default: mockFlatList,
    ScaleDecorator: ({ children }: { children: ReactNode }) =>
      mockReact.createElement(mockReact.Fragment, null, children),
    ShadowDecorator: ({ children }: { children: ReactNode }) =>
      mockReact.createElement(mockReact.Fragment, null, children),
  };
});

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

jest.mock('./src/features/survey/services/surveyRepository');
