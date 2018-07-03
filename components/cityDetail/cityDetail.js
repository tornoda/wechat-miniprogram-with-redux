// cityDetail.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    cityWeather: Object,
    isIndexPage: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    navToCityList: function () {
      wx.navigateTo({
        url: "/pages/navigator/cityList/cityList"
      })
    }
  }
})
