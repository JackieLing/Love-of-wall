// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async(event, context) => {
  let {
    type,
    detailId
  } = event
  switch (type) {
    case 'topic':
      {
        return getTopic(detailId)
      }
    case 'replay':
      {
        return getreplay(detailId)
      }
    default:
      {
        return
      }
  }
}

// 获取回复列表
async function getreplay(detailId) {
  try {
    return await db.collection('replay').where({
        t_id: "" + detailId
      })
      .get({
        success: function(res) {
          return res;
        },
        fail: function(res) {
          return res;
        }
      })
  } catch (e) {
    console.error(e)
  }
}
//获取详情数据
async function getTopic(detailId) {
  try {
    return await db.collection('topic').doc("" + detailId)
      .get({
        success: function(res) {
          return res;
        },
        fail: function(res) {
          return res;
        }
      })
  } catch (e) {
    console.error(e)
  }
}
