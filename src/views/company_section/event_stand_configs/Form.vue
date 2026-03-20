<template>
  <v-card elevation="24" :disabled="isLoading" :loading="isLoading">
    <v-card-title class="d-flex align-center justify-space-between">
      <div class="d-flex align-center">
        <BtnBack
          :route="
            !isStoreMode
              ? {
                  name: routeName + '/show',
                  params: {
                    id: getEncodeId(itemId),
                    event: getEncodeId(eventId),
                    stand_type: getEncodeId(stand_typeId),
                  },
                }
              : {
                  name: routeName,
                  params: {
                    event: getEncodeId(eventId),
                    stand_type: getEncodeId(stand_typeId),
                  },
                }
          "
        />
        <CardTitle :text="$route.meta.title" :icon="$route.meta.icon" />
      </div>

      <div />
    </v-card-title>

    <v-card-text v-if="item">
      <v-form ref="formRef" autocomplete="off" @submit.prevent="handleAction">
        <v-row>
          <v-col cols="12">
            <v-card>
              <v-card-title class="d-flex align-center justify-space-between">
                <div class="d-flex align-center">
                  <CardTitle text="DATOS GENERALES" sub />
                </div>

                <div />
              </v-card-title>

              <v-card-text>
                <v-row dense>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="item.price"
                      label="Precio"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="50"
                      counter
                      :rules="rules.textRequired"
                      autocomplete="off"
                    />
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="item.capacity"
                      label="Capacidad"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="50"
                      counter
                      :rules="rules.textRequired"
                      autocomplete="off"
                    />
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="item.size_length"
                      label="Largo del estante"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="50"
                      counter
                      :rules="rules.textRequired"
                      autocomplete="off"
                    />
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="item.size_width"
                      label="Ancho del estante"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="50"
                      counter
                      :rules="rules.textRequired"
                      autocomplete="off"
                    />
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="item.size_height"
                      label="Alto del estante"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="50"
                      counter
                      :rules="rules.textRequired"
                      autocomplete="off"
                    />
                  </v-col>

                  <v-col cols="12" md="2">
                    <v-switch
                      v-model="item.has_electricity"
                      label="¿Tiene electricidad?"
                      color="primary"
                      density="compact"
                      hide-details="auto"
                      inset
                    />
                  </v-col>

                  <v-col cols="12" md="2">
                    <v-switch
                      v-model="item.has_water"
                      label="¿Tiene agua?"
                      color="primary"
                      density="compact"
                      hide-details="auto"
                      inset
                    />
                  </v-col>

                  <v-col cols="12" md="2">
                    <v-switch
                      v-model="item.has_internet"
                      label="¿Tiene internet?"
                      color="primary"
                      density="compact"
                      hide-details="auto"
                      inset
                    />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12">
            <div class="text-right">
              <v-btn
                type="submit"
                icon
                variant="flat"
                size="x-small"
                :color="isStoreMode ? 'success' : 'warning'"
                :loading="isLoading"
              >
                <v-icon>mdi-check</v-icon>
                <v-tooltip activator="parent" location="left">
                  Continuar
                </v-tooltip>
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, inject, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";

import { useStore } from "@/store";
import { URL_API } from "@/utils/config";
import { getHdrs, getErr, getRsp } from "@/utils/http";
import { getDecodeId, getEncodeId } from "@/utils/coders";
import { getRules } from "@/utils/validators";
import { getUserObj } from "@/utils/objects";
import { b64ToFile, getFormData, toStorePayload } from "@/utils/helpers";

import BtnBack from "@/components/BtnBack.vue";
import CardTitle from "@/components/CardTitle.vue";
import BtnDocPreview from "@/components/BtnDocPreview.vue";

const routeName = "event_stand_configs";

const alert = inject("alert");
const confirm = inject("confirm");
const store = useStore();
const router = useRouter();
const route = useRoute();

const itemId = ref(route.params.id ? getDecodeId(route.params.id) : null);
const eventId = ref(
  route.params.event ? getDecodeId(route.params.event) : null
);
const stand_typeId = ref(
  route.params.stand_type ? getDecodeId(route.params.stand_type) : null
);

const isStoreMode = ref(!itemId.value);

const isLoading = ref(true);
const formRef = ref(null);
const item = ref(null);

const rules = getRules();

const ticket_types = ref([]);
const ticket_typesLoading = ref(true);

const authHdrs = (useFormData = false) =>
  getHdrs({ token: store.getAuth?.token, useFormData });

const getItem = async () => {
  if (isStoreMode.value) {
    item.value = {
      capacity: null,
      price: null,
      size_lengh: null,
      size_widh: null,
      size_height: null,
      has_electricity: false,
      has_water: false,
      has_internet: false,
      stand_type_id: stand_typeId.value,
    };
    isLoading.value = false;
    return;
  }

  try {
    const endpoint = `${URL_API}/v1/company/events/event_stand_configs/${itemId.value}`;
    const response = await axios.get(endpoint, authHdrs());

    item.value = getRsp(response)?.data?.item || null;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

const handleAction = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) {
    alert?.show("red-darken-1", "Revisa los detalles señalados");
    return;
  }

  const confirmed = await confirm?.show(
    `¿Confirma ${isStoreMode.value ? "agregar" : "editar"} registro?`
  );
  if (!confirmed) return;

  isLoading.value = true;

  try {
    const payloadItem = { ...item.value };

    if (payloadItem.has_electricity !== undefined) {
      payloadItem.has_electricity = payloadItem.has_electricity ? 1 : 0;
    }

    if (payloadItem.has_water !== undefined) {
      payloadItem.has_water = payloadItem.has_water ? 1 : 0;
    }

    if (payloadItem.has_internet !== undefined) {
      payloadItem.has_internet = payloadItem.has_internet ? 1 : 0;
    }

    const payload = toStorePayload(payloadItem, isStoreMode.value);
    const formData = getFormData(payload);

    const endpoint = `${URL_API}/v1/company/events/event_stand_configs${
      isStoreMode.value ? "" : `/${itemId.value}`
    }`;

    const response = await axios.post(endpoint, formData, authHdrs(true));

    const rsp = getRsp(response);
    alert?.show("success", rsp?.message || "Operación exitosa");

    router.push({
      name: `${routeName}/show`,
      params: {
        id: getEncodeId(isStoreMode.value ? rsp?.data?.item?.id : itemId.value),
        event: getEncodeId(eventId.value),
        stand_type: getEncodeId(stand_typeId.value),
      },
    });
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  getItem();
});
</script>
