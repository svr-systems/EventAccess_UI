import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { es } from "vuetify/locale";

import { VDateInput } from "vuetify/labs/VDateInput";

import "@mdi/font/css/materialdesignicons.css";

import App from "./App.vue";
import router from "@/router";
import { useStore } from "@/store";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp(App);
app.use(pinia);

const store = useStore();

const vuetify = createVuetify({
  components: {
    ...components,
    VDateInput,
  },
  directives,
  theme: {
    defaultTheme: store.conf.theme_dark ? "dark" : "light",
  },
  locale: {
    locale: "es",
    fallback: "es",
    messages: { es },
  },
});

const themeName = store.conf.theme_dark ? "dark" : "light";

if (typeof vuetify.theme?.change === "function") {
  vuetify.theme.change(themeName);
} else {
  vuetify.theme.global.name.value = themeName;
}

app.use(vuetify);
app.use(router);
app.mount("#app");
