<template>
  <v-app>
    <Alert ref="alert" />
    <Confirm ref="confirm" />

    <NavBar v-if="hasAuth" />

    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed, provide } from "vue";
import { useStore } from "@/store";
import Alert from "@/components/Alert.vue";
import Confirm from "@/components/Confirm.vue";
import NavBar from "@/components/NavBar.vue";

const store = useStore();
const alert = ref(null);
const confirm = ref(null);
const hasAuth = computed(() => !!store.getAuth?.token);

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
