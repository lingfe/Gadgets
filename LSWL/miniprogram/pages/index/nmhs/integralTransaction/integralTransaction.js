/**  
 *   作者:  lingfe 
 *   时间:  2017-11-30
 *   描述:  积分交易
 * 
 * */
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isBltype: 'shou', //显示送分或者收分,默认收分
    integral: '', //积分
    pwd: '', //密匙
    tab_name: 'tab_integral_transaction' //积分交易表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;

    //获取用户信息
    that.getUserInfo(that);
  },

  //获取用户信息
  getUserInfo: function (that) {
    wx.cloud.callFunction({
      name: "query",
      data: {
        tab_name: 'tab_user_info',
        where: {
          openid: wx.getStorageSync('openid')
        }
      },
      success: function (user) {
        console.log(user);
        if (app.checkInput(user.result.data)) {
          //不存在,跳转
          wx.navigateTo({
            url: '/pages/public/wxUserinfoLogin/wxUserinfoLogin',
          })
        } else {
          var userinfo = user.result.data[0];
          wx.setStorageSync('userinfo', userinfo);
          that.setData({
            userinfo: userinfo
          });
        }
      }
    })
  },

  //帮助
  bindtapbangzhu: function (e) {
    var that = this;
    //判断指令
    if (that.data.isBltype == "shou") {
      that.showModal("说明:请输入密匙领取积分!");
    } else {
      that.showModal("说明: 好友根据您设置的密匙领取积分!");
    }
  },

  //送分或者收分
  bindtapIntegral: function (e) {
    console.log(e.currentTarget.id);
    var that = this;
    that.setData({
      isBltype: e.currentTarget.id,
    });
  },

  //积分
  inputcontactPeople: function (e) {
    var that = this;
    var value = e.detail.value;
    if (!value.replace(/^((\d*[0-9])|(0?\.\d{2}))$/g, '')) {
      that.setData({
        integral: parseFloat(value)
      });
    } else {
      wx.showToast({
        title: '只能输入整数或小数！',
        icon: 'none'
      })
      that.setData({
        integral: null,
      });
    }
  },

  //密匙
  inputPwd: function (e) {
    this.setData({
      pwd: e.detail.value
    });
  },

  //提交，送分或者收分
  binSbmint: function (e) {
    var that = this;
    wx.showLoading({
      title: '处理中..',
      mask:true
    })
    //判断送分或者收分
    if (that.data.isBltype == "shou") {
      //收分
      that.getShou(that);
    } else if (that.data.isBltype == "so") {
      //送分
      that.setSo(that);
    }
  },

  //收分
  getShou: function (that) {
    //验证非空
    if (app.checkInput(that.data.pwd)) {
      that.showModal("请输入密匙!");
      wx.hideLoading();
      return;
    }

    //查询
    wx.cloud.callFunction({
      name: 'query',
      data: {
        tab_name: that.data.tab_name,
        where: {
          lq_pwd: that.data.pwd,
        }
      },
      success: function (res) {
        //验证非空
        if (!app.checkInput(res.result.data)) {
          var data = res.result.data[0];
          if (data.state == 1) {
            wx.showToast({
              title: '已被领取！',
              icon: 'none'
            })
            return;
          }
          var user = wx.getStorageSync('userinfo');
          var integral = (parseFloat(user.integral) + parseFloat(data.integral));
          user.integral = integral;
          wx.setStorageSync('userinfo', user);
          //执行修改-用户积分
          var update = {
            tab_name: 'tab_user_info',
            where: {
              _id: user._id
            },
            update_data: {
              integral: integral,
            }
          }
          that.setData({
            update: update,
            pwd: '',
            integral: '',
          });
          that.update(that);
          that.showModal("领取成功!积分+" + data.integral);

          //执行修改-交易状态
          update = {
            tab_name: that.data.tab_name,
            where: {
              _id: data._id
            },
            update_data: {
              lq_personal_id: user._id,
              state: 1 //已领取
            }
          }
          that.setData({
            update: update,
          });
          that.update(that);
        } else {
          that.showModal("密匙不存在!");
          wx.hideLoading();
        }
      }
    })
  },

  //修改
  update: function (that) {
    wx.cloud.callFunction({
      name: 'update',
      data: that.data.update,
      success: function (res) {
        console.log(res);
        wx.showToast({
          title: '成功处理！',
          icon: 'none'
        })
        //获取用户信息
        wx.hideLoading();
        that.getUserInfo(that);
      }
    })
  },

  //送分
  setSo: function (that) {
    //验证非空
    if (app.checkInput(that.data.integral)) {
      that.showModal("请输入积分!");
      wx.hideLoading();
      return;
    }

    var integral = parseFloat(that.data.integral);
    var user = wx.getStorageSync('userinfo');
    if (parseFloat(user.integral) < integral) {
      that.showModal("您的积分不足!");
      wx.hideLoading();
      that.setData({
        integral: user.integral
      });
      return;
    }

    if (app.checkInput(that.data.pwd)) {
      that.showModal("请输入密匙!");
      wx.hideLoading();
      return;
    }

    //查询
    wx.cloud.callFunction({
      name: 'query',
      data: {
        tab_name: that.data.tab_name,
        where: {
          lq_pwd: that.data.pwd,
        }
      },
      success: function (yz_pwd) {
        if (!app.checkInput(yz_pwd.result.data)) {
          wx.showToast({
            title: '密钥重复！请不要设置太简单的密钥，建议使用随机生成！',
            icon: 'none',
            duration: 3000
          })
          return;
        } else {
          //参数
          var user = wx.getStorageSync('userinfo')
          var form = {
            integral: that.data.integral, //积分
            lq_pwd: that.data.pwd, //领取密匙
            personal_id: user._id, //积分发送者
            state: 0,
            crt_id: user._id,
            crt_date: new Date().toLocaleString()
          }

          //提示
          wx.showModal({
            title: '提示',
            content: '是否确定送分？送出后也可以自己领取回来！',
            confirmText: "确定",
            cancelText: "取消",
            success: function (res) {
              console.log(res);
              if (res.confirm) {
                //保存记录
                wx.cloud.callFunction({
                  name: 'add',
                  data: {
                    tab_name: that.data.tab_name,
                    form: form
                  },
                  complete: function (res) {
                    console.log(res);
                    wx.showToast({
                      title: '送分成功!',
                    });

                    //修改用户积分
                    var integral = (parseFloat(user.integral) - form.integral);
                    user.integral = integral;
                    wx.setStorageSync('userinfo', user);
                    var update = {
                      tab_name: 'tab_user_info',
                      where: {
                        _id: user._id
                      },
                      update_data: {
                        integral: integral
                      }
                    }
                    that.setData({
                      update: update,
                      pwd: '',
                      integral: '',
                    });
                    //执行修改
                    that.update(that);
                  }
                });
              }
            }
          });
        }
      }
    })
  },

  //提示框
  showModal: function (msg) {
    wx.showModal({
      title: '提示',
      content:msg,
      showCancel: false,
    });
  },
})