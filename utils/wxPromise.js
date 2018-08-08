import toPromise from '../module/to-promise'

const toPromiseWx = toPromise(wx)

export const request = toPromiseWx('request')
export const getLocation = toPromiseWx('getLocation')
export const setStorage = toPromiseWx('setStorage')
export const getStorage = toPromiseWx('getStorage')