import { ref, UnwrapRef } from 'vue';
import { AxiosResponse } from 'axios';
import useLoading from './loading';

// use to fetch list
// Don't use async function. It doesn't work in async function.
// Use the bind function to add parameters
// example: useRequest(api.bind(null, {}))

export default function useRequest<T>(
  api: () => Promise<AxiosResponse>,
  defaultValue = [] as unknown as T,
  isLoading = true
) {
  const { loading, setLoading } = useLoading(isLoading);
  const response = ref<T>(defaultValue);
  api()
    .then((resp) => {
      response.value = resp.data as unknown as UnwrapRef<T>;
    })
    .finally(() => {
      setLoading(false);
    });
  return { loading, response };
}
