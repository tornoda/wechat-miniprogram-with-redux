// components/today/parts/mainInfo/mainInfo.js
const app = getApp();
const imageList = app.globalData.imageList;
const thisCityId = app.globalData.thisCityId;
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
    wid: String,
    cityName: String,
    isIndexPage: Boolean,
    cityId: Number
  },

  /**
   * 组件的初始数据
   */
  data: {
    imageList: imageList,
    thisCityId: thisCityId
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onTap: function () {
      console.log("ontap is invoked")
      this.triggerEvent("hideAndShow");
    }
  }
})
