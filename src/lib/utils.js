/**
 * Gets the id property of the provided object
 * _Function is curried_
 *
 * @example
 * const myObject = { id: 'foo' }
 * getId(myObject) // 'foo'
 */
export const getId = obj => obj?.id

/**
 * Returns true if the value if truthy, false otherwise
 *
 * @example
 * isTruthy(false) // false
 * isTruthy('')    // false
 * isTruthy('a')   // true
 */
export const isTruthy = val => !!val

/**
 * Checks if a value is included in an array.
 * _Function is curried_
 *
 * @example
 * const array = [1, 2, 3]
 * includedIn(array)(1) // true
 * includedIn(array)(4) // false
 */
export const includedIn = arr => val => arr && arr.includes(val)

/**
 * Get the value of the index from the provided array
 * _Function is curried_
 *
 * @example
 * const arr = ['foo', 'bar', 'baz']
 * getByIndexFrom(arr)(1) // 'bar'
 * getByIndexFrom(arr)(4) // undefined
 */
export const getByIndexFrom = arr => index => arr && arr[index]

/**
 * Checks if the id property of the object equals the provided value
 * _Function is curried_
 *
 * @example
 * const myObject = { id: 'foo' }
 * idSameAs('foo')(myObject) // true
 * idSameAs('bar')(myObject) // false
 */
export const idSameAs = value => obj => getId(obj) === value

/**
 * Checks if the id property of an object is included in the provided array
 * _Function is curried_
 *
 * @example
 * const myArray = ['foo', 'bar']
 * idIncludedIn(myArray)({ id: 'bar' }) // true
 * idIncludedIn(myArray)({ id: 'baz' }) // false
 */
export const idIncludedIn = array => obj => array && array.includes(getId(obj))

/**
 * Checks if an array is not emoty
 *
 * @example
 * notEmpty([1, 2, 3]) // true
 * notEmpty([]) // false
 */
export const notEmpty = val => {
  if (val == null) return false
  if (typeof val === 'string' || Array.isArray(val)) return val.length > 0
  if (typeof val === 'object') return Object.keys(val).length > 0
  return true
}

/**
 * Checks if a value is not null
 *
 * @example
 * notNull(undefined) // true
 * notNull(null) // false
 */
export const notNull = val => val !== null

/**
 * Checks if a value if not NaN
 *
 * @example
 * notNaN(undefined) // true
 * notNaN(NaN) // false
 */
export const notNaN = val => !Number.isNaN(val)

/**
 * Wraps a value in an object with a specified property
 * _Function is curried_
 *
 * @example
 * wrapInProperty('myNumber', 10) // { myNumber: 10 }
 */
export const wrapInProperty = property => value => ({ [property]: value })

export const apply = fns => value => fns.map(fn => fn(value))

export const isPromise = (value) => Boolean(value && typeof value.then === 'function')

/**
 * Returns a copy of the object without the specified keys.
 *
 * @example
 * omit({ a: 1, b: 2, c: 3 }, ['b', 'c']) // { a: 1 }
 */
export const omit = (obj, keys) =>
  Object.fromEntries(Object.entries(obj).filter(([k]) => !keys.includes(k)))

/**
 * Returns an array with duplicate values removed.
 *
 * @example
 * uniq([1, 2, 2, 3]) // [1, 2, 3]
 */
export const uniq = arr => [...new Set(arr)]

export { deepEqual } from 'fast-equals'
