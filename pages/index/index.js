//index.js
//获取应用实例
const app = getApp();

Page({
  data: {
    cityWeather: {},
    isIndexPage: true
  },
  onLoad: function () {
    this.updateThisCity();
  },
  onPullDownRefresh: function () {
    this.updateThisCity();
  },
  // setState: function (cityWeather) {
  //   this.setData({
  //     cityWeather: cityWeather
  //   })
  // },
  updateThisCity: function () {
    const _this = this;
    app.getLocationViaGPS()
      .then(
        (location) => app.getWeather(location),
        (err) => app.getWeather(err)
      )
      .then((cityName) => {
        const cityWeather = app.globalData.cityWeather;
        const cityList = app.globalData.cityList;
        //当前城市名字
        //App初始化的城市列表中，当前城市信息已过时。
        cityList[0] = cityName;
        _this.setData({
          cityWeather: cityWeather[cityName]
        }, () => {
          wx.stopPullDownRefresh();  
          console.log("当前城市天气信息更新成功")
        })
      })
  },
  navToCityList: function () {
    wx.navigateTo({
      url: "/pages/navigator/cityList/cityList"
    })
  }
})
