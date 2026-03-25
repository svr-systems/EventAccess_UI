<template>
  <v-card elevation="24" :disabled="isLoading">
    <v-card-title class="d-flex align-center justify-space-between">
      <div class="d-flex align-center">
        <BtnBack
          :route="{
            name: 'offers',
            params: {
              supplier: getEncodeId(supplierId),
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

            <template #item.has_electricity="{ item }">
                {{ item.has_electricity === 1 ? "Sí" : "No" }}
            </template>

            <template #item.has_water="{ item }">
                {{ item.has_water === 1 ? "Sí" : "No" }}
            </template>

            <template #item.has_internet="{ item }">
                {{ item.has_internet === 1 ? "Sí" : "No" }}
            </template>

            <template #item.action="{ item }">
              <div class="text-right">
                <v-btn
                  icon
                  variant="text"
                  size="x-small"
                  color="warning"
                  :to="{
                    name: 'stand_allocations',
                    params: {
                      event_stand_config: getEncodeId(item.id),
                      offer: getEncodeId(offerId),
                      supplier: getEncodeId(supplierId),
                      event: getEncodeId(eventId),
                    },
                  }"
                >
                  <v-icon>mdi-selection-marker</v-icon>
                  <v-tooltip activator="parent" location="left"
                    >Ver asignaciones de estantes</v-tooltip
                  >
                </v-btn>
                <v-btn
                  icon
                  variant="text"
                  size="x-small"
                  color="info"
                  :to="{
                    name: 'stand_requests',
                    params: {
                      event_stand_config: getEncodeId(item.id),
                      offer: getEncodeId(offerId),
                      supplier: getEncodeId(supplierId),
                      event: getEncodeId(eventId),
                    },
                  }"
                >
                  <v-icon>mdi-fireplace-off</v-icon>
                  <v-tooltip activator="parent" location="left"
                    >Ver solicitudes de estantes</v-tooltip
                  >
                </v-btn>
                <v-btn
                  icon
                  variant="text"
                  size="x-small"
                  color="success"
                  @click="handleRequestAction(item.id)"
                  :loading="loadingItemId === item.id"
                >
                  <v-icon>mdi-send</v-icon>
                  <v-tooltip activator="parent" location="left"
                    >Enviar solicitud de estante</v-tooltip
                  >
                </v-btn>
              </div>
            </template>
          </v-data-table>
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
import { b64ToFile, getFormData, toStorePayload } from "@/utils/helpers";
import CardTitle from "@/components/CardTitle.vue";
import BtnBack from "@/components/BtnBack.vue";

const routeName = "event_stand_config";
const alert = inject("alert");
const confirm = inject("confirm");
const store = useStore();
const route = useRoute();

const isLoading = ref(false);
const items = ref([]);
const companies = ref([]);
const companyId = ref(null);
const search = ref("");
const isActive = ref(1);
const loadingItemId = ref(null);

const isItemsEmpty = computed(() => items.value.length === 0);
const isAdmin = computed(() => store.getUser?.role_id === 1);

const offerId = ref(
  route.params.offer ? getDecodeId(route.params.offer) : null
);
const supplierId = ref(
  route.params.supplier ? getDecodeId(route.params.supplier) : null
);
const eventId = ref(
  route.params.event ? getDecodeId(route.params.event) : null
);

const authHdrs = (useFormData = false) =>
  getHdrs({ token: store.getAuth?.token, useFormData });

const isActiveOptions = [
  { id: 1, name: "ACTIVOS" },
  { id: 0, name: "INACTIVOS" },
];

const headers = [
  { title: "#", key: "index", filterable: false, sortable: false, width: 60 },
  { title: "Precio", key: "price" },
  { title: "Capacidad", key: "capacity" },
  { title: "Largo del estante (m)", key: "size_length" },
  { title: "Ancho del estante (m)", key: "size_width" },
  { title: "Alto del estante (m)", key: "size_width" },
  { title: "¿Tiene electricidad?", key: "size_height" },
  { title: "¿Tiene agua?", key: "has_water" },
  { title: "¿Tiene internet?", key: "has_internet" },
  { title: "", key: "action", filterable: false, sortable: false, width: 180 },
];

const getItems = async () => {
  isLoading.value = true;
  items.value = [];

  try {
    const endpoint = `${URL_API}/v1/suppliers/event_stand_configs`;
    const response = await axios.get(endpoint, {
      params: { offer_id: offerId.value },
      ...getHdrs({ token: store.getAuth?.token }),
    });

    items.value = getRsp(response)?.data?.items || [];
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

const handleRequestAction = async (eventStandConfigId) => {
  const confirmed = await confirm?.show(`¿Confirma enviar la solicitud?`);
  if (!confirmed) return;

  loadingItemId.value = eventStandConfigId;

  try {
    const payload = {
      event_id: eventId.value,
      offer_id: offerId.value,
      supplier_id: supplierId.value,
      event_stand_config_id: eventStandConfigId,
    };
    const formData = getFormData(payload);

    const endpoint = `${URL_API}/v1/suppliers/stand_requests`;

    const response = await axios.post(endpoint, formData, authHdrs(true));

    const rsp = getRsp(response);
    alert?.show("success", "Solicitud enviada con exito");

    await getItems();
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    loadingItemId.value = null;
  }
};

onMounted(() => {
  getItems();
});
</script>
