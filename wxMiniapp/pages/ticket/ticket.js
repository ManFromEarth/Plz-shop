var host = require('../../config').service.host
var sessionid = require('../../utils/session').get()
var getpoi = require('../../utils/getpoi')
var event = require('../../vendors/event')
var car = require('../../utils/car')
function numSub(num1, num2) {
  var baseNum, baseNum1, baseNum2;
  var precision;
  try {
    baseNum1 = num1.toString().split(".")[1].length
  } catch (e) {
    baseNum1 = 0;
  }
  try {
    baseNum2 = num2.toString().split(".")[1].length
  } catch (e) {
    baseNum2 = 0;
  }
  baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
  precision = (baseNum1 >= baseNum2) ? baseNum1 : baseNum2;
  return ((num1 * baseNum - num2 * baseNum) / baseNum).toFixed(precision);
}
function keysrt(key, desc) {
  return function (a, b) {
    return desc ? ~~(a[key] < b[key]) : ~~(a[key] > b[key]);
  }
}
Page({
  data: {
    arrear: null,
    postage: 39,
    postcost: 10,
    balance: 0,
    defaultAdress: null,
    coupon: [],
    account: {},
    bill: {}
  },
  onLoad: function (options) {
  },
  onShow: function () {
    var that = this
    wx.request({
      url: `${host}/Address/GetDefaultAddress.ashx?UserId=${sessionid}`,
      success: function (res) {
        if (res.data.Id !== 0) {
          that.setData({
            defaultAdress: res.data
          })
        } else {
          that.setData({
            defaultAdress: null
          })
        }
      }
    })
    wx.request({
      url: `${host}/UserCenter/GetUserCenter.ashx?UserId=${sessionid}`,
      success: function (res) {
        if (res.data.State !== 'error') {
          var Amount = res.data.Amount
          that.setData({
            balance: Amount
          })
        }
        that.renderCart()
      }
    })
    wx.request({
      url: `${host}/Coupon/GetCouponInfo.ashx?UserId=${sessionid}`,
      success: function (res) {
        that.setData({
          coupon: res.data
        })
        that.renderCart()
      }
    })
    this.renderCart()
  },
  onUnload: function () {
    event.remove('selpoi', this)
  },
  deltnum: function (e) {
    var index = e.currentTarget.dataset.index
    car.descrOne(index)
    this.renderCart()
  },
  addnum: function (e) {
    var index = e.currentTarget.dataset.index
    car.plusOne(index)
    this.renderCart()
  },
  renderCart: function () {
    var carlist = car.get()
    var coupon = this.data.coupon
    var balance = this.data.balance
    var totalAmount = 0
    var postcost = null
    var trupay = null
    var usebalance = null
    var arrear = null
    var wxPay = null
    for (var i = 0, len = carlist.length; i < len; i++) {
      totalAmount += (carlist[i].standar.Price * carlist[i].isbuy)
    }
    console.log(coupon)
      var usecoupon = {
        reducenum: 0,
        cardDes: '无可用优惠券',
        CouponId: 0
      }
    if ((totalAmount - usecoupon.reducenum) >= this.data.postage) {
      postcost = 0
      arrear = 0
    }
    else {
      postcost = this.data.postcost
      arrear = this.data.postage - totalAmount + usecoupon.reducenum
    }
    if (balance >= (totalAmount - usecoupon.reducenum + postcost)) {
      usebalance = totalAmount - usecoupon.reducenum + postcost
    }
    else {
      usebalance = balance
    }
    wxPay = totalAmount - usecoupon.reducenum + postcost - usebalance
    var account = {}
    account.totalAmount = totalAmount
    account.usecoupon = usecoupon
    account.postcost = postcost
    account.usebalance = usebalance
    account.wxPay = wxPay
    this.setData({
      carlist: carlist,
      account: account,
      arrear: arrear
    })
  },
  goBill: function () {
    var that = this
    if (!this.data.defaultAdress) {
      wx.showToast({
        title: '请选择收货地址',
        icon: 'success',
        duration: 1000
      })
      return
    }
    var carlist = this.data.carlist
    var account = this.data.account
    var list = []
    for (var i = 0, len = carlist.length; i < len; i++) {
      list.push({
        ProductName: carlist[i].Title,
        ProductId: carlist[i].Pid,
        StandradId: carlist[i].standar.StandardId,
        ProducuPrice: carlist[i].standar.Price,
        ProductNum: carlist[i].isbuy,
        Amount: carlist[i].standar.Price * carlist[i].isbuy
      })
    }
    var UsedCash = account.usebalance
    var UsedCoupon = account.usecoupon.CouponId
    var AmoutPaid = account.wxPay
    var OriginalAmount = account.totalAmount
    var Postage = account.postcost
    var UserId = sessionid
    var jsonStr = {}
    jsonStr.list = list
    jsonStr.UsedCash = UsedCash
    jsonStr.UsedCoupon = UsedCoupon
    jsonStr.AmoutPaid = AmoutPaid
    jsonStr.OriginalAmount = OriginalAmount + Postage
    jsonStr.Postage = Postage
    jsonStr.UserId = UserId
    wx.request({
      url: `${host}/UserCenter/AddUserOrder.ashx`,
      data: { jsonStr: jsonStr },
      success: function (res) {
        if (res.data.State === 'ok') {
          var orderID = res.data.Message
          var accountStr = JSON.stringify(account)
          var carlistStr = JSON.stringify(carlist)
          var defaultAdress = JSON.stringify(that.data.defaultAdress)
          wx.navigateTo({
            url: `./pay/pay?orderID=${orderID}&account=${accountStr}&carlist=${carlistStr}&defaultAdress=${defaultAdress}`
          })
        } else {
          wx.showLoading({
            title: '网络出错!',
          })
          setTimeout(function () {
            wx.hideLoading()
          }, 1000)
        }
      },
      fail: function (err) {
        wx.showLoading({
          title: '网络出错!',
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 1000)
      }
    })
  }
})