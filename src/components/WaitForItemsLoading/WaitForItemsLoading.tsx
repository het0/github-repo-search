import React from 'react';

export type Props = React.PropsWithChildren<{
  loading?: boolean;
  empty?: boolean;
  count?: number;
  EmptyRender: React.ReactNode;
  ShimmerComponent?: React.FunctionComponent;
}>;

const WaitForItemsLoading = ({
  empty,
  loading,
  count = 5,
  ShimmerComponent,
  EmptyRender,
  children,
}: Props) => {
  return (
    <>
      {loading && ShimmerComponent
        ? Array.from({ length: count! }).map((_, i) => (
            <ShimmerComponent key={i} />
          ))
        : empty
        ? EmptyRender
        : children}
    </>
  );
};

export default WaitForItemsLoading;
