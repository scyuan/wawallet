var QR = require("../../utils/qrcode.js");
Page({
  data: {
    maskHidden: true,
    imagePath: '',
    address: '0x9c7fc7fe1150cc800f8dbc95e07004ef04f2b5e9', //默认二维码生成文本,
    amount:'0',
  },
  onLoad: function (options) {
    this.setData({
      address:wx.getStorageSync('address')
    })

    // 页面初始化 options为页面跳转所带来的参数
    var size = this.setCanvasSize();//动态设置画布大小
    var address = wx.getStorageSync('address');
    console.log(address);
    this.setData({
      address:address
    })
    var initUrl = this.data.address+'+'+this.data.amount;
    console.log(initUrl);
    this.createQrCode(initUrl, "mycanvas", size.w, size.h);
  },
  onReady: function () {
  
  },
  onShow: function () {

    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },

  onUnload: function () {
    // 页面关闭

  },
  //适配不同屏幕大小的canvas
  setCanvasSize: function () {
    var size = {};
    try {
      var res = wx.getSystemInfoSync();
      var scale = 750 / 686;//不同屏幕下canvas的适配比例；设计稿是750宽
      var width = res.windowWidth / scale;
      var height = width;//canvas画布为正方形
      size.w = width;
      size.h = height;
    } catch (e) {
      // Do something when catch error
      console.log("获取设备信息失败" + e);
    }
    return size;
  },
  createQrCode: function (url, canvasId, cavW, cavH) {
    //调用插件中的draw方法，绘制二维码图片
    QR.api.draw(url, canvasId, cavW, cavH);
    setTimeout(() => { this.canvasToTempImage(); }, 1000);

  },
  //获取临时缓存照片路径，存入data中
  canvasToTempImage: function () {
    var that = this;
    wx.canvasToTempFilePath({
      canvasId: 'mycanvas',
      success: function (res) {
        var tempFilePath = res.tempFilePath;
        console.log(tempFilePath);
        that.setData({
          imagePath: tempFilePath,
          // canvasHidden:true
        });
      },
      fail: function (res) {
        console.log(res);
      }
    });
  },
  //点击图片进行预览，长按保存分享图片
  previewImg: function (e) {
    var img = this.data.imagePath;
    console.log(img);
    wx.previewImage({
      current: img, // 当前显示图片的http链接
      urls: [img] // 需要预览的图片http链接列表
    })
  },
  getValue:function(e){
    this.setData({
      amount:e.detail.value
    })
  },
  formSubmit: function (e) {
    //判断金额是否格式正确
    if(isNaN(this.data.amount)){
      wx.showToast({
        title: '不是数字',
      })
      return ;
    }
    var that = this;
    var url = this.data.address + '+' + this.data.amount;
    that.setData({
      maskHidden: false,
    });
    wx.showLoading({
      title: '正在生成二维码',
    })
    var st = setTimeout(function () {
      wx.hideToast()
      var size = that.setCanvasSize();
      //绘制二维码
      that.createQrCode(url, "mycanvas", size.w, size.h);
      that.setData({
        maskHidden: true
      });
      clearTimeout(st);
      wx.hideLoading();
    }, 2000)

  }

})