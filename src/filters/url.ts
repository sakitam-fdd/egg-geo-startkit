const localHostList = [
  'localhost',
  '127.0.0.1',
];

export const formatUrl = (url: string) => {
  if (localHostList.indexOf(window.location.hostname) < 0) {
    url = url.replace(/^http(s)?:\/\/(.*?)\//, `${window.location.protocol}://${window.location.hostname}/`);
  }
  return url;
};
