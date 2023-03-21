import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { UrlObject } from 'url';

export const DEFAULT_PAGE = 1;
export const QUERY_PARAM = 'p';

/**
 * Provides pagination logic stored in route.
 *
 * @kind function
 *
 * @returns {currentPage, setCurrentPage} returns current page and function to set current page
 */
const useRoutePagination = () => {
  const [currentPage, setCurrentPageVal] = useState<number>(DEFAULT_PAGE);
  const router = useRouter();
  const queryParam = router.query[QUERY_PARAM] ?? '';
  const pageFromQuery = parseInt(
    Array.isArray(queryParam) ? queryParam.join() : queryParam,
    10
  );

  // Query is used to hold state of pagination
  const setCurrentPage = useCallback(
    (page: number, replace: boolean = false): Promise<boolean> => {
      const url = {
        query: {
          ...router.query,
          [QUERY_PARAM]: page,
        },
      } as UrlObject;

      setCurrentPageVal(page);
      if (replace) {
        return router.replace(url, undefined, { shallow: true });
      } else {
        return router.push(url, undefined, { shallow: true });
      }
    },
    [router]
  );

  // Ensure the location always contains a page number
  useEffect(() => {
    if (!pageFromQuery) {
      setCurrentPage(DEFAULT_PAGE, true);
    }
  }, [pageFromQuery]);

  return {
    currentPage,
    setCurrentPage,
  };
};

export { useRoutePagination };
