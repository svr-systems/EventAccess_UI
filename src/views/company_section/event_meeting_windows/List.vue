<template>
  <v-card elevation="24" :loading="isLoading">
    <v-card-title class="d-flex align-center justify-end">
      <div class="d-flex align-center ga-3">
        <v-btn
          color="success"
          variant="flat"
          size="small"
          prepend-icon="mdi-plus"
          @click="openCreateDialog"
        >
          Nuevo horario
        </v-btn>

        <v-divider vertical class="mx-2" />

        <div class="d-flex align-center">
          <span class="text-body-2 text-grey-darken-1 mr-2">Citas B2B</span>
          <v-switch
            v-model="hasBuyers"
            color="success"
            hide-details
            :loading="switchLoading"
            :disabled="switchLoading"
            @update:model-value="toggleBuyers"
          />
        </div>
      </div>
    </v-card-title>

    <v-card-text v-if="hasBuyers">
      <!-- Sección: Ajustes -->
      <v-row>
        <v-col cols="12">
          <v-card class="mb-6">
            <v-card-title class="d-flex align-center justify-space-between">
              <span class="text-h6 font-weight-bold">Ajustes</span>
              <v-btn
                icon
                variant="flat"
                size="x-small"
                color="primary"
                @click="openTimeDialog"
              >
                <v-icon>mdi-pencil</v-icon>
                <v-tooltip activator="parent" location="left">Editar</v-tooltip>
              </v-btn>
            </v-card-title>

            <v-divider />

            <v-card-text>
              <div class="info-item">
                <v-icon size="small" color="primary" class="mr-2"
                  >mdi-clock</v-icon
                >
                <span class="text-body-2"
                  >Tiempo por reunión: {{ meetingTime }} minutos</span
                >
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Sección: Horario de reuniones -->
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title class="text-h6 font-weight-bold">
              Horario de reuniones
            </v-card-title>

            <v-divider />

            <v-card-text>
              <div
                v-if="meetingWindows.length === 0 && !isLoading"
                class="text-center py-8"
              >
                <v-icon size="60" color="grey-lighten-1" class="mb-4">
                  mdi-calendar-clock
                </v-icon>
                <div class="text-h6 text-grey">
                  No hay horarios de reuniones configurados
                </div>
                <div class="text-body-2 text-grey mt-2">
                  Haz clic en "Nuevo horario" para comenzar
                </div>
              </div>

              <v-row v-if="!isLoading && meetingWindows.length > 0" dense>
                <v-col
                  v-for="window in meetingWindows"
                  :key="window.id"
                  cols="12"
                  md="6"
                  lg="4"
                >
                  <v-card elevation="6" class="window-card">
                    <v-card-title
                      class="d-flex align-center justify-space-between pb-4 pt-4"
                    >
                      <span class="text-h6 font-weight-bold">
                        {{ window.display_id }}
                      </span>
                      <v-btn
                        icon
                        variant="flat"
                        size="x-small"
                        color="primary"
                        @click="openEditDialog(window)"
                      >
                        <v-icon>mdi-pencil</v-icon>
                        <v-tooltip activator="parent" location="left"
                          >Editar</v-tooltip
                        >
                      </v-btn>
                    </v-card-title>

                    <v-divider />

                    <v-card-text>
                      <div class="info-section">
                        <div class="info-item">
                          <v-icon size="small" color="primary" class="mr-2"
                            >mdi-calendar</v-icon
                          >
                          <span class="text-body-2">
                            Fecha:
                            {{ formatDate(window.presentation_date?.date) }}
                          </span>
                        </div>

                        <div class="info-item">
                          <v-icon size="small" color="primary" class="mr-2"
                            >mdi-clock</v-icon
                          >
                          <span class="text-body-2">
                            Horario: {{ formatTime(window.start_time) }} -
                            {{ formatTime(window.end_time) }}
                          </span>
                        </div>

                        <div class="info-item">
                          <v-icon size="small" color="primary" class="mr-2"
                            >mdi-information</v-icon
                          >
                          <span class="text-body-2">
                            Horario del evento:
                            {{
                              formatTime(window.presentation_date?.start_time)
                            }}
                            -
                            {{ formatTime(window.presentation_date?.end_time) }}
                          </span>
                        </div>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-text v-else-if="!hasBuyers && !isLoading">
      <div class="text-center py-8">
        <v-icon size="60" color="grey-lighten-1" class="mb-4">
          mdi-calendar-clock
        </v-icon>
        <div class="text-h6 text-grey">Módulo de citas desactivado</div>
        <div class="text-body-2 text-grey mt-2">
          Activa el módulo para comenzar a configurar los horarios de reuniones
        </div>
      </div>
    </v-card-text>

    <!-- Dialog: Editar tiempo por reunión -->
    <v-dialog v-model="timeDialog" max-width="400px">
      <v-card>
        <v-card-title class="d-flex align-center justify-space-between">
          <span>Editar tiempo por reunión</span>
          <v-btn icon variant="text" size="small" @click="timeDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-divider />

        <v-card-text class="pa-4">
          <v-text-field
            v-model="tempMeetingTime"
            label="Tiempo por reunión (minutos)"
            type="number"
            variant="outlined"
            density="compact"
            :rules="rules.requiredNumber"
          />
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn
            color="success"
            variant="flat"
            icon
            size="x-small"
            :loading="timeSaving"
            @click="saveMeetingTime"
          >
            <v-icon>mdi-check</v-icon>
            <v-tooltip activator="parent" location="left">Guardar</v-tooltip>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog: Crear/Editar horario de reunión -->
    <v-dialog v-model="windowDialog" max-width="600px">
      <v-card>
        <v-card-title class="d-flex align-center justify-space-between">
          <span>{{ isEditMode ? "Editar horario" : "Nuevo horario" }}</span>
          <v-btn icon variant="text" size="small" @click="windowDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-divider />

        <v-card-text class="pa-4">
          <v-form ref="formRef" @submit.prevent="saveWindow">
            <v-row dense>
              <v-col cols="12">
                <v-select
                  v-model="formData.presentation_date_id"
                  label="Fecha de presentación"
                  :items="presentationDates"
                  :loading="presentationDatesLoading"
                  item-value="id"
                  item-title="date"
                  variant="outlined"
                  density="compact"
                  :rules="rules.requiredNotNull"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.start_time"
                  label="Hora de inicio"
                  type="time"
                  variant="outlined"
                  density="compact"
                  :rules="rules.requiredNotNull"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.end_time"
                  label="Hora de fin"
                  type="time"
                  variant="outlined"
                  density="compact"
                  :rules="rules.requiredNotNull"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-4">
          <v-btn
            v-if="isEditMode"
            color="red"
            variant="flat"
            icon
            size="x-small"
            :loading="windowDeleting"
            @click="deleteWindow"
          >
            <v-icon>mdi-delete</v-icon>
            <v-tooltip activator="parent" location="right"> Eliminar </v-tooltip>
          </v-btn>

          <v-spacer />

          <v-btn
            color="primary"
            variant="flat"
            icon
            size="x-small"
            :loading="windowSaving"
            @click="saveWindow"
          >
            <v-icon>{{ isEditMode ? "mdi-pencil" : "mdi-check" }}</v-icon>
            <v-tooltip activator="parent" location="left">
              {{ isEditMode ? "Guardar cambios" : "Crear" }}
            </v-tooltip>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup>
import { ref, inject, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { useStore } from "@/store";
import { URL_API } from "@/utils/config";
import { getHdrs, getErr, getRsp } from "@/utils/http";
import { getDecodeId, getEncodeId } from "@/utils/coders";
import { getRules } from "@/utils/validators";
import CardTitle from "@/components/CardTitle.vue";
import BtnBack from "@/components/BtnBack.vue";

const alert = inject("alert");
const confirm = inject("confirm");
const store = useStore();
const route = useRoute();
const router = useRouter();

const isLoading = ref(true);
const rules = getRules();

// Switch
const hasBuyers = ref(false);
const switchLoading = ref(false);

// Tiempo por reunión
const meetingTime = ref(null);
const timeDialog = ref(false);
const tempMeetingTime = ref(null);
const timeSaving = ref(false);

// Horarios de reuniones
const meetingWindows = ref([]);
const windowDialog = ref(false);
const isEditMode = ref(false);
const currentWindowId = ref(null);
const windowSaving = ref(false);
const windowDeleting = ref(false);
const formRef = ref(null);

// Catálogo de fechas
const presentationDates = ref([]);
const presentationDatesLoading = ref(false);

const formData = ref({
  presentation_date_id: null,
  start_time: "",
  end_time: "",
});

const eventId = ref(getDecodeId(route.params.event));

const authHdrs = () => getHdrs({ token: store.getAuth?.token });

// Formatear fecha
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const [year, month, day] = dateString.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return date.toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
};

// Formatear hora
const formatTime = (timeString) => {
  if (!timeString) return "N/A";
  if (timeString.match(/^\d{2}:\d{2}:\d{2}$/)) {
    return timeString.slice(0, 5);
  }
  return timeString;
};

// Obtener estado del módulo de citas
const getBuyersStatus = async () => {
  try {
    const endpoint = `${URL_API}/v1/company/events/meeting_windows/status`;
    const response = await axios.get(endpoint, {
      params: {
        event_id: eventId.value,
      },
      ...authHdrs(),
    });
    hasBuyers.value = getRsp(response)?.data?.has_buyers || false;
  } catch (err) {
    console.error("Error al obtener estado de citas:", err);
  }
};

// Activar/desactivar módulo de citas
const toggleBuyers = async () => {
  switchLoading.value = true;
  try {
    const endpoint = `${URL_API}/v1/company/events/meeting_windows/activate`;
    const response = await axios.patch(
      endpoint,
      {
        event_id: eventId.value,
      },
      authHdrs()
    );
    hasBuyers.value = getRsp(response)?.data?.has_buyers || false;

    if (hasBuyers.value) {
      await getMeetingTime();
      await getMeetingWindows();
      await getPresentationDates();
    } else {
      meetingTime.value = null;
      meetingWindows.value = [];
    }
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
    hasBuyers.value = !hasBuyers.value;
  } finally {
    switchLoading.value = false;
  }
};

// Obtener tiempo por reunión
const getMeetingTime = async () => {
  try {
    const endpoint = `${URL_API}/v1/company/events/meeting_windows/time`;
    const response = await axios.get(endpoint, {
      params: {
        event_id: eventId.value,
      },
      ...authHdrs(),
    });
    meetingTime.value = getRsp(response)?.data?.meeting_time || null;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  }
};

// Guardar tiempo por reunión
const saveMeetingTime = async () => {
  if (!tempMeetingTime.value) {
    alert?.show("warning", "Ingresa un tiempo válido");
    return;
  }

  const confirmed = await confirm?.show("¿Confirma guardar los cambios?");
  if (!confirmed) return;

  timeSaving.value = true;
  try {
    const payload = {
      event_id: eventId.value,
      meeting_time: parseInt(tempMeetingTime.value),
    };
    const endpoint = `${URL_API}/v1/company/events/meeting_windows/time`;
    await axios.patch(endpoint, payload, authHdrs());
    meetingTime.value = tempMeetingTime.value;
    timeDialog.value = false;
    alert?.show("success", "Tiempo por reunión actualizado correctamente");
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    timeSaving.value = false;
  }
};

// Obtener horarios de reuniones
const getMeetingWindows = async () => {
  isLoading.value = true;
  try {
    const endpoint = `${URL_API}/v1/company/events/meeting_windows`;
    const response = await axios.get(endpoint, {
      params: {
        is_active: 1,
        event_id: eventId.value,
      },
      ...authHdrs(),
    });
    meetingWindows.value = getRsp(response)?.data?.items || [];
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

// Obtener catálogo de fechas de presentación
const getPresentationDates = async () => {
  presentationDatesLoading.value = true;
  try {
    const endpoint = `${URL_API}/v1/company/events/presentation_dates`;
    const response = await axios.get(endpoint, {
      params: {
        is_active: 1,
        event_id: eventId.value,
      },
      ...authHdrs(),
    });
    const items = getRsp(response)?.data?.items || [];
    presentationDates.value = items.map((item) => ({
      ...item,
      display_title: `${item.display_id} - ${item.date}`,
    }));
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    presentationDatesLoading.value = false;
  }
};

// Abrir diálogo para editar tiempo
const openTimeDialog = () => {
  tempMeetingTime.value = meetingTime.value;
  timeDialog.value = true;
};

// Abrir diálogo para crear nuevo horario
const openCreateDialog = () => {
  isEditMode.value = false;
  currentWindowId.value = null;
  formData.value = {
    presentation_date_id: null,
    start_time: "",
    end_time: "",
  };
  windowDialog.value = true;
};

// Abrir diálogo para editar horario
const openEditDialog = (window) => {
  isEditMode.value = true;
  currentWindowId.value = window.id;
  formData.value = {
    presentation_date_id: window.presentation_date_id,
    start_time: formatTime(window.start_time),
    end_time: formatTime(window.end_time),
  };
  windowDialog.value = true;
};

// Guardar horario (crear o editar)
const saveWindow = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) {
    alert?.show("red-darken-1", "Revisa los detalles señalados");
    return;
  }

  const confirmed = await confirm?.show(
    `¿Confirma ${
      isEditMode.value ? "guardar los cambios" : "crear el horario"
    }?`
  );
  if (!confirmed) return;

  windowSaving.value = true;
  try {
    const payload = {
      event_id: eventId.value,
      presentation_date_id: formData.value.presentation_date_id,
      start_time: formData.value.start_time,
      end_time: formData.value.end_time,
    };

    let endpoint;
    if (isEditMode.value) {
      endpoint = `${URL_API}/v1/company/events/meeting_windows/${currentWindowId.value}`;
      await axios.put(endpoint, payload, authHdrs());
    } else {
      endpoint = `${URL_API}/v1/company/events/meeting_windows`;
      await axios.post(endpoint, payload, authHdrs());
    }

    alert?.show(
      "success",
      isEditMode.value
        ? "Horario actualizado correctamente"
        : "Horario creado correctamente"
    );
    windowDialog.value = false;
    await getMeetingWindows();
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    windowSaving.value = false;
  }
};

// Eliminar horario de reunión
const deleteWindow = async () => {
  const confirmed = await confirm?.show(
    "¿Confirma eliminar este horario? Esta acción no se puede deshacer."
  );
  if (!confirmed) return;

  windowDeleting.value = true;

  try {
    const endpoint = `${URL_API}/v1/company/events/meeting_windows/${currentWindowId.value}`;
    await axios.delete(endpoint, authHdrs());

    alert?.show("success", "Horario eliminado correctamente");
    windowDialog.value = false;
    await getMeetingWindows();
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    windowDeleting.value = false;
  }
};

onMounted(async () => {
  await getBuyersStatus();
  if (hasBuyers.value) {
    await getMeetingTime();
    await getMeetingWindows();
    await getPresentationDates();
  }
  isLoading.value = false;
});
</script>

<style scoped>
.window-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
  overflow: hidden;
}

.window-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.2) !important;
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>