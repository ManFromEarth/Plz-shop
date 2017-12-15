const host = require('../../config').service.host 
const formTime = require('../../utils/formTime.js')
function throttle(method, context) {
  clearTimeout(method.tId);
  method.tId = setTimeout(function () {
    method.call(context);
  }, 500);
}
Page({
  data: {
    orderBy: 1,
    startIndex: 1,
    endIndex: 20,
    cookbooklist: []
  },
  onLoad: function (options) {
    var that = this
    var orderBy = this.data.orderBy
    var startIndex = this.data.startIndex
    var endIndex = this.data.endIndex
    wx.request({
      url: `${host}/Menu/getMenuList.ashx?orderby=${orderBy}&SearchText=&StartIndex=${startIndex}&EndIndex=${endIndex}`,
      success: function (res) {
        if (res.data) {
          startIndex = endIndex+1
          endIndex += 20
          that.setData({
            cookbooklist: res.data,
            startIndex: startIndex,
            endIndex: endIndex
          })
        }
      }
    })
  },
  loadnew: function () {
    var that = this
    this.setData({
      orderBy:1,
      startIndex: 21,
      endIndex: 40
    })
    wx.request({
      url: `${host}/Menu/getMenuList.ashx?orderby=1&SearchText=&StartIndex=1&EndIndex=20`,
      success: function (res) {
        var startIndex = that.data.startIndex
        var endIndex = that.data.endIndex
        if (res.data) {
          startIndex = endIndex + 1
          endIndex += 20
          that.setData({
            cookbooklist: res.data,
            startIndex: startIndex,
            endIndex: endIndex
          })
        }
      }
    })
  },
  loadmuch: function () {
    var that=this
    this.setData({
      orderBy:2,
      startIndex: 21,
      endIndex: 40
    })
    wx.request({
      url: `${host}/Menu/getMenuList.ashx?orderby=2&SearchText=&StartIndex=1&EndIndex=20`,
      success: function (res) {
        var startIndex = that.data.startIndex
        var endIndex = that.data.endIndex
        if (res.data) {
          startIndex = endIndex + 1
          endIndex += 20
          that.setData({
            cookbooklist: res.data,
            startIndex: startIndex,
            endIndex: endIndex
          })
        }
      }
    })
   },
  scrolltolower: function () {
    var loadCook = this.loadCook
    throttle(loadCook, this);
  },
  loadCook: function () {
    var that = this
    var orderBy = this.data.orderBy
    var startIndex = this.data.startIndex
    var endIndex = this.data.endIndex
    wx.request({
      url: `${host}/Menu/getMenuList.ashx?orderby=${orderBy}&SearchText=&StartIndex=${startIndex}&EndIndex=${endIndex}`,
      success: function (res) {
        if (res.data) {
          var newCook = res.data
          var cookbooklist = that.data.cookbooklist
          var newCook = cookbooklist.concat(newCook)
          startIndex = endIndex+1
          endIndex += 20
          that.setData({
            cookbooklist: newCook,
            startIndex: startIndex,
            endIndex: endIndex
          })
        }
      }
    })

  }

})