<template>
  <v-card elevation="24" :loading="isLoading">
    <v-card-title class="d-flex align-center justify-space-between">
      <div class="d-flex align-center">
        <BtnBack
          :route="{
            name: 'buyer_offers_areas',
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
              />
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12" md="3" class="pb-0">
          <v-text-field
            v-model="search"
            label="Buscar solicitudes"
            type="text"
            variant="outlined"
            density="compact"
            append-inner-icon="mdi-magnify"
          />
        </v-col>

        <v-col cols="12" class="pb-10">
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
          <div
            v-if="filteredItems.length === 0 && !isLoading"
            class="text-center py-8"
          >
            <v-icon size="60" color="grey-lighten-1" class="mb-4">
              mdi-account-group
            </v-icon>
            <div class="text-h6 text-grey">No hay solicitudes disponibles</div>
            <div class="text-body-2 text-grey mt-2">
              No se encontraron solicitudes para mostrar
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
                class="event-card"
                @click="openRequestDialog(item)"
              >
                <div class="event-header">
                  <v-img
                    v-if="getLogoUrl(item.supplier)"
                    :src="getLogoUrl(item.supplier)"
                    class="event-cover-image"
                    cover
                  />
                  <div v-else class="event-cover-placeholder">
                    <v-icon size="60" color="white">mdi-domain</v-icon>
                  </div>
                </div>

                <v-card-text class="pa-4">
                  <div class="text-h6 font-weight-bold text-center mb-1 mt-2">
                    {{ item.supplier?.name || "Proveedor sin nombre" }}
                  </div>

                  <v-divider class="my-3" />

                  <div class="info-section">
                    <div class="info-item">
                      <v-icon size="small" color="primary" class="mr-2"
                        >mdi-identifier</v-icon
                      >
                      <div class="text-body-2">
                        ID Solicitud: {{ item.display_id || "N/A" }}
                      </div>
                    </div>

                    <div class="info-item">
                      <v-icon size="small" color="primary" class="mr-2"
                        >mdi-account</v-icon
                      >
                      <div class="text-body-2 text-truncate">
                        Usuario:
                        {{ item.supplier_user?.user?.full_name || "N/A" }}
                      </div>
                    </div>
                  </div>

                  <v-divider class="my-3" />

                  <div class="info-section">
                    <div class="info-item">
                      <v-icon size="small" color="primary" class="mr-2"
                        >mdi-check-circle</v-icon
                      >
                      <div class="text-body-2">
                        Estado:
                        <v-chip
                          :color="getApprovalColor(item.is_approved)"
                          size="x-small"
                          class="ml-1"
                        >
                          {{ getApprovalText(item.is_approved) }}
                        </v-chip>
                      </div>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>

  <!-- Dialog: Detalle de la solicitud -->
  <v-dialog v-model="requestDialog" max-width="600px" scrollable>
    <v-card :loading="isLoadingDetail">
      <v-card v-if="selectedItem && !isLoadingDetail">
        <!-- Botón cerrar sobre el logo -->
        <v-btn
          icon
          variant="text"
          color="white"
          class="close-btn"
          @click="requestDialog = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>

        <!-- Logo a todo lo ancho -->
        <div class="dialog-header">
          <v-img
            v-if="getLogoUrl(selectedItem.supplier)"
            :src="getLogoUrl(selectedItem.supplier)"
            height="200px"
            cover
          />
          <div v-else class="dialog-placeholder">
            <v-icon size="80" color="white">mdi-domain</v-icon>
          </div>
        </div>

        <v-card-text class="pa-6">
          <div class="text-h5 font-weight-bold text-center mb-2">
            {{ selectedItem.supplier?.name || "Proveedor sin nombre" }}
          </div>

          <v-divider class="my-4" />

          <div class="info-section-dialog">
            <div class="info-item-dialog">
              <v-icon size="small" color="primary" class="mr-3"
                >mdi-identifier</v-icon
              >
              <div>
                <div class="text-caption text-grey">ID Solicitud</div>
                <div class="text-body-2 font-weight-medium">
                  {{ selectedItem.display_id || "N/A" }}
                </div>
              </div>
            </div>

            <div class="info-item-dialog">
              <v-icon size="small" color="primary" class="mr-3"
                >mdi-account</v-icon
              >
              <div>
                <div class="text-caption text-grey">Usuario solicitante</div>
                <div class="text-body-2 font-weight-medium">
                  {{ selectedItem.supplier_user?.user?.full_name || "N/A" }}
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
                    :color="getApprovalColor(selectedItem.is_approved)"
                    size="small"
                  >
                    {{ getApprovalText(selectedItem.is_approved) }}
                  </v-chip>
                </div>
              </div>
            </div>
          </div>

          <v-divider class="my-4" />

          <v-card-actions class="pa-4">
            <v-btn
              color="success"
              :loading="isLoadingAccept"
              :disabled="selectedItem.is_approved === true"
              @click="openScheduleDialog"
            >
              <v-icon start>mdi-check</v-icon>
              Aceptar
            </v-btn>

            <v-spacer />

            <v-btn
              color="error"
              :loading="isLoadingReject"
              :disabled="selectedItem.is_approved === false"
              @click="rejectRequest"
            >
              <v-icon start>mdi-close-circle</v-icon>
              Rechazar
            </v-btn>
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-card>
  </v-dialog>

  <!-- Dialog: Agendar cita (Aceptar) -->
  <v-dialog v-model="scheduleDialog" max-width="500px">
    <v-card>
      <v-card-title class="d-flex align-center justify-space-between">
        <span>Seleccionar horario</span>
        <v-btn icon variant="text" size="small" @click="scheduleDialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-4">
        <v-select
          v-model="selectedSchedule"
          :items="scheduleList"
          :item-title="
            (item) =>
              `${item.presentation_date?.date} | ${item.start_time} - ${item.end_time}`
          "
          label="Seleccione un horario disponible"
          variant="outlined"
          density="compact"
          :loading="scheduleLoading"
          :disabled="scheduleLoading || scheduleList.length === 0"
          return-object
        >
          <template #item="{ item, props }">
            <v-list-item v-bind="props">
              <template #title>
                <div class="d-flex align-center">
                  <v-icon size="small" class="mr-2">mdi-clock-outline</v-icon>
                  <span
                    >{{ item.raw.presentation_date?.date }} |
                    {{ item.raw.start_time }} - {{ item.raw.end_time }}</span
                  >
                </div>
              </template>
            </v-list-item>
          </template>
        </v-select>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn
          color="primary"
          :disabled="!selectedSchedule"
          :loading="isLoadingConfirm"
          @click="acceptRequest"
        >
          Confirmar
        </v-btn>
      </v-card-actions>
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

const routeName = "meeting_requests";
const alert = inject("alert");
const confirm = inject("confirm");
const store = useStore();
const route = useRoute();

const isLoading = ref(false);
const isLoadingDetail = ref(false);
const isLoadingAccept = ref(false);
const isLoadingReject = ref(false);
const isLoadingConfirm = ref(false);
const items = ref([]);
const search = ref("");
const isActive = ref(1);

// Dialog states
const requestDialog = ref(false);
const scheduleDialog = ref(false);
const selectedItem = ref(null);
const selectedSchedule = ref(null);
const scheduleList = ref([]);
const scheduleLoading = ref(false);

const eventId = ref(
  route.params.event ? getDecodeId(route.params.event) : null
);

const isItemsEmpty = computed(() => items.value.length === 0);
const isAdmin = computed(() => store.getUser?.role_id === 1);

const isActiveOptions = [
  { id: 1, name: "ACTIVOS" },
  { id: 0, name: "INACTIVOS" },
];

// Función para obtener el color según el estado de aprobación
const getApprovalColor = (isApproved) => {
  if (isApproved === null) return "warning";
  if (isApproved === true) return "success";
  return "error";
};

// Función para obtener el texto según el estado de aprobación
const getApprovalText = (isApproved) => {
  if (isApproved === null) return "PENDIENTE";
  if (isApproved === true) return "ACEPTADA";
  return "RECHAZADA";
};

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
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
};

// Filtrar items según búsqueda
const filteredItems = computed(() => {
  if (!search.value) return items.value;

  const searchTerm = search.value.toLowerCase();
  return items.value.filter((item) => {
    return (
      (item.supplier?.name &&
        item.supplier.name.toLowerCase().includes(searchTerm)) ||
      (item.display_id && item.display_id.toLowerCase().includes(searchTerm)) ||
      (item.supplier_user?.user?.full_name &&
        item.supplier_user.user.full_name.toLowerCase().includes(searchTerm))
    );
  });
});

const getItems = async () => {
  isLoading.value = true;
  items.value = [];

  try {
    const endpoint = `${URL_API}/v1/buyers/meetings/requests`;
    const response = await axios.get(endpoint, {
      params: { event_id: eventId.value },
      ...getHdrs({ token: store.getAuth?.token }),
    });

    items.value = getRsp(response)?.data?.items || [];
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

// Abrir dialog de solicitud
const openRequestDialog = (item) => {
  selectedItem.value = item;
  requestDialog.value = true;
};

// Abrir dialog de horarios para aceptar
const openScheduleDialog = async () => {
  if (!selectedItem.value) return;

  scheduleDialog.value = true;
  scheduleLoading.value = true;
  selectedSchedule.value = null;

  try {
    const supplierUserId = selectedItem.value.supplier_user_id;
    const endpoint = `${URL_API}/v1/buyers/meetings/available`;
    const response = await axios.get(endpoint, {
      params: {
        event_id: eventId.value,
        supplier_user_id: supplierUserId,
      },
      ...getHdrs({ token: store.getAuth?.token }),
    });
    scheduleList.value = getRsp(response)?.data?.items || [];
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    scheduleLoading.value = false;
  }
};

// Aceptar solicitud (con horario)
const acceptRequest = async () => {
  if (!selectedSchedule.value || !selectedItem.value) return;

  const confirmed = await confirm?.show(
    `¿Confirma aceptar la solicitud de ${selectedItem.value.supplier?.name} para el día ${selectedSchedule.value.presentation_date?.date} de ${selectedSchedule.value.start_time} a ${selectedSchedule.value.end_time}?`
  );
  if (!confirmed) return;

  isLoadingConfirm.value = true;

  try {
    const endpoint = `${URL_API}/v1/buyers/meetings`;

    const payload = {
      event_id: eventId.value,
      presentation_date_id: selectedSchedule.value.presentation_date_id,
      event_area_id: selectedItem.value.event_area_id,
      supplier_id: selectedItem.value.supplier_id,
      supplier_user_id: selectedItem.value.supplier_user_id,
      start_time: selectedSchedule.value.start_time,
      end_time: selectedSchedule.value.end_time,
      meeting_request_id: selectedItem.value.id,
    };

    const response = await axios.post(endpoint, payload, {
      ...getHdrs({ token: store.getAuth?.token }),
    });

    if (getRsp(response)) {
      alert?.show("green-darken-1", "Solicitud aceptada exitosamente");
      scheduleDialog.value = false;
      selectedSchedule.value = null;
      requestDialog.value = false;
      selectedItem.value = null;
      getItems();
    }
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoadingConfirm.value = false;
  }
};

// Rechazar solicitud
const rejectRequest = async () => {
  if (!selectedItem.value) return;

  const confirmed = await confirm?.show(
    `¿Confirma rechazar la solicitud de ${selectedItem.value.supplier?.name}?`
  );
  if (!confirmed) return;

  isLoadingReject.value = true;

  try {
    const endpoint = `${URL_API}/v1/buyers/meetings/requests/reject`;
    const response = await axios.patch(
      endpoint,
      { id: selectedItem.value.id },
      { ...getHdrs({ token: store.getAuth?.token }) }
    );

    if (getRsp(response)) {
      alert?.show("green-darken-1", "Solicitud rechazada exitosamente");
      requestDialog.value = false;
      selectedItem.value = null;
      getItems();
    }
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoadingReject.value = false;
  }
};

onMounted(() => {
  getItems();
});
</script>

<style scoped>
.event-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
  cursor: pointer;
  overflow: hidden;
}

.event-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.2) !important;
}

.event-header {
  position: relative;
  height: 160px;
  overflow: hidden;
}

.event-cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.event-card:hover .event-cover-image {
  transform: scale(1.05);
}

.event-cover-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.event-cover-placeholder .v-icon {
  opacity: 0.9;
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.text-body-3 {
  font-size: 0.8125rem;
  line-height: 1.4;
}

.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

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

.d-flex {
  display: flex;
}

.ga-4 {
  gap: 16px;
}

@media (max-width: 600px) {
  .event-header {
    height: 140px;
  }

  .dialog-header {
    height: 160px;
  }

  .d-flex.ga-4 {
    flex-direction: column;
    gap: 12px;
  }
}
</style>