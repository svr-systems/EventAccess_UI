<template>
  <v-card :loading="isLoading">
    <v-card-text>
      <v-row>
        <!-- Sección: Flyer y Logo -->
        <v-col cols="12">
          <v-card>
            <v-card-title class="d-flex align-center justify-space-between">
              <div class="d-flex align-center">
                <CardTitle text="IMAGENES" sub />
              </div>

              <div>
                <v-btn
                  icon
                  variant="flat"
                  size="x-small"
                  color="primary"
                  @click="openMediaDialog"
                >
                  <v-icon>mdi-pencil</v-icon>
                  <v-tooltip activator="parent" location="left"
                    >Editar</v-tooltip
                  >
                </v-btn>
              </div>
            </v-card-title>

            <v-card-text>
              <v-row>
                <v-col cols="12" md="6" class="text-center">
                  <div class="text-subtitle-2 font-weight-medium mb-2">
                    Flyer
                  </div>
                  <div class="image-container">
                    <v-img
                      v-if="flyerPreviewUrl"
                      :src="flyerPreviewUrl"
                      height="200"
                      cover
                      class="rounded-lg"
                    />
                    <div v-else class="image-placeholder-flyer rounded-lg">
                      <v-icon size="50" class="placeholder-icon"
                        >mdi-image</v-icon
                      >
                      <div class="text-caption mt-2 placeholder-text">
                        Sin flyer
                      </div>
                    </div>
                  </div>
                </v-col>

                <v-col cols="12" md="6" class="text-center">
                  <div class="text-subtitle-2 font-weight-medium mb-2">
                    Logo
                  </div>
                  <div class="image-container">
                    <v-img
                      v-if="logoPreviewUrl"
                      :src="logoPreviewUrl"
                      height="200"
                      cover
                      class="rounded-lg"
                    />
                    <div v-else class="image-placeholder-logo rounded-lg">
                      <v-icon size="50" class="placeholder-icon"
                        >mdi-image</v-icon
                      >
                      <div class="text-caption mt-2 placeholder-text">
                        Sin logo
                      </div>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Sección: Información general -->
        <v-col cols="12">
          <v-card>
            <v-card-title class="d-flex align-center justify-space-between">
              <div class="d-flex align-center">
                <CardTitle text="INFORMACIÓN GENERAL" sub />
              </div>

              <div>
                <v-btn
                  icon
                  variant="flat"
                  size="x-small"
                  color="primary"
                  @click="openGeneralDialog"
                >
                  <v-icon>mdi-pencil</v-icon>
                  <v-tooltip activator="parent" location="left"
                    >Editar</v-tooltip
                  >
                </v-btn>
              </div>
            </v-card-title>

            <v-card-text>
              <v-row dense>
                <v-col cols="12">
                  <VisVal label="Nombre" :value="eventData.name" />
                </v-col>
                <v-col cols="12">
                  <VisVal label="Descripción" :value="eventData.description" />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Sección: Ubicación -->
        <v-col cols="12">
          <v-card>
            <v-card-title class="d-flex align-center justify-space-between">
              <div class="d-flex align-center">
                <CardTitle text="UBICACIÓN" sub />
              </div>

              <div>
                <v-btn
                  icon
                  variant="flat"
                  size="x-small"
                  color="primary"
                  @click="openLocationDialog"
                >
                  <v-icon>mdi-pencil</v-icon>
                  <v-tooltip activator="parent" location="left"
                    >Editar</v-tooltip
                  >
                </v-btn>
              </div>
            </v-card-title>

            <v-card-text>
              <v-row dense>
                <v-col cols="12" md="6">
                  <VisVal
                    label="Nombre del lugar"
                    :value="eventData.place_name"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <VisVal label="Dirección" :value="eventData.address" />
                </v-col>
                <v-col cols="12" md="6">
                  <VisVal
                    label="Municipio"
                    :value="eventData.municipality?.name"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <VisVal
                    label="Estado"
                    :value="eventData.municipality?.state?.name"
                  />
                </v-col>
                <v-col cols="12">
                  <VisVal
                    label="Referencia adicional"
                    :value="eventData.address_reference"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Sección: Fechas y horarios -->
        <v-col cols="12">
          <v-card>
            <v-card-title class="d-flex align-center justify-space-between">
              <div class="d-flex align-center">
                <CardTitle text="FECHAS Y HORARIOS" sub />
              </div>

              <div />
            </v-card-title>

            <v-card-text>
              <div
                v-for="date in eventData.presentation_dates"
                :key="date.id"
                class="mb-4"
              >
                <v-row dense align="center">
                  <v-col cols="12" md="8">
                    <div class="d-flex flex-wrap ga-4">
                      <div>
                        <span class="text-caption text-grey">Fecha</span>
                        <div class="text-body-2 font-weight-medium">
                          {{ formatDate(date.date) }}
                        </div>
                      </div>
                      <div>
                        <span class="text-caption text-grey">Recepción</span>
                        <div class="text-body-2 font-weight-medium">
                          {{ date.reception_time }}
                        </div>
                      </div>
                      <div>
                        <span class="text-caption text-grey">Inicio</span>
                        <div class="text-body-2 font-weight-medium">
                          {{ date.start_time }}
                        </div>
                      </div>
                      <div>
                        <span class="text-caption text-grey">Término</span>
                        <div class="text-body-2 font-weight-medium">
                          {{ date.end_time }}
                        </div>
                      </div>
                    </div>
                  </v-col>
                  <v-col cols="12" md="4" class="text-right">
                    <v-btn
                      icon
                      variant="flat"
                      size="x-small"
                      color="primary"
                      @click="openEditPresentationDateDialog(date)"
                    >
                      <v-icon>mdi-pencil</v-icon>
                      <v-tooltip activator="parent" location="left"
                        >Editar fecha</v-tooltip
                      >
                    </v-btn>
                  </v-col>
                </v-row>
              </div>

              <div
                v-if="eventData.presentation_dates?.length === 0"
                class="text-center py-4"
              >
                <div class="text-caption text-grey">
                  No hay fechas registradas
                </div>
              </div>

              <v-btn
                block
                variant="outlined"
                color="primary"
                size="small"
                prepend-icon="mdi-plus"
                @click="openAddPresentationDateDialog"
                class="mt-2"
              >
                Agregar
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>

    <!-- Dialog: Editar imágenes -->
    <v-dialog v-model="mediaDialog" max-width="600px">
      <v-card>
        <v-card-title class="d-flex align-center justify-space-between">
          <span>Editar imágenes</span>
          <v-btn icon variant="text" size="small" @click="mediaDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-divider />

        <v-card-text class="pa-4">
          <v-row>
            <v-col cols="12" md="6">
              <v-file-input
                v-model="tempFiles.flyer"
                label="Flyer"
                variant="outlined"
                density="compact"
                prepend-icon=""
                accept=".png,.jpg,.jpeg"
                show-size
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-file-input
                v-model="tempFiles.logo"
                label="Logo"
                variant="outlined"
                density="compact"
                prepend-icon=""
                accept=".png,.jpg,.jpeg"
                show-size
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn
            color="primary"
            variant="flat"
            icon
            size="x-small"
            :loading="mediaLoading"
            @click="saveMedia"
          >
            <v-icon>mdi-check</v-icon>
            <v-tooltip activator="parent" location="left">
              Confirmar
            </v-tooltip>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog: Editar información general -->
    <v-dialog v-model="generalDialog" max-width="600px">
      <v-card>
        <v-card-title class="d-flex align-center justify-space-between">
          <span>Editar información general</span>
          <v-btn
            icon
            variant="text"
            size="small"
            @click="generalDialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-divider />

        <v-card-text class="pa-4">
          <v-text-field
            v-model="tempGeneral.name"
            label="Nombre del evento"
            variant="outlined"
            density="compact"
            :rules="rules.textRequired"
          />
          <v-textarea
            v-model="tempGeneral.description"
            label="Descripción"
            variant="outlined"
            density="compact"
            rows="4"
            :rules="rules.textRequired"
          />
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn
            color="primary"
            variant="flat"
            icon
            size="x-small"
            :loading="generalLoading"
            @click="saveGeneral"
          >
            <v-icon>mdi-check</v-icon>
            <v-tooltip activator="parent" location="left">
              Confirmar
            </v-tooltip>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog: Editar ubicación -->
    <v-dialog v-model="locationDialog" max-width="600px">
      <v-card>
        <v-card-title class="d-flex align-center justify-space-between">
          <span>Editar ubicación</span>
          <v-btn
            icon
            variant="text"
            size="small"
            @click="locationDialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-divider />

        <v-card-text class="pa-4">
          <v-text-field
            v-model="tempLocation.place_name"
            label="Nombre del lugar"
            variant="outlined"
            density="compact"
            :rules="rules.textRequired"
          />
          <v-text-field
            v-model="tempLocation.address"
            label="Dirección"
            variant="outlined"
            density="compact"
            :rules="rules.textRequired"
          />
          <v-select
            v-model="tempLocation.state_id"
            label="Estado"
            :items="states"
            :loading="statesLoading"
            item-value="id"
            item-title="name"
            variant="outlined"
            density="compact"
            :rules="rules.requiredNotNull"
          />
          <v-select
            v-model="tempLocation.municipality_id"
            label="Municipio"
            :items="municipalities"
            :loading="municipalitiesLoading"
            item-value="id"
            item-title="name"
            variant="outlined"
            density="compact"
            :rules="rules.requiredNotNull"
            :disabled="!tempLocation.state_id"
          />
          <v-text-field
            v-model="tempLocation.address_reference"
            label="Referencia adicional"
            variant="outlined"
            density="compact"
            :rules="rules.textOptional"
          />
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn
            color="primary"
            variant="flat"
            icon
            size="x-small"
            :loading="locationLoading"
            @click="saveLocation"
          >
            <v-icon>mdi-check</v-icon>
            <v-tooltip activator="parent" location="left">
              Confirmar
            </v-tooltip>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog: Editar fecha y horario -->
    <v-dialog v-model="scheduleDialog" max-width="600px">
      <v-card>
        <v-card-title class="d-flex align-center justify-space-between">
          <span>Editar fecha y horario</span>
          <v-btn
            icon
            variant="text"
            size="small"
            @click="scheduleDialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-divider />

        <v-card-text class="pa-4">
          <v-text-field
            v-model="tempSchedule.date"
            label="Fecha del evento"
            type="date"
            variant="outlined"
            density="compact"
            :rules="rules.requiredNotNull"
          />
          <v-text-field
            v-model="tempSchedule.reception_time"
            label="Hora de recepción"
            type="time"
            variant="outlined"
            density="compact"
            :rules="rules.requiredNotNull"
          />
          <v-text-field
            v-model="tempSchedule.start_time"
            label="Hora de inicio"
            type="time"
            variant="outlined"
            density="compact"
            :rules="rules.requiredNotNull"
          />
          <v-text-field
            v-model="tempSchedule.end_time"
            label="Hora de término"
            type="time"
            variant="outlined"
            density="compact"
            :rules="rules.requiredNotNull"
          />
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-4">
          <v-btn
            color="red"
            variant="flat"
            icon
            size="x-small"
            :loading="deleteScheduleLoading"
            @click="deletePresentationDate"
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
            :loading="scheduleLoading"
            @click="savePresentationDate"
          >
            <v-icon>mdi-check</v-icon>
            <v-tooltip activator="parent" location="left">
              Confirmar
            </v-tooltip>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog: Agregar nueva fecha y horario -->
    <v-dialog v-model="addScheduleDialog" max-width="600px">
      <v-card>
        <v-card-title class="d-flex align-center justify-space-between">
          <span>Agregar fecha y horario</span>
          <v-btn
            icon
            variant="text"
            size="small"
            @click="addScheduleDialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-divider />

        <v-card-text class="pa-4">
          <v-text-field
            v-model="newSchedule.date"
            label="Fecha del evento"
            type="date"
            variant="outlined"
            density="compact"
            :rules="rules.requiredNotNull"
          />
          <v-text-field
            v-model="newSchedule.reception_time"
            label="Hora de recepción"
            type="time"
            variant="outlined"
            density="compact"
            :rules="rules.requiredNotNull"
          />
          <v-text-field
            v-model="newSchedule.start_time"
            label="Hora de inicio"
            type="time"
            variant="outlined"
            density="compact"
            :rules="rules.requiredNotNull"
          />
          <v-text-field
            v-model="newSchedule.end_time"
            label="Hora de término"
            type="time"
            variant="outlined"
            density="compact"
            :rules="rules.requiredNotNull"
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
            :loading="addScheduleLoading"
            @click="addPresentationDate"
          >
            <v-icon>mdi-check</v-icon>
            <v-tooltip activator="parent" location="left"> Agregar </v-tooltip>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup>
import { ref, inject, onMounted, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

import { useStore } from "@/store";
import { URL_API } from "@/utils/config";
import { getHdrs, getErr, getRsp } from "@/utils/http";
import { getDecodeId, getEncodeId } from "@/utils/coders";
import { getRules } from "@/utils/validators";
import { b64ToFile, getFormData, toStorePayload } from "@/utils/helpers";

import BtnBack from "@/components/BtnBack.vue";
import CardTitle from "@/components/CardTitle.vue";
import VisVal from "@/components/VisVal.vue";

const alert = inject("alert");
const confirm = inject("confirm");
const store = useStore();
const route = useRoute();
const router = useRouter();

const isLoading = ref(true);
const eventId = computed(() => route.params.event);
const rules = getRules();

// Datos del evento
const eventData = ref({
  name: null,
  description: null,
  place_name: null,
  address: null,
  address_reference: null,
  municipality: null,
  presentation_dates: [],
  flyer_b64: null,
  logo_b64: null,
});

// Previsualización de imágenes
const flyerPreviewUrl = ref(null);
const logoPreviewUrl = ref(null);

// Catálogos
const states = ref([]);
const statesLoading = ref(true);
const municipalities = ref([]);
const municipalitiesLoading = ref(false);

// Diálogos y estados de carga
const mediaDialog = ref(false);
const generalDialog = ref(false);
const locationDialog = ref(false);
const scheduleDialog = ref(false);
const addScheduleDialog = ref(false);
const mediaLoading = ref(false);
const generalLoading = ref(false);
const locationLoading = ref(false);
const scheduleLoading = ref(false);
const addScheduleLoading = ref(false);
const deleteScheduleLoading = ref(false);

// Datos temporales para edición
const tempFiles = ref({
  flyer: null,
  logo: null,
});

const tempGeneral = ref({
  name: "",
  description: "",
});

const tempLocation = ref({
  place_name: "",
  address: "",
  state_id: null,
  municipality_id: null,
  address_reference: "",
});

const tempSchedule = ref({
  id: null,
  event_id: null,
  date: "",
  reception_time: "",
  start_time: "",
  end_time: "",
});

// Datos para nueva fecha
const newSchedule = ref({
  date: "",
  reception_time: "",
  start_time: "",
  end_time: "",
});

const authHdrs = (useFormData = false) =>
  getHdrs({ token: store.getAuth?.token, useFormData });

// Obtener catálogo de estados
const getStates = async () => {
  statesLoading.value = true;
  try {
    const endpoint = `${URL_API}/v1/company/catalogs/states`;
    const response = await axios.get(endpoint, authHdrs());
    states.value = getRsp(response)?.data?.items || [];
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    statesLoading.value = false;
  }
};

// Obtener municipios por estado
const getMunicipalitiesByState = async (stateId) => {
  if (!stateId) {
    municipalities.value = [];
    municipalitiesLoading.value = false;
    return;
  }

  municipalitiesLoading.value = true;

  try {
    const endpoint = `${URL_API}/v1/company/catalogs/municipalities`;
    const response = await axios.get(endpoint, {
      params: {
        state_id: stateId,
      },
      ...authHdrs(),
    });
    municipalities.value = getRsp(response)?.data?.items || [];
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    municipalitiesLoading.value = false;
  }
};

// Watch para detectar cambios en el estado seleccionado
watch(
  () => tempLocation.value.state_id,
  (newStateId, oldStateId) => {
    if (newStateId) {
      if (oldStateId && oldStateId !== newStateId) {
        tempLocation.value.municipality_id = null;
      }
      getMunicipalitiesByState(newStateId);
    } else {
      municipalities.value = [];
    }
  }
);

// Convertir base64 a URL para previsualización
const b64ToUrl = (b64) => {
  if (!b64 || !b64.content) return null;
  return `data:${b64.mime};base64,${b64.content}`;
};

// Cargar datos del evento
const getEventData = async () => {
  isLoading.value = true;

  try {
    const endpoint = `${URL_API}/v1/company/events/${getDecodeId(
      eventId.value
    )}`;
    const response = await axios.get(endpoint, authHdrs());
    const data = getRsp(response)?.data?.item || null;

    if (data) {
      eventData.value = data;
      flyerPreviewUrl.value = b64ToUrl(data.flyer_b64);
      logoPreviewUrl.value = b64ToUrl(data.logo_b64);
    }
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
    router.push({ name: "company_section_events" });
  } finally {
    isLoading.value = false;
  }
};

// Abrir diálogo de imágenes
const openMediaDialog = () => {
  // Convertir flyer actual a File si existe
  let flyerFile = null;
  if (eventData.value.flyer_b64 && eventData.value.flyer_b64.content) {
    flyerFile = b64ToFile(eventData.value.flyer_b64);
  }

  // Convertir logo actual a File si existe
  let logoFile = null;
  if (eventData.value.logo_b64 && eventData.value.logo_b64.content) {
    logoFile = b64ToFile(eventData.value.logo_b64);
  }

  tempFiles.value = {
    flyer: flyerFile,
    logo: logoFile,
  };

  mediaDialog.value = true;
};

const openGeneralDialog = () => {
  tempGeneral.value = {
    name: eventData.value.name,
    description: eventData.value.description,
  };
  generalDialog.value = true;
};

const openLocationDialog = () => {
  tempLocation.value = {
    place_name: eventData.value.place_name,
    address: eventData.value.address,
    state_id: eventData.value.municipality?.state_id || null,
    municipality_id: eventData.value.municipality_id || null,
    address_reference: eventData.value.address_reference || "",
  };

  if (tempLocation.value.state_id) {
    getMunicipalitiesByState(tempLocation.value.state_id);
  }

  locationDialog.value = true;
};

const openEditPresentationDateDialog = (date) => {
  tempSchedule.value = {
    id: date.id,
    event_id: eventData.value.id,
    date: date.date,
    reception_time: date.reception_time,
    start_time: date.start_time,
    end_time: date.end_time,
  };
  scheduleDialog.value = true;
};

const openAddPresentationDateDialog = () => {
  newSchedule.value = {
    date: "",
    reception_time: "",
    start_time: "",
    end_time: "",
  };
  addScheduleDialog.value = true;
};

// Guardar imágenes
const saveMedia = async () => {
  if (!tempFiles.value.flyer && !tempFiles.value.logo) {
    alert?.show("warning", "Selecciona al menos una imagen para actualizar");
    return;
  }

  const confirmed = await confirm?.show("¿Confirma guardar los cambios?");
  if (!confirmed) return;

  mediaLoading.value = true;

  try {
    const payload = {};

    if (tempFiles.value.flyer && tempFiles.value.flyer instanceof File) {
      payload.flyer_doc = tempFiles.value.flyer;
    }
    if (tempFiles.value.logo && tempFiles.value.logo instanceof File) {
      payload.logo_doc = tempFiles.value.logo;
    }

    const storePayload = toStorePayload(payload, true);
    const formData = getFormData(storePayload);

    const endpoint = `${URL_API}/v1/company/events/${getDecodeId(
      eventId.value
    )}/images`;
    const response = await axios.post(endpoint, formData, authHdrs(true));

    const rsp = getRsp(response);
    alert?.show(
      "success",
      rsp?.message || "Imágenes actualizadas correctamente"
    );

    mediaDialog.value = false;
    await getEventData();
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    mediaLoading.value = false;
  }
};

// Guardar información general
const saveGeneral = async () => {
  const confirmed = await confirm?.show("¿Confirma guardar los cambios?");
  if (!confirmed) return;

  generalLoading.value = true;

  try {
    const payload = {
      name: tempGeneral.value.name,
      description: tempGeneral.value.description,
    };

    const endpoint = `${URL_API}/v1/company/events/${getDecodeId(
      eventId.value
    )}/general`;
    const response = await axios.patch(endpoint, payload, authHdrs());
    const rsp = getRsp(response);

    alert?.show(
      "success",
      rsp?.message || "Información actualizada correctamente"
    );
    generalDialog.value = false;
    await getEventData();
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    generalLoading.value = false;
  }
};

// Guardar ubicación
const saveLocation = async () => {
  const confirmed = await confirm?.show("¿Confirma guardar los cambios?");
  if (!confirmed) return;

  locationLoading.value = true;

  try {
    const payload = {
      place_name: tempLocation.value.place_name,
      address: tempLocation.value.address,
      municipality_id: tempLocation.value.municipality_id,
      address_reference: tempLocation.value.address_reference || null,
    };

    const endpoint = `${URL_API}/v1/company/events/${getDecodeId(
      eventId.value
    )}/address`;
    const response = await axios.patch(endpoint, payload, authHdrs());
    const rsp = getRsp(response);

    alert?.show(
      "success",
      rsp?.message || "Ubicación actualizada correctamente"
    );
    locationDialog.value = false;
    await getEventData();
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    locationLoading.value = false;
  }
};

// Guardar fecha y horario (edición)
const savePresentationDate = async () => {
  const confirmed = await confirm?.show("¿Confirma guardar los cambios?");
  if (!confirmed) return;

  scheduleLoading.value = true;

  try {
    const payload = {
      id: tempSchedule.value.id,
      event_id: getDecodeId(eventId.value),
      date: tempSchedule.value.date,
      reception_time: tempSchedule.value.reception_time,
      start_time: tempSchedule.value.start_time,
      end_time: tempSchedule.value.end_time,
    };

    const endpoint = `${URL_API}/v1/company/events/presentation_dates/${tempSchedule.value.id}`;
    const response = await axios.patch(endpoint, payload, authHdrs());
    const rsp = getRsp(response);

    alert?.show(
      "success",
      rsp?.message || "Fecha y horario actualizados correctamente"
    );
    scheduleDialog.value = false;
    await getEventData();
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    scheduleLoading.value = false;
  }
};

// Eliminar fecha y horario
const deletePresentationDate = async () => {
  const confirmed = await confirm?.show(
    "¿Confirma eliminar esta fecha? Esta acción no se puede deshacer."
  );
  if (!confirmed) return;

  deleteScheduleLoading.value = true;

  try {
    const endpoint = `${URL_API}/v1/company/events/presentation_dates/${tempSchedule.value.id}`;
    const response = await axios.delete(endpoint, authHdrs());
    const rsp = getRsp(response);

    alert?.show("success", rsp?.message || "Fecha eliminada correctamente");
    scheduleDialog.value = false;
    await getEventData();
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    deleteScheduleLoading.value = false;
  }
};

// Agregar nueva fecha y horario
const addPresentationDate = async () => {
  const confirmed = await confirm?.show("¿Confirma agregar la nueva fecha?");
  if (!confirmed) return;

  // Validar campos requeridos
  if (
    !newSchedule.value.date ||
    !newSchedule.value.reception_time ||
    !newSchedule.value.start_time ||
    !newSchedule.value.end_time
  ) {
    alert?.show("warning", "Todos los campos son obligatorios");
    return;
  }

  addScheduleLoading.value = true;

  try {
    const payload = {
      event_id: getDecodeId(eventId.value),
      date: newSchedule.value.date,
      reception_time: newSchedule.value.reception_time,
      start_time: newSchedule.value.start_time,
      end_time: newSchedule.value.end_time,
    };

    const endpoint = `${URL_API}/v1/company/events/presentation_dates`;
    const response = await axios.post(endpoint, payload, authHdrs());
    const rsp = getRsp(response);

    alert?.show("success", rsp?.message || "Fecha agregada exitosamente");
    addScheduleDialog.value = false;
    await getEventData();
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    addScheduleLoading.value = false;
  }
};

// Función para formatear fecha
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const parts = dateString.split("-");
    if (parts.length === 3) {
      const year = parseInt(parts[0]);
      const month = parseInt(parts[1]) - 1;
      const day = parseInt(parts[2]);

      const date = new Date(year, month, day);

      return date.toLocaleDateString("es-MX", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
    return dateString;
  } catch {
    return dateString;
  }
};

onMounted(() => {
  getStates();
  getEventData();
});
</script>

<style scoped>
.image-container {
  min-height: 200px;
}

/* Estilos para placeholder de flyer - gradiente profesional */
.image-placeholder-flyer {
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  transition: transform 0.3s ease;
}

.image-placeholder-flyer:hover {
  transform: scale(1.02);
}

/* Estilos para placeholder de logo - gradiente corporativo */
.image-placeholder-logo {
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border: none;
  transition: transform 0.3s ease;
}

.image-placeholder-logo:hover {
  transform: scale(1.02);
}

.placeholder-icon {
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 8px;
}

.placeholder-text {
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}

.ga-2 {
  gap: 8px;
}
</style>