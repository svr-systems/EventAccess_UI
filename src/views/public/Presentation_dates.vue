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
              <CardTitle
                text="Fechas de presentación"
                icon="mdi-calendar-range"
              />
            </v-col>
            <v-col cols="auto" class="d-flex">
              <v-btn
                color="success"
                variant="flat"
                size="small"
                class="mr-2"
                prepend-icon="mdi-account-cash"
                @click="openBuyerDialog"
              >
                Registrarse como comprador
              </v-btn>
              <v-btn
                color="primary"
                variant="flat"
                size="small"
                prepend-icon="mdi-store"
                @click="openProviderDialog"
              >
                Registrarse como proveedor
              </v-btn>
            </v-col>
          </v-row>
        </v-card-title>

        <v-card-text>
          <v-row dense>
            <v-col cols="12">
              <v-text-field
                v-model="search"
                label="Buscar fechas"
                type="text"
                variant="outlined"
                density="compact"
                append-inner-icon="mdi-magnify"
                class="mb-4"
              />

              <div
                v-if="filteredItems.length === 0 && !isLoading"
                class="text-center py-8"
              >
                <v-icon size="60" color="grey-lighten-1" class="mb-4">
                  mdi-calendar-remove
                </v-icon>
                <div class="text-h6 text-grey">No hay fechas disponibles</div>
                <div class="text-body-2 text-grey mt-2">
                  No se encontraron fechas de presentación para este evento
                </div>
              </div>

              <v-row v-if="!isLoading && filteredItems.length > 0" dense>
                <v-col
                  v-for="item in filteredItems"
                  :key="item.id"
                  cols="12"
                  sm="6"
                  md="4"
                  lg="3"
                >
                  <v-card
                    elevation="6"
                    class="date-card"
                    :to="{
                      name: 'public_presentation_tickets',
                      params: {
                        id: getEncodeId(item.id),
                      },
                    }"
                  >
                    <v-card-text class="pa-4">
                      <div
                        class="d-flex justify-space-between align-start mb-3"
                      >
                        <v-avatar
                          size="50"
                          color="primary-lighten-5"
                          rounded="lg"
                        >
                          <v-icon size="30" color="primary"
                            >mdi-calendar</v-icon
                          >
                        </v-avatar>
                        <v-chip
                          :color="item.is_active ? 'success' : 'error'"
                          size="x-small"
                          class="text-capitalize"
                        >
                          {{ item.is_active ? "Activo" : "Inactivo" }}
                        </v-chip>
                      </div>

                      <div class="text-h5 font-weight-bold text-center mb-1">
                        {{ formatDateFull(item.date) }}
                      </div>

                      <div class="text-caption text-grey text-center mb-3">
                        {{ item.display_id }}
                      </div>

                      <v-divider class="my-3" />

                      <div class="mb-3">
                        <div class="d-flex align-center mb-2">
                          <v-icon size="small" color="primary" class="mr-2"
                            >mdi-clock-in</v-icon
                          >
                          <div class="text-body-2">
                            <span class="font-weight-medium">Recepción:</span>
                            {{ formatTime(item.reception_time) }}
                          </div>
                        </div>

                        <div class="d-flex align-center mb-2">
                          <v-icon size="small" color="primary" class="mr-2"
                            >mdi-play-circle</v-icon
                          >
                          <div class="text-body-2">
                            <span class="font-weight-medium">Inicio:</span>
                            {{ formatTime(item.start_time) }}
                          </div>
                        </div>

                        <div class="d-flex align-center">
                          <v-icon size="small" color="primary" class="mr-2"
                            >mdi-stop-circle</v-icon
                          >
                          <div class="text-body-2">
                            <span class="font-weight-medium">Fin:</span>
                            {{ formatTime(item.end_time) }}
                          </div>
                        </div>
                      </div>

                      <v-divider class="my-3" />

                      <div class="d-flex justify-space-between align-center">
                        <div>
                          <div class="text-caption text-grey">Disponibles</div>
                          <div class="text-h6 font-weight-bold">
                            {{ item.available_total || "0" }}
                          </div>
                        </div>

                        <div class="text-right">
                          <div class="text-caption text-grey">Capacidad</div>
                          <div class="text-body-1 font-weight-medium">
                            {{ item.capacity_total || "0" }}
                          </div>
                        </div>
                      </div>

                      <v-progress-linear
                        :model-value="availabilityPercentage(item)"
                        :color="getAvailabilityColor(item.available_total)"
                        height="6"
                        rounded
                        class="mt-3"
                      />

                      <div class="d-flex justify-space-between mt-2">
                        <div class="text-caption text-grey">
                          Vendidos: {{ item.sold_total || "0" }}
                        </div>
                        <v-chip
                          :color="getAvailabilityColor(item.available_total)"
                          size="x-small"
                          class="text-capitalize"
                        >
                          {{ getAvailabilityText(item.available_total) }}
                        </v-chip>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>

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
import BtnDocPreview from "@/components/BtnDocPreview.vue";

const router = useRouter();
const route = useRoute();
const store = useStore();
const alert = inject("alert");

// Estado
const isLoading = ref(false);
const items = ref([]);
const search = ref("");
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

const authHdrs = (useFormData = false) =>
  getHdrs({ token: store.getAuth?.token, useFormData });

// Obtener eventId de la ruta
const itemId = ref(route.params.id ? getDecodeId(route.params.id) : null);

// Filtrar items según búsqueda
const filteredItems = computed(() => {
  if (!search.value) return items.value;

  const searchTerm = search.value.toLowerCase();
  return items.value.filter((item) => {
    return (
      (item.display_id && item.display_id.toLowerCase().includes(searchTerm)) ||
      (item.date &&
        formatDateFull(item.date).toLowerCase().includes(searchTerm)) ||
      (item.reception_time && item.reception_time.includes(searchTerm)) ||
      (item.start_time && item.start_time.includes(searchTerm))
    );
  });
});

// Funciones de formato
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

// Funciones del diálogo
const openProviderDialog = () => {
  providerForm.value = {
    user: getUserObj(),
    supplier: {
      name: null,
    },
    event_id: itemId?.value,
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
    event_id: itemId?.value,
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

    const response = await axios.post(endpoint, formData, authHdrs());

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
    event_id: itemId?.value,
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
    event_id: itemId?.value,
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
    // Aquí puedes personalizar el payload para compradores si es necesario
    const payload = toStorePayload(buyerForm.value, true);
    const formData = getFormData(payload);

    // TODO: Reemplazar con el endpoint correcto para compradores
    const endpoint = `${URL_API}/v1/public/buyers`;

    const response = await axios.post(endpoint, formData, authHdrs());
    const rsp = getRsp(response);

    alert?.show("success", rsp?.message || "Registro de comprador exitoso");
    closeBuyerDialog();
  } catch (err) {
    alert?.show("red-darken-1", getErr(err) || "Error al registrar comprador");
  } finally {
    buyerDialogLoading.value = false;
  }
};

// Funciones de disponibilidad
const getAvailabilityColor = (available) => {
  const numAvailable = parseInt(available) || 0;
  if (numAvailable === 0) return "error";
  if (numAvailable < 20) return "warning";
  return "success";
};

const getAvailabilityText = (available) => {
  const numAvailable = parseInt(available) || 0;
  if (numAvailable === 0) return "Agotado";
  if (numAvailable < 20) return "Pocos";
  return "Disponible";
};

const availabilityPercentage = (item) => {
  const capacity = parseInt(item.capacity_total) || 0;
  const sold = parseInt(item.sold_total) || 0;
  if (capacity === 0) return 0;
  return (sold / capacity) * 100;
};

// Cargar fechas de presentación
const getItems = async () => {
  isLoading.value = true;
  items.value = [];

  try {
    const endpoint = `${URL_API}/v1/public/events/presentation_dates`;
    const response = await axios.get(endpoint, {
      params: {
        is_active: 1,
        event_id: itemId.value,
      },
      ...getHdrs(),
    });

    items.value = getRsp(response)?.data?.items || [];
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  getItems();
});
</script>

<style scoped>
.date-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  height: 100%;
  cursor: pointer;
}

.date-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
}

.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.bg-primary-lighten-5 {
  background-color: rgba(25, 118, 210, 0.1);
}
</style>