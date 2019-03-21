// pages/my/my.js
Page({
  data: {
    img: "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=578899140,1412678472&fm=27&gp=0.jpg",
    isbut:false
  },
  onLoad: function (options) {
    //需要注意的是：我们展示图片的域名需要在后台downfile进行配置，并且画到canvas里面前需要先下载存储到data里面
    let that = this;
    //先下载下来，比如我们的logo
    wx.downloadFile({
      url: that.data.img,
      success: function (res) {
        console.log("下载图片",res);
        that.setData({
          img: res.tempFilePath
        });
        that.canvasImg();
      }
    })
  },

  handler: function (e) {
    var that = this

    if (e.detail.authSetting["scope.writePhotosAlbum"]) {//如果打开了地理位置，就会为true
      that.setData({
        isbut: false
   

      })
    
    } else {
      that.setData({
        isbut: true
      });
    }
  },
  canvasImg() {
    const ctx = wx.createCanvasContext('myCanvas');
    const grd = ctx.createLinearGradient(0, 0, 300, 0);//创建了一个线性的渐变颜色 前两个参数起点横纵坐标，后两个参数终点横纵坐标
    grd.addColorStop(0, '#000');
    grd.addColorStop(0.5, 'red');
    grd.addColorStop(1, 'yellow');
    ctx.setFillStyle(grd);                             //为创建的canvans上下文添充颜色  如果没有设置 fillStyle，默认颜色为 black。及为背景色
    ctx.fillRect(0, 0, 300, 400);   // (左边  宽高)
    ctx.drawImage(this.data.img, 50, 100, 200, 145);   //里面的参数无非就是图片放置的位置即图片的横纵坐标，图片的宽高
    ctx.setFillStyle("#fff");
    ctx.setFontSize(20);                               //字大小
    ctx.setTextAlign('center');                        //是否居中显示，参考点画布中线
    ctx.fillText('今天天气好晴朗', 150, 280); 
               //150:canvas画布宽300，取1/2，中间，280：纵向位置
    ctx.setFillStyle("#666");
    ctx.setFontSize(20);                               //字大小
    ctx.setTextAlign('right');                        //是否居中显示，参考点画布中线
    ctx.fillText('今天天气好晴朗1111', 150, 350);   
    ctx.draw();
  },
  saveImg() {
    var that = this;
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 300,                     //画布宽高
      height: 400,  //画布宽高*dpr 以iphone6为准
      destWidth: 600,   //输出图片的宽高             
      destHeight: 800,
      canvasId: 'myCanvas',
      quality:"1",
      success: function (res) {
        console.log("临时图片吗",res.tempFilePath) //生成的临时图片路径
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (res) {
            console.log("陈宫",res);
            wx.showToast({
              title: '保存成功',
            })
          },
          fail: function (err) {
            console.log(err);
            if (err.errMsg === "saveImageToPhotosAlbum:fail:auth denied") {
              console.log("用户一开始拒绝了，我们想再次发起授权")
              console.log('打开设置窗口')
              that.setData({
                isbut:true
              })
              // wx.openSetting({
              //   success(settingdata) {
              //     console.log(settingdata)
              //     if (settingdata.authSetting['scope.writePhotosAlbum']) {
              //       console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
              //     } else {
              //       console.log('获取权限失败，给出不给权限就无法正常使用的提示')
              //     }
              //   }
              // })
              }
       
      }
    })
  }
})
  }
})