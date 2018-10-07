var app = getApp()
var initData = 'this is first line\nthis is second line'
Page({
  onLoad: function () {
    var that = this;
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        that.setData({
          userInfo: res.data
        })
      }
    })
    app.getLocationInfo(function (locationInfo) {
      console.log('map', locationInfo);
      that.setData({
        longitude: locationInfo.longitude,
        latitude: locationInfo.latitude,
        markers: [{
          id: 0,
          iconPath: "../../imgs/ic_position.png",
          longitude: locationInfo.longitude,
          latitude: locationInfo.latitude,
          width: 30,
          height: 30
        }]
      })
    })
    //set the width and height
    // 动态设置map的宽和高
    wx.getSystemInfo({
      success: function (res) {
        console.log('getSystemInfo');
        console.log(res.windowWidth);
        that.setData({
          map_width: res.windowWidth,
          map_height: res.windowWidth,
          controls: [{
            id: 1,
            iconPath: '../../imgs/ic_location.png',
            position: {
              left: res.windowWidth / 2 - 8,
              top: res.windowWidth / 2 - 16,
              width: 30,
              height: 30
            },
            clickable: true
          }]
        })
      }
    })
  },
  data: {
    map_width: 380,
    map_height: 380,
    text: initData,
    userInfo: {},
    imeiText:''
  },
  loginoff: function (e) {
    wx.navigateTo({
      url: '/pages/login/login',
    });
  },
  openLock: function (e) {
    var that = this;
    wx.request({
      url: 'https://www.ayinshu.cn/GuangJX/api/operate/openLightbox',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        UNAME: that.data.userInfo.name,
        IMEI: that.data.imeiText,
        AREA: that.data.userInfo.areaname
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          text: res.data
        })
      },
      fail: function () {
        that.setData({
          text: "no"
        })
      }
    })

  },
  scan: function () {
    var that = this;
    wx.scanCode({
      success: (res) => {
        that.setData({
          imeiText: res.result.replace(/\s/g, "")
        })
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 2000
        })
      },
      fail: (res) => {
        wx.showToast({
          title: '失败',
          icon: 'success',
          duration: 2000
        })
      },
      complete: (res) => { }
    })
  },
  getLngLat: function () {
    var that = this;
    this.mapCtx = wx.createMapContext("map4select");
    this.mapCtx.getCenterLocation({
      success: function (res) {

        that.setData({
          longitude: res.longitude,
          latitude: res.latitude,
          markers: [{
            id: 0,
            iconPath: "../../imgs/ic_position.png",
            longitude: res.longitude,
            latitude: res.latitude,
            width: 30,
            height: 30
          }]
        })

      }
    })
  },
  regionchange(e) {
    // 地图发生变化的时候，获取中间点，也就是用户选择的位置
    if (e.type == 'end') {
      this.getLngLat()
    }
  },
  markertap(e) {
    console.log(e)
  }
})