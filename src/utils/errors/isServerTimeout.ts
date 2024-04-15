type Props = {
  status?: number
  message: string
}

export const isServerTimeout = (detailError: Props): boolean => {
  return (
    [502, 504].includes(detailError.status) ||
    /50[24]/gm.test(detailError.message) ||
    /gateway/gim.test(detailError.message) ||
    /time-?out/gim.test(detailError.message)
  )
}
