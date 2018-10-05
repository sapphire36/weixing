Page({
  data: {
    items: [
      { name: '1', value: '安装人员' },
      { name: '2', value: '施工人员', checked: 'true' }
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

  // 获取输入账号
  phoneInput: function (e) {
    this.setData({
      username: e.detail.value
    })
  },

  // 获取输入密码
  passwordInput: function (e) {
    this.setData({
      passwd: e.detail.value
    })
  },

  // 登录
  login: function (e) {
    if (this.data.username.length == 0 || this.data.passwd.length == 0) {
      wx.showToast({
        title: '用户名和密码不能为空',
        icon: 'loading',
        duration: 2000
      })
    } else {
      //var newdata = radioChange.value,
      var Username = this.data.username;
      var Usertype = this.data.usertype;
      var Passwd = this.data.passwd;
 
        wx.request({
          url: 'https://www.ayinshu.cn/GuangJX/api/common/login',
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            username: Username,
            passwd: Passwd,
            utype: Usertype,
          },
          success: function (res) {
            var temp=res.data.data;
   
            if (temp =='1') {
              if (Usertype=='1'){
                wx.switchTab({
                  url: '/pages/operate/operate'
                })
              }else{
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
  }
}
})