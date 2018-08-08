//index.js
import {
  getGPS,
  getIp,
  getWeather
} from '../../actions/fetchingData'
import {
  handleName,
  saveWeather,
  SAVE_NAME
} from '../../actions/simpleActions'
import { store } from '../../app'

const { getState, dispatch, subscribe } = store

export const WEATHER_URL = 'http://api.jisuapi.com/weather/query?appkey=67915663762c1f49&';

Page({
  data: {
    cityWeather: {},
    isIndexPage: true
  },
  onLoad: function () {
    const _this = this
    //监听state变化更新视图
    subscribe(
      () => {
        const { thisCity: { weather: { weather } } } = getState()
        _this.setData({
          cityWeather: weather
        })
      }
    )
    this.updataHomePage()
      .then(
        () => {
          const { thisCity: { weather: { weather, weather: { cityName } } } } = getState()
          dispatch(handleName(SAVE_NAME, cityName, true))
          dispatch(saveWeather(weather))
        }
      )
  },
  onPullDownRefresh: function () {
    this.updataHomePage()
      .then(
        () => { wx.stopPullDownRefresh() }
      )
  },
  updataHomePage: function () {
    /* 
      逻辑：
      优先使用gps获取天气，如果获取不成功的话，则使用ip地址获取天气
      ip地址使用搜狐提供的一个api，具体见action
    */
    return dispatch(getGPS())
      .then(
        ({ latitude, longitude }) => {
          return WEATHER_URL + `location=${latitude},${longitude}`
        },//resolve(通过GPS获取天气的地址)
        () => {
          console.log("开始获取ip")
          wx.showToast({ content: "GPS信息获取失败", duration: 1000 })
          //请注意这里返回的是一个rejected的Promise,目的是为了让then中的onRejeted处理
          return dispatch(getIp())
        }//reject(IP地址)
      )
      .then(
        (gpsUrl) => {
          return dispatch(getWeather({ url: gpsUrl }))
        },//若成功通过GPS，则使用生成的url获取天气
        (ip) => {
          const ipUrl = WEATHER_URL + `ip=${ip}`
          return dispatch(getWeather({ url: ipUrl }))
        }//若没有GPS，则使用ip地址生产url获取天气
      )
    // .then(
    //   //天气获取成功
    //   () => {
    //     console.log(`天气获取成功`)
    //   },
    //   //天气获取失败
    //   (err) => {
    //     console.log(err)
    //   }
    // )
  },
  navToCityList: function () {
    wx.navigateTo({
      url: "/pages/navigator/cityList/cityList"
    })
  }
})
