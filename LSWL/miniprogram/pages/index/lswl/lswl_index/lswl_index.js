// miniprogram/pages/index/lswl/lswl_index/lswl_index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    images_list:[],
    type_menu:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.quer();
  },



  //查询
  quer: function () {
    const db = wx.cloud.database();
    db.collection('tab_my_images').where({
        yw_id: 'lswl_index'
      })
      .get({
        success: res => {
          this.setData({
            images_list: res.data
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

    //查询菜单
    db.collection('tab_sys_menu').where({
      state: 0
    })
      .get({
        success: res => {
          this.setData({
            type_menu: res.data
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