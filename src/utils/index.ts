import * as path from 'path'

export function getRootPath (): string {
  return path.resolve(__dirname, '../../')
}

export function getPkgVersion (): string {
  return require(path.join(getRootPath(), 'package.json')).version
}

export function printPkgVersion () {
  const taroVersion = getPkgVersion()
  console.log(`itaro v${taroVersion}`)
  console.log()
}

export const isObject = (arg): boolean => Object.prototype.toString.call(arg) === '[object Object]'

export const isArray = (arg): boolean => Array.isArray(arg)

export const isTest = process.env.NODE_ENV === 'dev'

export const sleep = (timeout) => new Promise((resolve) => setTimeout(resolve, timeout))
