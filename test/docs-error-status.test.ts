import { expect, it } from 'vitest'
import { isDocsNotFound } from '../packages/docs/app/utils/error-status'

it.each([
  [{ statusCode: 404 }, true],
  [{ status: 404 }, true],
  [{ status: 404, statusCode: 404 }, true],
  [{ status: 500, statusCode: 404 }, false],
  [{ status: 500 }, false],
  [{ statusCode: 500 }, false],
  [{ status: '404' }, false],
  [new Error('Private failure'), false],
  [null, false],
  [undefined, false],
] as const)('classifies serialized docs errors safely: %j', (error, expected) => {
  expect(isDocsNotFound(error)).toBe(expected)
})
