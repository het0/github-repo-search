import React from 'react';
import Card from '@mui/material/Card';
import Skeleton from '@mui/material/Skeleton';

const RepositoryItemShimmer = () => {
  return (
    <Card elevation={4}>
      <Skeleton variant="rectangular" height="250px" />
    </Card>
  );
};

export default RepositoryItemShimmer;
