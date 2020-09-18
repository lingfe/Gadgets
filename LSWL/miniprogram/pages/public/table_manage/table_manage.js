// miniprogram/pages/index/lswl/lswl_data_manage/table_manage/table_manage.js
const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    tab_name: null,
    pageing:{
      pageIndex:1,
      pageNum:10
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      tab_name: options.tab_name
    })
    that.getField(that);
  },

  //是否
  bindchange_if: function (e) {
    var that = this;
    that.data.where = {
      _id: e.target.id
    }

    //得到字段
    var field = e.target.dataset.field;
    var update_data = '{"' + field + '":"' + e.detail.value + '"}';
    that.data.update_data = JSON.parse(update_data);

    //执行修改
    that.update(that);
    console.log(e);
  },

  //修改 
  update: function (that) {
    wx.cloud.callFunction({
      name: 'update',
      data: {
        tab_name: that.data.tab_name,
        where: that.data.where,
        update_data: that.data.update_data
      },
      success: function (res) {
        console.log(res);
        that.data.list=[];
        that.querData(that);
        wx.showToast({
          title: '操作成功！',
        })
      }
    });
  },

  //改变数据状态
  bind_state: function (e) {
    var that = this;
    that.data.where = {
      _id: e.target.id
    }
    that.data.update_data = {
      state: parseInt(e.target.dataset.state)
    }
    //执行修改
    that.update(that);
  },

  //得到字段
  getField: function (that) {
    wx.cloud.callFunction({
      name: 'getField',
      data: {
        tab_name: that.data.tab_name,
      },
      complete: function (res) {
        console.log(res);
        that.setData({
          fields: res.result.data
        });

        that.querData(that);
      }
    });
  },

  //查询数据
  querData: function (that) {
    //分页参数
    var pageing=that.data.pageing;
    var pageIndex=pageing.pageIndex;
    var pageNum=pageing.pageNum;
    pageIndex=(pageIndex-1)*pageNum;
    db.collection(that.data.tab_name)
      .where({})
      .orderBy('sort', 'asc')
      .skip(pageIndex)
      .limit(pageNum)
      .get({
        success: res => {
          //字段
          var fields = that.data.fields;
          var arr = [];
          var list = res.data;
          //处理var
          list.forEach(st => {
            var fd_data = [];
            for (var j = 0; j < fields.length; j++) {
              var fd = fields[j];
              for (let key in st) {
                if (fd.field_name == key) {
                  fd.field_value = st[key];
                  fd_data.push(fd);
                  break;
                }
              }
            }
            st.fields = fd_data;
            //改变内存地址
            var cartInfo = JSON.parse(JSON.stringify(st));
            arr.push(cartInfo);
          });
          that.setData({
            list:that.data.list.concat(arr) ,
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

  //删除数据
  bind_delete: function (e) {
    var that = this;
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
              id: e.target.id,
            },
            success: function (res) {
              console.log(res);
              wx.showToast({
                title: '删除成功！',
                icon:'none'
              })

              that.data.list=[];
              that.querData(that);
            }
          });
        }
      }
    });
  },

    /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this;
    //重置分页
    var pageing=that.data.pageing;
    that.setData({
      list:[],
      pageing:{
        pageIndex:1,
        pageNum:10
      }
    })
    that.querData(that);

    //下拉完成后执行回退
    wx.stopPullDownRefresh();
  },

    /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function (e) {
    var that = this;
    var pageIndex=that.data.pageing.pageIndex;
    that.setData({
      pageing:{
        pageIndex:pageIndex+1,
        pageNum:10,
      }
    })
    that.querData(that);
  },

})