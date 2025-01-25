export const toUTC = (date: Date): string => {
  return date.toISOString();
};

export const toGMT7 = (date: Date): string => {
  const offset = 7 * 60 * 60 * 1000; // GMT+7 offset in milliseconds
  const gmt7Date = new Date(date.getTime() + offset);
  return gmt7Date.toISOString().slice(0, -1); // Remove the 'Z' at the end
};

export const toReadableGMT7 = (date: string): string => {
  const gmt7Date = new Date(new Date(date).getTime() + 7 * 60 * 60 * 1000);
  return gmt7Date.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });
};
