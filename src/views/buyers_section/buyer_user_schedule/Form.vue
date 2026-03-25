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
                    buyer: getEncodeId(buyerId),
                    event: getEncodeId(eventId),
                  },
                }
              : {
                  name: routeName,
                  params: {
                    buyer: getEncodeId(buyerId),
                    event: getEncodeId(eventId),
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
                  <CardTitle text="HORARIOS DE REUNIONES" sub />
                </div>

                <div />
              </v-card-title>

              <v-card-text>
                <div
                  v-if="event_meeting_windowsLoading"
                  class="text-center py-4"
                >
                  <v-progress-circular indeterminate size="40" />
                  <div class="text-body-2 text-grey mt-2">
                    Cargando horarios...
                  </div>
                </div>

                <v-row v-else-if="event_meeting_windows.length === 0" dense>
                  <v-col cols="12">
                    <div class="text-center py-4">
                      <v-icon size="40" color="grey-lighten-1" class="mb-2">
                        mdi-clock-outline
                      </v-icon>
                      <div class="text-body-2 text-grey">
                        No hay horarios de reuniones registrados
                      </div>
                    </div>
                  </v-col>
                </v-row>

                <v-row v-else dense>
                  <v-col
                    v-for="meeting in event_meeting_windows"
                    :key="meeting.id"
                    cols="12"
                    sm="6"
                    md="4"
                    lg="3"
                  >
                    <v-card class="meeting-card">
                      <v-card-text class="pa-3">
                        <div
                          class="d-flex justify-space-between align-start mb-2"
                        >
                          <div class="text-caption text-grey">
                            {{ meeting.display_id }}
                          </div>
                          <v-chip
                            :color="meeting.is_active ? 'success' : 'error'"
                            size="x-small"
                            class="text-capitalize"
                          >
                            {{ meeting.is_active ? "Activo" : "Inactivo" }}
                          </v-chip>
                        </div>

                        <div class="mb-2">
                          <div class="d-flex align-center mb-1">
                            <v-icon size="small" color="primary" class="mr-1">
                              mdi-calendar
                            </v-icon>
                            <div class="text-body-2">
                              {{ meeting.presentation_date?.date }}
                            </div>
                          </div>
                          <div class="d-flex align-center">
                            <v-icon size="small" color="primary" class="mr-1">
                              mdi-clock
                            </v-icon>
                            <div class="text-body-2">
                              {{ formatTime(meeting.start_time) }} -
                              {{ formatTime(meeting.end_time) }}
                            </div>
                          </div>
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>

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
                      v-model="item.start_time"
                      label="Hora de inicio"
                      type="time"
                      variant="outlined"
                      density="compact"
                      :rules="rules.textRequired"
                    />
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="item.end_time"
                      label="Hora de cierre"
                      type="time"
                      variant="outlined"
                      density="compact"
                      :rules="rules.textRequired"
                    />
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-select
                      v-model="item.buyer_user_id"
                      label="Usuarios"
                      :items="buyer_users"
                      :loading="buyer_usersLoading"
                      item-value="id"
                      item-title="user.full_name"
                      variant="outlined"
                      density="compact"
                      :rules="rules.requiredNotNull"
                    />
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-select
                      v-model="item.presentation_date_id"
                      label="Fechas de presentación"
                      :items="presentation_dates"
                      :loading="presentation_datesLoading"
                      item-value="id"
                      :item-title="
                        (item) =>
                          `${item.date} | ${item.start_time} - ${item.end_time}`
                      "
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

const routeName = "buyer_user_schedule";

const alert = inject("alert");
const confirm = inject("confirm");
const store = useStore();
const router = useRouter();
const route = useRoute();

const itemId = ref(route.params.id ? getDecodeId(route.params.id) : null);
const buyerId = ref(
  route.params.buyer ? getDecodeId(route.params.buyer) : null
);
const eventId = ref(
  route.params.event ? getDecodeId(route.params.event) : null
);

const isStoreMode = ref(!itemId.value);

const isLoading = ref(true);
const formRef = ref(null);
const item = ref(null);

const rules = getRules();

const buyer_users = ref([]);
const buyer_usersLoading = ref(true);
const presentation_dates = ref([]);
const presentation_datesLoading = ref(true);
const event_meeting_windows = ref([]);
const event_meeting_windowsLoading = ref(true);

const authHdrs = (useFormData = false) =>
  getHdrs({ token: store.getAuth?.token, useFormData });

// Función para formatear fecha
const formatDate = (dateString) => {
  if (!dateString) return "N/A";

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-MX", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
};

// Función para formatear hora
const formatTime = (timeString) => {
  if (!timeString) return "N/A";

  try {
    // Si viene en formato HH:MM:SS, mostrar solo HH:MM
    if (timeString.match(/^\d{2}:\d{2}:\d{2}$/)) {
      return timeString.slice(0, 5);
    }
    return timeString;
  } catch {
    return timeString;
  }
};

const getCatalogs = async () => {
  // Cargar usuarios compradores
  try {
    const endpoint1 = `${URL_API}/v1/buyers/users`;
    const response1 = await axios.get(endpoint1, {
      params: { buyer_id: buyerId.value },
      ...getHdrs({ token: store.getAuth?.token }),
    });

    buyer_users.value = getRsp(response1)?.data?.items || [];
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    buyer_usersLoading.value = false;
  }

  // Cargar fechas de presentación
  try {
    const endpoint2 = `${URL_API}/v1/buyers/events/presentation_dates`;
    const response2 = await axios.get(endpoint2, {
      params: { event_id: eventId.value },
      ...getHdrs({ token: store.getAuth?.token }),
    });

    presentation_dates.value = getRsp(response2)?.data?.items || [];
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    presentation_datesLoading.value = false;
  }

  // Cargar horarios de reuniones
  try {
    const endpoint3 = `${URL_API}/v1/buyers/events/meeting_windows`;
    const response3 = await axios.get(endpoint3, {
      params: { event_id: eventId.value },
      ...getHdrs({ token: store.getAuth?.token }),
    });

    const items = getRsp(response3)?.data?.items || [];
    event_meeting_windows.value = items;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    event_meeting_windowsLoading.value = false;
  }
};

const getItem = async () => {
  if (isStoreMode.value) {
    item.value = {
      presentation_date_id: null,
      buyer_user_id: null,
      buyer_id: buyerId.value,
      event_id: eventId.value,
      start_time: null,
      end_time: null,
    };
    isLoading.value = false;
    return;
  }

  try {
    const endpoint = `${URL_API}/v1/buyers/user_schedules/${itemId.value}`;
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

    const endpoint = `${URL_API}/v1/buyers/user_schedules${
      isStoreMode.value ? "" : `/${itemId.value}`
    }`;

    const response = await axios.post(endpoint, formData, authHdrs(true));

    const rsp = getRsp(response);
    alert?.show("success", rsp?.message || "Operación exitosa");

    router.push({
      name: `${routeName}/show`,
      params: {
        id: getEncodeId(isStoreMode.value ? rsp?.data?.item?.id : itemId.value),
        buyer: getEncodeId(buyerId.value),
        event: getEncodeId(eventId.value),
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

<style scoped>
.meeting-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.meeting-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
}
</style>