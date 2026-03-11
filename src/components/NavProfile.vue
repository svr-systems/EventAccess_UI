<template>
  <v-dialog v-model="dialogModel" persistent scrim="black" max-width="420">
    <v-card
      class="pa-4 text-center"
      elevation="24"
      :loading="isLoading"
      :disabled="isLoading"
    >
      <v-row dense>
        <v-col cols="12" class="text-right">
          <v-btn
            icon
            variant="text"
            size="x-small"
            :disabled="isLoading"
            @click.prevent="dialogModel = false"
          >
            <v-icon>mdi-close</v-icon>
            <v-tooltip activator="parent" location="bottom">Cerrar</v-tooltip>
          </v-btn>
        </v-col>

        <v-col cols="12">
          <b>
            <small>{{ user?.email || "Correo" }}</small>
          </b>
        </v-col>

        <v-col cols="12">
          <v-avatar size="100">
            <v-img v-if="user?.avatar_b64" :src="user.avatar_b64" />
            <v-icon v-else size="120">mdi-account-circle</v-icon>
          </v-avatar>
        </v-col>

        <v-col cols="12">
          <span class="font-weight-medium">{{ user?.full_name }}</span>
        </v-col>

        <v-col cols="12" class="pt-4">
          <v-btn
            block
            color="transparent"
            class="text-none"
            :loading="isLoading"
            @click="logout"
          >
            Cerrar Sesión
            <v-icon end>mdi-logout</v-icon>
          </v-btn>
        </v-col>

        <v-col cols="12">
          <Footer />
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, inject } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

import { useStore } from "@/store";
import { URL_API } from "@/utils/config";
import { getHdrs, getErr } from "@/utils/http";

import Footer from "./Footer.vue";

const props = defineProps({ modelValue: Boolean });
const emit = defineEmits(["update:modelValue"]);

const store = useStore();
const router = useRouter();
const alert = inject("alert");

const isLoading = ref(false);

const user = computed(() => store.getUser);
const token = computed(() => store.getAuth?.token || null);

const dialogModel = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const logout = async () => {
  isLoading.value = true;

  try {
    const endpoint = `${URL_API}/v1/auth/logout`;

    if (token.value) {
      await axios.post(endpoint, {}, getHdrs({ token: token.value }));
    }

    store.logoutAction();
    await router.replace({ name: "login" });
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));

    store.logoutAction();
    await router.replace({ name: "login" });
  } finally {
    isLoading.value = false;
    dialogModel.value = false;
  }
};
</script>
