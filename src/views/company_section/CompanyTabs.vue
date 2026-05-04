<template>
  <v-card elevation="24">
    <v-card-title class="d-flex align-center justify-space-between">
      <div class="d-flex align-center">
        <BtnBack
          :route="{
            name: 'company_section_events',
          }"
        />
      </div>

      <div>
        <v-btn
          v-if="eventIsActive"
          icon
          variant="flat"
          size="x-small"
          color="red"
          :loading="disablingEvent"
          @click="disableEvent"
        >
          <v-icon>mdi-delete</v-icon>
          <v-tooltip activator="parent" location="left"
            >Inhabilitar evento</v-tooltip
          >
        </v-btn>

        <v-btn
          v-else
          icon
          variant="flat"
          size="x-small"
          color="success"
          :loading="activatingEvent"
          @click="activateEvent"
        >
          <v-icon>mdi-delete-restore</v-icon>
          <v-tooltip activator="parent" location="left"
            >Activar evento</v-tooltip
          >
        </v-btn>
      </div>
    </v-card-title>

    <!-- Tabs de navegación -->
    <v-card-text class="pb-0">
      <v-tabs v-model="tab" density="compact" grow>
        <v-tab value="metrics">
          <v-icon start size="small">mdi-chart-bar</v-icon>
          Panel
        </v-tab>

        <v-tab value="information">
          <v-icon start size="small">mdi-information</v-icon>
          Información
        </v-tab>

        <v-tab value="tickets">
          <v-icon start size="small">mdi-ticket</v-icon>
          Tickets
        </v-tab>

        <v-tab value="stands">
          <v-icon start size="small">mdi-storefront</v-icon>
          Stands
        </v-tab>

        <v-tab value="networking">
          <v-icon start size="small">mdi-account-group</v-icon>
          Citas B2B
        </v-tab>
      </v-tabs>
    </v-card-text>

    <v-card-text>
      <router-view />
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, computed, watch, onMounted, inject } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getEncodeId, getDecodeId } from "@/utils/coders";
import axios from "axios";

import { useStore } from "@/store";
import { URL_API } from "@/utils/config";
import { getHdrs, getErr, getRsp } from "@/utils/http";
import CardTitle from "@/components/CardTitle.vue";
import BtnBack from "@/components/BtnBack.vue";

const route = useRoute();
const router = useRouter();
const store = useStore();
const alert = inject("alert");
const confirm = inject("confirm");

const pageTitle = computed(() => route.meta?.title);
const pageIcon = computed(() => route.meta?.icon);
const disablingEvent = ref(false);
const activatingEvent = ref(false);
const eventIsActive = ref(true);
const eventInfoLoading = ref(true);

const eventIdEncoded = computed(() => route.params.event);
const eventIdDecoded = ref(null);

const authHdrs = (useFormData = false) =>
  getHdrs({ token: store.getAuth?.token, useFormData });

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
  metrics: "event_metrics",
  information: "event_information",
  tickets: "event_tickets",
  stands: "event_stands_configs",
  networking: "event_networking",
};

const tab = ref("metrics");

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

// Función para obtener información del evento
const getEventInfo = async () => {
  if (!eventIdDecoded.value) return;

  eventInfoLoading.value = true;

  try {
    const endpoint = `${URL_API}/v1/company/events/${eventIdDecoded.value}`;
    const response = await axios.get(endpoint, authHdrs());
    const data = getRsp(response)?.data?.item || null;

    if (data) {
      eventIsActive.value = data.is_active === true;
    }
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    eventInfoLoading.value = false;
  }
};

// Función para inhabilitar el evento
const disableEvent = async () => {
  const confirmed = await confirm?.show("¿Confirma inhabilitar este evento?");
  if (!confirmed) return;

  disablingEvent.value = true;

  try {
    const endpoint = `${URL_API}/v1/company/events/${eventIdDecoded.value}`;
    await axios.delete(endpoint, authHdrs());

    alert?.show("success", "Evento inhabilitado correctamente");
    eventIsActive.value = false;
    router.push({ name: "company_section_events" });
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    disablingEvent.value = false;
  }
};

// Función para activar el evento
const activateEvent = async () => {
  const confirmed = await confirm?.show("¿Confirma activar este evento?");
  if (!confirmed) return;

  activatingEvent.value = true;

  try {
    const endpoint = `${URL_API}/v1/company/events/${eventIdDecoded.value}/activate`;
    await axios.patch(endpoint, {}, authHdrs());

    alert?.show("success", "Evento activado correctamente");
    eventIsActive.value = true;
    router.push({ name: "company_section_events" });
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    activatingEvent.value = false;
  }
};

onMounted(async () => {
  if (route.name === "company_tabs" && eventIdEncoded.value) {
    router.replace({
      name: "event_metrics",
      params: { event: eventIdEncoded.value },
    });
  }

  // Esperar a que eventIdDecoded esté disponible
  await new Promise((resolve) => setTimeout(resolve, 100));
  await getEventInfo();
});

const eventId = computed(() => eventIdDecoded.value);
</script>