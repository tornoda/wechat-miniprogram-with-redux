// components/today/parts/mainInfo/mainInfo.js
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
  methods: {
    onTap: function () {
      console.log("ontap is invoked")
      this.triggerEvent("hideAndShow");
    }
  }
})
