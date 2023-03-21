import React, { useState, useRef } from 'react';
import Head from 'next/head';
import TextField from '@mui/material/TextField';
import Pagination from '@mui/material/Pagination';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import { SEARCH_API_ROUTE } from '@/constants/routes';
import { useRestAPI } from '@/lib/hooks/useRestAPI';
import { SearchRepositoriesResponse } from '@/types/types';
import { useRoutePagination } from '@/lib/hooks/useRoutePagination';
import { useThrottledEffect } from '@/lib/hooks/useThrottledEffect';
import { useEventListener } from '@/lib/hooks/useEventListener';
import RepositoryItem from '@/components/RepositoryItem/RepositoryItem';
import RepositoryItemShimmer from '@/components/RepositoryItem/RepositoryItemShimmer';
import WaitForItemsLoading from '@/components/WaitForItemsLoading/WaitForItemsLoading';
import EmptyContent from '@/components/EmptyContent/EmptyContent';

const PAGE_SIZE = 9;

function Home() {
  const [inputVal, setInputVal] = useState<string>();
  const containerRef = useRef<HTMLDivElement>();

  const { api, state } = useRestAPI<SearchRepositoriesResponse>();

  const { setCurrentPage, currentPage } = useRoutePagination();

  useThrottledEffect(
    () => {
      const endpoint = new URL(SEARCH_API_ROUTE);

      endpoint.search = new URLSearchParams({
        q: inputVal ?? '',
        page: `${currentPage}`,
        per_page: `${PAGE_SIZE}`,
      }).toString();

      api.sendRequest({ endpoint: endpoint.toString() });
    },
    2000,
    [inputVal, currentPage]
  );

  // Fun little style effect to highlight cards when mouse moves
  useEventListener(containerRef.current, 'mousemove', (e: MouseEvent) => {
    if (containerRef.current) {
      const cards = containerRef.current.getElementsByClassName(
        'cardBase'
      ) as HTMLCollectionOf<HTMLElement>;
      for (const card of cards) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      }
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPage(1);
    setInputVal(e.target.value);
  };

  const total_pages = Math.ceil((state.data?.total_count ?? 0) / PAGE_SIZE);
  const items = state.data?.items ?? [];
  const isLoading = state.loading;
  const isEmpty = state.done && items.length === 0;
  const error = state.error?.message;

  return (
    <>
      <Head>
        <title>Github Repo Search</title>
      </Head>
      <Container
        component="main"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: '6rem',
          gap: '20px',
          minHeight: '100vh',
        }}
      >
        <TextField
          variant="outlined"
          color="primary"
          type="text"
          id="search"
          placeholder="Search GitHub Repositories"
          aria-label="Search GitHub Repositories"
          error={!inputVal}
          sx={{ maxWidth: '700px', width: '80%' }}
          onChange={handleInputChange}
        />
        <Box
          ref={containerRef}
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
            width: '100%',
            '&:hover > .cardBase::after': {
              opacity: 1,
            },
          }}
        >
          <WaitForItemsLoading
            empty={isEmpty}
            loading={isLoading}
            count={PAGE_SIZE}
            EmptyRender={
              <EmptyContent title={error ?? ''} subTitle="Try typing :)" />
            }
            ShimmerComponent={RepositoryItemShimmer}
          >
            {items.map((item) => (
              <RepositoryItem key={item.id} {...item} />
            ))}
          </WaitForItemsLoading>
        </Box>
        {total_pages > 1 && !isEmpty && (
          <Pagination
            count={total_pages}
            page={currentPage}
            size="large"
            color="secondary"
            onChange={(_, page) => setCurrentPage(page)}
          />
        )}
      </Container>
    </>
  );
}

export default Home;
