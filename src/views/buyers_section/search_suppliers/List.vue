<template>
  <v-card elevation="24" :loading="isLoading">
    <v-card-text>
      <v-row dense>
        <v-col cols="12" md="9" class="pb-0"> </v-col>

        <v-col cols="12" md="3" class="pb-0">
          <v-text-field
            v-model="search"
            label="Buscar"
            type="text"
            variant="outlined"
            density="compact"
            append-inner-icon="mdi-magnify"
            :disabled="isItemsEmpty && hasAvailableHours !== false"
          />
        </v-col>

        <v-col cols="12">
          <div
            v-if="filteredItems.length === 0 && !isLoading"
            class="text-center py-8"
          >
            <v-icon size="60" color="grey-lighten-1" class="mb-4">
              {{
                hasAvailableHours === false
                  ? "mdi-calendar-check"
                  : "mdi-account-group"
              }}
            </v-icon>
            <div class="text-h6 text-grey">
              {{
                hasAvailableHours === false
                  ? "Horario completo"
                  : "No hay proveedores disponibles"
              }}
            </div>
            <div class="text-body-2 text-grey mt-2">
              {{
                hasAvailableHours === false
                  ? "Has llenado todo tu horario disponible. No puedes agendar más citas en este evento."
                  : "No se encontraron proveedores para mostrar"
              }}
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
                @click="openOfferDialog(item)"
              >
                <div class="event-header">
                  <v-img
                    v-if="getLogoUrl(item.supplier)"
                    :src="getLogoUrl(item.supplier)"
                    class="event-cover-image"
                    cover
                  />
                  <div v-else class="event-cover-placeholder">
                    <v-icon size="60" color="white">mdi-store</v-icon>
                  </div>
                </div>

                <v-card-text class="pa-4">
                  <div class="text-h6 font-weight-bold text-center mb-1 mt-2">
                    {{ item.supplier?.name || "Proveedor sin nombre" }}
                  </div>

                  <div class="text-body-3 text-center mb-3">
                    {{ item.supplier?.description || "Sin descripción" }}
                  </div>

                  <v-divider class="my-3" />

                  <div class="info-section">
                    <div class="info-item">
                      <v-icon size="small" color="primary" class="mr-2"
                        >mdi-account</v-icon
                      >
                      <div class="text-body-2">
                        Usuario: {{ getUserFullName(item.supplier_user) }}
                      </div>
                    </div>

                    <div class="info-item">
                      <v-icon size="small" color="primary" class="mr-2"
                        >mdi-map-marker</v-icon
                      >
                      <div class="text-body-2">
                        Área: {{ item.event_area?.name || "N/A" }}
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

  <!-- Dialog: Detalle del proveedor -->
  <v-dialog v-model="offerDialog" max-width="800px" scrollable>
    <v-card :loading="isLoadingOffer">
      <v-card v-if="selectedOffer && !isLoadingOffer">
        <!-- Botón cerrar -->
        <v-btn
          icon
          variant="text"
          color="white"
          class="close-btn"
          @click="offerDialog = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>

        <!-- Logo a todo lo ancho -->
        <div class="dialog-header">
          <v-img
            v-if="getLogoUrl(selectedOffer.supplier)"
            :src="getLogoUrl(selectedOffer.supplier)"
            height="200px"
            cover
          />
          <div v-else class="dialog-placeholder">
            <v-icon size="80" color="white">mdi-store</v-icon>
          </div>
        </div>

        <v-card-text class="pa-6">
          <!-- Título del proveedor -->
          <div class="text-center mb-4">
            <div class="text-h5 font-weight-bold">
              {{ selectedOffer.supplier?.name || "Proveedor sin nombre" }}
            </div>
          </div>

          <v-divider class="my-4" />

          <!-- Sección: Información del negocio -->
          <div class="text-subtitle-1 font-weight-bold text-primary mb-3">
            <v-icon size="small" class="mr-2">mdi-store</v-icon>
            Información del proveedor
          </div>

          <v-row dense class="mb-6">
            <v-col cols="12" sm="6">
              <div class="info-item-dialog">
                <v-icon size="small" color="primary" class="mr-2"
                  >mdi-account</v-icon
                >
                <div>
                  <div class="text-caption text-grey">Usuario de contacto</div>
                  <div class="text-body-2 font-weight-medium">
                    {{ getUserFullName(selectedOffer.supplier_user) || "N/A" }}
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
                      v-if="selectedOffer.supplier?.website_url"
                      :href="selectedOffer.supplier.website_url"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-decoration-none"
                    >
                      {{ truncateText(selectedOffer.supplier.website_url, 40) }}
                    </a>
                    <span v-else>N/A</span>
                  </div>
                </div>
              </div>
            </v-col>

            <v-col cols="12" sm="6">
              <div class="info-item-dialog">
                <v-icon size="small" color="primary" class="mr-2"
                  >mdi-map-marker</v-icon
                >
                <div>
                  <div class="text-caption text-grey">Área de especialidad</div>
                  <div class="text-body-2 font-weight-medium">
                    {{ selectedOffer.event_area?.name || "N/A" }}
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
                    {{ selectedOffer.supplier?.fiscal_code || "N/A" }}
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
                    {{ selectedOffer.supplier?.fiscal_name || "N/A" }}
                  </div>
                </div>
              </div>
            </v-col>

            <v-col cols="12" sm="6">
              <div class="info-item-dialog">
                <v-icon size="small" color="primary" class="mr-2"
                  >mdi-map-marker</v-icon
                >
                <div>
                  <div class="text-caption text-grey">Ubicación</div>
                  <div class="text-body-2 font-weight-medium">
                    {{ getSupplierLocation(selectedOffer.supplier) || "N/A" }}
                  </div>
                </div>
              </div>
            </v-col>

            <v-col cols="12" sm="6">
              <div class="info-item-dialog">
                <v-icon size="small" color="primary" class="mr-2"
                  >mdi-text-box</v-icon
                >
                <div>
                  <div class="text-caption text-grey">Descripción</div>
                  <div class="text-body-2 font-weight-medium">
                    {{ selectedOffer.supplier.description }}
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>

          <v-divider class="my-4" />

          <!-- Botón de agendar cita -->
          <v-btn color="primary" size="large" block @click="openScheduleDialog">
            <v-icon start>mdi-calendar-clock</v-icon>
            Agendar cita
          </v-btn>
        </v-card-text>
      </v-card>
    </v-card>
  </v-dialog>

  <!-- Dialog: Agendar cita -->
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
          @click="confirmSchedule"
        >
          Confirmar cita
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

const routeName = "search_suppliers";
const alert = inject("alert");
const confirm = inject("confirm");
const store = useStore();
const route = useRoute();

const isLoading = ref(false);
const isLoadingOffer = ref(false);
const isLoadingConfirm = ref(false);
const items = ref([]);
const search = ref("");
const hasAvailableHours = ref(true);

// Dialog states
const offerDialog = ref(false);
const scheduleDialog = ref(false);
const selectedOffer = ref(null);
const selectedSchedule = ref(null);
const scheduleList = ref([]);
const scheduleLoading = ref(false);

const eventId = computed(() => route.params.event);

const isItemsEmpty = computed(() => items.value.length === 0);
const isAdmin = computed(() => store.getUser?.role_id === 1);

// Función para truncar texto largo
const truncateText = (text, maxLength) => {
  if (!text) return "N/A";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
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

// Función para obtener la URL del logo desde base64
const getLogoUrl = (supplier) => {
  if (supplier?.logo_b64 && supplier.logo_b64.content) {
    return `data:${supplier.logo_b64.mime};base64,${supplier.logo_b64.content}`;
  }
  return null;
};

// Función para obtener el nombre completo del usuario
const getUserFullName = (user) => {
  if (!user) return "N/A";
  const names = [user.name, user.paternal_surname, user.maternal_surname]
    .filter(Boolean)
    .join(" ");
  return names || "Sin nombre";
};

// Filtrar items según búsqueda
const filteredItems = computed(() => {
  if (!search.value) return items.value;

  const searchTerm = search.value.toLowerCase();
  return items.value.filter((item) => {
    return (
      (item.supplier?.name &&
        item.supplier.name.toLowerCase().includes(searchTerm)) ||
      (item.supplier?.description &&
        item.supplier.description.toLowerCase().includes(searchTerm)) ||
      (item.supplier?.display_id &&
        item.supplier.display_id.toLowerCase().includes(searchTerm)) ||
      (item.supplier_user?.email &&
        item.supplier_user.email.toLowerCase().includes(searchTerm)) ||
      (item.event_area?.name &&
        item.event_area.name.toLowerCase().includes(searchTerm))
    );
  });
});

const getItems = async () => {
  isLoading.value = true;
  items.value = [];

  try {
    const endpoint = `${URL_API}/v1/buyers/offer_areas/suppliers`;

    const params = {
      event_id: getDecodeId(eventId.value),
    };

    const response = await axios.get(endpoint, {
      params: params,
      ...getHdrs({ token: store.getAuth?.token }),
    });

    const responseData = getRsp(response)?.data;
    items.value = responseData?.items || [];
    hasAvailableHours.value = responseData?.has_available_hours ?? true;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

// Abrir dialog de oferta con los datos ya existentes
const openOfferDialog = (item) => {
  selectedOffer.value = item;
  offerDialog.value = true;
};

// Abrir dialog de horarios
const openScheduleDialog = async () => {
  if (!selectedOffer.value) return;

  scheduleDialog.value = true;
  scheduleLoading.value = true;
  selectedSchedule.value = null;

  try {
    const supplierUserId = selectedOffer.value.supplier_user_id;
    const endpoint = `${URL_API}/v1/buyers/meetings/available`;
    const response = await axios.get(endpoint, {
      params: {
        event_id: getDecodeId(eventId.value),
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

// Confirmar agendamiento de cita
const confirmSchedule = async () => {
  if (!selectedSchedule.value || !selectedOffer.value) return;

  const confirmed = await confirm?.show(
    `¿Confirma agendar cita con ${selectedOffer.value.supplier?.name} para el día ${selectedSchedule.value.presentation_date?.date} de ${selectedSchedule.value.start_time} a ${selectedSchedule.value.end_time}?`
  );
  if (!confirmed) return;

  isLoadingConfirm.value = true;

  try {
    const endpoint = `${URL_API}/v1/buyers/meetings`;

    const payload = {
      event_id: getDecodeId(eventId.value),
      presentation_date_id: selectedSchedule.value.presentation_date_id,
      event_area_id: selectedOffer.value.event_area_id,
      supplier_id: selectedOffer.value.supplier_id,
      supplier_user_id: selectedOffer.value.supplier_user_id,
      supplier_event_area_id: selectedOffer.value.supplier_event_area_id,
      buyer_offer_area_id: selectedOffer.value.buyer_offer_area_id,
      start_time: selectedSchedule.value.start_time,
      end_time: selectedSchedule.value.end_time,
      meeting_request_id: null,
    };

    const response = await axios.post(endpoint, payload, {
      ...getHdrs({ token: store.getAuth?.token }),
    });

    if (getRsp(response)) {
      alert?.show("green-darken-1", "Cita agendada exitosamente");
      scheduleDialog.value = false;
      selectedSchedule.value = null;
      offerDialog.value = false;
      selectedOffer.value = null;
      // Recargar los items para actualizar el estado
      getItems();
    }
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoadingConfirm.value = false;
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
  .event-header {
    height: 140px;
  }

  .dialog-header {
    height: 160px;
  }
}
</style>