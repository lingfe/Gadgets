// miniprogram/pages/index/lswl/lswl_index/cash_gift/add_cash_gift.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    yw_id:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({yw_id:options.id})
  },

  //提示框
  showModal: function (msg) {
    wx.showModal({
      title: '提示',
      content: msg,
      showCancel: false,
    });
  },

  //礼金-文本内容显示
  inputBind: function (event) {
    var value=event.detail.value;
    var tt = parseInt(value)//强转Int，毕竟有可能返回是String类型的数字
    if(app.checkInput(tt)){
      this.setData({
        inputValue: tt.toFixed(2)
      })
    }
    console.log('bindInput=' + this.data.inputValue)
  },


  //提交
  submitForm: function (e) {
    var that = this;

    //来宾姓名
    var name = e.detail.value.name;
    if (app.checkInput(name)) {
      that.showModal("姓名不能为空!");
      return;
    }else if(name.length>4){
      that.showModal("姓名最长只能输入4个字！",1);
      return;
    }

    //礼金
    var cash_gift = e.detail.value.cash_gift;
    if (app.checkInput(cash_gift)) {
      that.showModal("礼金不能为空!");
      return;
    } else if (cash_gift > 9999999999999.99){
      that.showModal("超出范围的人民币值!请在9999999999999.99范围内输入。");
      return;
    }

    //数据
    var form = {
      name: name,
      cash_gift: parseInt(cash_gift).toFixed(2),
      remark: e.detail.value.remark,
      yw_id:that.data.yw_id,
    };

    //添加
    that.add(form);

  },

  add: function (form) {
    const db = wx.cloud.database();
    db.collection('tab_my_cash_gift').add({
      data: {
        name: form.name,
        cash_gift: form.cash_gift,
        remark: form.remark,
        yw_id: form.yw_id,
        cdate: new Date()
      },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        this.setData({
          counterId: res._id,
          count: 1
        })
        wx.navigateBack({
          url: '../hq_list/hq_list_details/hq_list_details',
        })
        wx.showToast({
          title: '新增记录成功',
        })
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
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