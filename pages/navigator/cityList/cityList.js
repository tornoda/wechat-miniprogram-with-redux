// cityList.js
import { store } from '../../../app'
import {
  handleName,
  saveWeather,
  SAVE_NAME,
  DELETE_NAME
} from '../../../actions/simpleActions'
import { getWeather } from '../../../actions/fetchingData'
import { WEATHER_URL } from '../../index/index'

const { getState, dispatch, subscribe } = store

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cityWeather: {},
    cityList: [],
    isBtnShow: false,
    initPageX: 0,
    delShow: "",
    toDelCity: "",
    toFocusInput: false,
    style: {
      inputWidth: "",
      inputColor: ""
    }
  },

  onLoad: function () {
    const _this = this
    // const { cities, citiesWeather } = getState()
    //一旦store中的state有变化，就会更新UI
    subscribe(
      () => {
        const { cities, citiesWeather } = getState()
        _this.setData({
          cityWeather: citiesWeather,
          cityList: cities
        })
      }
    )
  },
  onReady: function () {
    const _this = this
    const { cities, citiesWeather } = getState()
    if (cities.length > 1) {
      _this.refreshCitiesWeather()
    } else {
      _this.setData({
        cityWeather: citiesWeather,
        cityList: cities
      })
    }
  },
  onPullDownRefresh: function () {
    this.refreshCitiesWeather()
  },
  toggleEdit: function () {
    this.setData({
      isBtnShow: !this.data.isBtnShow
    })
  },
  onSubmit: function (e) {
    //这里的局部数据isBtnShow没有放入redux
    this.setData({
      isBtnShow: false/* 在编辑状态下添加城市，会自动退出编辑状态 */
    })
    const city = e.detail.value.city
    const url = `${WEATHER_URL}city=${city}`
    dispatch(handleName(SAVE_NAME, city))
    dispatch(getWeather({ url }))
      .then(
        (weather) => {
          dispatch(saveWeather(weather))
        }
      )
  },
  showInput: function (e) {
    if (!this.data.isInputShow) {
      const style1 = `width: 530rpx;`
      const style2 = `background-color: #fff`
      this.setData({
        style: {
          inputWidth: style1,
          inputColor: style2,
        },
      });
    }
  },
  handleTransitionend: function (e) {
    console.log("transitionend!")
    this.setData({
      toFocusInput: true
    })
  },
  deleteCity: function (event) {
    const cityName = event.detail.target.dataset.cityName;
    dispatch(handleName(DELETE_NAME, cityName))
  },
  //刷新城市列表天气
  refreshCitiesWeather: function () {
    const _this = this;
    const { cities } = getState()
    const allRequset = cities.map((val) => {
      const url = `${WEATHER_URL}&city=${val}`
      return dispatch(getWeather({ url }))
        .then((weather) => {
          dispatch(saveWeather(weather))
        })
    })
    Promise.all(allRequset)
      .then(
        () => {
          wx.stopPullDownRefresh();
        }
      )
  }
})