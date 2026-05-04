<template>
  <v-card elevation="24" :disabled="isLoading">
    <v-card-title class="d-flex align-center justify-space-between">
      <div class="d-flex align-center"></div>

      <div>
        <v-btn
          icon
          variant="flat"
          size="x-small"
          color="warning"
          :to="{
            name: 'buyer_user_schedule/store',
            params: {
              event: eventId,
            },
          }"
        >
          <v-icon>mdi-clock-time-eight</v-icon>
          <v-tooltip activator="parent" location="bottom"
            >Configurar mis horarios</v-tooltip
          >
        </v-btn>
      </div>
    </v-card-title>
    <v-card-text>
      <v-row dense>
        <v-col cols="12" md="9" class="pb-0">
          <v-row dense>
            <v-col cols="12" md="3" class="pb-0">
              <v-select
                v-model="selectedFilter"
                label="Mostrar"
                variant="outlined"
                density="compact"
                :items="filterOptions"
                item-title="name"
                item-value="value"
                @update:model-value="handleFilterChange"
              />
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12" md="3" class="pb-0">
          <v-text-field
            v-model="search"
            label="Buscar"
            type="text"
            variant="outlined"
            density="compact"
            append-inner-icon="mdi-magnify"
            :disabled="isItemsEmpty"
          />
        </v-col>

        <v-col cols="12">
          <v-data-table
            density="compact"
            :items="items"
            :headers="headers"
            :search="search"
            :items-per-page="15"
            :loading="isLoading"
            item-value="id"
          >
            <template #item.index="{ index }">
              <b>{{ index + 1 }}</b>
            </template>

            <template #item.time_range="{ item }">
              <div class="text-body-2">
                {{ formatTimeOnly(item.start_time) }} -
                {{ formatTimeOnly(item.end_time) }}
              </div>
            </template>

            <template #item.status="{ item }">
              <v-chip
                :color="item.is_active ? 'success' : 'error'"
                size="x-small"
              >
                {{ item.is_active ? "ACTIVA" : "CANCELADA" }}
              </v-chip>
            </template>

            <template #item.confirmation="{ item }">
              <v-chip
                :color="
                  item.is_confirmed === null
                    ? 'warning'
                    : item.is_confirmed
                    ? 'success'
                    : 'error'
                "
                size="x-small"
              >
                {{
                  item.is_confirmed === null
                    ? "PENDIENTE"
                    : item.is_confirmed
                    ? "ACEPTADA"
                    : "DENEGADA"
                }}
              </v-chip>
            </template>

            <template #item.action="{ item }">
              <div class="text-right">
                <v-btn
                  icon
                  variant="text"
                  size="x-small"
                  :color="item.is_active ? '' : 'red-darken-3'"
                  @click="openDetailDialog(item)"
                >
                  <v-icon>mdi-eye</v-icon>
                  <v-tooltip activator="parent" location="left"
                    >Detalle</v-tooltip
                  >
                </v-btn>
              </div>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>

  <!-- Dialog: Detalle de la cita -->
  <v-dialog v-model="detailDialog" max-width="800px" scrollable>
    <v-card :loading="isLoadingDetail">
      <v-card v-if="selectedItem && !isLoadingDetail">
        <v-btn
          icon
          variant="text"
          color="white"
          class="close-btn"
          @click="detailDialog = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>

        <div class="dialog-header">
          <v-img
            v-if="getLogoUrl(selectedItem.supplier)"
            :src="getLogoUrl(selectedItem.supplier)"
            height="200px"
            cover
          />
          <div v-else class="dialog-placeholder">
            <v-icon size="80" color="white">mdi-store</v-icon>
          </div>
        </div>

        <v-card-text class="pa-6">
          <div class="text-h5 font-weight-bold text-center mb-1">
            {{ selectedItem.supplier?.name || "Proveedor sin nombre" }}
          </div>

          <v-divider class="my-4" />

          <div class="text-subtitle-1 font-weight-bold text-primary mb-3">
            <v-icon size="small" class="mr-2">mdi-calendar-clock</v-icon>
            Información de la cita
          </div>

          <v-row dense class="mb-6">
            <v-col cols="12" sm="6" md="4">
              <div class="info-item-dialog">
                <v-icon size="small" color="primary" class="mr-2"
                  >mdi-calendar</v-icon
                >
                <div>
                  <div class="text-caption text-grey">Fecha</div>
                  <div class="text-body-2 font-weight-medium">
                    {{ formatDate(selectedItem.presentation_date?.date) }}
                  </div>
                </div>
              </div>
            </v-col>

            <v-col cols="12" sm="6" md="4">
              <div class="info-item-dialog">
                <v-icon size="small" color="primary" class="mr-2"
                  >mdi-clock</v-icon
                >
                <div>
                  <div class="text-caption text-grey">Horario</div>
                  <div class="text-body-2 font-weight-medium">
                    {{ formatTimeOnly(selectedItem.start_time) }} -
                    {{ formatTimeOnly(selectedItem.end_time) }}
                  </div>
                </div>
              </div>
            </v-col>

            <v-col cols="12" sm="6" md="4">
              <div class="info-item-dialog">
                <v-icon size="small" color="primary" class="mr-2"
                  >mdi-tag</v-icon
                >
                <div>
                  <div class="text-caption text-grey">Servicio</div>
                  <div class="text-body-2 font-weight-medium">
                    {{ selectedItem.event_area?.name || "N/A" }}
                  </div>
                </div>
              </div>
            </v-col>

            <v-col cols="12" sm="6" md="4">
              <div class="info-item-dialog">
                <v-icon size="small" color="primary" class="mr-2"
                  >mdi-calendar-check</v-icon
                >
                <div>
                  <div class="text-caption text-grey">Confirmación</div>
                  <div>
                    <v-chip
                      :color="
                        selectedItem.is_confirmed === null
                          ? 'warning'
                          : selectedItem.is_confirmed
                          ? 'success'
                          : 'error'
                      "
                      size="x-small"
                    >
                      {{
                        selectedItem.is_confirmed === null
                          ? "PENDIENTE"
                          : selectedItem.is_confirmed
                          ? "ACEPTADA"
                          : "DENEGADA"
                      }}
                    </v-chip>
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>

          <v-divider class="my-4" />

          <div class="text-subtitle-1 font-weight-bold text-primary mb-3">
            <v-icon size="small" class="mr-2">mdi-store</v-icon>
            Información del proveedor
          </div>

          <v-row dense class="mb-6">
            <v-col cols="12" sm="6">
              <div class="info-item-dialog">
                <v-icon size="small" color="primary" class="mr-2"
                  >mdi-map-marker</v-icon
                >
                <div>
                  <div class="text-caption text-grey">Ubicación</div>
                  <div class="text-body-2 font-weight-medium">
                    {{ getSupplierLocation(selectedItem.supplier) || "N/A" }}
                  </div>
                </div>
              </div>
            </v-col>

            <v-col cols="12" sm="6">
              <div class="info-item-dialog">
                <v-icon size="small" color="primary" class="mr-2"
                  >mdi-web</v-icon
                >
                <div>
                  <div class="text-caption text-grey">Sitio web</div>
                  <div class="text-body-2 font-weight-medium">
                    <a
                      v-if="selectedItem.supplier?.website_url"
                      :href="selectedItem.supplier.website_url"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-decoration-none"
                    >
                      {{ truncateText(selectedItem.supplier.website_url, 40) }}
                    </a>
                    <span v-else>N/A</span>
                  </div>
                </div>
              </div>
            </v-col>

            <v-col cols="12" sm="6">
              <div class="info-item-dialog">
                <v-icon size="small" color="primary" class="mr-2"
                  >mdi-domain</v-icon
                >
                <div>
                  <div class="text-caption text-grey">RFC</div>
                  <div class="text-body-2 font-weight-medium">
                    {{ selectedItem.supplier?.fiscal_code || "N/A" }}
                  </div>
                </div>
              </div>
            </v-col>

            <v-col cols="12" sm="6">
              <div class="info-item-dialog">
                <v-icon size="small" color="primary" class="mr-2"
                  >mdi-file-document</v-icon
                >
                <div>
                  <div class="text-caption text-grey">Razón social</div>
                  <div class="text-body-2 font-weight-medium">
                    {{ selectedItem.supplier?.fiscal_name || "N/A" }}
                  </div>
                </div>
              </div>
            </v-col>

            <v-col cols="12">
              <div class="info-item-dialog">
                <v-icon size="small" color="primary" class="mr-2 mt-1"
                  >mdi-text-box</v-icon
                >
                <div class="flex-grow-1">
                  <div class="text-caption text-grey">Descripción</div>
                  <div class="text-body-2 font-weight-medium description-text">
                    {{
                      selectedItem.supplier?.description || "Sin descripción"
                    }}
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>

          <v-divider class="my-4" />

          <v-btn
            color="red"
            size="large"
            block
            :loading="isLoadingCancel"
            @click="cancelMeeting"
          >
            <v-icon start>mdi-calendar-remove</v-icon>
            Cancelar cita
          </v-btn>
        </v-card-text>
      </v-card>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, inject, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

import { useStore } from "@/store";
import { URL_API } from "@/utils/config";
import { getHdrs, getErr, getRsp } from "@/utils/http";
import { getEncodeId, getDecodeId } from "@/utils/coders";
import CardTitle from "@/components/CardTitle.vue";
import BtnBack from "@/components/BtnBack.vue";

const routeName = "meetings";
const alert = inject("alert");
const confirm = inject("confirm");
const store = useStore();
const route = useRoute();

const isLoading = ref(false);
const isLoadingDetail = ref(false);
const isLoadingCancel = ref(false);
const items = ref([]);
const search = ref("");

const selectedFilter = ref(1);
const currentFilter = ref(1);

// Opciones del filtro
const filterOptions = [
  { name: "Confirmadas", value: 1 },
  { name: "Denegadas", value: 0 },
  { name: "Pendientes", value: null },
];

// Dialog states
const detailDialog = ref(false);
const selectedItem = ref(null);

const eventId = computed(() => route.params.event);

const isItemsEmpty = computed(() => items.value.length === 0);
const isAdmin = computed(() => store.getUser?.role_id === 1);

const headers = [
  { title: "#", key: "index", filterable: false, sortable: false, width: 60 },
  { title: "Fecha", key: "presentation_date.date" },
  { title: "Hora", key: "time_range", sortable: false },
  { title: "Proveedor", key: "supplier.name" },
  { title: "Servicio", key: "event_area.name" },
  { title: "Confirmación", key: "confirmation", sortable: false },
  { title: "", key: "action", filterable: false, sortable: false, width: 60 },
];

// Función para truncar texto largo
const truncateText = (text, maxLength) => {
  if (!text) return "N/A";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

// Manejar cambio de filtro
const handleFilterChange = (value) => {
  currentFilter.value = value;
  getItems();
};

// Función para obtener la URL del logo desde base64
const getLogoUrl = (supplier) => {
  if (supplier?.logo_b64 && supplier.logo_b64.content) {
    return `data:${supplier.logo_b64.mime};base64,${supplier.logo_b64.content}`;
  }
  return null;
};

// Función para obtener la ubicación completa del proveedor
const getSupplierLocation = (supplier) => {
  if (!supplier) return "N/A";
  const parts = [];
  if (supplier.address) parts.push(supplier.address);
  if (supplier.municipality?.name) parts.push(supplier.municipality.name);
  if (supplier.municipality?.state) parts.push(supplier.municipality.state);
  if (supplier.zip) parts.push(`CP ${supplier.zip}`);
  return parts.length > 0 ? parts.join(", ") : "N/A";
};

// Función para formatear fecha
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
};

// Función para formatear hora (recibe formato HH:MM:SS)
const formatTimeOnly = (timeString) => {
  if (!timeString) return "N/A";
  if (timeString.match(/^\d{2}:\d{2}:\d{2}$/)) {
    return timeString.slice(0, 5);
  }
  return timeString;
};

// Abrir dialog de detalle
const openDetailDialog = (item) => {
  selectedItem.value = item;
  detailDialog.value = true;
};

// Cancelar cita
const cancelMeeting = async () => {
  if (!selectedItem.value) return;

  const confirmed = await confirm?.show(
    `¿Confirma cancelar la cita con ${
      selectedItem.value.supplier?.name
    } para el día ${formatDate(
      selectedItem.value.presentation_date?.date
    )} de ${formatTimeOnly(selectedItem.value.start_time)} a ${formatTimeOnly(
      selectedItem.value.end_time
    )}?`
  );
  if (!confirmed) return;

  isLoadingCancel.value = true;

  try {
    const endpoint = `${URL_API}/v1/buyers/meetings/reject`;
    const response = await axios.patch(
      endpoint,
      { id: selectedItem.value.id },
      { ...getHdrs({ token: store.getAuth?.token }) }
    );

    if (getRsp(response)) {
      alert?.show("green-darken-1", "Cita cancelada exitosamente");
      detailDialog.value = false;
      selectedItem.value = null;
      getItems();
    }
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoadingCancel.value = false;
  }
};

const getItems = async () => {
  isLoading.value = true;
  items.value = [];

  try {
    const endpoint = `${URL_API}/v1/buyers/meetings`;

    const params = {
      event_id: getDecodeId(eventId.value),
    };

    if (currentFilter.value !== null) {
      params.filter = currentFilter.value;
    }

    const response = await axios.get(endpoint, {
      params: params,
      ...getHdrs({ token: store.getAuth?.token }),
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
/* Estilos para el dialog */
.close-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.5);
}

.close-btn:hover {
  background-color: rgba(0, 0, 0, 0.7);
}

.dialog-header {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.dialog-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.info-item-dialog {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.description-text {
  white-space: pre-wrap;
  word-wrap: break-word;
  line-height: 1.5;
  max-height: 200px;
  overflow-y: auto;
  padding-right: 8px;
}

/* Scroll personalizado para la descripción */
.description-text::-webkit-scrollbar {
  width: 4px;
}

.description-text::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.description-text::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.description-text::-webkit-scrollbar-thumb:hover {
  background: #555;
}

@media (max-width: 600px) {
  .dialog-header {
    height: 160px;
  }
}
</style>