// miniprogram/pages/index/lswl/lswl_index/open_cash_gift/open_cash_gift.js
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
    that.quer(options.id);
  },

  //重新录入
  bindtap_delete:function(event){
    const db = wx.cloud.database(); 
    db.collection('tab_my_cash_gift').doc(event.currentTarget.id).remove({
      success: res => {
        wx.showToast({
          title: '删除成功',
        })
        //关闭当前页跳转
        wx.navigateBack({
          url: '../hq_list/hq_list_details/hq_list_details',
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '删除失败',
        })
        console.error('[数据库] [删除记录] 失败：', err)
      }
    })
  },

  //查询
  quer:function(id){
    const db = wx.cloud.database();
    db.collection('tab_my_cash_gift').where({
      _id: id
    })
      .get({
        success: res => {
          this.setData({
            tab: res.data[0]
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