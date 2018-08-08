// cityDetails.js
import { store } from '../../../app'
import { getWeather } from '../../../actions/fetchingData'
import { WEATHER_URL } from '../../index/index'

let city = ''
const { dispatch, subscribe, getState } = store

Page({
  data: {
    cityWeather: {},
  },
  onLoad: function (options) {
    console.log(options)
    city = options["cityName"]
  },

  onReady: function () {
    const _this = this
    const { citiesWeather } = getState()
    _this.setData({
      cityWeather: citiesWeather[city]
    })
    //注册自动更新UI
    subscribe(
      () => {
        const { citiesWeather } = getState()
        _this.setData({
          cityWeather: citiesWeather[city]
        })
      }
    )
  },
  onPullDownRefresh: function () {
    const url = `${WEATHER_URL}city=${city}`
    dispatch(getWeather({ url: url }))
      .then(() => wx.stopPullDownRefresh());
  },
})