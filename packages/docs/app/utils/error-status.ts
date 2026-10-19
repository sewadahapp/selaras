export function isDocsNotFound(error: unknown) {
  if (!error || typeof error !== 'object')
    return false
  const status = 'status' in error ? error.status : undefined
  const statusCode = 'statusCode' in error ? error.statusCode : undefined
  return (status ?? statusCode) === 404
}
