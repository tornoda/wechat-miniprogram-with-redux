// components/future7Days/future-oneday/futureOneday.js
const app = getApp();
const imageList = app.globalData.imageList;


Component({
  /**
   * 组件的属性列表
   */
  properties: {
    date: String,
    week: String,
    weather: String,
    temperature: String,
    wid: String,
  },

  /**
   * 组件的初始数据
   */
  data: {
    imageList: imageList
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
