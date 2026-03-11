<template>
  <v-card elevation="24" :disabled="isLoading" :loading="isLoading">
    <v-card-title class="d-flex align-center justify-space-between">
      <div class="d-flex align-center">
        <BtnBack
          :route="
            !isStoreMode
              ? {
                  name: routeName + '/show',
                  params: { id: getEncodeId(itemId) },
                }
              : { name: routeName, params: { id: getEncodeId(companyId) } }
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
                      v-model="item.name"
                      label="Nombre del evento"
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
                      v-model="item.description"
                      label="Descripción *"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="50"
                      counter
                      :rules="rules.textOptional"
                      autocomplete="off"
                    />
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="item.flyer"
                      label="Flyer *"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="60"
                      counter
                      :rules="rules.textOptional"
                      autocomplete="off"
                    />
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="item.sale_start_at"
                      label="Inicio de venta de boletos"
                      type="datetime-local"
                      variant="outlined"
                      density="compact"
                      :rules="rules.textOptional"
                    />
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="item.sale_end_at"
                      label="Fin de venta de boletos"
                      type="datetime-local"
                      variant="outlined"
                      density="compact"
                      :rules="rules.textOptional"
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <div class="d-flex align-start ga-2">
                      <div class="flex-grow-1">
                        <v-file-input
                          v-model="item.logo_doc"
                          label="Logo *"
                          variant="outlined"
                          density="compact"
                          prepend-icon=""
                          show-size
                          accept=".png,.jpg,.jpeg"
                          :rules="rules.imageOptional"
                        />
                      </div>

                      <div v-if="item.logo_doc" class="pt-1 flex-shrink-0">
                        <BtnDocPreview
                          :file="item.logo_doc"
                          tooltip="Ver"
                          variant="outlined"
                        />
                      </div>
                    </div>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-switch
                      v-model="item.is_public"
                      label="Evento público"
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
            <v-card>
              <v-card-title class="d-flex align-center justify-space-between">
                <div class="d-flex align-center">
                  <CardTitle text="DIRECCIÓN" sub />
                </div>

                <div />
              </v-card-title>

              <v-card-text>
                <v-row dense>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="item.place_name"
                      label="Nombre del lugar"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="60"
                      counter
                      :rules="rules.textRequired"
                      autocomplete="off"
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="item.address"
                      label="Dirección"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="60"
                      counter
                      :rules="rules.textRequired"
                      autocomplete="off"
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="item.latitude"
                      label="Latitud *"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="60"
                      counter
                      :rules="rules.textOptional"
                      autocomplete="off"
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="item.longitude"
                      label="Longitud *"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="60"
                      counter
                      :rules="rules.textOptional"
                      autocomplete="off"
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

const routeName = "company_section_events";

const alert = inject("alert");
const confirm = inject("confirm");
const store = useStore();
const router = useRouter();
const route = useRoute();

const itemId = ref(route.params.id ? getDecodeId(route.params.id) : null);
const companyId = ref(
  route.params.company ? getDecodeId(route.params.company) : null
);
const isStoreMode = ref(!itemId.value);

const isLoading = ref(true);
const formRef = ref(null);
const item = ref(null);

const rules = getRules();

const roles = ref([]);
const rolesLoading = ref(true);

const authHdrs = (useFormData = false) =>
  getHdrs({ token: store.getAuth?.token, useFormData });

const formatDate = (dateString) => {
  if (!dateString) return null;

  if (dateString.match(/^\d{4}-\d{2}-\d{2}/)) return dateString;

  const parts = dateString.split(" ")[0].split("/");
  if (parts.length === 3) {
    const [day, month, year] = parts;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  return dateString;
};

const getItem = async () => {
  if (isStoreMode.value) {
    item.value = {
      name: null,
      description: null,
      place_name: null,
      address: null,
      latitude: null,
      longitude: null,
      logo_path: null,
      logo_doc: null,
      flyer: null,
      is_public: 0,
      sale_start_at: null,
      sale_end_at: null,
      company_id: companyId.value,
    };
    isLoading.value = false;
    return;
  }

  try {
    const endpoint = `${URL_API}/v1/company/events/${itemId.value}`;
    const response = await axios.get(endpoint, authHdrs());

    item.value = getRsp(response)?.data?.item || null;

    if (item.value) {
      item.value.logo_doc = b64ToFile(item.value?.logo_b64);
    }
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

    if (payloadItem.is_public !== undefined) {
      payloadItem.is_public = payloadItem.is_public ? 1 : 0;
    }

    const payload = toStorePayload(payloadItem, isStoreMode.value);
    const formData = getFormData(payload);

    const endpoint = `${URL_API}/v1/company/events${
      isStoreMode.value ? "" : `/${itemId.value}`
    }`;

    const response = await axios.post(endpoint, formData, authHdrs(true));

    const rsp = getRsp(response);
    alert?.show("success", rsp?.message || "Operación exitosa");

    router.push({
      name: `${routeName}/show`,
      params: {
        id: getEncodeId(isStoreMode.value ? rsp?.data?.item?.id : itemId.value),
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
