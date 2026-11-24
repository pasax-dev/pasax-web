import crypto from "node:crypto"

function deriveAesKey(): Buffer {
  const raw =
    process.env.SSH_PROFILE_CIPHER_KEY ||
    process.env.NEXTAUTH_SECRET ||
    "pasax-ephemeral-local-dev-cipher-key"
  return crypto.createHash("sha256").update(raw).digest()
}

export function encryptSshSecret(plaintext: string): string {
  const key = deriveAesKey()
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv)
  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ])
  const tag = cipher.getAuthTag()
  return `v1:${iv.toString("hex")}:${tag.toString("hex")}:${encrypted.toString("hex")}`
}

export function decryptSshSecret(payload: string): string | null {
  try {
    const parts = payload.split(":")
    if (parts.length !== 4 || parts[0] !== "v1") {
      return null
    }
    const [, ivHex, tagHex, dataHex] = parts
    const key = deriveAesKey()
    const decipher = crypto.createDecipheriv(
      "aes-256-gcm",
      key,
      Buffer.from(ivHex, "hex")
    )
    decipher.setAuthTag(Buffer.from(tagHex, "hex"))
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(dataHex, "hex")),
      decipher.final(),
    ])
    return decrypted.toString("utf8")
  } catch {
    return null
  }
}
