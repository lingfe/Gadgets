/**  
 *   作者:  lingfe 
 *   时间:  2017-10-28
 *   描述:  管理员
 * 
 * */
var app = getApp();

Page({

  //页面的初始数据
  data: {
    tabs: ["未行动", "行动中", "已完成"], //tab菜单列
    activeIndex: 0, //tab切换下标
    sliderOffset: 0, //坐标x
    sliderLeft: 0, //坐标y
    list: null,
    cst: false, //隐藏
    where: {
      state: 0
    },
    form:{
      num:0,
      total:null,
    },
    userinfo:wx.getStorageSync('userinfo')
  },

  //页面加载
  onLoad: function (options) {
    var that = this;
    wx.showToast({
      title: '欢迎您！管理员',
      icon:'none'
    })

    //设置tab
    var sliderWidth = 50;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });

    //默认获取未处理
    that.getlemonRecovery(that);
  },

  //完成
  wancheng: function (e) {
    var that = this;
    var update = {
      tab_name: 'tab_nmhs_call_maa',
      where: {
        _id: e.currentTarget.id
      },
      update_data: {
        state: parseInt(e.currentTarget.dataset.state)
      }
    }
    var id=e.currentTarget.id;
    if (!app.checkInput(id)) {
      var that = this;
      that.setData({
        update:update,
        call_maa_id:e.currentTarget.id,
        call_maa_crt_id:e.currentTarget.dataset.crtid,
        cst: this.data.cst == false ? true : false
      });
    }
  },

  //废弃
  feiqi:function(e){
    var that = this;
    var update = {
      tab_name: 'tab_nmhs_call_maa',
      where: {
        _id: e.currentTarget.id
      },
      update_data: {
        state: parseInt(e.currentTarget.dataset.state)
      }
    }
    wx.showModal({
      title:'提示',
      content:'确定废弃吗？废弃之后将不可恢复！',
      cancelText:'取消',
      confirmText:'确定',
      success:function(res){
        if(res.confirm){
          var exe={
            code:'update',
            update:update
          }
          wx.navigateTo({
            url: '/pages/public/data_operation/data_operation?exe='+JSON.stringify(exe),
          })
        }
      }
    })
  },

  //行动
  xingdo: function (e) {
    var that = this;
    var update = {
      tab_name: 'tab_nmhs_call_maa',
      where: {
        _id: e.currentTarget.id
      },
      update_data: {
        state: parseInt(e.currentTarget.dataset.state)
      }
    }
    //执行修改
    var exe={
      code:'update',
      update:update
    }
    wx.navigateTo({
      url: '/pages/public/data_operation/data_operation?exe='+JSON.stringify(exe),
    })
  },

  //编辑状态
  update: function (that) {
    //执行修改
    wx.cloud.callFunction({
      name: 'update',
      data: that.data.update,
      success: function (res) {
        console.log(res);
        wx.showToast({
          title: '操作成功！',
          icon: 'none'
        })
        //刷新
        wx.hideLoading();
        that.getlemonRecovery(that);
      }
    })
  },

  //获取预约
  getlemonRecovery: function (that) {
    const db = wx.cloud.database();
    db.collection('tab_nmhs_call_maa')
      .where(that.data.where)
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

  //拨打用户电话
  bindtapPhone: function (e) {
    var that = this;
    wx.showModal({
      title: '拨打用户电话',
      content: '是否确定拨打？' + e.currentTarget.id,
      confirmText: "确定",
      cancelText: "取消",
      success: function (res) {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: e.currentTarget.id
          });
        }
      }
    });
  },

  //总共多少斤
  inputother: function (e) {
    var that = this;
    var form = that.data.form;
    var other = parseFloat(e.detail.value == '' ? 0 : e.detail.value);
    this.setData({
      'form.num': parseFloat(e.detail.value)*1,
    });
  },

  //显示或隐藏表单
  CalculationlistBindtap: function (e) {
    if(!app.checkInput(e.currentTarget.id)){
      this.setData({
        cst: this.data.cst == false ? true : false
      });
    }
  },

  //tab点击切换
  tabClick: function (e) {
    //当前
    var that = this;
    var name = e.currentTarget.dataset.name;
    if (name == "未行动") {
      //未行动
      that.setData({
        where:{state:0}
      })
      that.getlemonRecovery(that);
    } else if (name == "行动中") {
      //行动中
      that.setData({
        where:{state:1}
      })
      that.getlemonRecovery(that);
    } else if (name == "已完成") {
      //已完成
      that.setData({
        where:{state:2}
      })
      that.getlemonRecovery(that);
    }

    //设置
    that.setData({
      list: null,
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },

  //保存回收纪录
  submitForm: function (e) {
    var that = this;
    //得到表单
    wx.showLoading({
      title: '处理中..',
      mask:true
    })
    var form = e.detail.value;
    form.crt_date=new Date().toLocaleString();
    form.state=0;
    form.openid=wx.getStorageSync('openid');
    form.crt_id=wx.getStorageSync('userinfo')._id;
    if (app.checkInput(form.total)) {
      wx.showToast({
        title: '请输入总共斤数！',
        icon:'none'
      })
      return;
    }

    //验证数量
    if(form.total>=1000000000000){
      wx.showToast({
        title: '最多只能输入100亿',
        icon:'none'
      })
      that.setData({
        form:{
          num:0,
          total:null,
        }
      })
      return;
    }

    //保存
    wx.cloud.callFunction({
      name:'add',
      data:{
        tab_name:'tab_recovery_record',
        form:form
      },
      success:function(res){
        console.log(res);
        //执行修改状态
        that.update(that);
        //修改用户贡献
        that.data.form=form;
        that.setContribtion(that);
        //初始化
        that.setData({
          form:{
            total:null,
            num:0,
          },
          cst: false
        });
      }
    })
  },

  //修改用户贡献
  setContribtion:function(that){
    var form=that.data.form;
    wx.cloud.callFunction({
      name:'query',
      data:{
        tab_name:'tab_user_info',
        where:{
          _id:form.user_id,
        }
      },
      success:function(res){
        var user=res.result.data[0];
        user.integral = (parseFloat(user.integral) + parseFloat(form.total));
        user.nmhs_jin=(parseFloat(user.nmhs_jin) + parseFloat(form.total));
        var update = {
          tab_name: 'tab_user_info',
          where: {
            _id: user._id
          },
          update_data: {
            integral: user.integral,
            nmhs_jin:user.nmhs_jin
          }
        }
        //执行修改
        that.data.update=update;
        that.update(that);
      }
    })
  }
})