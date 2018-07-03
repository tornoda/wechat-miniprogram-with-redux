// briefCity.js
const app = getApp();
const cityList = app.globalData.cityList;
const normalListCss = `
  max-height: 200rpx;
  opacity: 1;
`
Component({
  properties: {
    oneCity: Object,
  },
  data: {
    imageList: app.globalData.imageList,
    initPageX: 0,
    buttonWidth: 0,
    moveDistance: 0,
    style: {
      btnHideAndShowStyle: "",
      itemHideStyle: "",
      normalListStyle: "",
    },
    isPageFirstIn: true,
    isButtonAchieved: false,
    isButtonStart: true,
    className: ""
  },
  attached: function () {
    const thisName = this.dataset.cityName;
    const transitionStyle =  cityList.indexOf(thisName) !== -1 
      ? "" 
      : "transition: all 0.3s cubic-bezier(0,0.7,0.9,1)";
    this.setData({
      "style.normalListStyle": normalListCss + transitionStyle,
      isPageFirstIn: !this.isPageFirstIn,
    })
  },
  ready: function () {
    //获取删除按钮大小
    let query = wx.createSelectorQuery();
    var _this = this;
    const button = query.select(".city-list >>> .brief-deleteBtn");
    button.fields({
      size: true,
    }, function ({width}) {
      _this.setData({ buttonWidth: width })
    }).exec();
    //处理添加时候的动画
  },

  methods: {
    toDetails: function (event) {
      // if句处理回弹动画
      if (this.data.isButtonAchieved) {
        this.resetButton();
        return false;
      }
      //处理路由
      const cityName = event.currentTarget.dataset.cityName;
      wx.navigateTo({
        url: "/pages/navigator/cityDetails/cityDetails?" + "cityName=" + cityName
      })
    },
    foldingItem: function (event) {
      const _this = this;
      const style = `
        max-height: 0;
        left: -630rpx;
        transition: all 0.3s cubic-bezier(0,0.7,0.9,1);
      `;
      this.setData({
        style: {
          itemHideStyle: style,
        }
      }, setTimeout(() => {
        _this.deleteCity(event)
      }, 300))
    },
    deleteCity: function (event) {
      this.triggerEvent("deleteCity", event);
    },
    resetButton: function () {
      const style = `
        transition: all 0.3s;
        left: 0;
      `
      this.setData({
        style: {
          btnHideAndShowStyle: style,
          normalListStyle: normalListCss
        },
        isButtonAchieved: false,
        isButtonStart: true
      });
    },
    touchstart: function (event) {
      if (this.data.isButtonAchieved) return false;
      const initPageX = event.touches[0].pageX;
      this.setData({
        initPageX: initPageX,
      })      
      // this.triggerEvent("touchstart", event);
    },
    touchmove: function (event) {
      if (event.currentTarget.dataset.cityName === app.globalData.cityList[0]) return false;
      if (this.data.isButtonAchieved) return false;
      const buttonWidth = this.data.buttonWidth;//根据不同设备渲染出来的删除按钮的宽度
      const pageX = event.touches[0].pageX;//当前pageX
      const cityName = event.currentTarget.dataset.cityName;
      const moveDistance = this.data.initPageX - pageX;
      const style1 = `
        left: -${moveDistance}px;
        transition: 0;
      `
      if (moveDistance > moveDistance / 3 && moveDistance < buttonWidth) {
        this.setData({
          moveDistance: moveDistance,
          style: {
            btnHideAndShowStyle: style1,
            normalListStyle: normalListCss,
          },
          isButtonAchieved: false,
          isButtonStart: false
        })
      }else if (moveDistance > buttonWidth) {
        const extraDistance = Math.pow((moveDistance - buttonWidth), 1 / 2) + 60;
        const style2 = `
          left: -${extraDistance}px;
          transition: 0;
        `
        this.setData({
          style: {
            btnHideAndShowStyle: style2,
            normalListStyle: normalListCss,
          },
          isButtonAchieved: false,
          isButtonStart: false
        })
      }
      console.log("this.delShow");
    },
    touchend: function (event) {
      if(this.data.isButtonAchieved || this.data.isButtonStart) return false;
      const moveDistance = this.data.moveDistance;
      const buttonWidth = this.data.buttonWidth;
      const style1 = `
        left: 0;
        transition: all 0.3s;
      `
      const style2 = `
        left: -${buttonWidth}px;
        transition: all 0.3s cubic-bezier(0,0.7,0.9,1);
      `
      if (moveDistance <= buttonWidth / 2) {
        this.setData({
          style: {
            btnHideAndShowStyle: style1,
            normalListStyle: normalListCss,
          },
          isButtonAchieved: false,
          isButtonStart: true
        })
      } else if (moveDistance > buttonWidth / 2) {
        this.setData({
          style: {
            btnHideAndShowStyle: style2,
            normalListStyle: normalListCss,
          },
          isButtonAchieved: true,
          isButtonStart: false
        })
      }

    }
  }
})