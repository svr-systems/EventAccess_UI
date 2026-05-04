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
          Nuevo stand
        </v-btn>

        <v-divider vertical class="mx-2" />

        <div class="d-flex align-center">
          <span class="text-body-2 text-grey-darken-1 mr-2">Stands</span>
          <v-switch
            v-model="hasStands"
            color="success"
            hide-details
            :loading="switchLoading"
            :disabled="switchLoading"
            @update:model-value="toggleStands"
          />
        </div>
      </div>
    </v-card-title>

    <v-card-text v-if="hasStands">
      <v-row>
        <v-col cols="12">
          <div
            v-if="standConfigs.length === 0 && !isLoading"
            class="text-center py-8"
          >
            <v-icon size="60" color="grey-lighten-1" class="mb-4">
              mdi-storefront
            </v-icon>
            <div class="text-h6 text-grey">
              No hay configuraciones de stands
            </div>
            <div class="text-body-2 text-grey mt-2">
              Haz clic en "Nuevo tipo de stand" para comenzar
            </div>
          </div>

          <v-row v-if="!isLoading && standConfigs.length > 0" dense>
            <v-col
              v-for="config in standConfigs"
              :key="config.id"
              cols="12"
              md="6"
              lg="4"
            >
              <v-card elevation="6" class="stand-card">
                <v-card-title
                  class="d-flex align-center justify-space-between pb-4 pt-4"
                >
                  <span class="text-h6 font-weight-bold">{{
                    config.name
                  }}</span>
                  <v-btn
                    icon
                    variant="flat"
                    size="x-small"
                    color="primary"
                    @click="openEditDialog(config)"
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
                        >mdi-account-group</v-icon
                      >
                      <span class="text-body-2"
                        >Capacidad: {{ config.capacity }} personas</span
                      >
                    </div>

                    <div class="info-item">
                      <v-icon size="small" color="primary" class="mr-2"
                        >mdi-currency-usd</v-icon
                      >
                      <span class="text-body-2"
                        >Precio: {{ formatCurrency(config.price) }}</span
                      >
                    </div>

                    <div class="info-item">
                      <v-icon size="small" color="primary" class="mr-2"
                        >mdi-arrow-expand-all</v-icon
                      >
                      <span class="text-body-2"
                        >Dimensiones: {{ config.size_length }}m x
                        {{ config.size_width }}m x
                        {{ config.size_height }}m</span
                      >
                    </div>

                    <div class="info-item">
                      <v-icon size="small" color="primary" class="mr-2"
                        >mdi-flash</v-icon
                      >
                      <span class="text-body-2"
                        >Electricidad:
                        {{ config.has_electricity ? "Sí" : "No" }}</span
                      >
                    </div>

                    <div class="info-item">
                      <v-icon size="small" color="primary" class="mr-2"
                        >mdi-water</v-icon
                      >
                      <span class="text-body-2"
                        >Agua: {{ config.has_water ? "Sí" : "No" }}</span
                      >
                    </div>

                    <div class="info-item">
                      <v-icon size="small" color="primary" class="mr-2"
                        >mdi-wifi</v-icon
                      >
                      <span class="text-body-2"
                        >Internet: {{ config.has_internet ? "Sí" : "No" }}</span
                      >
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-text v-else-if="!hasStands && !isLoading">
      <div class="text-center py-8">
        <v-icon size="60" color="grey-lighten-1" class="mb-4">
          mdi-storefront
        </v-icon>
        <div class="text-h6 text-grey">Módulo de stands desactivado</div>
        <div class="text-body-2 text-grey mt-2">
          Activa el módulo para comenzar a configurar los stands del evento
        </div>
      </div>
    </v-card-text>

    <!-- Dialog: Crear/Editar configuración de stand -->
    <v-dialog v-model="editDialog" max-width="600px">
      <v-card>
        <v-card-title class="d-flex align-center justify-space-between">
          <span>{{
            isEditMode ? "Editar configuración de stand" : "Nuevo tipo de stand"
          }}</span>
          <v-btn icon variant="text" size="small" @click="editDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-divider />

        <v-card-text class="pa-4">
          <v-form ref="formRef" @submit.prevent="saveConfig">
            <v-row dense>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.name"
                  label="Nombre del stand"
                  type="text"
                  variant="outlined"
                  density="compact"
                  maxlength="100"
                  counter
                  :rules="rules.textRequired"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.capacity"
                  label="Capacidad (personas)"
                  type="number"
                  variant="outlined"
                  density="compact"
                  :rules="rules.requiredNumber"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.price"
                  label="Precio"
                  type="number"
                  variant="outlined"
                  density="compact"
                  prefix="$"
                  step="0.01"
                  :rules="rules.requiredNumber"
                />
              </v-col>

              <v-col cols="12">
                <div class="text-subtitle-2 font-weight-medium mb-2">
                  Dimensiones (metros)
                </div>
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  v-model="formData.size_length"
                  label="Largo"
                  type="number"
                  variant="outlined"
                  density="compact"
                  step="0.01"
                  :rules="rules.requiredNumber"
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  v-model="formData.size_width"
                  label="Ancho"
                  type="number"
                  variant="outlined"
                  density="compact"
                  step="0.01"
                  :rules="rules.requiredNumber"
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  v-model="formData.size_height"
                  label="Alto"
                  type="number"
                  variant="outlined"
                  density="compact"
                  step="0.01"
                  :rules="rules.requiredNumber"
                />
              </v-col>

              <v-col cols="12">
                <div class="text-subtitle-2 font-weight-medium mb-2">
                  Servicios disponibles
                </div>
              </v-col>

              <v-col cols="12" md="4">
                <v-switch
                  v-model="formData.has_electricity"
                  label="Electricidad"
                  color="success"
                  hide-details
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-switch
                  v-model="formData.has_water"
                  label="Agua"
                  color="success"
                  hide-details
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-switch
                  v-model="formData.has_internet"
                  label="Internet"
                  color="success"
                  hide-details
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
            :loading="deleting"
            @click="deleteConfig"
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
            :loading="saving"
            @click="saveConfig"
          >
            <v-icon>{{ isEditMode ? "mdi-pencil" : "mdi-check" }}</v-icon>
            <v-tooltip activator="parent" location="left">
              {{ isEditMode ? "Guardar cambios" : "Crear" }}</v-tooltip
            >
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
const saving = ref(false);
const deleting = ref(false);
const switchLoading = ref(false);
const rules = getRules();

// Datos
const hasStands = ref(false);
const standConfigs = ref([]);

// Dialog
const editDialog = ref(false);
const isEditMode = ref(false);
const currentConfigId = ref(null);
const formRef = ref(null);

const eventId = ref(getDecodeId(route.params.event));

const formData = ref({
  name: "",
  capacity: null,
  price: null,
  size_length: null,
  size_width: null,
  size_height: null,
  has_electricity: false,
  has_water: false,
  has_internet: false,
});

const authHdrs = () => getHdrs({ token: store.getAuth?.token });

// Formatear moneda
const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return "$0.00";
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  }).format(amount);
};

// Obtener estado del módulo de stands
const getStandsStatus = async () => {
  try {
    const endpoint = `${URL_API}/v1/company/events/event_stand_configs/status`;
    const response = await axios.get(endpoint, {
      params: {
        event_id: eventId.value,
      },
      ...authHdrs(),
    });
    hasStands.value = getRsp(response)?.data?.has_stands || false;
  } catch (err) {
    console.error("Error al obtener estado de stands:", err);
  }
};

// Activar/desactivar módulo de stands
const toggleStands = async () => {
  switchLoading.value = true;
  try {
    const endpoint = `${URL_API}/v1/company/events/event_stand_configs/activate`;
    const response = await axios.patch(
      endpoint,
      {
        event_id: eventId.value,
      },
      authHdrs()
    );
    hasStands.value = getRsp(response)?.data?.has_stands || false;

    if (hasStands.value) {
      await getStandConfigs();
    } else {
      standConfigs.value = [];
    }
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
    // Revertir el switch si hay error
    hasStands.value = !hasStands.value;
  } finally {
    switchLoading.value = false;
  }
};

// Obtener configuraciones de stands
const getStandConfigs = async () => {
  if (!hasStands.value) return;

  isLoading.value = true;
  try {
    const endpoint = `${URL_API}/v1/company/events/event_stand_configs`;
    const response = await axios.get(endpoint, {
      params: {
        is_active: 1,
        event_id: eventId.value,
      },
      ...authHdrs(),
    });
    standConfigs.value = getRsp(response)?.data?.items || [];
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

// Abrir diálogo para crear nuevo
const openCreateDialog = () => {
  isEditMode.value = false;
  currentConfigId.value = null;
  formData.value = {
    name: "",
    capacity: null,
    price: null,
    size_length: null,
    size_width: null,
    size_height: null,
    has_electricity: false,
    has_water: false,
    has_internet: false,
  };
  editDialog.value = true;
};

// Abrir diálogo de edición
const openEditDialog = (config) => {
  isEditMode.value = true;
  currentConfigId.value = config.id;
  formData.value = {
    name: config.name,
    capacity: config.capacity,
    price: parseFloat(config.price),
    size_length: parseFloat(config.size_length),
    size_width: parseFloat(config.size_width),
    size_height: parseFloat(config.size_height),
    has_electricity: config.has_electricity,
    has_water: config.has_water,
    has_internet: config.has_internet,
  };
  editDialog.value = true;
};

// Guardar configuración (crear o editar)
const saveConfig = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) {
    alert?.show("red-darken-1", "Revisa los detalles señalados");
    return;
  }

  const confirmed = await confirm?.show(
    `¿Confirma ${
      isEditMode.value ? "guardar los cambios" : "crear el tipo de stand"
    }?`
  );
  if (!confirmed) return;

  saving.value = true;

  try {
    const payload = {
      event_id: eventId.value,
      name: formData.value.name,
      capacity: parseInt(formData.value.capacity),
      price: parseFloat(formData.value.price),
      size_length: parseFloat(formData.value.size_length),
      size_width: parseFloat(formData.value.size_width),
      size_height: parseFloat(formData.value.size_height),
      has_electricity: formData.value.has_electricity,
      has_water: formData.value.has_water,
      has_internet: formData.value.has_internet,
    };

    let endpoint;
    if (isEditMode.value) {
      endpoint = `${URL_API}/v1/company/events/event_stand_configs/${currentConfigId.value}`;
      await axios.put(endpoint, payload, authHdrs());
    } else {
      endpoint = `${URL_API}/v1/company/events/event_stand_configs`;
      await axios.post(endpoint, payload, authHdrs());
    }

    alert?.show(
      "success",
      isEditMode.value
        ? "Configuración actualizada correctamente"
        : "Tipo de stand creado correctamente"
    );
    editDialog.value = false;
    await getStandConfigs();
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    saving.value = false;
  }
};

// Eliminar configuración de stand
const deleteConfig = async () => {
  const confirmed = await confirm?.show(
    "¿Confirma eliminar este tipo de stand? Esta acción no se puede deshacer."
  );
  if (!confirmed) return;

  deleting.value = true;

  try {
    const endpoint = `${URL_API}/v1/company/events/event_stand_configs/${currentConfigId.value}`;
    await axios.delete(endpoint, authHdrs());

    alert?.show("success", "Tipo de stand eliminado correctamente");
    editDialog.value = false;
    await getStandConfigs();
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    deleting.value = false;
  }
};

onMounted(async () => {
  await getStandsStatus();
  if (hasStands.value) {
    await getStandConfigs();
  }
  isLoading.value = false;
});
</script>

<style scoped>
.stand-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
  overflow: hidden;
}

.stand-card:hover {
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