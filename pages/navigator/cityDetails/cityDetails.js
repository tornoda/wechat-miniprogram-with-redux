// cityDetails.js
let cityName = "";
const app = getApp();

Page({
  data: {
    cityWeather: {},
    isIndexPage: false
  },
  onLoad: function (options) {
    console.log(options)
    cityName = options["cityName"];
  },

  onReady: function () {
    this.updateWeatherFromGlobal(cityName);
  },
  onPullDownRefresh: function () {
    this.updateWeatherFromGlobal()
      .then(() => wx.stopPullDownRefresh());
  },
  updateWeatherFromGlobal: function (cityName) {
    const _this = this;
    const cityWeather =  app.globalData.cityWeather;
    return new Promise ((resolve) => {
      _this.setData({
        cityWeather: cityWeather[cityName]
      }, () => {resolve()})
    })
  },
})