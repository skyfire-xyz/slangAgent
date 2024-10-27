export const setSessionData = async (key: string, data: string) => {
  if (key) {
    if (typeof window !== "undefined") {
      window["sessionStorage"].setItem(key, data);
    }
  } else {
    setSessionData(key, data);
  }
};

export const getSessionData = (key: string): any => {
  if (typeof window !== "undefined") {
    const storageData = window["sessionStorage"].getItem(key) || "";
    return storageData;
  }
  return null;
};
