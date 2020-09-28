// miniprogram/pages/public/data_operation/data_operation.js
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
    var exe=options.exe;
    if(exe!=null) {
      exe = JSON.parse(exe);
    }else{
      exe={}
    }
    if (exe.code == 'update') {
      wx.showLoading({
        title: '正在执行中..',
        mask: true
      })
      //执行修改
      that.data.update = exe.update;
      that.update(that);
    } else if (options.btn == "delete") {
      //执行删除
      that.data.tab_name = options.tab_name;
      that.data.id = options.id;
      that.delete(that);
    }
  },

  //删除
  delete: function (that) {
    //提示
    wx.showModal({
      title: '数据删除',
      content: '是否确定删除？删除之后将无法恢复！',
      confirmText: "确定",
      cancelText: "取消",
      success: function (res) {
        console.log(res);
        //是否确定
        if (res.confirm) {
          wx.cloud.callFunction({
            name: 'delete',
            data: {
              tab_name: that.data.tab_name,
              id: that.data.id,
            },
            success: function (res) {
              console.log(res);
              wx.hideLoading();
              wx.showModal({
                title: '提示',
                content: '操作成功!',
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    //返回
                    wx.navigateBack();
                  }
                }
              })
            }
          });
        }
        //返回
        wx.navigateBack();
      }
    });
  },

  //编辑
  update: function (that) {
    //执行修改
    wx.cloud.callFunction({
      name: 'update',
      data: that.data.update,
      success: function (res) {
        console.log(res);
        wx.hideLoading();
        wx.showModal({
          title: '提示',
          content: '操作成功!',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              //返回
              wx.navigateBack();
            }
          }
        })
      }
    })
  }

})