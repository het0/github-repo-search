import { useCallback, useMemo, useReducer, Reducer } from 'react';

import RestAPIError from '../RestAPI/RestAPIError';

type State<T = any> = {
  data: T | null;
  error: RestAPIError | null;
  loading: boolean;
  done: boolean;
};

type Action =
  | { type: 'set data'; payload: any }
  | { type: 'set error'; payload: any }
  | { type: 'set loading'; payload: any }
  | { type: 'receive error'; payload: any }
  | { type: 'receive response'; payload: any }
  | { type: 'reset state'; payload: any };

type IActionsDef = {
  dispatch: (a: Action) => void;
  receiveError: (p: RestAPIError) => void;
  receiveResponse: (p: Action) => void;
  resetState: () => void;
  setData: (p: Action) => void;
  setError: (p: RestAPIError) => void;
  setLoading: (b: boolean) => void;
};

const initialState: State = {
  data: null,
  error: null,
  loading: false,
  done: false,
};

const reducer = (state: State, { payload, type }: Action): State => {
  switch (type) {
    case 'set data': {
      return { ...state, data: payload };
    }
    case 'set error': {
      return { ...state, error: payload };
    }
    case 'set loading': {
      return { ...state, loading: payload };
    }
    case 'receive error': {
      return {
        data: null,
        error: payload,
        loading: false,
        done: true,
      };
    }
    case 'receive response': {
      return {
        data: payload,
        error: null,
        loading: false,
        done: true,
      };
    }
    case 'reset state': {
      return initialState;
    }
    default: {
      return state;
    }
  }
};

/**
 * Exposes the current state of the REST response
 * as well as an API for updating that state.
 */
const useRestResponse = <T>(): [State<T>, IActionsDef] => {
  const [state, dispatch] = useReducer(
    reducer as Reducer<State<T>, Action>,
    initialState,
    (s) => s
  );

  const setData = useCallback(
    (payload: Action) => {
      dispatch({
        payload,
        type: 'set data',
      });
    },
    [dispatch]
  );

  const setError = useCallback(
    (payload: RestAPIError) => {
      dispatch({
        payload,
        type: 'set error',
      });
    },
    [dispatch]
  );

  const setLoading = useCallback(
    (payload: boolean) => {
      dispatch({
        payload,
        type: 'set loading',
      });
    },
    [dispatch]
  );

  const receiveError = useCallback(
    (payload: RestAPIError) => {
      dispatch({
        payload,
        type: 'receive error',
      });
    },
    [dispatch]
  );

  const receiveResponse = useCallback(
    (payload: Action) => {
      dispatch({
        payload,
        type: 'receive response',
      });
    },
    [dispatch]
  );

  const resetState = useCallback(() => {
    dispatch({
      payload: null,
      type: 'reset state',
    });
  }, [dispatch]);

  // This object should never change.
  const api = useMemo(
    () => ({
      dispatch,
      receiveError,
      receiveResponse,
      resetState,
      setData,
      setError,
      setLoading,
    }),
    [
      dispatch,
      receiveError,
      receiveResponse,
      resetState,
      setData,
      setError,
      setLoading,
    ]
  );

  return [state, api];
};

export { useRestResponse };
