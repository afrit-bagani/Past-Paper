// Fallback function to extract platform from User-Agent string
export const extractPlatformFromUserAgent = (userAgent) => {
  if (/windows/i.test(userAgent)) return "Windows";
  if (/macintosh|mac os x/i.test(userAgent)) return "macOS";
  if (/android/i.test(userAgent)) return "Android";
  if (/iphone|ipad|ipod/i.test(userAgent)) return "iOS";
  if (/linux/i.test(userAgent)) return "Linux";
  return "Unknown";
};
