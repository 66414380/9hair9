const app = getApp()
let storage = require('../../utils/util.js')
Page({
  data: {
    home_notes_url: "", //首页须知图片
    home_background_url: "", //首页背景图
    home_start_url: "", //首页开始图片


    notes_background_url:'',
    notes_button:'',
    notes_info:'',

    display: 'none',
    width:'',
    height:'',
    left:'',
    top:'',
   
  },
  understandHandle:function(){
    this.setData({ display: 'none' })
  },
  noteHandle:function(){
    app.xhr('POST', '?controller=activity&action=getActivityNote', {
    activityId: 24
    }, '', (res) => {
      if (res.data.errcode === 0) {
        this.setData({
          notes_background_url: res.data.data.notes_background_url,
          notes_button: res.data.data.notes_button,
          notes_info: res.data.data.notes_info,
        })
      }
    })


    this.setData({ display: 'block' })

  },
  startHandle:function(){

    app.xhr('POST', '?controller=activity&action=checkActivity', {
      userId: storage.get_s('userId'),
      activityId:24
    }, '', (res) => {
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
  onLoad: function (options) {
    let scene = decodeURIComponent(options.scene)
    console.log(scene)

    let res = wx.getSystemInfoSync()
    this.setData({ width: res.windowWidth, height: res.windowHeight, left: res.windowWidth / 2 - res.windowWidth * 0.8 / 2, top: res.windowHeight / 2 - res.windowHeight *0.8 / 2 })

    if (!storage.get_s('userId')) {
      this.login()
    }

    app.xhr('POST', '?controller=activity&action=activityInit', { activityId: 24 }, '', (res) => { 
      if (res.data.errcode === 0) {
        this.setData({
          home_notes_url: res.data.data.home_notes_url, 
          home_background_url: res.data.data.home_background_url, 
          home_start_url: res.data.data.home_start_url, 
        })
      }

    })

  },
  

})
