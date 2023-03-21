import { useCallback, useMemo, useRef } from 'react';

import RestAPI, { Options } from '@/lib/RestAPI/RestAPI';

import RestAPIError from '../RestAPI/RestAPIError';
import { useRestResponse } from './useRestResponse';

type SendRequest = Options & {
  endpoint?: string;
  onCompleted?: (response: any) => void;
  onError?: (error: RestAPIError) => void;
};

/**
 * A hook that helps to make REST API calls and track state of the call.
 *
 * @kind function
 *
 * @param endpoint {string} endpoint to make a request to
 *
 * @returns {state, api} returns state of the call and api to make a request
 */
const useRestAPI = <T>(endpoint: string = '') => {
  const [restResponseState, restResponseApi] = useRestResponse<T>();
  const { receiveError, receiveResponse, setLoading } = restResponseApi;

  const apiRef = useRef<RestAPI>();

  // Define a callback that sends a request
  // either as an effect or in response to user interaction.
  const sendRequest = useCallback(
    async ({
      endpoint: endpointOverride,
      onCompleted,
      onError,
      ...options
    }: SendRequest = {}): Promise<any> => {
      // setLoading to true before making the call.
      // There is no need to setLoading to false after because
      // both receiveResponse and receiveError handle that.
      setLoading(true);

      const req = new RestAPI(endpointOverride ?? endpoint, options);

      // Saving newly created request to handle abortRequest
      apiRef.current = req;

      try {
        req.run();

        const promise = req.getResponse();
        let response;
        if (options && options.parseJSON === false) {
          response = await promise;
        } else {
          response = await promise.then((res) => res.json());
        }

        // If request aborted - don't finish response
        if (!req.isAborted) {
          receiveResponse(response);
          if (onCompleted) onCompleted(response);
        }

        return response;
      } catch (error) {
        // Error is of type M2ApiResponseError here.
        if (!req.isAborted && error instanceof RestAPIError) {
          receiveError(error);
          if (onError) onError(error);
        }
      }
    },
    [endpoint, receiveError, receiveResponse, setLoading]
  );

  const abortRequest = useCallback(() => {
    if (apiRef.current) {
      // Abort request by ref, using abort controller for this
      // apiRef will always point to the latest created request
      apiRef.current.abortRequest();
      // Need to set loading to false because we won't be having response completed
      setLoading(false);
    }
  }, [setLoading]);

  const api = useMemo(
    () => ({
      ...restResponseApi,
      abortRequest,
      sendRequest,
    }),
    [restResponseApi, sendRequest, abortRequest]
  );

  return {
    state: restResponseState,
    api,
  };
};

export { useRestAPI };
