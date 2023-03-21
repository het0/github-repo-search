import React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export type Props = {
  title?: string;
  subTitle?: string;
};

const EmptyContent = ({ title = 'Nothing found :(', subTitle }: Props) => {
  return (
    <Stack
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: '15em',
      }}
    >
      <Typography variant="h4" color="text.main" sx={{ textAlign: 'center' }}>
        {title}
      </Typography>
      <Typography
        variant="h6"
        color="text.secondary"
        sx={{ textAlign: 'center' }}
      >
        {subTitle}
      </Typography>
    </Stack>
  );
};

export default EmptyContent;
