<template>
  <v-row justify="center">
    <v-col cols="12" class="pt-3">
      <v-card elevation="24" :loading="isLoading">
        <v-card-title>
          <v-row dense align="center">
            <v-col cols="auto">
              <BtnBack
                :route="{
                  name: 'event_suppliers',
                }"
              />
            </v-col>
            <v-col>
              <CardTitle text="Información del evento" icon="mdi-calendar" />
            </v-col>
          </v-row>
        </v-card-title>

        <v-card-text v-if="eventData" class="mr-14 ml-14">
          <v-img
            v-if="getLogoUrl(eventData)"
            :src="getLogoUrl(eventData)"
            height="200"
            cover
            class="rounded-lg mb-6"
          />
          <div v-else class="banner-placeholder rounded-lg mb-6">
            <v-icon size="80" color="white">mdi-calendar</v-icon>
          </div>

          <v-row>
            <v-col cols="12" md="9">
              <v-card class="pa-4 mb-6 pt-10">
                <div class="mb-6 mr-6 ml-6 pb-4">
                  <div class="text-h4 font-weight-bold">
                    {{ eventData.name }}
                  </div>
                </div>

                <div class="mb-6 mr-6 ml-6 pb-4">
                  <div class="text-h6 font-weight-bold mb-3">
                    Información del evento
                  </div>
                  <div class="text-body-1">
                    {{ eventData.description || "Sin descripción disponible" }}
                  </div>
                </div>

                <div class="mb-6 mr-6 ml-6 pb-4">
                  <div class="text-h6 font-weight-bold mb-3">
                    Información Adicional
                  </div>
                  <v-list density="compact" bg-color="transparent">
                    <v-list-item>
                      <template #prepend>
                        <v-icon color="primary">mdi-clock</v-icon>
                      </template>
                      <v-list-item-title>
                        Duración: {{ getDuration() }}
                      </v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                      <template #prepend>
                        <v-icon color="primary">mdi-door-open</v-icon>
                      </template>
                      <v-list-item-title>
                        Apertura de puertas: {{ getOpeningTime() }}
                      </v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                      <template #prepend>
                        <v-icon color="primary">mdi-cash-refund</v-icon>
                      </template>
                      <v-list-item-title>
                        No se admiten devoluciones
                      </v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                      <template #prepend>
                        <v-icon color="primary">mdi-parking</v-icon>
                      </template>
                      <v-list-item-title>
                        Estacionamiento gratuito
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </div>

                <div class="mr-6 ml-6 mb-6 pb-4">
                  <div class="text-h6 font-weight-bold mb-3">Ubicación</div>
                  <div class="text-subtitle-1 font-weight-bold">
                    {{ eventData.place_name }}
                  </div>
                  <div class="text-body-2 text-grey mt-1">
                    {{ eventData.address || "Dirección no especificada" }}
                  </div>
                </div>

                <div class="mr-6 ml-6 mb-6">
                  <div class="text-h6 font-weight-bold mb-3">Programa</div>
                  <v-list density="compact" bg-color="transparent">
                    <v-list-item
                      v-for="dateItem in items"
                      :key="dateItem.id"
                      class="mb-2"
                    >
                      <template #prepend>
                        <v-icon color="primary">mdi-calendar</v-icon>
                      </template>
                      <v-list-item-title class="font-weight-bold">
                        {{ formatDateFull(dateItem.date) }}
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        Recepción: {{ formatTime(dateItem.reception_time) }} |
                        Inicio: {{ formatTime(dateItem.start_time) }} | Fin:
                        {{ formatTime(dateItem.end_time) }}
                      </v-list-item-subtitle>
                    </v-list-item>
                  </v-list>
                </div>
              </v-card>
            </v-col>

            <v-col cols="12" md="3">
              <v-card
                v-if="eventData?.has_buyers"
                class="pa-4 mb-6 text-center sticky-card"
              >
                <v-btn
                  color="primary"
                  class="mt-4"
                  :to="{
                    name: 'search_buyer',
                    params: {
                      event: getEncodeId(eventId),
                    },
                  }"
                >
                  <v-icon start>mdi-calendar-clock</v-icon>
                  Citas B2B
                </v-btn>
                <div class="mb-2 mt-6">
                  <div class="text-body-1 text-grey">Disponibles</div>
                </div>
              </v-card>

              <v-card
                v-if="eventData?.has_stands"
                class="pa-4 mb-6 text-center sticky-card"
              >
                <v-btn color="warning" class="mt-4">
                  <v-icon start>mdi-storefront</v-icon>
                  Solicitar stands
                </v-btn>
                <div class="mb-2 mt-6">
                  <div class="text-body-1 text-grey">Disponibles</div>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-text v-else-if="!isLoading">
          <div class="text-center py-8">
            <v-icon size="60" color="grey-lighten-1" class="mb-4">
              mdi-calendar-remove
            </v-icon>
            <div class="text-h6 text-grey">No se encontró el evento</div>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, computed, inject, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

import { useStore } from "@/store";
import { URL_API } from "@/utils/config";
import { getHdrs, getErr, getRsp } from "@/utils/http";
import { getEncodeId, getDecodeId } from "@/utils/coders";
import { getRules } from "@/utils/validators";
import { getUserObj } from "@/utils/objects";
import { getFormData, toStorePayload } from "@/utils/helpers";
import CardTitle from "@/components/CardTitle.vue";
import BtnBack from "@/components/BtnBack.vue";
import BtnTheme from "@/components/BtnTheme.vue";

const router = useRouter();
const route = useRoute();
const store = useStore();
const alert = inject("alert");

// Estado
const isLoading = ref(false);
const eventData = ref(null);
const items = ref([]);
const rules = getRules();

// Estado del diálogo de proveedor
const providerDialogVisible = ref(false);
const providerDialogLoading = ref(false);
const providerFormRef = ref(null);
const providerForm = ref(null);

// Estado del diálogo de comprador
const buyerDialogVisible = ref(false);
const buyerDialogLoading = ref(false);
const buyerFormRef = ref(null);
const buyerForm = ref(null);

// Select de registro
const selectedRegistrationType = ref(null);
const registrationOptions = [
  { title: "Registrarse como comprador", value: "buyer" },
  { title: "Registrarse como proveedor", value: "provider" },
];

const eventId = ref(route.params.id ? getDecodeId(route.params.id) : null);

// Función para obtener la URL del logo desde base64
const getLogoUrl = (item) => {
  if (item.logo_b64 && item.logo_b64.content) {
    return `data:${item.logo_b64.mime};base64,${item.logo_b64.content}`;
  }
  return null;
};

// Funciones de formato
const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return "$0.00";

  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  }).format(amount);
};

const formatDateFull = (dateString) => {
  if (!dateString) return "N/A";

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-MX", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
};

const formatTime = (timeString) => {
  if (!timeString) return "N/A";

  try {
    if (timeString.match(/^\d{2}:\d{2}$/)) {
      return timeString;
    }
    return timeString;
  } catch {
    return timeString;
  }
};

// Funciones auxiliares
const getDuration = () => {
  if (items.value.length === 0) return "No especificada";
  const firstDate = items.value[0];
  if (firstDate.start_time && firstDate.end_time) {
    const start = firstDate.start_time;
    const end = firstDate.end_time;
    return `${start} - ${end}`;
  }
  return "No especificada";
};

const getOpeningTime = () => {
  if (items.value.length === 0) return "No especificada";
  const firstDate = items.value[0];
  return formatTime(firstDate.reception_time) || "No especificada";
};

const formatTimeRange = () => {
  if (items.value.length === 0) return "";
  const firstDate = items.value[0];
  return `${formatTime(firstDate.reception_time)} - ${formatTime(
    firstDate.end_time
  )}`;
};

// Funciones de disponibilidad
const getAvailabilityColor = (available) => {
  const numAvailable = parseInt(available) || 0;
  if (numAvailable === 0) return "error";
  if (numAvailable < 20) return "warning";
  return "success";
};

// Manejar selección del select
const handleRegistrationSelect = (value) => {
  if (value === "buyer") {
    openBuyerDialog();
  } else if (value === "provider") {
    openProviderDialog();
  }
  selectedRegistrationType.value = null; // Resetear select después de la selección
};

// Cargar datos del evento
const getEventData = async () => {
  if (!eventId.value) {
    alert?.show("warning", "No se especificó el evento");
    router.push({ name: "public_events" });
    return;
  }

  isLoading.value = true;

  try {
    const endpoint = `${URL_API}/v1/suppliers/events/${eventId.value}`;
    const response = await axios.get(endpoint, {
      ...getHdrs({ token: store.getAuth?.token }),
    });

    const data = getRsp(response)?.data;
    eventData.value = data?.item || null;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

// Cargar fechas de presentación del evento
const getPresentationDates = async () => {
  try {
    const endpoint = `${URL_API}/v1/public/events/presentation_dates`;
    const response = await axios.get(endpoint, {
      params: {
        is_active: 1,
        event_id: eventId.value,
      },
      ...getHdrs(),
    });

    items.value = getRsp(response)?.data?.items || [];
  } catch (err) {
    console.error("Error al cargar fechas:", err);
  }
};

onMounted(async () => {
  await getEventData();
  if (eventId.value) {
    await getPresentationDates();
  }
});
</script>

<style scoped>
.banner-placeholder {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.v-list-item__prepend) {
  margin-right: 12px;
}

.sticky-card {
  position: sticky;
  top: 20px;
}
</style>