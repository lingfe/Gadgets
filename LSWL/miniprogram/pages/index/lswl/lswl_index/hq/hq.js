// miniprogram/pages/index/lswl/lswl_index/hq/hq.js
var app=getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    yw_id: null,
  },

  //页面加载
  onLoad: function (options) {
    var that = this;
    //业务id
    var yw_id=app.getPage().options.menu_id;
    that.setData({yw_id:yw_id});
  },

  //是否开放
  bindIskaifang:function(e){
    if(e.detail.value == 1){
      //是
    }
  },

  //分享
  onShareAppMessage: function (e) {

  },

  //地址
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      event_address: e.detail.value
    });
  },

  //提示框
  showModal: function (msg) {
    wx.showModal({
      title: '提示',
      content: msg,
      showCancel: false,
    });
  },

  //提交
  submitForm: function (e) {
    var that = this;

    //事件日期
    var event_date = e.detail.value.event_date;
    if (app.checkInput(event_date)) {
      that.showModal("日期不能为空!");
      return;
    } 

    //事件名称
    var event_name = e.detail.value.event_name;
    if (app.checkInput(event_name)) {
      that.showModal("事件名称不能为空!");
      return;
    }

    //事件地址
    var event_address = e.detail.value.event_address;
    if (app.checkInput(event_address)) {
      that.showModal("举办地址不能为空!");
      return;
    }

    //详细地址
    var event_address_detatils = e.detail.value.event_address_detatils;
    if (app.checkInput(event_address_detatils)) {
      that.showModal("详细地址不能为空!");
      return;
    }

    //是否开放
    var iskaifang=e.detail.value.event_iskaifang;
    
    //数据
    var form={
      event_name:event_name,
      event_address:event_address,
      event_address_detatils: event_address_detatils,
      event_reamrk:e.detail.value.event_reamrk,
      yw_id:that.data.yw_id,
      event_date: event_date,
      iskaifang:iskaifang,
      yw_id:that.data.yw_id,
    };

    //添加
    that.add(form);

  },

  //添加事件
  add:function(form){
    const db = wx.cloud.database();
    db.collection('tab_my_event').add({
      data: {
        event_date: form.event_date,
        event_address: form.event_address,
        event_remark: form.event_remark,
        event_address_dateils: form.event_address_dateils,
        event_name: form.event_name,
        yw_id: form.yw_id,
        iskaifang:parseInt(form.iskaifang),
        state:0,
        yw_id:form.yw_id,
      },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        this.setData({
          counterId: res._id,
          count: 1
        })

        //返回,上上页
        var page=app.getPage(3);
        page.currentPage.setData({
          yw_id:form.yw_id,
        });
        
        wx.navigateBack({
          delta: 2,
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

  //清空表单
  closeForm: function (that) {
    that.setData({
      doorTime: null,
      yuyueAdress: null,
      adressInfo: null,
      cellYou: null,
      phone: null,
      remark: null,
    });
  },

  //上门时间
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      event_date: e.detail.value,
    })
  },

})