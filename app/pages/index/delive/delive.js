var event = require('../../../vendors/event')  
const sessionid = require('../../../utils/session').get()
const host = require('../../../config').service.host
Page({
  data: {
    adress: []
  },
  onLoad: function (options) {
  },
  onReady: function () {
  },
  onShow:function(){
    var that = this
    wx.request({
      url: `${host}/Address/GetAddressInfo.ashx?UserId=${sessionid}`,
      success: function (res) {
        var data = res.data
        if (data) {
          that.setData({
            adress: res.data
          })
        }
      }
    })
  },
  chooseadress: function (e) {
    var eq = e.currentTarget.dataset.eq
    var adress = this.data.adress
    var Id = adress[eq].Id
    var achome = adress[eq].Pcadress
    wx.request({
      url: `${host}/Address/setAdreeIsDefualt.ashx?Id=${Id}`,
      success: function (res) {
        if (res.data.State === 'ok') {
          event.emit('selpoi', achome)
          wx.navigateBack({
          })
        }
      }
    })
  }
})