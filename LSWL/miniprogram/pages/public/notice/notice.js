// miniprogram/pages/public/notice/notice.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab_name:'tab_notice',
    url:'/pages/public/content/content'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    //get
    that.getNotice(that);
  },

  //公告信息
  getNotice(that){
    wx.cloud.callFunction({
      name: 'query',
      data: {
        tab_name: 'tab_notice',
        where:{
          state:0,
          yw_id:wx.getStorageSync('menu_id')
        }
      },
      complete: function (res) {
        console.log(res);
        that.setData({
          notice_list:res.result.data
        })
      }
    })

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