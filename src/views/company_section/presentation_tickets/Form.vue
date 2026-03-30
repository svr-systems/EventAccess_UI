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
                    presentation_dates: getEncodeId(presentation_datesId),
                    event: getEncodeId(eventId),
                    company: getEncodeId(companyId),
                  },
                }
              : {
                  name: routeName,
                  params: {
                    presentation_dates: getEncodeId(presentation_datesId),
                    event: getEncodeId(eventId),
                    company: getEncodeId(companyId),
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
                      label="Capacidad *"
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
                    <v-select
                      v-model="item.ticket_type_id"
                      label="Tipo de ticket"
                      :items="ticket_types"
                      :loading="ticket_typesLoading"
                      item-value="id"
                      item-title="name"
                      variant="outlined"
                      density="compact"
                      :rules="rules.requiredNotNull"
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

const routeName = "presentation_tickets";

const alert = inject("alert");
const confirm = inject("confirm");
const store = useStore();
const router = useRouter();
const route = useRoute();

const itemId = ref(route.params.id ? getDecodeId(route.params.id) : null);
const eventId = ref(
  route.params.event ? getDecodeId(route.params.event) : null
);
const presentation_datesId = ref(
  route.params.presentation_dates
    ? getDecodeId(route.params.presentation_dates)
    : null
);
const companyId = ref(
  route.params.company ? getDecodeId(route.params.company) : null
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

const getCatalogs = async () => {
  try {
    const endpoint = `${URL_API}/v1/company/events/ticket_types`;
    const response = await axios.get(endpoint, {
      params: { is_active: 1, event_id: eventId.value },
      ...getHdrs({ token: store.getAuth?.token }),
    });

    ticket_types.value = getRsp(response)?.data?.items || [];
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    ticket_typesLoading.value = false;
  }
};

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
      ticket_type_id: null,
      price: null,
      capacity: null,
      presentation_date_id: presentation_datesId.value,
    };
    isLoading.value = false;
    return;
  }

  try {
    const endpoint = `${URL_API}/v1/company/events/presentation_tickets/${itemId.value}`;
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
    const payload = toStorePayload(item.value, isStoreMode.value);
    const formData = getFormData(payload);

    const endpoint = `${URL_API}/v1/company/events/presentation_tickets${
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
        presentation_dates: getEncodeId(presentation_datesId.value),
      },
    });
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  getCatalogs();
  getItem();
});
</script>
