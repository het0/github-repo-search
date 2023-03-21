import React from 'react';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { FaStar } from 'react-icons/fa';

import { RepoSearchResultItem } from '@/types/types';
import { truncateText } from '@/lib/helpers/common';

export type Props = RepoSearchResultItem;

const RepositoryItem = ({
  owner,
  full_name,
  description,
  stargazers_count,
  language,
}: Props) => {
  return (
    <Card
      elevation={4}
      className="cardBase"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        wordWrap: 'break-word',
        position: 'relative',
        p: '2px',
        '&:hover::before': {
          opacity: 1,
        },
        '&::before, &::after': {
          borderRadius: 'inherit',
          content: '""',
          height: '100%',
          left: '0px',
          opacity: 0,
          position: 'absolute',
          top: '0px',
          transition: 'opacity 500ms',
          width: '100%',
        },

        '&::before': {
          background:
            'radial-gradient(800px circle at var(--mouse-x) var(--mouse-y),rgba(255, 255, 255, 0.06),transparent 40%)',
          zIndex: 3,
        },
        '&::after': {
          background:
            'radial-gradient(600px circle at var(--mouse-x) var(--mouse-y),rgba(255, 255, 255, 0.4),transparent 40%)',
          zIndex: 1,
        },
      }}
    >
      <Box
        className="card"
        sx={{
          position: 'absolute',
          zIndex: 2,
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          padding: '2px',
        }}
      >
        <Box
          sx={{
            backgroundColor: 'background.default',
            width: '100%',
            height: '100%',
          }}
        />
      </Box>
      <Stack sx={{ zIndex: 4, height: '100%' }}>
        <CardHeader
          avatar={
            <Avatar src={owner!.avatar_url} aria-label={owner?.name ?? ''} />
          }
          title={owner?.login}
          subheader={owner?.type}
        />
        <CardContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            justifyContent: 'space-between',
          }}
        >
          <Typography gutterBottom variant="h5" component="div">
            {full_name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {truncateText(description ?? '', 200)}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: '20px',
            }}
          >
            <Chip icon={<FaStar />} label={stargazers_count} />
            <Typography
              variant="body2"
              color="info.main"
              sx={{ textAlign: 'right', fontWeight: 700 }}
            >
              {language}
            </Typography>
          </Box>
        </CardContent>
      </Stack>
    </Card>
  );
};

export default RepositoryItem;
