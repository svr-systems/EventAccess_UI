<template>
  <v-card elevation="24" :loading="isLoading">
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
            label="Buscar compradores"
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
            <div class="text-h6 text-grey">No hay compradores disponibles</div>
            <div class="text-body-2 text-grey mt-2">
              No se encontraron compradores para mostrar
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
                @click="openDetailDialog(item)"
              >
                <div class="event-header">
                  <div class="event-cover-placeholder">
                    <v-icon size="60">mdi-book</v-icon>
                  </div>
                </div>

                <v-card-text class="pa-4">
                  <div class="text-h6 font-weight-bold text-center mb-1 mt-2">
                    {{ item.buyer?.name || "Comprador sin nombre" }}
                  </div>

                  <v-divider class="my-3" />

                  <div class="info-section">
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

  <!-- Dialog: Detalle del comprador -->
  <v-dialog v-model="detailDialog" max-width="600px" scrollable>
    <v-card :loading="isLoadingDetail">
      <v-card v-if="selectedItem && !isLoadingDetail">
        <!-- Botón cerrar sobre el logo -->
        <v-btn
          icon
          variant="text"
          color="white"
          class="close-btn"
          @click="detailDialog = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>

        <!-- Header con gradiente (sin logo) -->
        <div class="dialog-header dialog-header-store">
          <v-icon size="80">mdi-book</v-icon>
        </div>

        <v-card-text class="pa-6">
          <div class="text-h5 font-weight-bold text-center mb-2">
            {{ selectedItem.buyer?.name || "Comprador sin nombre" }}
          </div>

          <v-divider class="my-4" />

          <div class="info-section-dialog">
            <div class="info-item-dialog">
              <v-icon size="small" color="primary" class="mr-3"
                >mdi-account</v-icon
              >
              <div>
                <div class="text-caption text-grey">Usuario de contacto</div>
                <div class="text-body-2 font-weight-medium">
                  {{ getUserFullName(selectedItem.buyer_user) || "N/A" }}
                </div>
              </div>
            </div>

            <div class="info-item-dialog">
              <v-icon size="small" color="primary" class="mr-3"
                >mdi-map-marker</v-icon
              >
              <div>
                <div class="text-caption text-grey">Área de interés</div>
                <div class="text-body-2 font-weight-medium">
                  {{ selectedItem.event_area?.name || "N/A" }}
                </div>
              </div>
            </div>

            <div
              class="info-item-dialog"
              v-if="selectedItem.buyer_offer_area?.description"
            >
              <v-icon size="small" color="primary" class="mr-3"
                >mdi-text-box</v-icon
              >
              <div>
                <div class="text-caption text-grey">
                  Descripción de la oferta
                </div>
                <div class="text-body-2 font-weight-medium">
                  {{ selectedItem.buyer_offer_area?.description || "N/A" }}
                </div>
              </div>
            </div>
          </div>

          <v-divider class="my-4" />

          <v-btn
            color="primary"
            size="large"
            block
            :loading="isLoadingRequest"
            @click="requestMeeting"
          >
            <v-icon start>mdi-calendar-clock</v-icon>
            Solicitar cita
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

const routeName = "buyer_offers";
const alert = inject("alert");
const confirm = inject("confirm");
const store = useStore();
const route = useRoute();

const isLoading = ref(false);
const isLoadingDetail = ref(false);
const isLoadingRequest = ref(false);
const items = ref([]);
const search = ref("");
const isActive = ref(1);

// Dialog states
const detailDialog = ref(false);
const selectedItem = ref(null);

const eventId = computed(() => route.params.event);

const isItemsEmpty = computed(() => items.value.length === 0);
const isAdmin = computed(() => store.getUser?.role_id === 1);

const isActiveOptions = [
  { id: 1, name: "ACTIVOS" },
  { id: 0, name: "INACTIVOS" },
];

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
      (item.buyer?.name &&
        item.buyer.name.toLowerCase().includes(searchTerm)) ||
      (item.buyer?.display_id &&
        item.buyer.display_id.toLowerCase().includes(searchTerm)) ||
      (item.event_area?.name &&
        item.event_area.name.toLowerCase().includes(searchTerm)) ||
      (item.buyer_user?.email &&
        item.buyer_user.email.toLowerCase().includes(searchTerm)) ||
      (item.buyer_user?.name &&
        item.buyer_user.name.toLowerCase().includes(searchTerm))
    );
  });
});

const getItems = async () => {
  isLoading.value = true;
  items.value = [];

  try {
    const endpoint = `${URL_API}/v1/suppliers/offer_areas/buyers`;
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

// Abrir dialog de detalle
const openDetailDialog = (item) => {
  selectedItem.value = item;
  detailDialog.value = true;
};

// Solicitar cita
const requestMeeting = async () => {
  if (!selectedItem.value) return;

  const confirmed = await confirm?.show(
    `¿Confirma solicitar cita con ${selectedItem.value.buyer?.name} para el área de ${selectedItem.value.event_area?.name}?`
  );
  if (!confirmed) return;

  isLoadingRequest.value = true;

  try {
    const endpoint = `${URL_API}/v1/suppliers/meeting/requests`;

    const payload = {
      event_id: Number(getDecodeId(eventId.value)),
      event_area_id: selectedItem.value.event_area_id,
      buyer_id: selectedItem.value.buyer_id,
      buyer_user_id: selectedItem.value.buyer_user_id,
    };

    const response = await axios.post(endpoint, payload, {
      ...getHdrs({ token: store.getAuth?.token }),
    });

    if (getRsp(response)) {
      alert?.show("green-darken-1", "Solicitud de cita enviada exitosamente");
      detailDialog.value = false;
      selectedItem.value = null;
    }
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoadingRequest.value = false;
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
  display: flex;
  align-items: center;
  justify-content: center;
}

.dialog-header-store {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
  .event-header {
    height: 140px;
  }

  .dialog-header {
    height: 160px;
  }
}
</style>