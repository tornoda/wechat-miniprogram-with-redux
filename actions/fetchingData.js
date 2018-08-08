import {
  requestBegin,
  received,
  requestFailed
} from './3Steps'
// import toPromise from '../module/to-promise'
import { request, getLocation } from '../utils/wxPromise'
import convertOriginData from '../utils/convertOriginData'

//获取当前当前GPS信息,resolve(location对象)
export const GPS = '_GPS'
export const getGPS = () => {
  return (dispatch) => {
    dispatch(requestBegin(GPS))
    return getLocation()
      .then(
        (location) => {
          dispatch(received(GPS, location))
          return location
        },
        (err) => {
          dispatch(requestFailed(GPS, err))
          console.log(`获取GPS失败：`)
          console.log(err)
          throw err
        }
      )
  }
}

//获取当前ip信息,resolve(ip)
export const IP = '_IP_SOHOPV'
const IPURL = 'https://pv.sohu.com/cityjson?ie=utf-8'
export const getIp = () => {
  return (dispatch) => {
    dispatch(requestBegin(IP))
    return request({
      url: IPURL
    })
      .then(
        (res) => {
          const resParsed = JSON.parse(res.data.match(/{.+}/)[0])
          const ip = resParsed.cip
          const name = resParsed.cname
          dispatch(received(IP, { ip, name }))
          return Promise.reject(ip)//注意！根据需求，这里没有返回resolve的Promise，而是rejected的Promise
        },
        (err) => {
          dispatch(requestFailed(IP, err))
          return Promise.reject(err)
        }
      )
  }
}

//根据城市获取当前天气
export const WEATHER = '_WEATHER'
export const getWeather = (option) => {
  return (dispatch) => {
    dispatch(requestBegin(WEATHER))
    return request(option)
      .then(//转换第三方API为自己想要的数据结构，如果有自己后端直接就能设计成需要的
        ({ data: { result } }) => {
          const weather = convertOriginData(result)
          dispatch(received(WEATHER, weather))
          return Promise.resolve(weather)
        },
        (err) => {
          dispatch(requestFailed(WEATHER, err))
          return Promise.reject(err)
        }
      )
  }
}