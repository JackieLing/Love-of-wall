var that
let detailId
let openid
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topic: {},
    id: '',
    openid: '',
    isLike: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    that = this;
    detailId = options.id;
    openid = options.openid;
    // 获取话题信息
    wx.cloud.callFunction({
      name: "getDetail",
      data: {
        type: "topic",
        detailId: detailId
      },
      success(res) {
        console.log("topic成功", res)
        that.topic = res.result.data;
        that.setData({
          topic: that.topic,
        })
      },
      fail(res) {
        console.log("topic失败", res)
      }
    })
    // db.collection('topic').doc(that.data.id).get({
    //   success: function(res) {
    //     that.topic = res.data;
    //     that.setData({
    //       topic: that.topic,
    //     })
    //   }
    // })

    // 获取收藏情况
    // wx.cloud.callFunction({
    //   name: "getDetail",
    //   data: {
    //     type: "collect",
    //     detailId: detailId,
    //     openid: openid
    //   },
    //   success(res) {
    //     console.log("collect成功", res)
    //     if (res.result && res.result.data) {
    //       that.refreshLikeIcon(true)
    //     } else {
    //       that.refreshLikeIcon(false)
    //     }
    //   },
    //   fail(res) {
    //     console.log("collectc失败", res)
    //   }
    // })
    db.collection('collect')
      .where({
        _openid: openid,
        _id: detailId

      })
      .get({
        success: function(res) {
          console.log("collect成功", res)
          if (res.data.length > 0) {
            that.refreshLikeIcon(true)
          } else {
            that.refreshLikeIcon(false)
          }
        },
        fail: console.error
      })

  },

  onShow: function() {
    // 获取回复列表
    that.getReplay()
  },

  getReplay: function() {
    // 获取回复列表
    wx.cloud.callFunction({
      name: "getDetail",
      data: {
        type: "replay",
        detailId: detailId
      },
      success(res) {
        console.log("replay成功", res.result)
        if (res.result) {
          that.setData({
            replays: res.result.data
          })
        }
      },
      fail(res) {
        console.log("replay失败", res)
      }
    })

    // db.collection('replay')
    //   .where({
    //     t_id: that.data.id
    //   })
    //   .get({
    //     success: function(res) {
    //       // res.data 包含该记录的数据
    //       console.log(res)
    //       that.setData({
    //         replays: res.data
    //       })
    //     },
    //     fail: console.error
    //   })
  },
  /**
   * 刷新点赞icon
   */
  refreshLikeIcon(isLike) {
    that.data.isLike = isLike
    that.setData({
      isLike: isLike,
    })
  },
  // 预览图片
  previewImg: function(e) {
    //获取当前图片的下标
    var index = e.currentTarget.dataset.index;

    wx.previewImage({
      //当前显示图片
      current: this.data.topic.images[index],
      //所有图片
      urls: this.data.topic.images
    })
  },
  /**
   * 喜欢点击
   */
  onLikeClick: function(event) {
    console.log(that.data.isLike);
    if (that.data.isLike) {
      // 需要判断是否存在
      that.removeFromCollectServer();
    } else {
      that.saveToCollectServer();
    }
  },
  /**
   * 添加到收藏集合中
   */
  saveToCollectServer: function(event) {
    console.log("that.data.id:" + detailId)
    db.collection('collect').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        _id: detailId,
        date: new Date(),
      },
      success: function(res) {
        that.refreshLikeIcon(true)
        console.log(res)
      },
    })
  },
  /**
   * 从收藏集合中移除
   */
  removeFromCollectServer: function(event) {
    db.collection('collect').doc(detailId).remove({

      success: that.refreshLikeIcon(false),
    });
  },

  /**
   * 跳转回复页面
   */
  onReplayClick() {
    wx.navigateTo({
      url: "../replay/replay?id=" + detailId + "&openid=" + openid
    })
  }
})