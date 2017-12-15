var host = require('../../../config').service.host  
var key = require | ('../../../config').key
var sessionid = require('../../../utils/session').get()
var car = require('../../../utils/car')
Page({
  data: {},
  onLoad: function (options) {
    var orderID = JSON.parse(options.orderID)
    var account = JSON.parse(options.account)
    var carlist = JSON.parse(options.carlist)
    var defaultAdress = JSON.parse(options.defaultAdress)
    this.setData({
      orderID: orderID,
      account: account,
      carlist: carlist,
      defaultAdress: defaultAdress
    })
  },
  onReady: function () {
  },
  onShow: function () {
  },
  onHide: function () {
  },
  onUnload: function () {
  },
  goWxPay: function (e) {
    var that = this
    var formId = e.detail.formId //发送模板消息所用的formId
    console.log(formId)
    var orderID = this.data.orderID
    var wxPay = this.data.account.wxPay 
    if (wxPay === 0) {
      wx.request({
        url: `${host}/UserCenter/updateOrderStatus.ashx?OrderId=${orderID}&Type=3&Remark=""`,
        success: function (res) {
          if (res.data.State === 'ok') {
            car.clear()
            wx.showToast({
              title: '成功',
              icon: 'success',
              duration: 1500,
              success: function () {
                wx.redirectTo({
                  url: '../../profile/order/order'
                })
              }
            })
          } else {
            wx.showToast({
              title: '出错了',
              icon: 'loading',
              duration: 1500
            })
          }
        }
      })
    } else {
      wx.request({
        url: `${host}/UserCenter/ToPay.ashx?OrderId=${orderID}`,
        success: function (res) {
          var data = res.data
          if (data.prepayid) {
            wx.requestPayment({
              timeStamp: data.timestamp,
              nonceStr: data.noncestr,
              package: data.package,
              signType: data.signType,
              paySign: data.sign,
              success: function (res) {
                if (res.errMsg === 'requestPayment:ok') {
                  wx.request({
                    url: `${host}/UserCenter/updateOrderStatus.ashx?OrderId=${orderID}&Type=3&Remark=""`,
                    success: function (res) {
                      if (res.data.State === 'ok') {
                        car.clear()
                        wx.showToast({
                          title: '成功',
                          icon: 'success',
                          duration: 1500,
                          success: function () {
                            wx.redirectTo({
                              url: '../../profile/order/order'
                            })
                          }
                        })
                      }
                    }
                  })
                }
              },
              fail: function (res) {
              },
              complete: function (res) {
              }
            })
          } else {
            wx.showToast({
              title: '出错了',
              icon: 'loading',
              duration: 1500
            })

          }
        },
        fail: function () {
        }
      })
    }
  }
})