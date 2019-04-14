// pages/installer/installer.js
var app = getApp()
var timer;
var freshTime = 1000*10;
var sendTime = 1000*30;
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
    });
    timer = setTimeout(function () {
      console.log("----Countdown----");
      that.fetchData();
    }, freshTime);
  },
  data: {
    temptue: '21.2',
    vol: '3.61',
    lockStatus:false,
    message: '就绪',
    lockStr:'开',
    sendTime:'',
    userInfo:{}
  },
  openLock: function (e) {
    var that = this;
    if (that.data.lockStatus == false) {
      that.setData({
        message: '设备锁处于开锁状态，请不要重复下发！'
      })
    } else {
      that.setData({
        message: '正在下发开锁指令，请耐心等待....'
      })
    }
    timer = setTimeout(function () {
      that.setData({
        lockStr: '开'
      })
      that.setData({
        lockStatus: false
      })
    }, sendTime);
  },
  closeLock: function (e) {
    var that = this;
    if (that.data.lockStatus == true){
        that.setData({
          message: '设备锁处于关锁状态，请不要重复下发！'
        })
    } else {
        that.setData({
          message: '正在下发关锁指令，请耐心等待....'
        })
    }
    timer = setTimeout(function () {
        that.setData({
          lockStr: '关'
        })
        that.setData({
          lockStatus: true
        })
    }, sendTime);
  },
  fetchData: function (e) {
    var that = this;
    timer = setTimeout(function () {
      console.log("----Countdown----");
      that.doFetchData();
      that.fetchData();
    }, freshTime);
  },
  doFetchData: function () {
    var that = this;
    wx.request({
      url: 'https://www.ayinshu.cn/api/thermal/getData',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        IMEI: '356566077983401'
      },
      success: function (res) {
        var temp = res.data;
        that.setData({
          message: '获取设备数据成功,正在解析数据....'
        })
        if(temp.result == 'true'){
          that.setData({
            vol: temp.content.voltage
          })
          that.setData({
            temptue: temp.content.temperature
          })
          var tt = new Date(parseInt(temp.content.addtime)).toLocaleString().replace(/:\d{1,2}$/, ' ')
          that.setData({
            sendTime: tt
          })
        }
        that.setData({
          message: '数据解析成功'
        })
      },
      fail: function () {
        wx.showToast({
          title: '服务器连接失败',
          icon: 'success',
          duration: 500
        })
      }
    })
  }
})