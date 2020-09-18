/**  
 *   作者:  lingfe 
 *   时间:  2017-10-27
 *   描述:  我的预约
 * 
 * */
var app=getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:null,
    cst:false,      //隐藏
    phone: '18585904321',//收集员,客服电话
  },

    /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
  },

  //拨打收集员,客服电话
  bindtapPhone: function () {
    var that = this;
    wx.showModal({
      title: '拨打收集员电话',
      content: '是否确定拨打？' + that.data.phone,
      confirmText: "确定",
      cancelText: "取消",
      success: function (res) {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: that.data.phone
          });
        }
      }
    });
  },

  //取消预约
  bindtapcancel:function(e){
    var that=this;
    var update = {
      tab_name: 'tab_nmhs_call_maa',
      where: {
        _id: e.currentTarget.id
      },
      update_data: {
        state: parseInt(e.currentTarget.dataset.state)
      }
    }
    var exe={
      code:'update',
      update:update
    }
    wx.navigateTo({
      url: '/pages/public/data_operation/data_operation?exe='+JSON.stringify(exe),
    })
  },

  //显示或隐藏表单
  CalculationlistBindtap:function(e){
    console.log(e);
    if (e.currentTarget.id=="eixt"){
      this.setData({
        cst:this.data.cst==false?true:false
      });
    }
  },

  //获取预约
  getlemonRecovery: function (that){
    const db = wx.cloud.database();
    db.collection('tab_nmhs_call_maa')
      .where({
        openid:wx.getStorageSync('openid')
      })
      .orderBy("crt_date","desc")//降序
      .get({
        success: res => {
          that.setData({
            list: res.data
          })
          console.log('[数据库] [查询记录] 成功: ', res)
        }
      })
  },

  //页面显示
  onShow:function(){
    var that=this;
    //获取回收预约信息
    that.getlemonRecovery(that);
  }
})