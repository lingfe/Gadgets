// miniprogram/pages/public/appreciate/appreciate.js
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
    var that=this;
    that.setData({
      menu_id:options.menu_id,
    })
    that.getMenuInfo(that);
  },

  //点击预览
  btn_preview:function(e){
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: [e.currentTarget.id+''] // 需要预览的图片http链接列表
    })
  },

  //查询菜单信息
  getMenuInfo:function(that){
    //得到数据
    wx.cloud.callFunction({
      name: 'query',
      data: {
        tab_name: "tab_sys_menu",
        where: {
          _id:that.data.menu_id
        },
      },
      complete: function (res) {
        console.log(res);
        that.setData({
          menuinfo: res.result.data[0]
        })
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})