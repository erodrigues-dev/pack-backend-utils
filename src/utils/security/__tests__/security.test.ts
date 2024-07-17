import { Security } from '../Security'

const makeSUT = () => new Security('my-super-secret-key')

describe('Security', () => {
  describe('encrypt', () => {
    it('should encrypt the data', () => {
      const sut = makeSUT()

      const data = 'my-data'
      const encryptedData = sut.encrypt(data)

      expect(encryptedData).not.toBe(data)
    })
  })

  describe('decrypt', () => {
    it('should decrypt the data', () => {
      const sut = makeSUT()

      const data = 'my-data'
      const encryptedData = sut.encrypt(data)
      const decryptedData = sut.decrypt(encryptedData)

      expect(decryptedData).toBe(data)
    })
  })

  describe('compare', () => {
    it('should return true if the data is equal to the encrypted data', () => {
      const sut = makeSUT()

      const data = 'my-data'
      const encryptedData = sut.encrypt(data)
      const result = sut.compare(data, encryptedData)

      expect(result).toBe(true)
    })

    it('should return false if the data is not equal to the encrypted data', () => {
      const sut = makeSUT()

      const data = 'my-data'
      const encryptedData = sut.encrypt(data)
      const result = sut.compare('another-data', encryptedData)

      expect(result).toBe(false)
    })
  })
})
