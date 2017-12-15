const QQMap = require('../../../../vendors/qqmap.min')
const config = require('../../../../config')
const event = require('../../../../vendors/event')
var qqmap = new QQMap({
  key: config.key.qqmapkey
})
Page({
  data: {
    poilist: []
  },
  onLoad: function (options) {

    this.setData({
      selectedCity: options.selectedCity
    })
  },
  onReady: function () {
  },
  onShow: function () {
  },
  inputtap: function (ev) {
    var that = this
    var keyword = ev.detail.value
    qqmap.getSuggestion({
      keyword: keyword,
      region: that.data.selectedCity,
      region_fix: 1,
      policy: 1,
      success: function (res) {
        console.log(res.data)
        var reslist = res.data
        var poilist = []
        for (var i = 0, length = reslist.length; i < length; i++) {
          var singel = {}
          singel.title = reslist[i].title
          singel.address = reslist[i].address
          poilist.push(singel)
        }
        that.setData({
          poilist: poilist
        })
      }
    })
  },
  selectSin: function (ev) {
    var index = ev.currentTarget.dataset.index
    var poidata = this.data.poilist[index]
    event.emit('choosepoi', poidata
    )
    wx.navigateBack({
    })
  }
})

