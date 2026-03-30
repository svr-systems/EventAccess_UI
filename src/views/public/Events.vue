<template>
  <v-row justify="center">
    <v-col cols="12" class="pt-3">
      <v-card elevation="24" :loading="isLoading">
        <v-card-title>
          <v-row dense align="center">
            <v-col cols="10" class="py-4">
              <CardTitle text="Eventos disponibles" icon="mdi-calendar" />
            </v-col>
          </v-row>
        </v-card-title>

        <v-card-text>
          <v-row dense>
            <v-col cols="12">
              <v-text-field
                v-model="search"
                label="Buscar eventos"
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
                <div class="text-h6 text-grey">No hay eventos disponibles</div>
                <div class="text-body-2 text-grey mt-2">
                  No se encontraron eventos para mostrar
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
                    :to="{
                      name: 'event_details',
                      params: { id: getEncodeId(item.id) },
                    }"
                  >
                    <div class="event-header">
                      <v-img
                        v-if="getLogoUrl(item)"
                        :src="getLogoUrl(item)"
                        class="event-cover-image"
                        cover
                      />
                      <div v-else class="event-cover-placeholder">
                        <v-icon size="60" color="white">mdi-calendar</v-icon>
                      </div>
                    </div>

                    <v-card-text class="pa-4">
                      <div
                        class="text-h6 font-weight-bold text-center mb-1 mt-2"
                      >
                        {{ item.name || "Evento sin nombre" }}
                      </div>

                      <div class="text-body-3 text-center mb-3">
                        {{ item.description || "Sin descripción" }}
                      </div>

                      <v-divider class="my-3" />

                      <div class="info-section">
                        <div class="info-item">
                          <v-icon size="small" color="primary" class="mr-2"
                            >mdi-map-marker</v-icon
                          >
                          <div class="text-body-2 text-truncate">
                            {{ item.place_name || "Lugar no especificado" }}
                          </div>
                        </div>

                        <div class="info-item">
                          <v-icon size="small" color="primary" class="mr-2"
                            >mdi-calendar</v-icon
                          >
                          <div class="text-body-2">
                            {{ formatDate(item.next_date) }}
                          </div>
                        </div>

                        <div class="info-item">
                          <v-icon size="small" color="primary" class="mr-2"
                            >mdi-ticket</v-icon
                          >
                          <div class="text-body-2 font-weight-bold">
                            Desde {{ formatCurrency(item.price_from) }}
                          </div>
                        </div>
                      </div>

                      <v-divider class="my-3" />

                      <div class="availability-section">
                        <div
                          class="d-flex justify-space-between align-center mb-1"
                        >
                          <div class="text-caption">Disponibilidad</div>
                          <div class="text-body-2 font-weight-bold">
                            {{ item.tickets_available || "0" }} boletos
                          </div>
                        </div>

                        <v-progress-linear
                          :model-value="
                            getAvailabilityPercentage(item.tickets_available)
                          "
                          :color="getAvailabilityColor(item.tickets_available)"
                          height="8"
                          rounded
                          class="mb-2"
                        />
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
  </v-row>
</template>

<script setup>
import { ref, computed, inject, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

import { useStore } from "@/store";
import { URL_API } from "@/utils/config";
import { getHdrs, getErr, getRsp } from "@/utils/http";
import { getEncodeId, getDecodeId } from "@/utils/coders";
import CardTitle from "@/components/CardTitle.vue";
import BtnTheme from "@/components/BtnTheme.vue";

const router = useRouter();
const store = useStore();
const alert = inject("alert");

// Estado
const isLoading = ref(false);
const items = ref([]);
const search = ref("");

// Función para obtener la URL del logo desde base64
const getLogoUrl = (item) => {
  if (item.logo_b64 && item.logo_b64.content) {
    return `data:${item.logo_b64.mime};base64,${item.logo_b64.content}`;
  }
  return null;
};

// Calcular porcentaje de disponibilidad
const getAvailabilityPercentage = (tickets) => {
  const numTickets = parseInt(tickets) || 0;
  // Asumiendo que 1000 es la capacidad máxima, ajusta según tu caso
  const maxCapacity = 1000;
  const percentage = (numTickets / maxCapacity) * 100;
  return Math.min(percentage, 100);
};

// Filtrar items según búsqueda
const filteredItems = computed(() => {
  if (!search.value) return items.value;

  const searchTerm = search.value.toLowerCase();
  return items.value.filter((item) => {
    return (
      (item.name && item.name.toLowerCase().includes(searchTerm)) ||
      (item.description &&
        item.description.toLowerCase().includes(searchTerm)) ||
      (item.place_name && item.place_name.toLowerCase().includes(searchTerm)) ||
      (item.address && item.address.toLowerCase().includes(searchTerm))
    );
  });
});

// Funciones de formato
const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return "$0.00";

  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  }).format(amount);
};

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

// Funciones de disponibilidad
const getAvailabilityColor = (tickets) => {
  const numTickets = parseInt(tickets) || 0;
  if (numTickets === 0) return "error";
  if (numTickets < 20) return "warning";
  return "success";
};

const getAvailabilityText = (tickets) => {
  const numTickets = parseInt(tickets) || 0;
  if (numTickets === 0) return "Agotado";
  if (numTickets < 20) return "Pocos boletos";
  return "Disponible";
};

// Cargar eventos
const getItems = async () => {
  isLoading.value = true;
  items.value = [];

  try {
    const endpoint = `${URL_API}/v1/public/events`;
    const response = await axios.get(endpoint, {
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
  height: 200px;
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
}

.event-cover-placeholder .v-icon {
  opacity: 0.8;
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

.availability-section {
  padding: 12px;
  border-radius: 8px;
  margin-top: 8px;
}

.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.text-body-3 {
  font-size: 0.8125rem;
  line-height: 1.4;
}

@media (max-width: 600px) {
  .event-header {
    height: 160px;
  }
}
</style>