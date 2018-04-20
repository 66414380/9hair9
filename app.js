

// const baseUrl = 'https://x.kuan1.cn/wxapp/index.php';//生产环境
const baseUrl = 'http://test0.kuan1.cn/wxapp/index.php';//测试环境
App({

  updateUrl: 'http://test0.kuan1.cn/oss/index.php?controller=index&action=upload_img',//测试环境上传图片
  // updateUrl: 'https://x.kuan1.cn/oss/index.php?controller=index&action=upload_img',//生产环境上传图片
  xhr: function (method, url, obj = null, token = '', cb) {
    wx.request({
      url: baseUrl + url,
      data: obj,
      method,
      header: {
        'Accept': 'application/json',
        'token': token
      },
      success: function (res) {
        if (typeof (cb) === "function") {
          cb(res)
        }
      },
      fail: function (error) {
        console.log(error)
      }
    })
  },
  onLaunch: function () {

  },

  onShow: function () {
    //拒绝获取user信息后调用
    wx.getSetting({
      success: (res) => {
        console.log(!res.authSetting['scope.userInfo'])
        if (!res.authSetting['scope.userInfo']) {
          wx.authorize({
            scope: 'scope.userInfo',
            success: () => { },
            fail: () => {
              wx.openSetting({
                success: (res) => {
                  wx.login({
                    success: (res) => {
                      this.xhr('POST', '?controller=consumer&action=codeGetUserIofo', { wx_appid: 'wx3fdd6959dd7c7869', code: res.code }, '', (res) => {
                        if (res.data.errcode === 1) {
                          wx.getUserInfo({
                            success: (res1) => {
                              this.xhr('POST', '?controller=consumer&action=wxUserInfoGetOursInfo', { wx_appid: 'wx3fdd6959dd7c7869', session_token: res.data.data.session_token, vi: res1.iv, encrypte_data: res1.encryptedData }, '', (res2) => {
                                storage.set('userId', res2.data.data.user_id)
                              })
                            }
                          })
                        }
                        if (res.data.errcode === 0) {
                          storage.set('userId', res.data.data.user_id)
                        }
                      })
                    }
                  })
                }
              })
            }
          })
        }
      }
    })
  },

})