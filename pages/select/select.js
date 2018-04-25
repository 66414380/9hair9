const app = getApp()
Page({
  data: {
    display: 'none',
    width: '',
    height: '',
    left: '',
    top: '',
    
    singleId:0,
    notes_background_url:'',
    notes_button:'',
    notes_info:'',
    list:[],
    obj:{}
  },
  selectHandle:function(e){
    let obj = this.data.obj
    obj.option.forEach((item)=>{
      item.select = false
    })
    obj.option[e.currentTarget.dataset.id].select = true
    this.setData({obj})
  },
  selectHandleMuli:function(e){
    let obj = this.data.obj, list = []


    
    obj.option[e.currentTarget.dataset.id].select = !obj.option[e.currentTarget.dataset.id].select
    obj.option.forEach((item) => {
      if (item.select === true) {
        list.push(1)
      }
    })
    this.setData({ obj })
    this.setData({ singleId: list.length })
    console.log(this.data.singleId)
    if (e.currentTarget.dataset.num < this.data.singleId){
      console.log('no')
      
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
    this.setData({obj})
    if (obj.subject_type === 2){

    }




  },

  onLoad: function (options) {
    let res = wx.getSystemInfoSync()
    this.setData({ width: res.windowWidth, height: res.windowHeight, left: res.windowWidth / 2 - res.windowWidth * 0.8 / 2, top: res.windowHeight / 2 - res.windowHeight * 0.8 / 2 })

    app.xhr('POST', '?controller=activity&action=getProblem', { activityId: 24 }, '', (res) => {
      if (res.data.errcode === 0) {
        res.data.data.forEach((item)=>{
          item.option.forEach((item1)=>{
            item1.select = false
          })
        })

        this.setData({
         list:res.data.data
        })
        let list = this.data.list;
        this.next(list)
      }

    })


  },
})