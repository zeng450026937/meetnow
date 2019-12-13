export const isSuccess = (param) => {
  if (!param) return false;
  const reasonCode = typeof param === 'object' ? param['reason-code'] : param;

  return [220000, 900200].includes(reasonCode) || /^[0-9]+[0]{4}/.test(reasonCode);
};

export const dataAsString = (date, divider = '/') => {
  if (!date) return false;
  if (typeof date === 'number') date = new Date(date);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  // const second = String(date.getSeconds()).padEnd(2, '0');

  return `${ year }${ divider }${ month }${ divider }${ day } ${ hour }:${ minute }`;
};

export const toArray = (val) => (Array.isArray(val) ? val : [val]);
