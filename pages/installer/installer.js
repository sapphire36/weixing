// pages/installer/installer.js
var app = getApp()


var initData = 'this is first line\nthis is second line'
Page({

  data: {
    map_width: 380,
    map_height: 380,
    text: initData,
    boolean: false,
    savedFilePath: '',
    complete:'未上传图片',
    CodeResult:'未扫码',
    Locationresult:'未获取位置',
    Boxname:'',
    mytext:''
  },

  mapViewTap: function () {
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        console.log(res)
        wx.openLocation({
          latitude: res.latitude,
          longitude: res.longitude,
          scale: 28
        })
        wx.showToast({
          title: res.latitude,
          icon: 'success',
          duration: 500
        })
      }
    })
  },

  photo: function () {
    var that = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
      
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths

        that.setData({
          savedFilePath: tempFilePaths,
          complete:'上传图片成功',
          boolean: true
          
        })
        //wx.setStorageSync('Rhine', tempFilePaths)
        wx.showToast({
          title: String('成功'),
          icon: 'success',
          duration: 2000
        })
        //上传图片
        wx.uploadFile({
          url: 'https://www.ayinshu.cn/GuangJX/api/install/Uploadphoto',      //此处换上你的接口地址
          filePath: tempFilePaths,
          name: 'img',
          header: {
            "Content-Type": "multipart/form-data"
          },
          formData: {
            'user': 'test'  //其他额外的formdata，可不写
          },
          success: function (res) {
            var data = res.data;
            console.log('上传成功+data');
          },
          fail: function (res) {
            console.log('fail');
          },
        })
        //上传图片

      }
    })

  },

  phoneInput: function (e) {
    this.setData({
      Boxname: e.detail.value
    })
    console.log(e.detail.value)
  },
  loginoff: function (e) {
    wx.navigateTo({
      url: '/pages/login/login',
    });
  },
  submit:function(){
    var that=this;
    wx.request({
      url: 'https://www.ayinshu.cn/GuangJX/api/install/installsubmit',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        coderesult: that.data.CodeResult,
        locationresult: that.data.Locationresult,
        name: that.data.Boxname
      },
      success: function (res) {
        var temp = res.data.data;
        that.setData({
          mytext: res.data.data
        })
        if (temp == '1') {
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 500
          })
        }
        else if (temp == '0') {
          wx.showToast({
            title: '提交失败',
            icon: 'success',
            duration: 500
          })
        }
        console.log(res.data)
      },
      fail: function () {
        wx.showToast({
          title: '服务器连接失败',
          icon: 'success',
          duration: 500
        })
      }
    })
  },
  location:function(){
    var that = this
    wx.getLocation({
    
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy

        that.setData({
          Locationresult:latitude+','+longitude
        })

        console.log('纬度' + latitude + '经度' + longitude)
        wx.showToast({
          title: String('成功'),
          icon: 'success',
          duration: 2000
        })
      }
    })
  },
  scan: function () {
    var that = this;
    var show;
    wx.scanCode({
      success: (res) => {
        console.log('扫码结果' + res.result);
        this.show = res.result;
        that.setData({
          show: this.show.replace(/\s/g, ""),
          CodeResult:this.show.replace(/\s/g, "")
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
      complete: (res) => {
      }
    })
  } 
})