//app.js
App({
  onLaunch: function () {
    const _this = this;
    new Promise ((resolve) => {//返回Promise.resolve(cityListInStorage)
      wx.getStorage({
        key: "cityList",
        success: function ({data}) {
          _this.globalData.cityList = data;
          resolve(data);
        }
      });
    })
    .then((cityList) => {//更新globalData里面的天气数据。
      _this.updatecitiesWeather(cityList);
    })
  },
  onHide: function () {
    wx.setStorage({
      key: "cityList",
      data: this.globalData.cityList
    });
  },
  getLocalCities: function () {
    wx.getStorage("cityList", function (list) {
      this.globalData.cityList = list
    });
  },
  //获取根据城市信息，获取天气更新地址，
  //返回Promise对象，resolve(Url)
  getCityWeatherUrl: function (cityInfo) {
    let _that = this;
    let getIpUrl = () => new Promise((resolve) => {
      wx.request({
        url: 'https://pv.sohu.com/cityjson?ie=utf-8',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          let _innerThis = _that;
          const resParsed = JSON.parse(res.data.match(/{.+}/)[0]);
          const ip = resParsed.cip;
          const cityName = resParsed.cname;
          const ipUrl = "http://api.jisuapi.com/weather/query?appkey=67915663762c1f49&ip=" + ip;
          resolve(ipUrl)
        },
        fail: (err) => {
          _this.getToast().showToast({ content: "请打开GPS(右上角-设置)",duration: 1500 })
        }
      })
    });
    const gpsUrl = "http://api.jisuapi.com/weather/query?appkey=67915663762c1f49&location=" + cityInfo.latitude + "," + cityInfo.longitude;
    const cnameUrl = "http://api.jisuapi.com/weather/query?appkey=67915663762c1f49&city=" + cityInfo;
    let url = "";
    const infoType = typeof cityInfo;
    if (infoType === "string") {
      url = cnameUrl;
      return Promise.resolve(url)
    }else if(infoType === "object") {
      url = gpsUrl;
      //如果获取GPS获取失败的话，通过ip来获取信息。
      if (cityInfo.errMsg !== "getLocation:ok") {
        return getIpUrl();
        return false
      }
      return Promise.resolve(url)
    }else{
      return getIpUrl();
    }
      // wx.request({
      // });

  },
  //获取城市信息、天气信息，并其存入global天气信息
  //返回一个Promise对象，把resolve(cityName)
  updateCityInfo: function (url) {
    const _this = this;
    return new Promise ((resolve) => {
      wx.request({
        url: url,
        success: (response) => {
          const {
            result: {
              week,
              updatetime,
              weather,
              temp,
              temphigh,
              templow,
              winddirect,
              humidity,
              index: [airconditioner, exercising, uv, , carwashing, , dressing],
              img,
              city,
              daily,
              cityid
            }
          } = JSON.parse(JSON.stringify(response.data));
          const cityName = city;
          const cityListBefore = _this.globalData.cityList.slice();
          const cityList = (cityListBefore.length === 0) ? [] : cityListBefore;
          //如果cityList中存在请求的城市，则不更新cityList信息
          //但是一定要更新天气预报信息，没有为什么
          (function () {
            if (cityListBefore.indexOf(cityName) !== -1) return false;
            cityList.push(cityName);
            _this.globalData.cityList = cityList;
          })();
          //但是一定要更新天气预报信息，没有为什么
          const cityWeatherBefore = Object.assign({}, _this.globalData.cityWeather);
          const cityWeather = (Object.keys(cityWeatherBefore).length === 0) ? {} : cityWeatherBefore;
          const thisCityWeather = {
            cityName: city,
            week: week,
            updatetime: updatetime,
            weather: weather,
            tempNow: temp + "℃",
            temp: templow + "℃" + "~" + temphigh + "℃",
            wind: winddirect,
            humidity: `湿度${humidity}%`,
            wid: img,
            airconditioner: airconditioner,
            uv: uv,
            exercising: exercising,
            carwashing: carwashing,
            dressing: dressing,
            future: daily,
            cityId: cityid
          };
          cityWeather[cityName] = thisCityWeather;
          _this.globalData.cityWeather = cityWeather;
          _this.globalData.thisCityId = cityid;
          // const cityWeatherCollection = _this.updateACityStorageWeather({
          //   sk: sk,
          //   today: today,
          //   future: future
          // });
          resolve(cityName);
        },
        fail: (err) => {
          _this.getToast.showToast({content: "无法获取天气信息"})
          console.log(err)
        }
      });
    })
  },
  //通过gps获取位置信息，然后返回promi0se对象，resolve(location对象)。
  getLocationViaGPS: function () {
    const _this = this;
    return new Promise ( 
      (resolve, reject) => {
        wx.getLocation({
          type: "wgs84",
          success: function (location) {
            // wx.setStorageSync("location", location);
            resolve(location);
          },
          fail: function (err) {
            _this.getToast().showToast({content: "GPS信息获取失败", duration: 1000})
            console.log("获取gps:")
            console.log(err)
            if (err) reject(err);
          }
        })
      }
  )
  },
  //提供城市名称、ip、gps信息，更新global中的城市列表和天气，
  //返回一个promise对象，resolve(cityName）
  getWeather: function (cityInfo) {
    const _this = this;
    return _this.getCityWeatherUrl(cityInfo)
      .then((cityAndUrl) => _this.updateCityInfo(cityAndUrl))
  },
  //提供cityList
  //返回[promise.resolve(cityName),...]
  updatecitiesWeather: function (cityList) {
    const _this = this;
    const cityNum = cityList.length;
    let cityPromise = [];
    for (let i = 0; i < cityNum; i++) {
      const cityName = cityList[i]
      cityPromise.push(
        _this.getWeather(cityName)
      );
    }
    return cityPromise;
  },
  // updateWithName: (name) => {
  //   const _this = this;
  //   app.getCityWeatherUrl(name)
  //     .then((url) => {
  //       return app.updateCityInfo(url)
  //     })
  //     .then((thisCityWeather) => {
  //       const cityWeather = _this.globalData.cityWeather;
  //       const cityList = _this.globalData.cityList;
  //       cityWeather = cityWeather[name] = thisCityWeather;
  //       cityList = 
  //       console.log(thisCityWeather);
  //       // const newList = app.convertCollectionToList(cityWeatherCollection, cityList);
  //       _this.setData({
  //         cityWeather: cityWeather,
  //         cityList: cityList
  //       }, () => { toast.hideLoading() });
  //     })
  // },
  convertCollectionToList: function (collection, order) {
    let list = [];
    for (let item of order) {
      list.push(collection[item]);
    }
    return list;
  },
  //对微信Toast Api进行简单封装
  getToast: () => (
    {
      showToast: ({ content, duration = 500, icon = "none" }) => {
        wx.showToast({
          title: content,
          duration: duration,
          icon: icon
        });
      },
      showLoading: ({ title = "加载中", mask = false }) => {
        wx.showLoading({
          title: title,
          mask: mask
        })
      },
      hideLoading: () => {
        wx.hideLoading();
      }
    }
  ),
  globalData: {
    imageList: {
      "0": "sunny",
      "99": "sunny",
      "1": "cloudy",
      "2": "overcast",
      "3": "lightrain",
      "22": "lightrain",
      "9": "lightrain",
      "7": "moderaterain",
      "8": "moderaterain",
      "21": "moderaterain",
      "301": "moderaterain",
      "4": "pour",
      "10": "pour",
      "11": "pour",
      "12": "pour",
      "23": "pour",
      "24": "pour",
      "25": "pour",
      "5": "sleety",
      "6": "sleety",
      "19": "haily",
      "13": "lightsnow",
      "14": "lightsnow",
      "26": "lightsnow",
      "15": "heavysnow",
      "16": "heavysnow",
      "17": "heavysnow",
      "27": "heavysnow",
      "28": "heavysnow",
      "302": "heavysnow",
      "18": "foggy",
      "32": "foggy",
      "49": "foggy",
      "53": "foggy",
      "54": "foggy",
      "55": "foggy",
      "56": "foggy",
      "57": "foggy",
      "58": "foggy",
      "20": "windy",
      "29": "sandstormy",
      "30": "sandstormy",
      "31": "sandstormy",
      "39": "tornado"
    },
    cityList: [],
    cityWeather: {},
    thisCityId: 0
  }
})