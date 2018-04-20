const app = getApp()
let storage = require('../../utils/util.js')
Page({
  data: {
    display: 'none',
    showSuccess: 'none',
    showFail: 'none',
    share: 'none',
    width: '',
    height: '',
    left: '',
    top: '',
    id: '',
    inputValue: '',
    img_url: '',
    img_share: ''
  },
  sandImg:function(){
    wx.previewImage({
      current: '', 
      urls: [this.data.img_share] 
    })
  },
  saveHandle: function () {
    wx.downloadFile({
      url: this.data.img_share,
      success: function (res) {
        console.log(res)
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (res) {
            wx.showToast({
              title: '保存相片成功',
              icon: 'none',
              duration: 2000
            })
          },
          fail: function (res) {
            console.log(res)
            console.log('fail')
          }
        })
      },
      fail: function () {
        console.log('fail')
      }
    })
  },
  shareHandle: function () {
    this.setData({ showSuccess: 'none', showFail: 'none', share: 'block' })
    wx.showNavigationBarLoading()
    wx.showShareMenu({
      withShareTicket: true
    })

    app.xhr('POST', '?controller=activity&action=getShareImg', { userId: storage.get_s('userId'), img: this.data.img_url }, '', (res) => {
      if (res.data.errcode === 0) {
        this.setData({ img_share: res.data.data.img })
      } else {
        wx.showToast({
          title: res.data.errmsg,
          icon: 'none',
          duration: 2000
        })
      }
      wx.hideNavigationBarLoading()

    })

  },
  showHandle: function () {
    if (this.data.inputValue.length < 4) {
      wx.showToast({
        title: '文字内容不少于4个字符',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (this.data.inputValue.length > 33) {
      wx.showToast({
        title: '文字内容大于33个字符',
        icon: 'none',
        duration: 2000
      })
      return
    }
    // if (!this.data.inputValue.trim()) {
    //   wx.showToast({
    //     title: '文字内容不符合要求',
    //     icon: 'none',
    //     duration: 2000
    //   })
    //   return
    // }
    let validate = /[0-9]+|[a-z]+|[A-Z]+|[\u4e00-\u9fa5]+/;

    console.log(validate.test(this.data.inputValue))
    
    if (!validate.test(this.data.inputValue)){
        wx.showToast({
        title: '文字内容不符合要求',
        icon: 'none',
        duration: 2000
      })
      return
    }

    wx.showNavigationBarLoading()
    app.xhr('POST', '?controller=activity&action=receiveCard', { userId: storage.get_s('userId'), answer1: this.data.id, answer2: this.data.inputValue }, '', (res) => {
      if (res.data.errcode === 0) {
        this.setData({ showSuccess: 'block' })
        this.setData({ img_url: res.data.data.img })
      } else if (res.data.errcode === 401) {
        this.setData({ showFail: 'block' })
        this.setData({ img_url: res.data.data.img })
      } else {
        wx.showToast({
          title: res.data.errmsg,
          icon: 'none',
          duration: 2000
        })
      }
      wx.hideNavigationBarLoading()
    })
  },
  inputHandle: function (e) {
    this.setData({ inputValue: e.detail.value })
  },
  understandHandle: function () {
    this.setData({ display: 'none' })
  },
  noteHandle: function () {
    this.setData({ display: 'block' })

  },
  onLoad: function (options) {
    if (options.id === '1') {
      this.setData({ id: 1 })
    } else {
      this.setData({ id: 2 })
    }
    let res = wx.getSystemInfoSync()
    this.setData({ width: res.windowWidth, height: res.windowHeight, left: res.windowWidth / 2 - res.windowWidth * 0.8 / 2, top: res.windowHeight / 2 - res.windowHeight * 0.8 / 2 })
  },

  onShareAppMessage: function (res) {
    if (res.from === 'button') {

      console.log(res.target)
    }
    return {
      title: '九毛九',
      path: '/pages/index/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})