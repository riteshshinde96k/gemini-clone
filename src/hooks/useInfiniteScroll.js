import { useState, useEffect, useCallback } from 'react';

export const useInfiniteScroll = (callback, hasMore) => {
  const [isFetching, setIsFetching] = useState(false);

  const fetchMoreData = useCallback(async () => {
    if (hasMore) {
      await callback();
    }
    setIsFetching(false);
  }, [callback, hasMore]);

  useEffect(() => {
    if (!isFetching) return;
    fetchMoreData();
  }, [isFetching, fetchMoreData]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollContainer = document.querySelector('.chat-messages');
      if (!scrollContainer || isFetching || !hasMore) return;

      if (scrollContainer.scrollTop === 0) {
        setIsFetching(true);
      }
    };

    const scrollContainer = document.querySelector('.chat-messages');
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, [isFetching, hasMore]);

  return [isFetching, setIsFetching];
};
