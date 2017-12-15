var carData = []
var car = {
  join: function (item) {
    var sinPro = {}
    sinPro.Pid = item.Pid
    sinPro.Title = item.Title
    sinPro.Tips = item.Tips
    sinPro.ImgCover = item.ImgCover
    sinPro.ImgGroup = item.ImgGroup
    sinPro.Descript = item.Descript
    sinPro.Price = item.Price
    sinPro.ImgGroup = item.ImgGroup
    sinPro.standar = {}
    sinPro.standar.StandardId = item.activeStandard.StandardId
    sinPro.standar.StandardName = item.activeStandard.StandardName
    sinPro.standar.Price = item.activeStandard.Price
    sinPro.standar.NeedScore = item.activeStandard.NeedScore
    sinPro.standar.IsSuitProduct = item.activeStandard.IsSuitProduct
    var len = carData.length
    if (len !== 0) {
      var flag = false;
      for (var i = 0; i < carData.length; i++) {
        if (carData[i].Pid === sinPro.Pid || carData[i].standar.StandardId === sinPro.standar.StandardId) {
          if (carData[i].standar.StandardId === sinPro.standar.StandardId) {
            carData[i].isbuy += 1
            flag = true
          }
        }
      }
      if (!flag) {
        sinPro.isbuy = 1
        carData.push(sinPro)
      }
      sinPro = {}
    } else {
      sinPro.isbuy = 1
      carData.push(sinPro)
      sinPro = {}
    }
    console.log(carData)
  },
  get: function () {
    return carData
  },
  clear:function(){
    carData=[]
  },
  descrOne:function(index){
    if (carData[index].isbuy===1){
      carData.splice(index,1)
      return
    }
    carData[index].isbuy-=1

  },
  plusOne:function(index){
    carData[index].isbuy+=1
  }
}
module.exports = exports = car



