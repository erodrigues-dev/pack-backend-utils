import crypto from 'node:crypto'

export class Security {
  private algorithm: string = 'aes-256-cbc'
  private key: string
  private iv: string

  constructor(secret: string) {
    const secretHash = crypto.createHash('sha512').update(secret).digest('hex')

    this.key = secretHash.substring(0, 32)
    this.iv = secretHash.substring(32, 48)
  }

  encrypt(data: string) {
    const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv)
    return Buffer.from(
      cipher.update(data, 'utf-8', 'hex') + cipher.final('hex'),
    ).toString('utf-8')
  }

  decrypt(data: string) {
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, this.iv)
    return decipher.update(data, 'hex', 'utf-8') + decipher.final('utf-8')
  }

  compare(data: string, encryptedData: string) {
    return this.encrypt(data) === encryptedData
  }
}
