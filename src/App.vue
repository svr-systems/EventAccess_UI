<template>
  <v-app>
    <Alert ref="alert" />
    <Confirm ref="confirm" />
    <TicketHeader v-if="shouldShowPublicHeaderFooter" />

    <NavBar v-if="hasAuth" />

    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
    <TicketFooter v-if="shouldShowPublicHeaderFooter" />
  </v-app>
</template>

<script setup>
import { ref, computed, provide } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "@/store";
import Alert from "@/components/Alert.vue";
import Confirm from "@/components/Confirm.vue";
import NavBar from "@/components/NavBar.vue";
import TicketHeader from "@/components/TicketHeader.vue";
import TicketFooter from "@/components/TicketFooter.vue";

const store = useStore();
const route = useRoute();
const alert = ref(null);
const confirm = ref(null);
const hasAuth = computed(() => !!store.getAuth?.token);

const shouldShowPublicHeaderFooter = computed(() => {
  return !hasAuth.value && route.meta?.showPublicHeaderFooter === true;
});

provide("alert", {
  show: (color, msg) => alert.value?.show(color, msg),
});

provide("confirm", {
  show: (options) => confirm.value?.show(options),
});
</script>

<style>
@import "@/style.css";
</style>
