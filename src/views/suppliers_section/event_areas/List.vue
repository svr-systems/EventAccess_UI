<template>
  <v-card elevation="24" :disabled="isLoading" :loading="isLoading">
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title class="d-flex align-center justify-space-between">
              <div class="d-flex align-center">
                <CardTitle text="ÁREAS DE SERVICIO" sub />
              </div>

              <div />
            </v-card-title>

            <v-card-text>
              <v-row dense>
                <v-col cols="12">
                  <div class="text-caption text-grey mb-4">
                    Selecciona las áreas de servicio que ofreces
                  </div>
                  <div class="d-flex flex-wrap ga-2">
                    <v-btn
                      v-for="area in eventAreas"
                      :key="area.id"
                      :color="
                        isAreaSelected(area.id) ? 'primary' : 'grey-lighten-2'
                      "
                      :variant="isAreaSelected(area.id) ? 'flat' : 'outlined'"
                      size="small"
                      rounded="pill"
                      :disabled="isLoading"
                      @click="toggleArea(area.id, area.is_checked)"
                      class="text-capitalize"
                    >
                      <v-icon v-if="isAreaSelected(area.id)" start size="small">
                        mdi-check
                      </v-icon>
                      {{ area.name }}
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, inject, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";

import { useStore } from "@/store";
import { URL_API } from "@/utils/config";
import { getHdrs, getErr, getRsp } from "@/utils/http";
import { getDecodeId, getEncodeId } from "@/utils/coders";
import { getRules } from "@/utils/validators";

import BtnBack from "@/components/BtnBack.vue";
import CardTitle from "@/components/CardTitle.vue";

const alert = inject("alert");
const store = useStore();
const router = useRouter();
const route = useRoute();

const isLoading = ref(false);
const eventAreas = ref([]);
const eventAreasLoading = ref(true);

const rules = getRules();

const eventId = computed(() => route.params.event);

const authHdrs = (useFormData = false) =>
  getHdrs({ token: store.getAuth?.token, useFormData });

// Función para verificar si un área está seleccionada
const isAreaSelected = (areaId) => {
  const area = eventAreas.value.find((a) => a.id === areaId);
  return area ? area.is_checked === 1 : false;
};

// Función para cambiar el estado de un área y enviar al backend
const toggleArea = async (areaId, currentChecked) => {
  if (isLoading.value) return;

  isLoading.value = true;

  const newChecked = currentChecked === 1 ? 0 : 1;

  const areaIndex = eventAreas.value.findIndex((a) => a.id === areaId);
  if (areaIndex !== -1) {
    eventAreas.value[areaIndex].is_checked = newChecked;
  }

  try {
    const payload = { event_area_id: Number(areaId) };
    const endpoint = `${URL_API}/v1/suppliers/events/areas`;

    await axios.post(endpoint, payload, authHdrs());
  } catch (err) {
    if (areaIndex !== -1) {
      eventAreas.value[areaIndex].is_checked = currentChecked;
    }
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

const getItems = async () => {
  eventAreasLoading.value = true;

  try {
    const endpoint = `${URL_API}/v1/suppliers/events/areas`;
    const response = await axios.get(endpoint, {
      params: { event_id: getDecodeId(eventId.value) },
      ...getHdrs({ token: store.getAuth?.token }),
    });
    eventAreas.value = getRsp(response)?.data?.items || [];
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    eventAreasLoading.value = false;
  }
};

onMounted(() => {
  getItems();
});
</script>