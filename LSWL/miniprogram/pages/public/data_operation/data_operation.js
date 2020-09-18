// miniprogram/pages/public/data_operation/data_operation.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.showLoading({
      title: '正在执行中..',
      mask:true
    })
    var exe=JSON.parse(options.exe);
    if (exe.code == 'update') {
      //执行修改
      that.data.update = exe.update;
      that.update(that);
    }
  },

  //编辑
  update: function (that) {
    //执行修改
    wx.cloud.callFunction({
      name: 'update',
      data: that.data.update,
      success: function (res) {
        console.log(res);
        wx.hideLoading();
        wx.showModal({
          title:'提示',
          content:'操作成功!',
          showCancel:false,
          success:function(res){
            if(res.confirm){
              //返回
              wx.navigateBack();
            }
          }
        })
      }
    })
  }

})