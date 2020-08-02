// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  try{
    return  await db.collection('tab_share').add({
      data:{
        yw_id:event.yw_id,
        share_page_url:event.share_page_url,
        crt_date:new Date(),
        crt_id:wxContext.OPENID,
        state:0
      },success:res=>{
        console.log(res)
        
      }
    })
  }catch(e){
    console.log(e)
  }
}