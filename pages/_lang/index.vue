<template>
  <div class="root">
    <header>
      <my-header></my-header>
    </header>
    <div class="main">
      <!-- 修改地址 -->
      <div class="address">
        <!-- 修改游戏合约地址 -->
        <p>
          {{$t('address.gameContract')}}：
          <a @click="getContractObj" href="javascript:;">{{$t('address.bind')}}</a>
        </p>
        <el-input v-model="myData.gameAddress" :placeholder="$t('address.input1')"></el-input>
        <!-- 修改邀请人 -->
        <p>
          {{$t('address.inviter')}}：
          <a @click="bindInviter" href="javascript:;">{{$t('address.bind')}}</a>
        </p>
        <el-input v-model="myData.inviterAddress" :placeholder="$t('address.input2')"></el-input>
        <!-- 投注次数 -->
        <p>{{$t('address.times')}}：{{myData.rollTimes}}</p>
        <!-- 投注胜率 -->
        <p>
          {{$t('address.winRate')}}：
          {{winTimes + loseTimes === 0 
            ? Number(0).toFixed(1) 
            : ((winTimes / (winTimes + loseTimes)) * 100).toFixed(1)}}%
        </p>
        <span style="font-size: 12px; color: #666;">* {{$t('address.warn')}}</span>
      </div>
      <!-- 修改策略 -->
      <div class="config">
        <!-- dice数量 -->
        <p class="orange">{{$t('config.diceBlance')}}：{{myData.dice || dice}}</p>
        <!-- 挖矿策略 -->
        <h3 style="margin: 20px 0;">{{$t('config.mining')}}</h3>
        <!-- 刷单速度 -->
        <div>
          {{$t('config.speed')}}：
          <el-input
            :class="auth.speed ? 'speed-inp error-inp' : 'speed-inp'"
            type="number"
            v-model="myData.speed">
          </el-input>
          <span style="font-size: 12px;">{{$t('config.speedUnit')}}</span>
        </div>
        <!-- 投注区间 -->
        <div>
          {{$t('config.betSection')}}:
          <el-input
            :class="auth.betSection ? 'section-inp error-inp' : 'section-inp'"
            type="number"
            v-model="myData.betSection">
          </el-input>
        </div>
        <!-- 每单投注数量 -->
        <div>
          {{$t('config.betNum')}}:
          <el-input
            :class="auth.betNum ? 'betnum-inp error-inp' : 'betnum-inp'"
            type="number"
            v-model="myData.betNum">
          </el-input>
          <span>TRX</span>
        </div>
        <!-- 停止 -->
        <div>
          {{$t('config.stopCondition1')}}
          <el-input class="stop-inp" v-model="myData.stopTrx" type="number"></el-input>
          {{$t('config.stop')}}
        </div>
        <div>
          {{$t('config.stopCondition2')}}
          <el-input class="stop-inp" v-model="myData.stopEnergy" type="number"></el-input>
          {{$t('config.stop')}}
        </div>
        <div>
          {{$t('config.stopCondition3')}}
          <el-input type="number" class="stop-inp" v-model="myData.stopBandwidth"></el-input>
          {{$t('config.stop')}}
        </div>
        <!-- 开始挖矿 -->
        <el-button @click="run" type="primary" class="switch">{{$t('config.' + status)}}</el-button>
      </div>
      <!-- 账户信息 -->
      <div class="account">
        <h3 style="margin-bottom: 20px;">{{$t('account.h')}}</h3>
        <p>
          {{$t('account.trx')}}：
          <span>{{my.trx}} TRX</span>
        </p>
        <div>
          {{$t('account.energy')}}：
          <span>{{my.energy}}</span>
          <span>（{{$t('account.overdue')}}：{{my.energyTime}}）</span>
          <!-- <span> （{{$t('account.overdue')}}：{{my.energyTime}}）</span> -->
          <el-input type="number" v-model="freezeEnergy" class="freeze-inp" :placeholder="$t('account.freezeInputVal')"></el-input>
          <el-button @click="freeze('ENERGY')" type="primary">{{$t('account.freeze')}}</el-button>
          <el-button @click="freeze('ENERGY')">{{$t('account.unFreeze')}}</el-button>
        </div>
        <div class="bandwidth">
          {{$t('account.bandwidth')}}：
          <span>{{my.bandwidth}}</span>
          <span>（{{$t('account.overdue')}}：{{my.bandwidthTime}}）</span>
          <!-- <span> （{{$t('account.overdue')}}：{{my.bandwidthTime}}）</span> -->
          <el-input type="number" v-model="freezeBandwidth" class="freeze-inp" :placeholder="$t('account.freezeInputVal')"></el-input>
          <el-button @click="freeze('BANDWIDTH')" type="primary">{{$t('account.freeze')}}</el-button>
          <el-button @click="freeze('BANDWIDTH')">{{$t('account.unFreeze')}}</el-button>
        </div>
      </div>
    </div>
    <!-- 列表 -->
    <div class="table-box">
      <el-table
        :data="allList"
        :row-class-name="tableRowClassName"
        :default-sort="{prop: 'timestamp', order: 'descending'}"
        style="width: 100%"
        border>
        <!-- 时间 -->
        <el-table-column
          prop="timestamp"
          :label="$t('table.time')">
          <template slot-scope="scope">
            {{new Date(scope.row.timestamp).toString().split(' ')[4]}}
          </template>
        </el-table-column>
        <!-- 小于该数获胜 -->
        <el-table-column
          :label="$t('table.rollUnder')">
          <template slot-scope="scope">
            {{scope.row.result._point}}
          </template>
        </el-table-column>
        <!-- 投注 -->
        <el-table-column
          :label="$t('table.bet')">
          <template slot-scope="scope">
            {{scope.row.result._amount / Math.pow(10, 6)}} TRX
          </template>
        </el-table-column>
        <!-- 开奖号码 -->
        <el-table-column
          :label="$t('table.roll')">
          <template slot-scope="scope">
            {{scope.row.result._random}}
          </template>
        </el-table-column>
        <!-- 奖励 -->
        <el-table-column
          :label="$t('table.prize')">
          <template slot-scope="scope">
            {{scope.row.name === 'UserWin' 
              ? scope.row.result._W / Math.pow(10, 6)
              : scope.row.result._amount / Math.pow(10, 6)}} TRX
          </template>
        </el-table-column>
      </el-table>
    </div>
    
  </div>
</template>

<script>
import MyHeader from '~/components/Header'
import { mapState } from 'vuex'
import axios from 'axios'
import { get } from 'https';
import { clearInterval, setInterval } from 'timers'

export default {
  components: {
    MyHeader
  },
  data() {
    return {
      status: 'run',
      contractObj: '',
      timer: '',
      eventTimer: '',
      diceTimer: '',
      freezeEnergy: '',
      freezeBandwidth: '',
      startTime: '',
      winList: [],
      loseList: [],
      allList: [],
      eventTimes: 0,
      winTimes: 0,
      loseTimes: 0,
      allTimes: 1,
      multiple: 1,
      explainDialog: false,
      auth: {
        speed: false,
        betSection: false,
        betNum: false
      },
      my: {
        trx: 0,
        energy: 0,
        bandwidth: 0,
        energyTime: '',
        bandwidthTime: ''
      },
      myData: {
        gameAddress: 'TMYcx6eoRXnePKT1jVn25ZNeMNJ6828HWk',
        inviterAddress: '',
        rollTimes: 0,
        dice: 0,
        speed: 20,
        betSection: 50,
        betNum: 10,
        stopTrx: 1000,
        stopEnergy: 1000,
        stopBandwidth: 1000
      }
    }
  },
  mounted() {
    console.log(window)
    if (this.account.addressView) {
      this.getBalance()
      this.getDiceNum()
    }
    let listStr = localStorage.getItem('LIST')
    if (listStr) {
      this.allList = JSON.parse(listStr)
    }
  },
  watch: {
    account(n, o) {
      this.getBalance()
    }
  },
  methods: {
    // 挖矿
    run() {
      let flag = this.my.trx * 1 < this.myData.stopTrx * 1 || this.my.bandwidth * 1 < this.myData.stopBandwidth * 1
      if (this.status === 'run') {
        this.startTime = new Date().getTime() - 5 * 60 * 1000
        if (!flag && this.contractObj && this.dataAuth()) {
          this.status = 'stop'
          this.timer = setInterval(() => {this.roll()}, 60000/(this.myData.speed * 1))
          this.eventTimer = setInterval(() => {this.eventServer()}, 6000)
          this.diceTimer = setInterval(() => {this.getDiceNum()}, 60000)
        } else {
          this.$message({
            type: 'error',
            showClose: true,
            message: this.$t('config.runErr')
          })
          this.status = 'run'
          clearInterval(this.timer)
          clearInterval(this.eventTimer)
           clearInterval(this.diceTimer)
        }
      } else {
        this.status = 'run'
        clearInterval(this.timer)
        clearInterval(this.eventTimer)
        clearInterval(this.diceTimer)
      }
    },
    async roll() {
      let flag = this.my.trx * 1 < this.myData.stopTrx * 1 || this.my.bandwidth * 1 < this.myData.stopBandwidth * 1
      if (!flag) {
        this.contractObj.bet(this.myData.betSection * 1).send({
          callValue: this.tronweb.toSun(this.myData.betNum * 1)
        }).then(async res => {
          this.getBalance()
          this.myData.rollTimes++
          // let dice = await this.dicegameObj.getBalanceOf(this.account.address).call()
          // this.myData.dice = dice.toString() / Math.pow(10, 6)
          // console.log(dice)
        }).catch(err => {
          console.log(err)
        })
      } else {
        this.status = 'run'
        clearInterval(this.timer)
        clearInterval(this.eventTimer)
        clearInterval(this.diceTimer)
      }
    },
    // 查询事件服务器
    async eventServer() {
      // 拿到匹配事件返回值
      let winRes = await this.tronweb.getEventResult(
        this.myData.gameAddress,
        this.startTime,
        'UserWin'
      ).catch(err => {
        console.log(err)
      }) || []
      winRes = this.unique(winRes.filter(v => 
        v.result._addr === this.account.address.replace(/^41/,'0x')))
      let loseRes = await this.tronweb.getEventResult(
        this.myData.gameAddress,
        this.startTime,
        'UserLose'
      ).catch(err => {
        console.log(err)
      }) || []
      loseRes = this.unique(loseRes.filter(v => 
        v.result._addr === this.account.address.replace(/^41/,'0x')))
      console.log(loseRes)
      // 判断是否是第一次查询事件服务器
      if (this.eventTimes === 0) {
        this.loseList = loseRes
        this.winList = winRes
        this.allList = winRes.concat(loseRes)
        this.loseTimes = loseRes.length
        this.winTimes = winRes.length
      } else {
        this.loseTimes += this.getNewResultNum(loseRes, this.loseList)
        this.winTimes += this.getNewResultNum(winRes, this.winList)
        this.loseList = this.unique(loseRes.concat(this.loseList))
        this.winList = this.unique(winRes.concat(this.winList))
        this.allList = this.unique([...winRes, ...loseRes, ...this.allList]).slice(0, 30).reverse()
        window.localStorage.setItem('LIST', JSON.stringify(this.allList))
      }
      this.eventTimes++
    },
    // 获取合约对象
    async getContractObj() {
      if (!this.authLogin()) {
        return
      }
      if (this.myData.gameAddress) {
        this.contractObj = await this.tronweb.contract().at(this.myData.gameAddress)
        this.$message({
          type: 'success',
          showClose: true,
          message: this.$t('address.suceess')
        })
      } else {
        this.$message({
          type: 'error',
          showClose: true,
          message: this.$t('address.authGameAddress')
        })
      }
    },
    // 获取余额
    async getBalance() {
      const tronweb = this.$store.state.tronweb
      tronweb.trx.getAccount().then(res => {
        this.my.trx = res.balance / Math.pow(10, 6)
      })
      tronweb.trx.getBandwidth().then(res => {
        this.my.bandwidth = res
      })
      tronweb.trx.getAccountResources().then(res => {
        this.my.energy = res.EnergyUsed
                         ? res.EnergyLimit - res.EnergyUsed
                         : 0
      })
      if (this.account.account_resource.frozen_balance_for_energy) {
        this.my.energyTime = new Date(this.account.account_resource.frozen_balance_for_energy.expire_time).toTimeString()
      }
      if (this.account.frozen) {
        this.my.bandwidthTime = new Date(this.account.frozen[0].expire_time).toTimeString()
      }
    },
    // 冻结
    async freeze(type) {
      let count
      if (type === 'BANDWIDTH') {
        count = this.freezeBandwidth
      } else {
        count = this.freezeEnergy
      }
      let transaction = await this.tronweb.transactionBuilder.freezeBalance(count * Math.pow(10,6), "3", type,this.account.address).catch((e)=>{console.log(e.toString())});
      let signedtx = await this.tronweb.trx.sign(transaction);
      let result = await this.tronweb.trx.sendRawTransaction(signedtx);
      if (result.result) {
        this.$message({
          type: 'success',
          showClose: true,
          message: this.$t('account.freezeSuccess')
        })
      }
    },
    // 解冻
    async unfreeze(type) {
      let count
      if (type === 'BANDWIDTH') {
        count = this.freezeBandwidth
      } else {
        count = this.freezeEnergy
      }
      let transaction = await this.tronweb.transactionBuilder.unfreezeBalance(count * Math.pow(10,6), "3", type,this.account.address).catch((e)=>{console.log(e.toString())});
      let signedtx = await this.tronweb.trx.sign(transaction);
      let result = await this.tronweb.trx.sendRawTransaction(signedtx);
       if (result.result) {
        this.$message({
          type: 'success',
          showClose: true,
          message: this.$t('account.unfreezeSuccess')
        })
      }
    },
    // 绑定邀请人
    bindInviter() {
      if (!this.authLogin()) {
        return
      }
      if (!this.myData.gameAddress) {
        return this.$message({
          type: 'error',
          showClose: true,
          message: this.$t('address.authGameAddress')
        })
      }
      if (!this.myData.inviterAddress) {
        return this.$message({
          type: 'error',
          showClose: true,
          message: this.$t('address.authInviteAddress')
        })
      }
      this.bindInviterServer()
    },
    bindInviterServer() {
      axios({
        url: 'http://47.90.189.80:9080/auth/user/addUserInvite',
        method: 'post',
        data: {
          dappId: '1',
          contractAddress: this.myData.gameAddress,
          inviterAddress: this.myData.inviterAddress,
          inviteeAddress: this.$store.state.account.address
        }
      }).then(res => {
        if (res.code === '0') {
          this.$message({
            type: 'success',
            showClose: true,
            message: this.$t('address.suceess')
          })
        }
      })
    },
    // 获取dice数量
    getDiceNum() {
      axios({
        url: 'http://wlcyapi.tronscan.org/api/mine/'+ this.myData.gameAddress +'/status/' + this.account.addressView,
        method: 'get'
      }).then(res => {
        let data = res.data || {}
        console.log(data)
        this.myData.dice = data.TotalMine || '0'
      })
    },
    tableRowClassName({row, rowIndex}) {
      if (row.name === 'UserWin') {
        return 'win-row';
      } else {
        return 'lose-row';
      }
    },
    // login auth
    authLogin() {
      let res = true
      if (!this.account) {
        this.$message({
          type: 'error',
          showClose: true,
          message: this.$t('login.authLogin')
        })
        res = false
      }
      return res
    },
    // 数据验证
    dataAuth() {
      let data = this.myData
      let res = true
      if (data.speed < 1 || data.speed > 20) {
        res = false
        this.auth.speed = true
      } else {
        this.auth.speed = false
      }
      if (data.betSection < 2 || data.betSection > 96) {
        res = false
        this.auth.betSection = true
      } else {
        this.auth.betSection = false
      }
      if (data.betNum < 10 || data.betNum > 10000) {
        res = false
        this.auth.betNum = true
      } else {
        this.auth.betNum = false
      }
      return res
    },
    // 数组去重
    unique(arr) {
      let res = []
      let obj = {}
      for (let i = 0, l = arr.length; i < l; i++) {
        if (!obj[arr[i].transaction]) {
          obj[arr[i].transaction] = '1'
          res.push(arr[i])
        }
      }
      return res
    },
    // 获取新数据的输赢次数
    getNewResultNum(nArr, oArr) {
      let res = 0
      for (let i = 0, l = nArr.length; i < l; i++) {
        let isEqual = false
        for (let n = 0, nl = oArr.length; n < nl; n++) {
          if (JSON.stringify(nArr[i]) === JSON.stringify(oArr[n])) {
            isEqual = true
            break
          }
        }
        if (!isEqual) {
          res++
        }
      }
      return res
    }
  },
  computed: {
    ...mapState(['account', 'tronweb', 'dicegameObj', 'dice'])
  }
}
</script>

<style lang="scss">
.root {
  font-size: 14px;
  color: #333;
  .main {
    padding: 30px 10px;
    overflow: hidden;
    > div {
      position: relative;
      padding: 10px;
      width: 32%;
      float: left;
      border-radius: 6px;
      background-color: #f8f9fb;
      box-shadow: 0px 5px 10px #eee;
      margin-right: 20px;
      .el-input {
        input {
          height: 35px;
          line-height: 35px;
          font-size: 13px;
          border: 0 none;
        }
        input:focus {
          border: 1px solid #409EFF;
        }
      }
      > p, > div {
        margin: 10px 0;
      }
    }
    > div:last-child {
      margin-right: 0px;
    }
    .config {
      .speed-inp {
        width: 100px;
      }
      .section-inp {
        width: 100px;
      }
      .betnum-inp {
        width: 100px;
      }
      .stop-inp {
        width: 100px;
      }
      .switch {
        margin-top: 20px;
        position: relative;
        left: 50%;
        transform: translateX(-50%);
      }
      .error-inp {
        border: 1px solid red;
        border-radius: 4px;
      }
    }
    .account {
      .freeze-inp {
        display: block;
        margin: 10px 0;
      }
      .bandwidth {
        margin-top: 30px;
      }
    }
  }
  .table-box {
    .el-table {
      box-shadow: 0px 0px 15px #eee;
    }
    thead {
      th {
        border: 0 none;
        color: #666;
        background: #eee;
      }
    }
    padding: 20px;
  }
  .orange {
    color: orange;
  }
  .lose-row {
    .cell {
      color: red;
    }
  }
  .win-row {
    .cell {
      color: green;
    }
  }
}
</style>
