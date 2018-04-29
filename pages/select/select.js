const app = getApp()
let storage = require('../../utils/util.js')
Page({
  data: {
    display: 'none',
    showSuccess: 'none',
    share:'none',
    width: '',
    height: '',
    left: '',
    top: '',
    ok: '',
    multId: 0,
    notes_background_url: '',
    notes_button: '',
    notes_info: '',

    receive_success_url: "", //领取成功按钮
    receive_info_url: "", //领取成功详情
    share_button: "", //分享按钮

    element1: '',
    element2: '',
    element3: '',
    element4: '',

    home_notes_url:'',
    listLength:'',
    list: [],
    obj: {},
    newList: [],
    inputValue: '',
    placeholder: ''
  },

  sandImg: function () {
    wx.previewImage({
      current: '',
      urls: [this.data.element2]
    })
  },
  saveHandle: function () {
    wx.downloadFile({
      url: this.data.receive_info_url,
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
  inputHandle: function (e) {
    this.setData({ inputValue: e.detail.value })
  },
  selectHandle: function (e) {
    let obj = this.data.obj
    obj.option.forEach((item) => {
      item.select = false
    })
    obj.option[e.currentTarget.dataset.id].select = true
    if (obj.option.some((item) => { return item.select === true }) === true) {
      this.setData({ ok: true })
    }else{
      this.setData({ ok: false })
    }

    this.setData({ obj })
  },
  selectHandleMuli: function (e) {
    let obj = this.data.obj, list = []
    if (e.currentTarget.dataset.num > this.data.multId) {
      obj.option[e.currentTarget.dataset.id].select = !obj.option[e.currentTarget.dataset.id].select
    } else {
      obj.option[e.currentTarget.dataset.id].select = false
    }
    obj.option.forEach((item) => {
      if (item.select === true) {
        list.push(1)
      }
    })
    if (obj.option.some((item) => { return item.select === true }) === true) {
      this.setData({ ok: true })
    } else {
      this.setData({ ok: false })
    }
    this.setData({ obj, multId: list.length })

  },
  understandHandle: function () {
    this.setData({ display: 'none' })
  },
  noteHandle: function () {

    app.xhr('POST', '?controller=activity&action=getActivityNote', {
      activityId: storage.get_s('activityId')
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
  shareHandle: function () {
    this.setData({ showSuccess: 'none',  share: 'block' })
    wx.showNavigationBarLoading()
    wx.showShareMenu({
      withShareTicket: true
    })

    app.xhr('POST', '?controller=activity&action=getShareImg', { 
      userId: storage.get_s('userId'), 
      activityId: storage.get_s('activityId'),
      img: this.data.receive_info_url 
      }, '', (res) => {
      if (res.data.errcode === 0) {
        
        this.setData({
          element1: res.data.data.element1,
          element2: res.data.data.element2,
          element3: res.data.data.element3,
          element4: res.data.data.element4,
        })

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

  nextHandle: function (e) {
    let newList = this.data.newList
    if (e.currentTarget.dataset.obj.subject_type === 1) {

      if (this.data.inputValue.length < e.currentTarget.dataset.obj.subject_rule.min) {
        wx.showToast({
          title: `文字内容不少于${e.currentTarget.dataset.obj.subject_rule.min}个字符`,
          icon: 'none',
          duration: 2000
        })
        return
      }
      if (this.data.inputValue.length > e.currentTarget.dataset.obj.subject_rule.max) {
        wx.showToast({
          title: `文字内容大于${e.currentTarget.dataset.obj.subject_rule.max}个字符`,
          icon: 'none',
          duration: 2000
        })
        return
      }
      let validate = /[0-9]+|[a-z]+|[A-Z]+|[\u4e00-\u9fa5]+/;

      if (!validate.test(this.data.inputValue)) {
        wx.showToast({
          title: '文字内容不符合要求',
          icon: 'none',
          duration: 2000
        })
        return
      }
        e.currentTarget.dataset.obj.input = this.data.inputValue
        if (this.data.newList.length !== this.data.listLength) {
          newList.push(e.currentTarget.dataset.obj)
          this.setData({ newList })
        }
        this.next(this.data.list)

    } else {
      if (this.data.ok === '') {
        wx.showToast({
          title: '请选择选项',
          icon: 'none',
          duration: 2000
        })
      } else {
        if (this.data.newList.length !== this.data.listLength){
          newList.push(e.currentTarget.dataset.obj)
          this.setData({ newList })
        }
        this.next(this.data.list)
      }
    }

    console.log(this.data.newList)

  },

  next(list) {
    let obj = list.shift()
    if (obj === undefined) {
      
      app.xhr('POST', '?controller=activity&action=receiveCard', { 
        activityId: storage.get_s('activityId'), 
        userId: storage.get_s('userId'), 
        answer: this.data.newList
        }, '', (res) => {
        if (res.data.errcode === 0) {
        this.setData({
          showSuccess: 'block',
          receive_success_url: res.data.data.receive_success_url,
          receive_info_url: res.data.data.receive_info_url,
          share_button: res.data.data.share_button,
        })
        }else{
          wx.showToast({
            title: res.data.errmsg,
            icon: 'none',
            duration: 2000
          })
        }
      })
    
      return
    }
    console.log(this.data.inputValue)
    this.setData({ obj, list, ok: ''})
    
    if (obj.subject_type === 1) {
      this.setData({ placeholder: `文字内容不少于${obj.subject_rule.min}个字符,多于${obj.subject_rule.max}个字符`, inputValue: ''})
    }
    console.log(this.data.inputValue)
  },
  toMiniProgram: function () {
    wx.navigateToMiniProgram({
      appId: 'wx3d7c7e70e4850853',
      path: 'pages/purchaseList/purchaseList',
    })
  },
  onLoad: function (options) {
    let res = wx.getSystemInfoSync()
    this.setData({ width: res.windowWidth, height: res.windowHeight, left: res.windowWidth / 2 - res.windowWidth * 0.8 / 2, top: res.windowHeight / 2 - res.windowHeight * 0.8 / 2, home_notes_url: storage.get_s('home_notes_url')})

    app.xhr('POST', '?controller=activity&action=getProblem', { activityId: storage.get_s('activityId') }, '', (res) => {
      if (res.data.errcode === 0) {
        res.data.data.forEach((item) => {
          item.input = ''
        })

        this.setData({ list: res.data.data, listLength: res.data.data.length })
        let list = this.data.list;
        this.next(list)
      }

    })




  },
})