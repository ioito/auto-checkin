const axios = require('axios')
const common = require('../common')
const config = require('../config')

const formatResult = common.formatResult
const Msg = common.Msg

const JUE_JIN_COOKIE = config.JUE_JIN_COOKIE
const JUE_JIN_COOKIE2 = config.JUE_JIN_COOKIE2

class JueJin {
  checkUrl = `https://api.juejin.cn/growth_api/v1/check_in`
  drawUrl = `https://api.juejin.cn/growth_api/v1/lottery/draw`

  constructor() {
    this.instance = axios.create()
  }

  async init() {
    const checkRes = await this.getCheckData()
    const checkResult = await formatResult(this.getClassName(), checkRes.msg)
    Msg.push(checkResult)

    // if (checkRes.status !== 0) return ;

    const drawRes = await this.getDrawData()
    const drawResult = await formatResult(this.getClassName(), drawRes.msg)
    Msg.push(drawResult)
  }

  getClassName() {
    return JueJin.name
  }

  async getCheckData() {
    const res = await this.instance({
      url: this.checkUrl, 
      method: 'post',
      headers: {'cookie': JUE_JIN_COOKIE}
    })
    
    const res2 = await this.instance({
      url: this.checkUrl, 
      method: 'post',
      headers: {'cookie': JUE_JIN_COOKIE2}
    })

    try {
      if (res.status === 200) {
        return {
          status: res.data.err_no,
          msg: '1签到结果：' + res.data.err_msg + '2签到结果：' + res2.data.err_msg,
        }
      }

    } catch (e) {
      return e
    }
  }

  async getDrawData() {
    const res = await this.instance({
      url: this.drawUrl, 
      method: 'post',
      headers: {'cookie': JUE_JIN_COOKIE}
    })
    
    const res2 = await this.instance({
      url: this.drawUrl, 
      method: 'post',
      headers: {'cookie': JUE_JIN_COOKIE2}
    })

    try {
      if (res.status === 200) {
        return {
          status: res.data.err_no,
          msg: '1抽奖结果：' + (res.data.err_no === 0 ? res.data.data.lottery_name : res.data.err_msg) + '2抽奖结果：' + (res2.data.err_no === 0 ? res2.data.data.lottery_name : res2.data.err_msg),
        }
      }

    } catch (e) {
      return e
    }
  }
}

module.exports = JueJin
