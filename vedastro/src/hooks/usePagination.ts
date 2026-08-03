"use client";

import { useState, useCallback } from "react";

interface UsePaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
  totalItemsCount: number;
}

export function usePagination({
  initialPage = 1,
  initialPageSize = 10,
  totalItemsCount
}: UsePaginationOptions) {
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [pageSize, setPageSize] = useState<number>(initialPageSize);

  const totalPagesCount = Math.max(1, Math.ceil(totalItemsCount / pageSize));

  const setPage = useCallback((pageNumber: number) => {
    setCurrentPage(() => {
      const boundCheck = Math.max(1, Math.min(pageNumber, totalPagesCount));
      return boundCheck;
    });
  }, [totalPagesCount]);

  const nextPage = useCallback(() => {
    setPage(currentPage + 1);
  }, [currentPage, setPage]);

  const prevPage = useCallback(() => {
    setPage(currentPage - 1);
  }, [currentPage, setPage]);

  return {
    currentPage,
    pageSize,
    totalPages: totalPagesCount,
    setPage,
    nextPage,
    prevPage,
    setPageSize
  };
}