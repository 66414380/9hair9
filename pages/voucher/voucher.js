let app = getApp()
let storage = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status:2,
    brand:'',
    phone: '',
    code: '',
    name: '',
    businessImage: '',
    idImage: '',
    timerId: '',
    seconds: "获取验证码",
    validateAction: true,
    startTime: '',
    initTimeRemaining: 60 * 1000,
  },
  submit: function () {

  },
  submit1:function(){

  },
  showBusinessImage: function () {
    wx.previewImage({
      current: '',
      urls: [this.data.img_share]
    })
  },
  showIdImage:function(){
    wx.previewImage({
      current: '',
      urls: [this.data.img_share]
    })
  },
  upImage: function (e) {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        let tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: app.updateUrl,
          filePath: tempFilePaths[0],
          name: 'filename',
          success: (res) => {
            let json = JSON.parse(res.data)
            if (json.errcode === 0) {
              if (e.currentTarget.dataset.id === '1'){
                this.setData({ businessImage: json.data.file_url })
              }else{
                this.setData({ idImage: json.data.file_url })
              }
              
            }
          }
        })
      }
    })
  },

  tick: function () {
    let seconds
    let elapsed = new Date() - this.data.startTime;
    let timeRemaining = this.data.initTimeRemaining - elapsed;
    if (timeRemaining < 0) {
      this.setData({ seconds: "获取验证码", validateAction: true })
      clearInterval(this.data.timerId);
    } else {
      seconds = Math.ceil(timeRemaining / 1000);
      this.setData({ seconds })
    }
  },
  validateMobile: function (mobile) {
    let validate = /^1[3|5|7|8]\d{9}$/;
    return validate.test(mobile);
  },
  validate: function () {
    if (this.validateMobile(this.data.phone)) {
      if (this.data.validateAction === true) {
        this.setData({ validateAction: false, startTime: new Date() })
        console.log(132)
        app.xhr('POST', '?controller=sms&action=bindBossSms', { userId: storage.get_s('userId'), phone: this.data.phone }, '', (res) => {
          if (res.data.errcode === 0) {
            wx.showToast({
              title: res.data.errmsg,
              icon: 'success',
              duration: 1200,
              mask: true,
              success: () => {
                this.setData({ timerId: setInterval(this.tick, 1000) })
              }
            })

          }
        })
      }
    } else {
      if (this.data.phone === '') {
        wx.showToast({
          title: '请输入手机号码',
          icon: 'none',
          duration: 2000
        })
      } else {
        wx.showToast({
          title: '请输入正确的手机号码',
          icon: 'none',
          duration: 2000
        })
      }
    }

  },
  brandHandle: function (e) {
    this.setData({ brand: e.detail.value })
  },
  nameHandle: function (e) {
    this.setData({ name: e.detail.value })
  },
  codeHandle: function (e) {
    this.setData({ code: e.detail.value })
  },
  phoneHandle: function (e) {
    this.setData({ phone: e.detail.value })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.data.timerId)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})