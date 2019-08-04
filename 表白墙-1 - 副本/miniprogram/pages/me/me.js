// miniprogram/pages/me/me.js
var app = getApp();
Page({

  actioncnt: function() {        
    wx.showActionSheet({            
      itemList:  ['群聊',  '好友',  '朋友圈'],
      success: function(res)  {
        console.log(res.tapIndex)
      },
      fail: function(res)  {
        console.log(res.errMsg)
      }
    })   
  },
  /**
   * 页面的初始数据
   */
  data: {
    isShow: false,
    showPublish: false
  },

  onShow() {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getKaiGuan();
  },

  //获取开发
  getKaiGuan() {
    let that = this;
    wx.cloud.database().collection("kaiguan").get({
      success(res) {
        if (res && res.data) {
          let kaiguan = res.data[0];
          console.log("请求开关成功", kaiguan)
          if (kaiguan && kaiguan.kaiguan) {
            that.setData({
              showPublish: true
            })
          }
        }
      },
      fail(res) {}
    })
  },
  /**
   * 收藏列表
   */
  onCollectClick: function(event) {
    wx.navigateTo({
      url: '../collect/collect',
    })
  },
  /**
   * 发布历史
   */
  onHistoryClick: function(event) {
    wx.navigateTo({
      url: '../history/history',
    })
  },

  /**
   * 提交意见
   */
  onAdvanceClick: function(event) {
    wx.navigateTo({
      url: '../advance/advance',
    })
  },

  //信息页面
  onuserClick: function(event) {
    wx.navigateTo({
      url: '../gerenxinxi/xinxi',
    })
  },




  clickInvitivation: function(event) {
    this.actioncnt();
  },


  onAdvance1Click: function(event) {
    wx.navigateTo({
      url: '../question/question',
    })
  },

  onAdvance2Click: function (event) {
    wx.navigateTo({
      url: '../home/home',
    })
  },
 



  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(event) {
    console.log(event);
  }
})