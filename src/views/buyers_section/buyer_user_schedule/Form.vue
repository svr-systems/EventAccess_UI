<template>
  <v-card elevation="24" :loading="isLoading">
    <v-card-title class="d-flex align-center justify-space-between">
      <div class="d-flex align-center">
        <BtnBack
          :route="{
            name: 'meetings',
            params: {
              event: eventId,
            },
          }"
        />
        <CardTitle
          text="Configurar horarios de atención"
          icon="mdi-clock-edit"
        />
      </div>

      <div />
    </v-card-title>

    <v-card-text v-if="!isLoading">
      <v-form ref="formRef" autocomplete="off" @submit.prevent="handleSave">
        <v-row>
          <v-col cols="12">
            <v-card>
              <v-card-text>
                <v-row dense>
                  <v-col
                    v-for="(schedule, index) in schedules"
                    :key="schedule.id || index"
                    cols="12"
                  >
                    <v-row dense align="center">
                      <v-col cols="12" md="3">
                        <div
                          class="text-subtitle-1 font-weight-medium text-primary"
                        >
                          {{ formatDate(schedule.presentation_date?.date) }}
                        </div>
                        <div class="text-caption text-grey">
                          Horario: {{ schedule.start_time || "--:--" }} -
                          {{ schedule.end_time || "--:--" }}
                        </div>
                      </v-col>

                      <v-col cols="6" md="3">
                        <v-text-field
                          v-model="schedule.buyer_user_schedule.start_time"
                          label="Hora de inicio"
                          type="time"
                          variant="outlined"
                          density="compact"
                          :rules="rules.timeRequired"
                        />
                      </v-col>

                      <v-col cols="6" md="3">
                        <v-text-field
                          v-model="schedule.buyer_user_schedule.end_time"
                          label="Hora de cierre"
                          type="time"
                          variant="outlined"
                          density="compact"
                          :rules="rules.timeRequired"
                        />
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12">
            <div class="text-right">
              <v-btn
                type="submit"
                icon
                variant="flat"
                size="x-small"
                color="success"
                :loading="isSaving"
              >
                <v-icon>mdi-check</v-icon>
                <v-tooltip activator="parent" location="left">
                  Guardar configuración
                </v-tooltip>
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>

    <v-card-text v-else-if="isLoading && schedules.length === 0">
      <div class="text-center py-8">
        <v-icon size="60" color="grey-lighten-1" class="mb-4">
          mdi-clock-outline
        </v-icon>
        <div class="text-h6 text-grey">Cargando horarios...</div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, onMounted, computed, inject } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

import { useStore } from "@/store";
import { URL_API } from "@/utils/config";
import { getHdrs, getErr, getRsp } from "@/utils/http";
import { getEncodeId, getDecodeId } from "@/utils/coders";
import { getRules } from "@/utils/validators";

import BtnBack from "@/components/BtnBack.vue";
import CardTitle from "@/components/CardTitle.vue";

const alert = inject("alert");
const confirm = inject("confirm");
const store = useStore();
const router = useRouter();
const route = useRoute();

const isLoading = ref(true);
const isSaving = ref(false);
const formRef = ref(null);
const schedules = ref([]);
const rules = getRules();

const eventId = computed(() => route.params.event);

const authHdrs = () => getHdrs({ token: store.getAuth?.token });

// Función para formatear fecha
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
};

// Obtener los horarios del usuario
const getItems = async () => {
  isLoading.value = true;

  try {
    const endpoint = `${URL_API}/v1/buyers/user_schedules`;
    const response = await axios.get(endpoint, {
      params: { event_id: getDecodeId(eventId.value) },
      ...authHdrs(),
    });

    const items = getRsp(response)?.data?.items || [];

    schedules.value = items.map((item) => ({
      id: item.id,
      is_active: item.is_active,
      event_id: item.event_id,
      presentation_date_id: item.presentation_date_id,
      start_time: item.start_time,
      end_time: item.end_time,
      display_id: item.display_id,
      presentation_date: item.presentation_date,
      buyer_user_schedule: {
        id: item.buyer_user_schedule?.id || null,
        is_active: item.buyer_user_schedule?.is_active ?? true,
        event_id: item.buyer_user_schedule?.event_id || item.event_id,
        presentation_date_id:
          item.buyer_user_schedule?.presentation_date_id ||
          item.presentation_date_id,
        start_time: item.buyer_user_schedule?.start_time || "",
        end_time: item.buyer_user_schedule?.end_time || "",
        display_id: item.buyer_user_schedule?.display_id || null,
      },
    }));
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

// Guardar configuración
const handleSave = async () => {
  let isValid = true;
  for (let i = 0; i < schedules.value.length; i++) {
    const startTime = schedules.value[i].buyer_user_schedule.start_time;
    const endTime = schedules.value[i].buyer_user_schedule.end_time;

    if (!startTime || !endTime) {
      alert?.show(
        "red-darken-1",
        `Debe completar ambos horarios para la fecha ${formatDate(
          schedules.value[i].presentation_date?.date
        )}`
      );
      isValid = false;
      break;
    }
  }

  if (!isValid) return;

  const confirmed = await confirm?.show(
    "¿Confirma guardar la configuración de horarios?"
  );
  if (!confirmed) return;

  isSaving.value = true;

  try {
    const buyerUserSchedules = schedules.value.map((schedule) => ({
      id: schedule.buyer_user_schedule.id,
      is_active: schedule.buyer_user_schedule.is_active,
      event_id: schedule.buyer_user_schedule.event_id,
      presentation_date_id: schedule.buyer_user_schedule.presentation_date_id,
      start_time: schedule.buyer_user_schedule.start_time,
      end_time: schedule.buyer_user_schedule.end_time,
      display_id: schedule.buyer_user_schedule.display_id,
    }));

    const payload = {
      buyer_user_schedules: buyerUserSchedules,
    };

    const endpoint = `${URL_API}/v1/buyers/user_schedules`;
    const response = await axios.post(endpoint, payload, authHdrs());

    const rsp = getRsp(response);
    alert?.show(
      "success",
      rsp?.message || "Configuración guardada exitosamente"
    );

    await getItems();
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isSaving.value = false;
  }
};

onMounted(() => {
  getItems();
});
</script>