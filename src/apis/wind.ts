import service from './http';

export function getScatter(url: string, params: any) {
  return service.get(url, {
    params,
  })
    .then(res => res.data);
}
