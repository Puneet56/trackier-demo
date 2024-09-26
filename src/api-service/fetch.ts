type FetchOptions = {
  url: string;
  method: string;
  body?: any;
  headers?: any;
};

type APIResponse<T> = {
  data?: T;
  error?: any;
};

const handleFetch = async <T>(
  options: FetchOptions
): Promise<APIResponse<T>> => {
  try {
    const token = localStorage.getItem("token");
    // vite
    const baseUrl = import.meta.env.VITE_APP_BASE_URL;

    if (token) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      };

      // @ts-ignore
      if (import.meta.env === "development") {
        options.headers = {
          ...options.headers,
          "x-test": "test",
        };
      }
    }

    const res = await fetch(baseUrl + options.url, {
      ...options,
    });

    const data: T = await res.json();
    return {
      data,
    };
  } catch (error) {
    console.error(error);
    return {
      error,
    };
  }
};

export const get = async <T>(url: string): Promise<APIResponse<T>> => {
  return handleFetch<T>({
    url,
    method: "GET",
  });
};
