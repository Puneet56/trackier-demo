import { useEffect, useState } from "react";

type PageState = {
  page: number;
  limit: number;
  onLoad: () => void;
};

const usePageChange = (args: PageState) => {
  // Set page and limit in query params
  // update page and limit in query params
  // (optionlly) fetch data from api

  const [page, setPage] = useState(args.page);
  const [limit, setLimit] = useState(args.limit);

  const handlePageChange = (newPage: number) => {
    setParams(newPage, limit);
    args.onLoad();
  };

  const handleLimitChange = (newLimit: number) => {
    setParams(page, newLimit);
    args.onLoad();
  };

  const setParams = (page: number, limit: number) => {
    setPage(page);
    setLimit(limit);

    history.pushState(
      {},
      "",
      `?${new URLSearchParams({
        _page: page.toString(),
        _limit: limit.toString(),
      })}`
    );
  };

  useEffect(() => {
    const page =
      Number(new URLSearchParams(window.location.search).get("_page")) || 1;
    const limit =
      Number(new URLSearchParams(window.location.search).get("_limit")) || 10;

    setParams(page, limit);
    args.onLoad();
  }, []);

  return {
    page: page,
    limit,
    handlePageChange,
    handleLimitChange,
  };
};

export { usePageChange };
