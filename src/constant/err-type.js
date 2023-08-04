module.exports = {
  TokenExpired: {
    msg: '登录过期，请重新登录',
    code: 401
  },
  TokenNotFound: {
    msg: 'token错误或未携带token',
    code: 401
  },
  UserFormatError: {
    msg: '用户名或者密码为空',
    code: 510
  },
  UserMessageNotFound: {
    code: 510,
    msg: '用户不存在'
  },
  UserMessageError: {
    msg: '用户名或者密码错误',
    code: 510
  },
  UserNameisExisted: {
    msg: '用户名已经存在',
    code: 510
  }
}
