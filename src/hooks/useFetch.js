import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(url, {
          headers: {
            Accept: 'application/vnd.github+json',
          },
        });
        setData(response.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setError('User not found. Please check the username.');
        } else if (err.response?.status === 403) {
          setError('API rate limit exceeded. Please wait a moment and try again.');
        } else {
          setError('Something went wrong. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};

export default useFetch;