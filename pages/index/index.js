const app = getApp()
let storage = require('../../utils/util.js')
Page({
  data: {
    display: 'none',
    width:'',
    height:'',
    left:'',
    top:''
  },
  understandHandle:function(){
    this.setData({ display: 'none' })
  },
  noteHandle:function(){
    this.setData({ display: 'block' })

  },
  startHandle:function(){

    app.xhr('POST', '?controller=activity&action=checkActivity', {}, '', (res) => {
      if (res.data.errcode === 0) {
        wx.navigateTo({
          url: '../select/select',
        })
      } else {
        wx.showToast({
          title: res.data.errmsg,
          icon: 'none',
          duration: 2000
        })
      }
    })

  },
  login: function () {
    wx.login({
      success: (res) => {
        app.xhr('POST', '?controller=consumer&action=codeGetUserIofo', { wx_appid: 'wx3fdd6959dd7c7869', code: res.code }, '', (res) => {
          if (res.data.errcode === 1) {
            wx.getUserInfo({
              success: (res1) => {
                app.xhr('POST', '?controller=consumer&action=wxUserInfoGetOursInfo', { wx_appid: 'wx3fdd6959dd7c7869', session_token: res.data.data.session_token, vi: res1.iv, encrypte_data: res1.encryptedData }, '', (res2) => {
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
    });
  },
  onLoad: function () {
    let res = wx.getSystemInfoSync()
    this.setData({ width: res.windowWidth, height: res.windowHeight, left: res.windowWidth / 2 - res.windowWidth * 0.8 / 2, top: res.windowHeight / 2 - res.windowHeight *0.8 / 2 })

    if (!storage.get_s('userId')) {
      this.login()
    }
  },

})
