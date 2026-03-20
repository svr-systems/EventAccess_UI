<template>
  <v-row justify="center">
    <v-col cols="12" class="pt-3">
      <v-card elevation="24" :loading="isLoading">
        <v-card-title>
          <v-row dense align="center">
            <v-col cols="10" class="py-4">
              <CardTitle text="Eventos disponibles" icon="mdi-calendar" />
            </v-col>
            <v-col cols="2" class="text-right py-4">
              <v-btn
                icon
                variant="flat"
                size="x-small"
                color="info"
                :to="{
                  name: 'login',
                }"
              >
                <v-icon>mdi-account</v-icon>
                <v-tooltip activator="parent" location="left">
                  Iniciar sesión
                </v-tooltip>
              </v-btn>
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
                      name: 'public_presentation_dates',
                      params: { id: getEncodeId(item.id) },
                    }"
                  >
                    <v-card-text class="pa-4">
                      <div class="d-flex justify-center mb-3">
                        <v-avatar
                          size="80"
                          color="primary-lighten-5"
                          rounded="lg"
                        >
                          <v-icon
                            size="40"
                            color="primary"
                            v-if="!item.logo_path"
                          >
                            mdi-calendar
                          </v-icon>
                          <v-img v-else :src="item.logo_path" />
                        </v-avatar>
                      </div>

                      <div class="text-h6 font-weight-bold text-center mb-2">
                        {{ item.name || "Evento sin nombre" }}
                      </div>

                      <div class="text-body-2 text-grey text-center mb-3">
                        {{ item.description || "Sin descripción" }}
                      </div>

                      <v-divider class="my-3" />

                      <div class="mb-2">
                        <div class="d-flex align-center mb-1">
                          <v-icon size="small" color="primary" class="mr-2"
                            >mdi-map-marker</v-icon
                          >
                          <div class="text-body-2 text-truncate">
                            {{ item.place_name || "Lugar no especificado" }}
                          </div>
                        </div>

                        <div class="d-flex align-center mb-1">
                          <v-icon size="small" color="primary" class="mr-2"
                            >mdi-calendar</v-icon
                          >
                          <div class="text-body-2">
                            {{ formatDate(item.next_date) }}
                          </div>
                        </div>

                        <div class="d-flex align-center">
                          <v-icon size="small" color="primary" class="mr-2"
                            >mdi-ticket</v-icon
                          >
                          <div class="text-body-2">
                            {{ formatCurrency(item.price_from) }}
                          </div>
                        </div>
                      </div>

                      <v-divider class="my-3" />

                      <div class="d-flex justify-space-between align-center">
                        <div>
                          <div class="text-caption text-grey">Disponibles</div>
                          <div class="text-body-1 font-weight-bold">
                            {{ item.tickets_available || "0" }}
                          </div>
                        </div>
                        <v-chip
                          :color="getAvailabilityColor(item.tickets_available)"
                          size="small"
                          class="text-capitalize"
                        >
                          {{ getAvailabilityText(item.tickets_available) }}
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

const router = useRouter();
const store = useStore();
const alert = inject("alert");

// Estado
const isLoading = ref(false);
const items = ref([]);
const search = ref("");

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
  if (numTickets < 20) return "Pocos";
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
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  height: 100%;
  cursor: pointer;
}

.event-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
}

.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.d-flex.justify-end.align-center.gap-2 {
  gap: 8px;
}

.bg-primary-lighten-5 {
  background-color: rgba(25, 118, 210, 0.1);
}
</style>
