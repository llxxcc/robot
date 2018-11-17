export const state = () => ({
  locales: ['en', 'zh'],
  locale: 'en',
  privateKey: '',
  account: '',
  tronweb: '',
  contractObj: '',
  dicegameObj: '',
  dice: ''
})

export const mutations = {
  SET_LANG(state, locale) {
    if (state.locales.indexOf(locale) !== -1) {
      state.locale = locale
    }
  },
  SET_PKEY(state, privateKey) {
    state.locale = privateKey
  },
  SET_ACCOUNT(state, account) {
    state.account = account
  },
  SET_TRONWEB(state, tronweb) {
    state.tronweb = tronweb
  },
  SET_CONTRACTOBJ(state, contractObj) {
    state.contractObj = contractObj
  },
  SET_DICEGAME(state, dicegameObj) {
    state.dicegameObj = dicegameObj
  },
  SET_DICE(state, dice) {
    state.dice = dice
  }
}
