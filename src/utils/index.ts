/**
 * get unix timestamp of now
 * @return {number} timestamp
 */
export function unixTimeStampNow(): number {
  const now = new Date();
  return Math.floor(now.getTime() / 1000);
}