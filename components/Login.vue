<template>
  <el-dialog
    :title="$t('login.title')"
    :visible.sync="loginVisible"
    width="30%"
    @close="close"
    center>
    <el-input v-model="privateKey" :placeholder="$t('login.placeholder')"></el-input>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">{{$t('login.cancel')}}</el-button>
      <el-button @click="login" type="primary">{{$t('login.login')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
const netServer = 'https://api.shasta.trongrid.io'
const TronWeb = require('TronWeb')
const HttpProvider = TronWeb.providers.HttpProvider
const fullNode = new HttpProvider(netServer)
const solidityNode = new HttpProvider(netServer)
const eventServer = netServer
const dicegame = 'TJXXTjz6bzhijYC55hrFvvuEeyaNDGrETg'

export default {
  props: {
    visible: Boolean
  },
  data() {
    return {
      loginVisible: this.visible,
      privateKey: '',
      tronweb: {},
      dicegameObj: ''
    }
  },
  created() {
  },
  methods: {
    close() {
      this.loginVisible = false
      this.$emit('update:visible', this.loginVisible)
    },
    async login() {
      const privateKey = this.privateKey
      if (privateKey) {
        this.tronweb = new TronWeb(
          fullNode,
          solidityNode,
          eventServer,
          privateKey
        )
        this.$store.commit('SET_TRONWEB', this.tronweb)
        this.tronweb.trx.getAccount().then(res => {
          if (res.address) {
            res.addressView = this.tronweb.address.fromHex(res.address)
            this.$store.commit('SET_ACCOUNT', res)
            this.tronweb.contract().at(dicegame).then(sRes => {
              this.dicegameObj = sRes
              this.$store.commit('SET_DICEGAME', this.dicegameObj)
              // 获取dice
              this.dicegameObj.getBalanceOf(res.address.replace('/^41/','0x')).call().then(ssRes => {
                this.$store.commit('SET_DICE', ssRes.toString() / Math.pow(10, 6))
              })
            })
            this.close()
            this.$message({
              showClose: true,
              message: this.$t('login.successMsg'),
              type: 'success'
            });
          } else {
            this.$message({
              type: 'error',
              showClose: true,
              message: this.$t('login.loginErrMsg')
            })
          }
        })
      } else {
        this.$message({
          showClose: true,
          message: this.$t('login.errMsg'),
          type: 'error'
        });
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
