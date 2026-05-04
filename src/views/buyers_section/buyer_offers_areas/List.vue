<template>
  <v-card elevation="24" :loading="isLoading">
    <v-card-title class="d-flex align-center justify-space-between">
      <div class="d-flex align-center"></div>

      <div>
        <v-btn
          icon
          variant="flat"
          size="x-small"
          color="success"
          :to="{
            name: `${routeName}/store`,
            params: {
              event: eventId,
            },
          }"
        >
          <v-icon>mdi-plus</v-icon>
          <v-tooltip activator="parent" location="bottom"
            >Crear oferta</v-tooltip
          >
        </v-btn>
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
            :disabled="isItemsEmpty"
          />
        </v-col>

        <v-col cols="12">
          <div
            v-if="filteredItems.length === 0 && !isLoading"
            class="text-center py-8"
          >
            <v-icon size="60" color="grey-lighten-1" class="mb-4">
              mdi-book-clock
            </v-icon>
            <div class="text-h6 text-grey">No hay ofertas disponibles</div>
            <div class="text-body-2 text-grey mt-2">
              No se encontraron ofertas para mostrar
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
                  name: `${routeName}/show`,
                  params: {
                    id: getEncodeId(item.id),
                    event: eventId,
                  },
                }"
              >
                <div class="event-header">
                  <div class="event-cover-placeholder">
                    <v-icon size="60" color="white">mdi-clock-outline</v-icon>
                  </div>
                </div>

                <v-card-text class="pa-4">
                  <div class="text-h6 font-weight-bold text-center mb-1 mt-2">
                    {{ item.event_area.name || "Sin área" }}
                  </div>

                  <div class="text-body-3 text-center">
                    {{ item.description || "Sin descripción" }}
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

const routeName = "buyer_offers_areas";
const alert = inject("alert");
const store = useStore();
const route = useRoute();

const isLoading = ref(false);
const items = ref([]);
const companies = ref([]);
const companyId = ref(null);
const search = ref("");
const isActive = ref(1);
const tab = ref("offers");

const isItemsEmpty = computed(() => items.value.length === 0);
const isAdmin = computed(() => store.getUser?.role_id === 1);

const eventId = computed(() => route.params.event);

const isActiveOptions = [
  { id: 1, name: "ACTIVOS" },
  { id: 0, name: "INACTIVOS" },
];

// Filtrar items según búsqueda
const filteredItems = computed(() => {
  if (!search.value) return items.value;

  const searchTerm = search.value.toLowerCase();
  return items.value.filter((item) => {
    return (
      (item.display_id && item.display_id.toLowerCase().includes(searchTerm)) ||
      (item.description && item.description.toLowerCase().includes(searchTerm))
    );
  });
});

const getItems = async () => {
  isLoading.value = true;
  items.value = [];

  try {
    const endpoint = `${URL_API}/v1/buyers/offer_areas`;
    const response = await axios.get(endpoint, {
      params: {
        is_active: isActive.value,
        event_id: getDecodeId(eventId.value),
      },
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
  background: linear-gradient(135deg, #42a5f5 0%, #1e88e5 100%);
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