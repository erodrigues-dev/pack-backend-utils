import { DetailFromError } from './getDetailFromError'

export const isServerTimeout = (detailError: DetailFromError) => {
  return (
    [502, 504].includes(detailError.status as number) ||
    /50[24]/gm.test(detailError.message) ||
    /gateway/gim.test(detailError.message) ||
    /time-?out/gim.test(detailError.message)
  )
}
