import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  CreateAxiosDefaults,
} from 'axios';
import parseLinkHeader from 'parse-link-header';

const nextLinkHeader = (response: AxiosResponse) => {
  const links = parseLinkHeader(response.headers.link);

  if (!links || !links.next) {
    return null;
  }

  // Defend against APIs that continue sending the same next link
  if (links.next.url === response.config.url) {
    return null;
  }

  return links.next.url;
};

export const createAxiosInstance = (config: CreateAxiosDefaults) => {
  const axiosInstance = axios.create(config);

  return {
    axiosInstance,
    // Iterator function to paginate a given url
    paginate: async function* <T = any>(
      url: string,
      options?: AxiosRequestConfig,
    ) {
      let requestUrl: string | null = url;

      while (requestUrl) {
        const response = await axiosInstance.get<T>(requestUrl, options);
        yield response.data;

        requestUrl = nextLinkHeader(response);
      }
    },
  };
};
