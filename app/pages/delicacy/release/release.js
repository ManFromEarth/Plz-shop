var showToast= function(title){
  wx.showLoading({
    title: title,
  })
  setTimeout(function () {
    wx.hideLoading()
  }, 1000)



}
var sessionid = getApp().globalData.sessionid
Page({
  data: {},
  onLoad: function () {
  },
  chooseImg: function () {
    var that = this
    wx.chooseImage({
      count: 3,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var theTempFilePaths = res.tempFilePaths
        that.setData({
          theTempFilePaths: theTempFilePaths
        })
      }
    })
  },
  procedure: function (e) {
    this.procedureValue = e.detail.value
  },
  submit: function (e) {
    var cookname = e.detail.value.cookname
    var ingredients = e.detail.value.ingredients
    var procedureValue = this.procedureValue
    var theTempFilePaths = this.data.theTempFilePaths
    console.log(cookname, ingredients, procedureValue, theTempFilePaths)
    if (!cookname || cookname == '')
    { showToast('请填写菜品名称') }
    else if (!ingredients || ingredients == '')
    { showToast('请填写配料') }
    else if (!procedureValue || procedureValue == '')
    { showToast('请填写步骤') }
    else if (!theTempFilePaths) 
    { showToast('请选择菜谱封面')}
     else {
      wx.uploadFile({
        url: 'https://example.weixin.qq.com/upload', //仅为示例，非真实的接口地址
        filePath: theTempFilePaths,
        name: 'bookcover',
        formData: {
          cookname: cookname,
          ingredients: ingredients,
          procedureValue: procedureValue
        },
        success: function (res) {
          var data = res.data
          //do something
        },
        fail:function(){
        
        }
      })
    }
  }
})


