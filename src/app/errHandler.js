module.exports = (err, ctx) => {
  // 控制台打印错误信息
  console.error(err)
  // 将错误信息统一返回
  ctx.body = err
}
