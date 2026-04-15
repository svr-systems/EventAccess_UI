<template>
  <v-card elevation="24" :disabled="isLoading">
    <v-card-title class="d-flex align-center justify-space-between">
      <div class="d-flex align-center">
        <BtnBack
          :route="{
            name: 'search_buyer',
            params: {
              event: getEncodeId(eventId),
            },
          }"
        />
        <CardTitle :text="route.meta.title" :icon="route.meta.icon" />
      </div>
    </v-card-title>

    <v-card-text>
      <v-row dense>
        <v-col cols="12" md="9" class="pb-0">
          <v-row dense>
            <v-col cols="12" md="3" class="pb-0">
              <v-select
                v-model="isActive"
                label="Mostrar"
                variant="outlined"
                density="compact"
                :items="isActiveOptions"
                item-title="name"
                item-value="id"
                :disabled="!isItemsEmpty"
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
          <v-btn
            block
            size="small"
            :color="isItemsEmpty ? 'info' : 'grey-darken-1'"
            :loading="isItemsEmpty && isLoading"
            @click.prevent="isItemsEmpty ? getItems() : (items = [])"
          >
            {{ isItemsEmpty ? "Aplicar" : "Cambiar" }} filtros
            <v-icon end>mdi-filter</v-icon>
          </v-btn>
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
  <v-dialog v-model="detailDialog" max-width="600px" scrollable>
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
            <v-icon size="80" color="white">mdi-book</v-icon>
          </div>
        </div>

        <v-card-text class="pa-6">
          <div class="text-h5 font-weight-bold text-center mb-2">
            {{ selectedItem.buyer?.name || "Comprador sin nombre" }}
          </div>

          <v-divider class="my-4" />

          <div class="info-section-dialog">
            <div class="info-item-dialog">
              <v-icon size="small" color="primary" class="mr-3"
                >mdi-identifier</v-icon
              >
              <div>
                <div class="text-caption text-grey">ID Cita</div>
                <div class="text-body-2 font-weight-medium">
                  {{ selectedItem.display_id || "N/A" }}
                </div>
              </div>
            </div>

            <div class="info-item-dialog">
              <v-icon size="small" color="primary" class="mr-3"
                >mdi-calendar</v-icon
              >
              <div>
                <div class="text-caption text-grey">Fecha</div>
                <div class="text-body-2 font-weight-medium">
                  {{ formatDate(selectedItem.presentation_date?.date) }}
                </div>
              </div>
            </div>

            <div class="info-item-dialog">
              <v-icon size="small" color="primary" class="mr-3"
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

            <div class="info-item-dialog">
              <v-icon size="small" color="primary" class="mr-3">mdi-tag</v-icon>
              <div>
                <div class="text-caption text-grey">Servicio</div>
                <div class="text-body-2 font-weight-medium">
                  {{ selectedItem.event_area?.name || "N/A" }}
                </div>
              </div>
            </div>

            <div class="info-item-dialog">
              <v-icon size="small" color="primary" class="mr-3"
                >mdi-account</v-icon
              >
              <div>
                <div class="text-caption text-grey">Comprador</div>
                <div class="text-body-2 font-weight-medium">
                  {{ selectedItem.buyer?.name || "N/A" }}
                </div>
              </div>
            </div>

            <div class="info-item-dialog">
              <v-icon size="small" color="primary" class="mr-3"
                >mdi-check-circle</v-icon
              >
              <div>
                <div class="text-caption text-grey">Estado</div>
                <div class="text-body-2 font-weight-medium">
                  <v-chip
                    :color="selectedItem.is_active ? 'success' : 'error'"
                    size="small"
                  >
                    {{ selectedItem.is_active ? "ACTIVA" : "CANCELADA" }}
                  </v-chip>
                </div>
              </div>
            </div>

            <div class="info-item-dialog">
              <v-icon size="small" color="primary" class="mr-3"
                >mdi-calendar-check</v-icon
              >
              <div>
                <div class="text-caption text-grey">Confirmación</div>
                <div class="text-body-2 font-weight-medium">
                  <v-chip
                    :color="
                      selectedItem.is_confirmed === null
                        ? 'warning'
                        : selectedItem.is_confirmed
                        ? 'success'
                        : 'error'
                    "
                    size="small"
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
          </div>

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
const isActive = ref(1);

// Dialog states
const detailDialog = ref(false);
const selectedItem = ref(null);

const eventId = ref(
  route.params.event ? getDecodeId(route.params.event) : null
);

const isItemsEmpty = computed(() => items.value.length === 0);
const isAdmin = computed(() => store.getUser?.role_id === 1);

const isActiveOptions = [
  { id: 1, name: "ACTIVOS" },
  { id: 0, name: "INACTIVOS" },
];

const headers = [
  { title: "#", key: "index", filterable: false, sortable: false, width: 60 },
  { title: "Identificador", key: "display_id" },
  { title: "Fecha", key: "presentation_date.date" },
  { title: "Hora", key: "time_range", sortable: false },
  { title: "Comprador", key: "buyer.name" },
  { title: "Servicio", key: "event_area.name" },
  { title: "Estado", key: "status", sortable: false },
  { title: "Confirmación", key: "confirmation", sortable: false },
  { title: "", key: "action", filterable: false, sortable: false, width: 60 },
];

// Función para obtener la URL del logo desde base64
const getLogoUrl = (supplier) => {
  if (supplier?.logo_b64 && supplier.logo_b64.content) {
    return `data:${supplier.logo_b64.mime};base64,${supplier.logo_b64.content}`;
  }
  return null;
};

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

// Función para formatear hora (recibe formato HH:MM:SS)
const formatTimeOnly = (timeString) => {
  if (!timeString) return "N/A";
  // Si viene en formato HH:MM:SS, mostrar solo HH:MM
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

  // Confirmación antes de cancelar
  const confirmed = await confirm?.show(
    `¿Confirma cancelar la cita con ${
      selectedItem.value.buyer?.name
    } para el día ${formatDate(
      selectedItem.value.presentation_date?.date
    )} de ${formatTimeOnly(selectedItem.value.start_time)} a ${formatTimeOnly(
      selectedItem.value.end_time
    )}?`
  );
  if (!confirmed) return;

  isLoadingCancel.value = true;

  try {
    const endpoint = `${URL_API}/v1/suppliers/meetings/confirm`;
    const response = await axios.patch(
      endpoint,
      { id: selectedItem.value.id, is_confirmed: false },
      { ...getHdrs({ token: store.getAuth?.token }) }
    );

    if (getRsp(response)) {
      alert?.show("green-darken-1", "Cita cancelada exitosamente");
      detailDialog.value = false;
      selectedItem.value = null;
      // Recargar la lista
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
    const endpoint = `${URL_API}/v1/suppliers/meetings`;
    const response = await axios.get(endpoint, {
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

.info-section-dialog {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-item-dialog {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

@media (max-width: 600px) {
  .dialog-header {
    height: 160px;
  }
}
</style>