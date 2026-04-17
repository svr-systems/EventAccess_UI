<template>
  <v-card elevation="24">
    <v-card-title class="d-flex align-center justify-space-between">
      <div class="d-flex align-center">
        <BtnBack
          :route="{
            name: 'event_buyers/show',
            params: {
              id: getEncodeId(eventId),
            },
          }"
        />
        <CardTitle :text="pageTitle" :icon="pageIcon" />
      </div>
    </v-card-title>

    <!-- Tabs de navegación -->
    <v-card-text class="pb-0">
      <v-tabs v-model="tab" density="compact" grow>
        <v-tab value="offers">
          <v-icon start size="small">mdi-tag</v-icon>
          Mis ofertas
        </v-tab>

        <v-tab value="agenda">
          <v-icon start size="small">mdi-calendar-clock</v-icon>
          Mi agenda
        </v-tab>

        <v-tab value="pending">
          <v-icon start size="small">mdi-clock-outline</v-icon>
          Pendientes
        </v-tab>

        <v-tab value="search">
          <v-icon start size="small">mdi-account-search</v-icon>
          Buscar proveedor
        </v-tab>
      </v-tabs>
    </v-card-text>

    <v-card-text>
      <router-view />
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getEncodeId, getDecodeId } from "@/utils/coders";
import CardTitle from "@/components/CardTitle.vue";
import BtnBack from "@/components/BtnBack.vue";

const route = useRoute();
const router = useRouter();

const pageTitle = computed(() => route.meta?.title);
const pageIcon = computed(() => route.meta?.icon);

const eventIdEncoded = computed(() => route.params.event);

const eventIdDecoded = ref(null);

const safeDecodeId = (encodedId) => {
  if (!encodedId) return null;
  try {
    if (!isNaN(encodedId)) return encodedId;
    return getDecodeId(encodedId);
  } catch (error) {
    console.warn("Error decoding event ID:", error);
    return encodedId;
  }
};

watch(
  () => eventIdEncoded.value,
  (newVal) => {
    eventIdDecoded.value = safeDecodeId(newVal);
  },
  { immediate: true }
);

const tabRoutes = {
  offers: "buyer_offers_areas",
  agenda: "meetings",
  pending: "meetings_requests",
  search: "search_suppliers",
};

const tab = ref("offers");

watch(
  () => route.name,
  (newRouteName) => {
    for (const [key, routeName] of Object.entries(tabRoutes)) {
      if (routeName === newRouteName) {
        tab.value = key;
        break;
      }
    }
  },
  { immediate: true }
);

watch(tab, (newTab) => {
  const routeName = tabRoutes[newTab];
  const currentRouteName = route.name;

  if (routeName && routeName !== currentRouteName && eventIdEncoded.value) {
    router.push({
      name: routeName,
      params: { event: eventIdEncoded.value },
    });
  }
});

onMounted(() => {
  if (route.name === "buyer_tabs" && eventIdEncoded.value) {
    router.replace({
      name: "buyer_offers_areas",
      params: { event: eventIdEncoded.value },
    });
  }
});

const eventId = computed(() => eventIdDecoded.value);
</script>