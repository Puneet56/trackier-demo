import { useState } from "react";
import { get } from "../../api-service/fetch";
import { usePageChange } from "../../hooks/use-page";
import { POSTS_URL } from "./constants";

type Data = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

const Posts = () => {
  const [data, setData] = useState<Data[]>([]);

  const onLoad = async () => {
    const page =
      Number(new URLSearchParams(window.location.search).get("_page")) || 1;
    const limit =
      Number(new URLSearchParams(window.location.search).get("_limit")) || 10;

    const res = await get<Data[]>(`${POSTS_URL}?_page=${page}&_limit=${limit}`);

    if (res.error) {
      // show error
      return;
    }

    if (res.data) {
      setData(res.data);
    } else {
      setData([]);
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
};

export default Posts;
