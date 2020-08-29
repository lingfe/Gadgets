//app.js
App({

  //验证非空
  checkInput: function (data) {
    if (data == null || data == undefined || data == "" || data == 'null') {
      return true;
    }
    if (typeof data == "string") {
      var result = data.replace(/(^\s*)|(\s*$)/g, "");
      return result.length == 0 ? true : false;
    } else {
      return false;
    }
  },

  //获取打开的页面，可以获取url、参数。并且可以设置之前页面参数
  getPage:function(num){
    var pages = getCurrentPages();
    if(num=="undefined"||num==''||num==null)num=1;
    var currentPage = pages[pages.length-num];//当前页面 num=1，上一个页面 num=2

    var url=currentPage.route; //路径
    var options = currentPage.options; //参数

    //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
    // currentPage.setData({
    //   'basicInfo.tabs_list': res.data.data,
    //   'releaseInfo.tabs_list':res.data.data
    // })

    return {
      num:num,
      url:url,
      options:options,
      currentPage:currentPage,
    };
  },
  
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }
    wx.cloud.callFunction({
      name: 'openid',
      success: function (res) {
        console.log("openid:" + res.result.openid);
        wx.setStorageSync('openid', res.result.openid) ;
      }
    });

    this.globalData = {}
  }
})
