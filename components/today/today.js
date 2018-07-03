// components/today/today.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    week: String,
    updateTime: String,
    todayWeather: String,
    todayTemp: String,
    currentTemp: String,
    wind: String,
    humidity: String,
    dressingIndex: String,
    uv: String,
    carWashing: String,
    airConditioner: String,
    exercising: String,
    dressingAdvice: String,
    wid: String,
    cityName: String,
    isIndexPage: Boolean,
    cityId: Number
  },

  /**
   * 组件的初始数据
   */
  data: {
    animationData: {},
    indexIsShow: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    hideAndShow: function () {
      var indexIsShow = this.data.indexIsShow;
      var targetHeight = indexIsShow ? "400rpx" : "772rpx";
      this.animation.height(targetHeight).step();
      this.setData({
        animationData: this.animation.export(),
        indexIsShow: !indexIsShow
      })
    }
  },

  attached: function () {
    var animation = wx.createAnimation({
      duration: 250,
    })
    this.animation = animation;
    this.setData({
      animationData: animation.export(),
    })
    console.log("today com is attached")
  }
})
