// cityList.js
const app = getApp();
const toast = app.getToast();

Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    cityWeather: {},
    cityList: [],
    initPageX: 0,
    delShow: "",
    toDelCity: "",
    toFocusInput: false,
    style: {
      inputWidth: "",
      inputColor: ""
    }
  },
  
  onReady: function () {
    this.updateWeatherFromGlobal();
  },
  onPullDownRefresh: function () {
    this.refreshCitiesWeather()
  },
  // // 自定义方法
  // getWeatherWithName: function (cityName) {
  //   return new Promise ((resolve) => {
  //     wx.request({
  //       url: "https://v.juhe.cn/weather/index?format=2&cityname=" + cityName + "&key=f8b7952e1e6464068c55ef74eaea3c59",
  //       success: (response) => {
  //         const {
  //           result: {
  //             sk,
  //           today,
  //           future
  //           }
  //       } = JSON.parse(JSON.stringify(response.data));
  //         resolve({
  //           cityName: today.city,
  //           now: sk,
  //           today: today,
  //           future: future
  //         })
  //       }
  //     })
  //   })
  // },
  onSubmit: function (e) {
    const _this = this;
    const newCity = e.detail.value.city;
    const cityList = app.globalData.cityList.slice();
    //根据输入的城市名称来更新citylist天气和城市列表
    if (cityList.indexOf(newCity) !== -1) {
      toast.showToast({ content: "城市已存在"})
      return false;
    }
    toast.showLoading({ mask: true });
    app.getCityWeatherUrl(newCity)
      .then((nameAndUrl) => {
        return app.updateCityInfo(nameAndUrl)
      })
      .then((thisCityWeather) => {
        const cityWeather = app.globalData.cityWeather;
        const cityList = app.globalData.cityList;
        console.log(thisCityWeather);
        // const newList = app.convertCollectionToList(cityWeatherCollection, cityList);
        _this.setData({
          cityWeather: cityWeather,
          cityList: cityList
        }, () => {toast.hideLoading()});
      })
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
    const cityList = app.globalData.cityList;
    const cityWeather = app.globalData.cityWeather;
    const index = cityList.indexOf(cityName);
    cityList.splice(index, 1);
    delete cityWeather[cityName];
    //更新UI
    this.setData({
      cityList: cityList
    })
    //更新localStorage的城市列表信息
    wx.setStorage({
      key: "cityList",
      data: cityList
    });
    //更新全局数据
    app.globalData.cityList = cityList;
    app.globalData.cityWeather = cityWeather;
  },
  //从globalData获取数据更新天气列表和天气。
  updateWeatherFromGlobal: function () {
    const cityWeather = app.globalData.cityWeather;
    const cityList = app.globalData.cityList;
    this.setData({
      cityList: cityList,
      cityWeather: cityWeather
    });
  },
  //刷新城市列表天气
  //return Promise.resolve():
  refreshCitiesWeather: function () {
    toast.showLoading({});
    const _this = this;
    const cityList = app.globalData.cityList.slice();
    const cityPromise = app.updatecitiesWeather(cityList);
    return Promise.all(cityPromise)
      .then(() => {
        _this.setData({
          cityList: app.globalData.cityList,
          cityWeather: app.globalData.cityWeather
        })
      })
      .then(() => {
        wx.stopPullDownRefresh();
        toast.hideLoading();
      })
  }
})