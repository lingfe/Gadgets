// miniprogram/pages/public/textbox/textbox.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nodes:'<style>.text{color:red; word-wrap: break-word; word-break: break-all;}</style><div style="color:red;">test</div><form bindsubmit="submitForm"><textarea name="textbox" maxlength="10000" class="text" ></textbox><button form-type="submit">转换</button></form><textarea class="text" maxlength="100000" value="{{textbox}}"></textbox>'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var text=that.data.nodes;

    var arr=text.split("");
    var list=[];
    arr.forEach(a => {
       var code=a.charCodeAt(0);
       list.push(code);
    });

    that.setData({
      arr:arr,
      textbox:list.join()
    })
  },

  submitForm:function(e){
    var that=this;
    var text=e.detail.value.textbox;

    var arr=text.split("");
    var list=[];
    arr.forEach(a => {
       var code=a.charCodeAt(0);
       list.push(code);
    });

    that.setData({
      arr:arr,
      textbox:list.join()
    })

    // list.forEach(st => {
    //   var str=String.fromCharCode(st);
    //   console.log(str);
    // });

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