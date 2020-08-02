// miniprogram/pages/index/lswl/lswl_index/hq_list/hq_list.js
var app=getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    queryResult:[],
    page_data:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.data.yw_id=options.menu_id;
    //查询数据
    that.quer(that);
    //页面设置信息
    that.getPageSetup(that);
  },

  //页面设置信息
  getPageSetup:function(that){
    const db = wx.cloud.database();
    db.collection("tab_page_setup")
    .where({
      page_path:app.getPage().url,
    }).get({
      success: res => {
        that.setData({
          page_data: res.data
        })
        console.log('[数据库] [查询记录] 成功: ', res)
      },
    })
  },

  //查询
  quer: function (that) {
    const db = wx.cloud.database();
    db.collection('tab_my_event')
      .where({
        yw_id:that.data.yw_id,
        iskaifang:1,
        state: 0
      })
      .get({
        success: res => {
          that.setData({
            queryResult: res.data
          })
          console.log('[数据库] [查询记录] 成功: ', res)
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '查询记录失败'
          })
          console.error('[数据库] [查询记录] 失败：', err)
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
    var that = this;
    that.quer(that);
    
    //下拉完成后执行回退
    wx.stopPullDownRefresh();
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