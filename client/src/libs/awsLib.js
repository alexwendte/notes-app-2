import { Storage } from 'aws-amplify'

// eslint-disable-next-line
export const s3Upload = async file => {
  const filename = `${Date.now()}-${file.name}`

  const stored = await Storage.vault.put(filename, file, {
    contentType: file.type,
  })

  return stored.key
}

export const s3Delete = async key => Storage.vault.remove(key)
