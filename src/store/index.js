import { defineStore } from "pinia";

export const useStore = defineStore("auth", {
  state: () => ({
    auth: null,
    conf: {
      theme_dark: true,
    },
  }),

  getters: {
    getAuth: (state) => state.auth,
    getConf: (state) => state.conf,
    getUser: (state) => state.auth?.user || null,
  },

  actions: {
    loginAction(auth) {
      this.auth = auth;
    },

    logoutAction() {
      this.auth = null;
    },

    themeDarkAction() {
      this.conf.theme_dark = !this.conf.theme_dark;
    },

    setThemeDarkAction(is_dark) {
      this.conf.theme_dark = !!is_dark;
    },

    profileAction(user) {
      if (this.auth) {
        this.auth.user = user;
      }
    },
  },

  persist: true,
});
