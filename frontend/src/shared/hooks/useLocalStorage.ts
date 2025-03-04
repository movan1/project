export const useLocalStorage = () => {
  const set = (key: string, value: unknown) => {
    if (typeof value === 'string') {
      localStorage.setItem(key, value);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  };

  const get = (key: string) => localStorage.getItem(key);

  const remove = (key: string) => localStorage.removeItem(key);

  return {
    get, remove, set
  };
};
