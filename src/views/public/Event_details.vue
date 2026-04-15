<template>
  <v-row justify="center">
    <v-col cols="12" class="pt-3">
      <v-card elevation="24" :loading="isLoading">
        <v-card-title>
          <v-row dense align="center">
            <v-col cols="auto">
              <BtnBack
                :route="{
                  name: 'public_events',
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

                <!-- Select de registro -->
                <div class="mr-6 ml-6 mt-4">
                  <v-select
                    v-model="selectedRegistrationType"
                    :items="registrationOptions"
                    label="¿Qué tipo de registro deseas hacer? (Opcional)"
                    variant="outlined"
                    density="compact"
                    hide-details
                    @update:model-value="handleRegistrationSelect"
                  />
                </div>
              </v-card>
            </v-col>

            <v-col cols="12" md="3">
              <v-card class="pa-4 mb-6 text-center sticky-card">
                <v-btn
                  color="success"
                  class="mt-4"
                  :to="{
                    name: 'public_presentation_tickets',
                    params: {
                      id: getEncodeId(eventId.value),
                    },
                  }"
                >
                  <v-icon start>mdi-ticket</v-icon>
                  Comprar Boletos
                </v-btn>
                <div class="mb-2 mt-4">
                  <div class="text-caption text-grey">A partir de</div>
                  <div class="text-h5 font-weight-bold">
                    {{ formatCurrency(eventData.price_from) }}
                  </div>
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

  <!-- Dialog para registro de proveedor -->
  <v-dialog v-model="providerDialogVisible" max-width="600px" persistent>
    <v-card :loading="providerDialogLoading">
      <v-card-title class="bg-primary text-white">
        <span class="text-h6">Registro de proveedor</span>
      </v-card-title>

      <v-card-text class="pt-4">
        <v-form
          ref="providerFormRef"
          @submit.prevent="handleProviderRegistration"
        >
          <v-row dense>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="providerForm.user.name"
                label="Nombre"
                type="text"
                variant="outlined"
                density="compact"
                maxlength="50"
                counter
                :rules="rules.textRequired"
                autocomplete="off"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="providerForm.user.paternal_surname"
                label="Apellido paterno"
                type="text"
                variant="outlined"
                density="compact"
                maxlength="25"
                counter
                :rules="rules.textRequired"
                autocomplete="off"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="providerForm.user.maternal_surname"
                label="Apellido materno *"
                type="text"
                variant="outlined"
                density="compact"
                maxlength="25"
                counter
                :rules="rules.textOptional"
                autocomplete="off"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="providerForm.user.phone"
                label="Teléfono *"
                type="tel"
                variant="outlined"
                density="compact"
                maxlength="10"
                counter
                :rules="rules.phoneOptional"
                autocomplete="off"
                inputmode="numeric"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="providerForm.user.email"
                label="Correo electrónico"
                type="email"
                variant="outlined"
                density="compact"
                maxlength="65"
                counter
                :rules="rules.emailRequired"
                autocomplete="off"
                inputmode="email"
                autocapitalize="none"
                spellcheck="false"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="providerForm.supplier.name"
                label="Nombre del proveedor"
                type="text"
                variant="outlined"
                density="compact"
                maxlength="50"
                counter
                :rules="rules.textRequired"
                autocomplete="off"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn
          color="grey-darken-1"
          variant="text"
          @click="closeProviderDialog"
          :disabled="providerDialogLoading"
        >
          Cancelar
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          @click="handleProviderRegistration"
          :loading="providerDialogLoading"
        >
          Continuar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Dialog para registro de comprador -->
  <v-dialog v-model="buyerDialogVisible" max-width="600px" persistent>
    <v-card :loading="buyerDialogLoading">
      <v-card-title class="bg-success text-white">
        <span class="text-h6">Registro de comprador</span>
      </v-card-title>

      <v-card-text class="pt-4">
        <v-form ref="buyerFormRef" @submit.prevent="handleBuyerRegistration">
          <v-row dense>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="buyerForm.user.name"
                label="Nombre"
                type="text"
                variant="outlined"
                density="compact"
                maxlength="50"
                counter
                :rules="rules.textRequired"
                autocomplete="off"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="buyerForm.user.paternal_surname"
                label="Apellido paterno"
                type="text"
                variant="outlined"
                density="compact"
                maxlength="25"
                counter
                :rules="rules.textRequired"
                autocomplete="off"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="buyerForm.user.maternal_surname"
                label="Apellido materno *"
                type="text"
                variant="outlined"
                density="compact"
                maxlength="25"
                counter
                :rules="rules.textOptional"
                autocomplete="off"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="buyerForm.user.phone"
                label="Teléfono *"
                type="tel"
                variant="outlined"
                density="compact"
                maxlength="10"
                counter
                :rules="rules.phoneOptional"
                autocomplete="off"
                inputmode="numeric"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="buyerForm.user.email"
                label="Correo electrónico"
                type="email"
                variant="outlined"
                density="compact"
                maxlength="65"
                counter
                :rules="rules.emailRequired"
                autocomplete="off"
                inputmode="email"
                autocapitalize="none"
                spellcheck="false"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="buyerForm.buyer.name"
                label="Nombre del comprador"
                type="text"
                variant="outlined"
                density="compact"
                maxlength="50"
                counter
                :rules="rules.textRequired"
                autocomplete="off"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn
          color="grey-darken-1"
          variant="text"
          @click="closeBuyerDialog"
          :disabled="buyerDialogLoading"
        >
          Cancelar
        </v-btn>
        <v-btn
          color="success"
          variant="flat"
          @click="handleBuyerRegistration"
          :loading="buyerDialogLoading"
        >
          Continuar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
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

// Funciones del diálogo de proveedor
const openProviderDialog = () => {
  providerForm.value = {
    user: getUserObj(),
    supplier: {
      name: null,
    },
    event_id: eventId?.value,
  };
  providerDialogVisible.value = true;
};

const closeProviderDialog = () => {
  providerDialogVisible.value = false;
  providerForm.value = {
    user: getUserObj(),
    supplier: {
      name: null,
    },
    event_id: eventId?.value,
  };
};

// Función para manejar el registro del proveedor
const handleProviderRegistration = async () => {
  const { valid } = await providerFormRef.value.validate();
  if (!valid) {
    alert?.show("red-darken-1", "Revisa los detalles señalados");
    return;
  }

  providerDialogLoading.value = true;

  try {
    const payload = toStorePayload(providerForm.value, true);
    const formData = getFormData(payload);

    const endpoint = `${URL_API}/v1/public/suppliers`;

    const response = await axios.post(endpoint, formData, getHdrs());
    const rsp = getRsp(response);

    alert?.show("success", rsp?.message || "Registro de proveedor exitoso");
    closeProviderDialog();
  } catch (err) {
    alert?.show("red-darken-1", getErr(err) || "Error al registrar proveedor");
  } finally {
    providerDialogLoading.value = false;
  }
};

// Funciones del diálogo de comprador
const openBuyerDialog = () => {
  buyerForm.value = {
    user: getUserObj(),
    buyer: {
      name: null,
    },
    event_id: eventId?.value,
  };
  buyerDialogVisible.value = true;
};

const closeBuyerDialog = () => {
  buyerDialogVisible.value = false;
  buyerForm.value = {
    user: getUserObj(),
    buyer: {
      name: null,
    },
    event_id: eventId?.value,
  };
};

// Función para manejar el registro del comprador
const handleBuyerRegistration = async () => {
  const { valid } = await buyerFormRef.value.validate();
  if (!valid) {
    alert?.show("red-darken-1", "Revisa los detalles señalados");
    return;
  }

  buyerDialogLoading.value = true;

  try {
    const payload = toStorePayload(buyerForm.value, true);
    const formData = getFormData(payload);

    const endpoint = `${URL_API}/v1/public/buyers`;

    const response = await axios.post(endpoint, formData, getHdrs());
    const rsp = getRsp(response);

    alert?.show("success", rsp?.message || "Registro de comprador exitoso");
    closeBuyerDialog();
  } catch (err) {
    alert?.show("red-darken-1", getErr(err) || "Error al registrar comprador");
  } finally {
    buyerDialogLoading.value = false;
  }
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
    const endpoint = `${URL_API}/v1/public/events/${eventId.value}`;
    const response = await axios.get(endpoint, {
      ...getHdrs(),
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