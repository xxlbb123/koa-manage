const jwt = require('jsonwebtoken')
const {TokenExpired,TokenNotFound} =require("../constant/err-type")
// 导入token密钥
const {secret} =require("../constant/secretKey")
class JWt{
  // 创建token
  static createToken (info){
    const token = jwt.sign(info, secret, {
      expiresIn: 60 * 60 * 24 * 3
    })
    return token
  }

  // 检验token是否过期
  async handleTokenExpired (ctx,next){
      await next().catch((err)=>{
         if (err.name==="TokenExpiredError"){
          err.status=401
          ctx.body= TokenExpired
         }else{
           throw err
         }
      })
  }
  // 检验是否存在token
  async handleTokenNotFound (ctx,next){
      await next().catch((err)=>{
        if(err.name==="UnauthorizedError" && 
          err.message==="No authorization token found"){
              ctx.status=401
              ctx.body=TokenNotFound               
        }else{
           throw err
        }
      })
  } 
}
module.exports=new JWt()


