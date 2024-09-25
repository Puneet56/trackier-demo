import { useEffect, useState } from "react";
import "./App.css";

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
        _page: page,
        _limit: limit,
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
    page,
    limit,
    handlePageChange,
    handleLimitChange,
  };
};

type Data = {
  id: number;
  title: string;
  userId: number;
};

function App() {
  const [data, setData] = useState<Data[]>([]);

  const onLoad = async () => {
    const page =
      Number(new URLSearchParams(window.location.search).get("_page")) || 1;
    const limit =
      Number(new URLSearchParams(window.location.search).get("_limit")) || 10;

    console.log("INSIDE ONLOAD", { page, limit });

    try {
      const data = await fetch(
        `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${limit}`
      );
      const json = await data.json();
      setData(json);
    } catch (error) {
      console.error(error);
    }
  };

  const { page, limit, handlePageChange, handleLimitChange } = usePageChange({
    page: 1,
    limit: 10,
    onLoad: onLoad,
  });

  return (
    <div>
      <pre>
        <table>
          <thead>
            <tr>
              <th>User Id</th>
              <th>id</th>
              <th>title</th>
            </tr>
            {data.map((item) => (
              <tr key={item.id}>
                <td>{item.userId}</td>
                <td>{item.id}</td>
                <td>{item.title}</td>
              </tr>
            ))}
          </thead>
        </table>
        <div>
          <select
            // page number
            value={page}
            onChange={(e) => handlePageChange(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5].map((page) => (
              <option key={page} value={page}>
                Page {page}
              </option>
            ))}
          </select>

          <select
            //page limit
            value={limit}
            onChange={(e) => handleLimitChange(Number(e.target.value))}
          >
            {[10, 20, 30, 40, 50].map((limit) => (
              <option key={limit} value={limit}>
                Limit {limit}
              </option>
            ))}
          </select>
        </div>
      </pre>
    </div>
  );
}

export default App;
