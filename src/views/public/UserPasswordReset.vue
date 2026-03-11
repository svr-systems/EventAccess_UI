<template>
  <v-row justify="center">
    <v-col cols="12" md="4" class="mt-11">
      <v-card
        elevation="24"
        class="py-4 px-4"
        :loading="isLoading"
        :disabled="isLoading"
      >
        <v-card-text class="text-center">
          <v-row dense>
            <v-col cols="12">
              <PublicHeader>
                <div class="text-caption text-medium-emphasis mt-2">
                  Restablecer contraseña
                </div>
              </PublicHeader>
            </v-col>

            <v-col v-if="!item && !isLoading" cols="12" class="pt-2">
              <v-icon size="48" color="warning">mdi-alert-circle</v-icon>
              <p class="py-2">
                {{ statusMessage || "La acción no es procesable." }}
              </p>
            </v-col>

            <v-col v-if="!item && isLoading" cols="12" class="pt-2">
              <p class="py-2">Validando información...</p>
              <div>
                <v-progress-circular size="18" indeterminate />
              </div>
            </v-col>

            <v-col v-else-if="item" cols="12">
              <v-form
                v-if="!success"
                ref="formRef"
                autocomplete="off"
                @submit.prevent="resetAction"
              >
                <v-row dense>
                  <v-col cols="12">
                    <VisVal label="Correo" :value="item.email" />
                  </v-col>

                  <v-col cols="12">
                    <VisVal label="Nombre" :value="item.full_name" />
                  </v-col>

                  <v-col cols="12" class="text-left">
                    <InpPassword
                      v-model="item.password"
                      label="Nueva contraseña"
                      counter
                      :rules="rules.passwordRequired"
                      autocomplete="off"
                      hide-details
                    />
                  </v-col>

                  <v-col cols="12" class="pt-2">
                    <v-btn
                      block
                      color="success"
                      type="submit"
                      class="text-none"
                      :loading="isLoading"
                    >
                      Restablecer
                      <v-icon end>mdi-update</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-form>

              <v-row v-else dense>
                <v-col cols="12" class="pt-2">
                  <v-icon size="32" color="success">mdi-check-circle</v-icon>
                </v-col>

                <v-col cols="12">
                  <div class="text-body-2">
                    La contraseña de tu cuenta ha sido restablecida
                    correctamente.
                  </div>

                  <div class="text-caption text-medium-emphasis mt-3">
                    Serás redireccionado en breve.
                  </div>

                  <div>
                    <v-progress-circular size="16" indeterminate />
                  </div>
                </v-col>
              </v-row>
            </v-col>

            <v-col cols="12">
              <Footer />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, inject, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";

import { useStore } from "@/store";
import { URL_API } from "@/utils/config";
import { getHdrs, getErr, getRsp } from "@/utils/http";
import { toStorePayload } from "@/utils/helpers";
import { getRules } from "@/utils/validators";

import PublicHeader from "@/components/PublicHeader.vue";
import Footer from "@/components/Footer.vue";
import VisVal from "@/components/VisVal.vue";
import InpPassword from "@/components/InpPassword.vue";

const alert = inject("alert");
const router = useRouter();
const route = useRoute();
const store = useStore();

const token = route.params.id;

const isLoading = ref(true);
const statusMessage = ref("");

const formRef = ref(null);
const item = ref(null);
const success = ref(false);

const rules = getRules();

const getItem = async () => {
  isLoading.value = true;

  try {
    const endpoint = `${URL_API}/v1/public/auth/password/reset/${token}`;
    const response = await axios.get(endpoint, getHdrs());

    const rsp = getRsp(response);
    const data_item = rsp?.data?.item;

    item.value = data_item ? { ...data_item, password: "" } : null;
    statusMessage.value = "";
  } catch (err) {
    item.value = null;
    statusMessage.value = getErr(err);
  } finally {
    isLoading.value = false;
  }
};

const resetAction = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  isLoading.value = true;

  try {
    let endpoint = `${URL_API}/v1/public/auth/password/reset/${token}`;

    const resetPayload = toStorePayload({
      password: item.value?.password,
    });

    await axios.post(endpoint, resetPayload, getHdrs());
    success.value = true;

    endpoint = `${URL_API}/v1/public/auth/login`;

    const loginPayload = toStorePayload({
      email: item.value?.email,
      password: item.value?.password,
    });

    const response = await axios.post(endpoint, loginPayload, getHdrs());

    const rsp = getRsp(response);
    const auth = rsp?.data?.auth;

    await store.loginAction(auth);

    setTimeout(async () => {
      await router.replace({ name: "home" });
    }, 1200);
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  if (store.getAuth?.token) {
    router.replace({ name: "home" });
    return;
  }

  getItem();
});
</script>
