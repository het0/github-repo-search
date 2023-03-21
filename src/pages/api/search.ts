import type { NextApiRequest, NextApiResponse } from 'next';

import RestAPI from '@/lib/RestAPI/RestAPI';
import { REPOSITORIES_ENDPOINT } from '@/constants/endpoints';
import RestAPIError from '@/lib/RestAPI/RestAPIError';

type Data = {
  error?: string;
  name?: string;
};

const base64 = (s: string): string => Buffer.from(s, 'utf8').toString('base64');
const prepareSearchParam = (
  value: string[] | string | undefined
): string | null =>
  value ? (Array.isArray(value) ? value.join('') : value) : null;

async function SearchAPIHandler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { q, sort, order, per_page, page } = req.query;

  const endpoint = new URL(REPOSITORIES_ENDPOINT);
  endpoint.searchParams.set('q', prepareSearchParam(q) ?? '');
  endpoint.searchParams.set('sort', prepareSearchParam(sort) ?? '');
  endpoint.searchParams.set('order', prepareSearchParam(order) ?? '');
  endpoint.searchParams.set(
    'per_page',
    `${prepareSearchParam(per_page) ?? 30}`
  );
  endpoint.searchParams.set('page', `${prepareSearchParam(page) ?? 1}`);

  const headers = new Headers({
    Authorization:
      'Basic ' +
      base64(
        `${process.env.GITHUB_CLIENT_ID}:${process.env.GITHUB_CLIENT_SECRET}`
      ),
  });

  const client = new RestAPI(endpoint.toString(), { headers });

  try {
    client.run();

    const response = await client.getResponse().then((res) => res.json());

    res.status(200).json(response);
  } catch (error: RestAPIError | any) {
    if (error instanceof RestAPIError) {
      res.status(error.response.status ?? 422).json({
        ...error?.bodyText,
      });
    } else {
      res.status(503);
    }
  }
}

export default SearchAPIHandler;
