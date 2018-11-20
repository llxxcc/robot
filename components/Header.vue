<template>
  <div class="root">
    <h1>Dicerobot Beta</h1>
    <div class="language" @click="toggleLangMenu">
      <span>{{langView}}</span>
      <i v-if="!showLangMenu" class="el-icon-arrow-down"></i>
      <i v-else class="el-icon-arrow-up"></i>
    </div>
    <div class="language-menu" v-if="showLangMenu">
      <nuxt-link
        class="item"
        v-for="(v, k) in langMap"
        :to="'/' + k"
        :key="k">
        {{v}}
      </nuxt-link>
    </div>
    <span
      v-if="account && account.address"
      class="account">
      {{account.addressView}}
    </span>
    <el-button
      v-else
      class="btn-login"
      @click="loginDialog = true"
      type="primary">
      {{$t('header.loginBtn')}}
    </el-button>
    <a @click="explainDialog = true" class="explain" href="javascript:;">{{$t('explain.btn')}}</a>
    <Login v-if="loginDialog" :visible.sync="loginDialog"/>
    <!-- 使用说明 -->
    <el-dialog
      :title="$t('explain.title')"
      :visible.sync="explainDialog"
      width="40%">
      <p>{{$t('explain.p1')}}</p>
      <p>{{$t('explain.p2')}}</p>
      <p>{{$t('explain.p3')}}</p>
      <p>{{$t('explain.p4')}}</p>
      <p>{{$t('explain.p5')}}</p>
      <p>{{$t('explain.p6')}}</p>
      <p>{{$t('explain.p7')}}</p>
      <p>{{$t('explain.p8')}}</p>
      <p>{{$t('explain.p9')}}</p>
      <p>{{$t('explain.p10')}}</p>
      <p style="margin-top: 20px;">
        {{$t('explain.p11')}}
        <span style="color: red;">{{$t('explain.p12')}}</span>
        {{$t('explain.p13')}}
      </p>
    </el-dialog>
  </div>
</template>

<script>
import Login from '~/components/Login'
import { mapState } from 'vuex'

export default {
  components: {
    Login
  },
  data () {
    return {
      loginDialog: false,
      langView: 'EN',
      langMap: {
        en: 'EN',
        zh: '中文'
      },
      showLangMenu: false,
      explainDialog: false
    }
  },
  created() {
    this.setLang()
  },
  methods: {
    toggleLangMenu() {
      this.showLangMenu = !this.showLangMenu
    },
    setLang() {
      this.langView = this.langMap[this.$store.state.locale]
    }
  },
  computed: {
    ...mapState(['account'])
  }
}
</script>

<style lang="scss" scoped>
.root {
  position: relative;
  width: 100%;
  height: 70px;
  line-height: 70px;
  padding: 0 2%;
  box-shadow: 5px 0px 10px #999;
  >h1 {
    display: inline;
  }
  .btn-login {
    height: 35px;
    padding: 10px 20px;
    margin-top: 15px;
    float: right;
  }
  .account {
    float: right;
  }
  .language {
    float: right;
    text-align: center;
    width: 100px;
    cursor: pointer;
  }
  .language-menu {
    width: 100px;
    position: absolute;
    top: 65px;
    right: 2%;
    border: 1px solid #ccc;
    background-color: #fff;
    z-index: 1;
    .item {
      display: block;
      width: 100%;
      height: 40px;
      padding-left: 10%;
      line-height: 40px;
      border-bottom: 1px solid #ccc;
      color: #000;
      text-decoration: none;
      cursor: pointer;
    }
    .item:hover {
      color: skyblue;
    }
  }
  p {
    line-height: 25px;
  }
  .explain {
    float: right;
    margin-right: 20px;
    font-size: 16px;
  }
}
</style>
