// miniprogram/pages/public/content/content.js
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
    var yw_id=options.notice_id;
    if(yw_id == null){
      yw_id=options.yw_id;
    }
    that.setData({
      btn: options.btn,
      yw_id: yw_id,
      openid: wx.getStorageSync('openid')
    })

    //得到公告
    that.getNotice(that);
    //得到内容
    that.getContent(that);
  },

  //公告信息
  getNotice(that) {
    wx.cloud.callFunction({
      name: 'query',
      data: {
        tab_name: 'tab_notice',
        where: {
          state: 0,
          _id: that.data.yw_id
        }
      },
      complete: function (res) {
        console.log(res);
        that.setData({
          notice: res.result.data[0]
        })
      }
    })

  },

  //拨打电话
  bind_tel: function (e) {
    wx.makePhoneCall({
      phoneNumber: '18585094270',
    })
  },

  //公告信息
  getContent(that) {
    wx.cloud.callFunction({
      name: 'query',
      data: {
        tab_name: 'tab_content',
        where: {
          state: 0,
          yw_id: that.data.yw_id
        }
      },
      complete: function (res) {
        console.log(res);
        that.setData({
          content_list: res.result.data
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