<template>
  <v-card elevation="24" :disabled="isLoading" :loading="isLoading">
    <v-card-title class="d-flex align-center justify-space-between">
      <div class="d-flex align-center">
        <BtnBack
          :route="{
            name: 'home',
          }"
        />
        <CardTitle :text="$route.meta.title" :icon="$route.meta.icon" />
      </div>

      <div />
    </v-card-title>

    <v-card-text v-if="item">
      <v-form ref="formRef" autocomplete="off" @submit.prevent="handleAction">
        <v-row>
          <v-col cols="12">
            <v-card>
              <v-card-title class="d-flex align-center justify-space-between">
                <div class="d-flex align-center">
                  <CardTitle text="DATOS DEL COMPRADOR" sub />
                </div>

                <div />
              </v-card-title>

              <v-card-text>
                <v-row dense>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="item.name"
                      label="Nombre"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="50"
                      counter
                      :rules="rules.textRequired"
                      autocomplete="off"
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="item.website_url"
                      label="Sitio Web *"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="50"
                      counter
                      :rules="rules.textOptional"
                      autocomplete="off"
                    />
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="item.address"
                      label="Dirección"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="50"
                      counter
                      :rules="rules.textRequired"
                      autocomplete="off"
                    />
                  </v-col>

                  <v-col cols="12" md="4">
                    <div class="d-flex align-start">
                      <div class="flex-grow-1">
                        <v-file-input
                          v-model="item.logo_doc"
                          label="Logotipo"
                          variant="outlined"
                          density="compact"
                          prepend-icon=""
                          show-size
                          accept=".png,.jpg,.jpeg"
                          :rules="rules.imageRequired"
                        />
                      </div>
                      <div v-if="item.logo_doc" class="pt-1 flex-shrink-0">
                        <BtnDocPreview
                          :file="item.logo_doc"
                          tooltip="Ver"
                          variant="outlined"
                        />
                      </div>
                    </div>
                  </v-col>

                  <v-col cols="12" md="12">
                    <v-text-field
                      v-model="item.description"
                      label="Descripción"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="500"
                      counter
                      :rules="rules.textRequired"
                      autocomplete="off"
                    />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>

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
                      :disabled="!item?.state_id"
                    />
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="item.zip"
                      label="Código postal"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="20"
                      counter
                      :rules="rules.textRequired"
                      autocomplete="off"
                    />
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
                :loading="isLoading"
              >
                <v-icon>mdi-check</v-icon>
                <v-tooltip activator="parent" location="left">
                  Continuar
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
import { getUserObj } from "@/utils/objects";
import { b64ToFile, getFormData, toStorePayload } from "@/utils/helpers";

import BtnBack from "@/components/BtnBack.vue";
import CardTitle from "@/components/CardTitle.vue";
import BtnDocPreview from "@/components/BtnDocPreview.vue";

const routeName = "users";

const alert = inject("alert");
const confirm = inject("confirm");
const store = useStore();
const router = useRouter();
const route = useRoute();

const itemId = ref(route.params.id ? getDecodeId(route.params.id) : null);

const isLoading = ref(true);
const formRef = ref(null);
const item = ref({
  name: null,
  state_id: null,
  municipality_id: null,
  logo_doc: null,
  phone: null,
  website_url: null,
  description: null,
  address: null,
  zip: null,
});

const rules = getRules();

const fiscal_regimes = ref([]);
const fiscal_regimesLoading = ref(true);
const cfdi_usages = ref([]);
const cfdi_usagesLoading = ref(true);
const states = ref([]);
const statesLoading = ref(true);
const municipalities = ref([]);
const municipalitiesLoading = ref(false);
const certifications = ref([]);
const certificationsLoading = ref(false);

const authHdrs = (useFormData = false) =>
  getHdrs({ token: store.getAuth?.token, useFormData });

const getCatalogs = async () => {
  try {
    const endpoint3 = `${URL_API}/v1/buyers/catalogs/states`;
    const response3 = await axios.get(endpoint3, authHdrs());
    states.value = getRsp(response3)?.data?.items || [];
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    statesLoading.value = false;
  }
};

const getMunicipalitiesByState = async (stateId) => {
  if (!stateId) {
    municipalities.value = [];
    municipalitiesLoading.value = false;
    return;
  }

  municipalitiesLoading.value = true;

  try {
    const endpoint = `${URL_API}/v1/buyers/catalogs/municipalities`;
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
  () => item.value?.state_id,
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

const getItem = async () => {
  try {
    const endpoint = `${URL_API}/v1/buyers/profile`;
    const response = await axios.get(endpoint, authHdrs());

    const data = getRsp(response)?.data?.item || null;

    if (data) {
      if (data.municipality && data.municipality.state) {
        data.state_id = data.municipality.state.id;
        data.municipality_id = data.municipality.id;
      }

      data.logo_doc = b64ToFile(data?.logo_b64);

      item.value = data;

      if (item.value.state_id) {
        await getMunicipalitiesByState(item.value.state_id);
      }
    } else {
      item.value = {
        name: null,
        state_id: null,
        municipality_id: null,
        logo_path: null,
        logo_doc: null,
        phone: null,
        website_url: null,
        description: null,
        address: null,
        zip: null,
      };
    }
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

const handleAction = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) {
    alert?.show("red-darken-1", "Revisa los detalles señalados");
    return;
  }

  const confirmed = await confirm?.show(`¿Confirma guardar la información?`);
  if (!confirmed) return;

  isLoading.value = true;

  try {
    const payload = toStorePayload(item.value, true);
    const formData = getFormData(payload);

    const endpoint = `${URL_API}/v1/buyers/profile`;

    const response = await axios.post(endpoint, formData, authHdrs(true));

    const rsp = getRsp(response);
    alert?.show("success", rsp?.message || "Operación exitosa");

    router.push({
      name: `home`,
    });
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  getCatalogs();
  getItem();
});
</script>