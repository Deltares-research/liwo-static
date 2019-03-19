import get from 'lodash/fp/get'
import pipe from 'lodash/fp/pipe'
import negate from 'lodash/fp/negate'
import isNull from 'lodash/fp/isNull'
import isEmpty from 'lodash/fp/isEmpty'
import includes from 'lodash/fp/includes'

/**
 * Gets the id property of the provided object
 * _Function is curried_
 *
 * @example
 * const myObject = { id: 'foo' }
 * getId(myObject) // 'foo'
 */
export const getId = get('id')

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
export const includedIn = includes.convert({rearg: false})

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
export const idSameAs = value => pipe([getId, id => id === value])

/**
 * Checks if the id property of an object is included in the provided array
 * _Function is curried_
 *
 * @example
 * const myArray = ['foo', 'bar']
 * idIncludedIn(myArray)({ id: 'bar' }) // true
 * idIncludedIn(myArray)({ id: 'baz' }) // false
 */
export const idIncludedIn = array => pipe([getId, includedIn(array)])

/**
 * Checks if an array is not emoty
 *
 * @example
 * notEmpty([1, 2, 3]) // true
 * notEmpty([]) // false
 */
export const notEmpty = negate(isEmpty)

/**
 * Checks if a value is not null
 *
 * @example
 * notNull(undefined) // true
 * notNull(null) // false
 */
export const notNull = negate(isNull)
