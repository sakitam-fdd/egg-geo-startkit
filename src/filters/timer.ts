import dayjs from 'dayjs';

export const date = (date: string | number | Date | dayjs.Dayjs | undefined, fmt = 'YYYY-MM-DD') => {
  let str = '';
  if (date) {
    str = dayjs(date).format(fmt);
  }
  return str;
};

export const time = (d: string | number | Date | dayjs.Dayjs | undefined, fmt = 'YYYY-MM-DD HH:mm:ss') => date(d, fmt);

export const minute = (d: string | number | Date | dayjs.Dayjs | undefined, fmt = 'YYYY-MM-DD HH:mm') => date(d, fmt);

export const second = (d: string | number | Date | dayjs.Dayjs | undefined, fmt = 'HH:mm:ss') => date(d, fmt);

export const month = (d: string | number | Date | dayjs.Dayjs | undefined, fmt = 'YYYY-MM') => date(d, fmt);
