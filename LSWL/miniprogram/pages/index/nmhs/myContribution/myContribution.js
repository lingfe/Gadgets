/**  
 *   作者:  lingfe 
 *   时间:  2017-11-03
 *   描述:  我的贡献
 * 
 * */
 var app=getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfo:wx.getStorageSync('userinfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    //获取预约纪录
    that.getIntegralRecord(that);
  },

  //获取积分纪录
  getIntegralRecord: function (that) {
    const db = wx.cloud.database();
    db.collection('tab_recovery_record')
      .where({
        user_id:that.data.userinfo._id
      })
      .orderBy("crt_date", "desc")//降序
      .get({
        success: res => {
          that.setData({
            list: res.data
          })
          console.log('[数据库] [查询记录] 成功: ', res)
        }
      })
  },

})