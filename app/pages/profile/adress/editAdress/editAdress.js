const event = require('../../../../vendors/event')   
const host = require('../../../../config').service.host
const Session = require('../../../../utils/session')
const cityList = ['永康市']
var checkPhonenumber = function (tel) {
  var reg = /^(13[0-9]|15[0-35-9]|18[0-9]|17[06-8]|14[57])\d{8}$/
  return reg.test(tel)
}
var showModal = function (content) {
  wx.showModal({
    title: '品丽州提醒',
    content: content,
    showCancel: false,
    confirmText: '知道了',
    success: function (res) {
      if (res.confirm) {
        return
      } else if (res.cancel) {
        return
      }
    }
  })
}
Page({
  data: {
    placeValue: {},
    placeHold: {
      name: '姓名',
      tel: '手机或固话',
      Housenumber: '楼号/单元/门牌号'
    }
  },
  onLoad: function (options) {
    var that = this
    var placeValue = {}
    placeValue.name = options.name
    placeValue.tel = options.tel
    placeValue.city = options.city
    placeValue.adress = options.adress
    placeValue.Housenumber = options.Housenumber
    this.editId= options.Id || null
    this.setData({
      placeValue: placeValue
    })
  },
  onShow: function () {
    var that = this
    event.on('choosepoi', this, function (data) {
      console.log(data)
      that.setData({
        'placeValue.adress': data.title
      })
    })
  },
  onUnload: function () {
  },
  navTosearchpoi: function () {
    var selectedCity = this.data.placeValue.city
    if (this.data.placeValue.city) {
      wx.navigateTo({
        url: `../searchpoi/searchpoi?selectedCity=${selectedCity}`
      })
    } else {
      wx.showModal({
        title: '品丽州提醒',
        content: '请选择收货县市',
      })
    }
  },
  formSubmit: function (e) {
    var placeValue = this.data.placeValue
    var name = e.detail.value.name
    var tel = e.detail.value.tel
    var city = placeValue.city
    var adress = placeValue.adress
    var Housenumber = e.detail.value.Housenumber
    var submitData = {}
    submitData.UserName = name
    submitData.TelNumber = tel
    submitData.City = city
    submitData.Pcadress = adress
    submitData.DetailAddress = Housenumber
    submitData.UserId = Session.get()
    console.log(submitData)
    if (!name)
    { showModal('请填写姓名') }
    else if (!checkPhonenumber(tel))
    { showModal('请正确填写手机号码') }
    else if (!adress)
    { showModal('请选择收货地址') }
    else if (!Housenumber) {
      showModal('请填写门牌号')
    } else if (!this.editId) {
      wx.request({
        url: `${host}/Address/AddAddress.ashx`,
        data: submitData,
        success: function (res) {
          if (res.data.State === 'ok') {
            wx.navigateBack({
            })
          }
        }
      })
    } else {
      submitData.Id = this.editId
      wx.request({
        url: `${host}/Address/editAddress.ashx`,
        data: submitData,
        success: function (res) {
          if (res.data.State === 'ok') {
            wx.navigateBack({
            })
          }
        }
      })
    }
  },
  selectcity: function () {
    var that = this
    wx.showActionSheet({
      itemList: cityList,
      success: function (res) {
        var eq = res.tapIndex
        that.setData({
          'placeValue.city': cityList[eq]
        })
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  }
}
)