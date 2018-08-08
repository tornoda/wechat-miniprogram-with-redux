// briefCity.js
const app = getApp();

Component({
  properties: {
    oneCity: Object,
    isBtnShow: Boolean,
    indexCity: String//指明首页城市。因首页城市不允许被删除
  },
  methods: {
    toDetails: function (event) {
      //处理路由
      const cityName = event.currentTarget.dataset.cityName
      wx.navigateTo({
        url: "/pages/navigator/cityDetails/cityDetails?" + "cityName=" + cityName
      })
    },
    deleteCity: function (event) {
      const _this = this;
      let animation = wx.createAnimation({
        duration: 200,
      })
      _this.animation = animation
      animation.left('-630rpx').height(0).step()
      _this.setData({
        animationData: animation.export()
      }, setTimeout(() => {
        _this.triggerEvent("deleteCity", event)
      }, 200))
    }
  }
})