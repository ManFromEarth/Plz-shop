var event = require('../../vendors/event')
var host = require('../../config').service.host
var sessionid = require('../../utils/session').get()
const getpoi = require('../../utils/getpoi')
const car = require('../../utils/car')
const app = getApp()
Page({
  data: {
    maskable: false,
    popup: false,
    popspec: true,
    currrntSpec: 0,
    currentC: 0
  },
  onLoad: function () {
    var that = this
    var optionUrl = `${host}/Product/getCategroyList.ashx?UserId=${sessionid}`
    if (!sessionid) {
      optionUrl = `${host}/Product/getCategroyList.ashx`
    }
    console.log(optionUrl)
    wx.request({
      url: optionUrl,
      success: function (res) {
        console.log(res)
        var data = res.data
        if (data) {
          var initCid = data.pclist[0].Cid
          var tab = data.pclist
          if (!data.adress.Pcadress) {
            getpoi(function (poitxt) {
              console.log(poitxt)
              that.setData({
                activeAdress: poitxt,
                tab: tab
              })
            })
          } else { 
            that.setData({
              tab: tab,
              activeAdress: data.adress.Pcadress
            })
          }
          wx.request({
            url: `${host}/Product/getProductList.ashx?Cid=${initCid}`,
            success: function (res) {
              console.log(res)
              var data = res.data
              tab[0].productlist = data
              that.setData({
                tab: tab
              })
            }
          })
        }
      }
    })
  },
  onShow: function () {
    var that = this
    event.on('selpoi', this, function (data) {
      that.setData({
        'activeAdress': data
      })
    })
  },
  onUnload: function () {
    event.remove('selpoi', this);
  },
  onShareAppMessage: function () {
  },
  tapchangge: function (ev) {
    var currentC = ev.currentTarget.id;
    this.setData({
      currentC: currentC
    })
  },
  swiperchange: function (ev) {
    var currentC = ev.detail.current
    this.setData({
      currentC: currentC
    })
    this.loadframe(currentC)
  },
  addcart: function (e) {
    var index = e.currentTarget.dataset.index
    var currentC = this.data.currentC
    this.setData({
      currentEq: index,
      popspec: false,
      maskable: true
    })
  },
  selectspec: function (e) {
    var index = e.currentTarget.dataset.index
    this.setData({
      currrntSpec: index
    })
  },
  joinCart: function (e) {
    var tab = this.data.tab
    var currrntSpec = this.data.currrntSpec
    var currentC = this.data.currentC
    var currentEq = this.data.currentEq
    var preCar = tab[currentC].productlist[currentEq]
    preCar.activeStandard = preCar.standardlist[currrntSpec]
    car.join(preCar)
    this.setData({
      popspec: true,
      maskable: false,
      currrntSpec: 0
    })
  },
  hiddenpop: function () {
    this.setData({
      popspec: true,
      popup: false,
      maskable: false
    })
  },
  tapcard: function () {
    this.setData({
      popup: false,
      maskable: false
    })
  },
  loadframe: function (currentC) {
    var that = this
    var tab = this.data.tab
    var cid = tab[currentC].Cid
    wx.request({
      url: `${host}/Product/getProductList.ashx?Cid=${cid}`,
      success: function (res) {
        for (var i = 0; i < tab.length; i++) {
          if (currentC == i) {
            tab[i].productlist = res.data
          }
          else {
            tab[i].productlist = null
          }
          that.setData({
            tab: tab
          })
        }
      }
    })
  }
})







