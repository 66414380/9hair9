const app = getApp()
Page({
  data: {
    display: 'none',
    width: '',
    height: '',
    left: '',
    top: '',
    show:[false,false],
    id:'',
    notes_background_url:'',
    notes_button:'',
    notes_info:'',
    list:[],
    obj:{}
  },
  selectHandle:function(e){
    console.log(e.currentTarget.dataset.id)
    switch (e.currentTarget.dataset.id){
      case '1':
        this.setData({ show: [true, false], id:1})
      break;
      case '2':
        this.setData({ show: [false, true], id: 2})
        break;
    }
  },
  understandHandle: function () {
    this.setData({ display: 'none' })
  },
  noteHandle: function () {

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
  nextHandle:function(){
    if (this.data.id === ''){
      wx.showToast({
        title: '你是妹子还是汉子？',
        icon: 'none',
        duration: 2000
      })
    }else{
      wx.navigateTo({
        url: `../receive/receive?id=${this.data.id}`,
      })
    }
  },

  next(list){
   let obj =  list.shift()
    console.log(obj)
  },

  onLoad: function (options) {
    let res = wx.getSystemInfoSync()
    this.setData({ width: res.windowWidth, height: res.windowHeight, left: res.windowWidth / 2 - res.windowWidth * 0.8 / 2, top: res.windowHeight / 2 - res.windowHeight * 0.8 / 2 })

    app.xhr('POST', '?controller=activity&action=getProblem', { activityId: 24 }, '', (res) => {
      if (res.data.errcode === 0) {
        this.setData({
         list:res.data.data
        })
        let list = this.data.list;
        this.next(list)
      }

    })


  },
})