
const toBase64 = (str: string) =>
  typeof window === 'undefined' ? Buffer.from(str).toString('base64') : window.btoa(str)

const shimmerSvg = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#14261f" offset="20%" />
      <stop stop-color="#1e382e" offset="50%" />
      <stop stop-color="#14261f" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#14261f" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`

export const getShimmerBlurDataUrl = (w: number = 400, h: number = 300): string => {
  return `data:image/svg+xml;base64,${toBase64(shimmerSvg(w, h))}`
}

export const DEFAULT_BLUR_DATA_URL = getShimmerBlurDataUrl(400, 300)
