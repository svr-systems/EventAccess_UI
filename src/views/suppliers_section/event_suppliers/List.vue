<template>
  <v-card elevation="24" :loading="isLoading">
    <v-card-title class="d-flex align-center justify-space-between">
      <div class="d-flex align-center">
        <CardTitle :text="route.meta.title" :icon="route.meta.icon" />
      </div>
    </v-card-title>

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
          />
        </v-col>

        <v-col cols="12">
          <div
            v-if="filteredItems.length === 0 && !isLoading"
            class="text-center py-8"
          >
            <v-icon size="60" color="grey-lighten-1" class="mb-4">
              mdi-calendar
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
                  name: 'event_suppliers/show',
                  params: {
                    id: getEncodeId(item.event_id),
                  },
                }"
              >
                <div class="event-header">
                  <v-img
                    v-if="getLogoUrl(item.events)"
                    :src="getLogoUrl(item.events)"
                    class="event-cover-image"
                    cover
                  />
                  <div v-else class="event-cover-placeholder">
                    <v-icon size="60" color="white">mdi-calendar</v-icon>
                  </div>
                </div>

                <v-card-text class="pa-4">
                  <div class="text-h6 font-weight-bold text-center mb-1 mt-2">
                    {{ item.events?.name || "Evento sin nombre" }}
                  </div>

                  <div class="text-body-3 text-center mb-3">
                    {{ item.events?.description || "Sin descripción" }}
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
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

const alert = inject("alert");
const store = useStore();
const route = useRoute();

const isLoading = ref(false);
const items = ref([]);
const search = ref("");
const isActive = ref(1);

const isItemsEmpty = computed(() => items.value.length === 0);
const isAdmin = computed(() => store.getUser?.role_id === 1);

const isActiveOptions = [
  { id: 1, name: "ACTIVOS" },
  { id: 0, name: "INACTIVOS" },
];

// Función para obtener la URL del logo desde base64
const getLogoUrl = (event) => {
  if (event?.logo_b64 && event.logo_b64.content) {
    return `data:${event.logo_b64.mime};base64,${event.logo_b64.content}`;
  }
  return null;
};

// Filtrar items según búsqueda
const filteredItems = computed(() => {
  if (!search.value) return items.value;

  const searchTerm = search.value.toLowerCase();
  return items.value.filter((item) => {
    return (
      (item.events?.name &&
        item.events.name.toLowerCase().includes(searchTerm)) ||
      (item.events?.description &&
        item.events.description.toLowerCase().includes(searchTerm)) ||
      (item.display_id && item.display_id.toLowerCase().includes(searchTerm))
    );
  });
});

const getItems = async () => {
  isLoading.value = true;
  items.value = [];

  try {
    const endpoint = `${URL_API}/v1/suppliers/events/supplier`;
    const response = await axios.get(endpoint, {
      params: { is_active: isActive.value },
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

.availability-section {
  padding: 8px 12px;
  border-radius: 8px;
  margin-top: 8px;
}

.text-body-3 {
  font-size: 0.8125rem;
  line-height: 1.4;
}

@media (max-width: 600px) {
  .event-header {
    height: 140px;
  }
}
</style>