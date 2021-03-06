Page({
  data: {
    items: [
      { name: '1', value: '施工人员' },
      { name: '2', value: '安装人员', checked: 'true' }
    ],
    username: '',
    passwd: '',
    usertype: '2'
  },
  radioChange: function (e) {
    this.setData({
      usertype: e.detail.value
    })
  },
  nameInput: function (e) {
    this.setData({
      username: e.detail.value
    })
  },
  passwordInput: function (e) {
    this.setData({
      passwd: e.detail.value
    })
  },
  login: function (e) {
    var _this = this
    if (_this.data.username.length == 0 || _this.data.passwd.length == 0) {
      wx.showToast({
        title: '用户名和密码不能为空',
        icon: 'loading',
        duration: 1000
      })
    } else {
      wx.request({
        url: 'https://www.ayinshu.cn/api/common/login',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          username: _this.data.username,
          passwd: _this.data.passwd,
          utype: _this.data.usertype,
        },
        success: function (res) {
          var temp = res.data.data;
          if (temp == '1') {
            wx.setStorage({
              key: 'userInfo',
              data: res.data.content
            })
            if (_this.data.usertype == '1') {
              wx.switchTab({
                url: '/pages/operate/operate'
              })
            } else {
              wx.navigateTo({
                url: '/pages/installer/installer'　　// 页面 A
              });
              wx.switchTab({
                url: '/pages/installer/installer'
              })
            }
          }
          else if (temp == '0') {
            wx.showToast({
              title: '用户名或密码错误',
              icon: 'success',
              duration: 500
            })
          }
          else if (temp == '2') {
            wx.showToast({
              title: '用户被禁用',
              icon: 'success',
              duration: 500
            })
          }
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
  }
})