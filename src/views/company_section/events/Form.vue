<template>
  <v-card elevation="24" :disabled="isLoading" :loading="isLoading">
    <v-card-title class="d-flex align-center justify-space-between">
      <div class="d-flex align-center">
        <BtnBack
          :route="{
            name: 'company_section_events',
          }"
        />
        <CardTitle :text="$route.meta.title" :icon="$route.meta.icon" />
      </div>

      <div />
    </v-card-title>

    <v-card-text>
      <v-form ref="formRef" autocomplete="off" @submit.prevent="handleAction">
        <v-row>
          <!-- Sección: Imágenes -->
          <v-col cols="12">
            <v-card>
              <v-card-title class="d-flex align-center justify-space-between">
                <div class="d-flex align-center">
                  <CardTitle text="IMAGENES" sub />
                </div>
                <div />
              </v-card-title>

              <v-card-text>
                <v-row>
                  <v-col cols="12" md="6" class="text-center">
                    <div class="text-subtitle-2 font-weight-medium mb-2">
                      Flyer
                    </div>
                    <div class="image-container">
                      <div
                        v-if="!item.flyer_doc"
                        class="image-placeholder-flyer rounded-lg"
                        @click="triggerFlyerUpload"
                      >
                        <v-icon size="50" class="placeholder-icon"
                          >mdi-cloud-upload</v-icon
                        >
                        <div class="text-caption mt-2 placeholder-text">
                          Click para subir flyer
                        </div>
                      </div>
                      <div v-else class="image-preview-container">
                        <v-img
                          :src="flyerPreviewUrl"
                          height="200"
                          cover
                          class="rounded-lg"
                        />
                        <div class="image-overlay">
                          <v-btn
                            icon
                            variant="flat"
                            size="x-small"
                            color="error"
                            class="delete-btn"
                            @click="removeFlyer"
                          >
                            <v-icon>mdi-delete</v-icon>
                            <v-tooltip activator="parent" location="left"
                              >Eliminar</v-tooltip
                            >
                          </v-btn>
                          <v-btn
                            icon
                            variant="flat"
                            size="x-small"
                            color="primary"
                            class="edit-btn"
                            @click="triggerFlyerUpload"
                          >
                            <v-icon>mdi-pencil</v-icon>
                            <v-tooltip activator="parent" location="left"
                              >Cambiar</v-tooltip
                            >
                          </v-btn>
                        </div>
                      </div>
                      <v-file-input
                        ref="flyerInput"
                        v-model="item.flyer_doc"
                        type="file"
                        accept=".png,.jpg,.jpeg"
                        class="d-none"
                        @update:model-value="onFlyerChange"
                      />
                    </div>
                  </v-col>

                  <v-col cols="12" md="6" class="text-center">
                    <div class="text-subtitle-2 font-weight-medium mb-2">
                      Logo
                    </div>
                    <div class="image-container">
                      <div
                        v-if="!item.logo_doc"
                        class="image-placeholder-logo rounded-lg"
                        @click="triggerLogoUpload"
                      >
                        <v-icon size="50" class="placeholder-icon"
                          >mdi-cloud-upload</v-icon
                        >
                        <div class="text-caption mt-2 placeholder-text">
                          Click para subir logo
                        </div>
                      </div>
                      <div v-else class="image-preview-container">
                        <v-img
                          :src="logoPreviewUrl"
                          height="200"
                          cover
                          class="rounded-lg"
                        />
                        <div class="image-overlay">
                          <v-btn
                            icon
                            variant="flat"
                            size="x-small"
                            color="error"
                            class="delete-btn"
                            @click="removeLogo"
                          >
                            <v-icon>mdi-delete</v-icon>
                            <v-tooltip activator="parent" location="left"
                              >Eliminar</v-tooltip
                            >
                          </v-btn>
                          <v-btn
                            icon
                            variant="flat"
                            size="x-small"
                            color="primary"
                            class="edit-btn"
                            @click="triggerLogoUpload"
                          >
                            <v-icon>mdi-pencil</v-icon>
                            <v-tooltip activator="parent" location="left"
                              >Cambiar</v-tooltip
                            >
                          </v-btn>
                        </div>
                      </div>
                      <v-file-input
                        ref="logoInput"
                        v-model="item.logo_doc"
                        type="file"
                        accept=".png,.jpg,.jpeg"
                        class="d-none"
                        @update:model-value="onLogoChange"
                      />
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
                <div />
              </v-card-title>

              <v-card-text>
                <v-row dense>
                  <v-col cols="12">
                    <v-text-field
                      v-model="item.name"
                      label="Nombre del evento"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="100"
                      counter
                      :rules="rules.textRequired"
                      autocomplete="off"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      v-model="item.description"
                      label="Descripción"
                      variant="outlined"
                      density="compact"
                      maxlength="500"
                      counter
                      rows="4"
                      :rules="rules.textRequired"
                      autocomplete="off"
                    />
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
                <div />
              </v-card-title>

              <v-card-text>
                <v-row dense>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="item.place_name"
                      label="Nombre del lugar"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="100"
                      counter
                      :rules="rules.textRequired"
                      autocomplete="off"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="item.address"
                      label="Dirección"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="200"
                      counter
                      :rules="rules.textRequired"
                      autocomplete="off"
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-select
                      v-model="item.state_id"
                      label="Estado"
                      :items="states"
                      :loading="statesLoading"
                      item-value="id"
                      item-title="name"
                      variant="outlined"
                      density="compact"
                      :rules="rules.requiredNotNull"
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-select
                      v-model="item.municipality_id"
                      label="Municipio"
                      :items="municipalities"
                      :loading="municipalitiesLoading"
                      item-value="id"
                      item-title="name"
                      variant="outlined"
                      density="compact"
                      :rules="rules.requiredNotNull"
                      :disabled="!item.state_id"
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="item.address_reference"
                      label="Referencia adicional"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="200"
                      counter
                      :rules="rules.textOptional"
                      autocomplete="off"
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
                  v-for="(date, index) in item.presentation_dates"
                  :key="index"
                  class="mb-6"
                >
                  <v-divider v-if="index > 0" class="my-4" />
                  <v-row dense align="center">
                    <v-col cols="12" md="3">
                      <div
                        class="text-subtitle-2 font-weight-medium text-primary"
                      >
                        Fecha {{ index + 1 }}
                      </div>
                    </v-col>
                    <v-col cols="12" md="3">
                      <v-text-field
                        v-model="date.date"
                        label="Fecha"
                        type="date"
                        variant="outlined"
                        density="compact"
                        :rules="rules.requiredNotNull"
                      />
                    </v-col>
                    <v-col cols="12" md="2">
                      <v-text-field
                        v-model="date.reception_time"
                        label="Recepción"
                        type="time"
                        variant="outlined"
                        density="compact"
                        :rules="rules.requiredNotNull"
                      />
                    </v-col>
                    <v-col cols="12" md="2">
                      <v-text-field
                        v-model="date.start_time"
                        label="Inicio"
                        type="time"
                        variant="outlined"
                        density="compact"
                        :rules="rules.requiredNotNull"
                      />
                    </v-col>
                    <v-col cols="12" md="2">
                      <v-text-field
                        v-model="date.end_time"
                        label="Término"
                        type="time"
                        variant="outlined"
                        density="compact"
                        :rules="rules.requiredNotNull"
                      />
                    </v-col>
                    <v-col cols="12" md="1" v-if="index > 0">
                      <v-btn
                        icon
                        variant="text"
                        size="small"
                        color="error"
                        @click="removePresentationDate(index)"
                      >
                        <v-icon>mdi-delete</v-icon>
                        <v-tooltip activator="parent" location="left"
                          >Eliminar fecha</v-tooltip
                        >
                      </v-btn>
                    </v-col>
                  </v-row>
                </div>

                <v-btn
                  block
                  variant="outlined"
                  color="primary"
                  size="small"
                  prepend-icon="mdi-plus"
                  @click="addPresentationDate"
                  class="mt-2"
                >
                  Agregar otra fecha
                </v-btn>
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
                :loading="isLoading"
              >
                <v-icon>mdi-check</v-icon>
                <v-tooltip activator="parent" location="left">
                  Guardar evento
                </v-tooltip>
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, inject, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";

import { useStore } from "@/store";
import { URL_API } from "@/utils/config";
import { getHdrs, getErr, getRsp } from "@/utils/http";
import { getDecodeId, getEncodeId } from "@/utils/coders";
import { getRules } from "@/utils/validators";
import { getFormData, toStorePayload } from "@/utils/helpers";

import BtnBack from "@/components/BtnBack.vue";
import CardTitle from "@/components/CardTitle.vue";

const routeName = "company_events";
const alert = inject("alert");
const confirm = inject("confirm");
const store = useStore();
const router = useRouter();
const route = useRoute();

const isLoading = ref(false);
const formRef = ref(null);
const flyerInput = ref(null);
const logoInput = ref(null);

const rules = getRules();

// Datos del formulario
const item = ref({
  name: null,
  description: null,
  place_name: null,
  address: null,
  municipality_id: null,
  address_reference: null,
  presentation_dates: [
    {
      id: null,
      is_active: 1,
      date: null,
      reception_time: null,
      start_time: null,
      end_time: null,
    },
  ],
  flyer_doc: null,
  logo_doc: null,
});

// Previsualización de imágenes
const flyerPreviewUrl = ref(null);
const logoPreviewUrl = ref(null);

// Catálogos
const states = ref([]);
const statesLoading = ref(true);
const municipalities = ref([]);
const municipalitiesLoading = ref(false);

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
  () => item.value.state_id,
  (newStateId, oldStateId) => {
    if (newStateId) {
      if (oldStateId && oldStateId !== newStateId) {
        item.value.municipality_id = null;
      }
      getMunicipalitiesByState(newStateId);
    } else {
      municipalities.value = [];
    }
  }
);

// Agregar nueva fecha
const addPresentationDate = () => {
  item.value.presentation_dates.push({
    id: null,
    is_active: 1,
    date: null,
    reception_time: null,
    start_time: null,
    end_time: null,
  });
};

// Eliminar fecha
const removePresentationDate = (index) => {
  if (item.value.presentation_dates.length > 1) {
    item.value.presentation_dates.splice(index, 1);
  }
};

// Manejo de imágenes
const triggerFlyerUpload = () => {
  flyerInput.value?.click();
};

const triggerLogoUpload = () => {
  logoInput.value?.click();
};

const onFlyerChange = (file) => {
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      flyerPreviewUrl.value = e.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    flyerPreviewUrl.value = null;
  }
};

const onLogoChange = (file) => {
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      logoPreviewUrl.value = e.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    logoPreviewUrl.value = null;
  }
};

const removeFlyer = () => {
  item.value.flyer_doc = null;
  flyerPreviewUrl.value = null;
};

const removeLogo = () => {
  item.value.logo_doc = null;
  logoPreviewUrl.value = null;
};

// Guardar evento
const handleAction = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) {
    alert?.show("red-darken-1", "Revisa los detalles señalados");
    return;
  }

  const confirmed = await confirm?.show("¿Confirma crear el evento?");
  if (!confirmed) return;

  isLoading.value = true;

  try {
    // Limpiar datos antes de enviar
    const payload = {
      name: item.value.name,
      description: item.value.description,
      place_name: item.value.place_name,
      address: item.value.address,
      municipality_id: item.value.municipality_id,
      address_reference: item.value.address_reference || null,
      presentation_dates: item.value.presentation_dates.filter(
        (date) =>
          date.date && date.reception_time && date.start_time && date.end_time
      ),
    };

    const formData = getFormData(payload);

    // Agregar imágenes si existen
    if (item.value.flyer_doc) {
      formData.append("flyer_doc", item.value.flyer_doc);
    }
    if (item.value.logo_doc) {
      formData.append("logo_doc", item.value.logo_doc);
    }

    const endpoint = `${URL_API}/v1/company/events`;

    const response = await axios.post(endpoint, formData, authHdrs(true));
    const rsp = getRsp(response);

    alert?.show("success", rsp?.message || "Evento creado exitosamente");

    router.push({
      name: "company_tabs",
      params: {
        event: getEncodeId(rsp?.data?.item?.id),
      },
    });
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  getStates();
});
</script>

<style scoped>
.image-container {
  min-height: 200px;
  cursor: pointer;
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
  cursor: pointer;
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
  cursor: pointer;
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

.image-preview-container {
  position: relative;
  height: 200px;
  overflow: hidden;
  border-radius: 8px;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-preview-container:hover .image-overlay {
  opacity: 1;
}

.delete-btn,
.edit-btn {
  opacity: 0.9;
  transition: transform 0.2s ease;
}

.delete-btn:hover,
.edit-btn:hover {
  transform: scale(1.1);
  opacity: 1;
}
</style>