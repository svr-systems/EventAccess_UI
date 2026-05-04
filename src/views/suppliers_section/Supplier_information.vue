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
                  <CardTitle text="DATOS DEL PROVEEDOR" sub />
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

                  <v-col cols="12" md="4">
                    <div class="d-flex align-start ga-2">
                      <div class="flex-grow-1">
                        <v-file-input
                          v-model="item.tax_certificate_doc"
                          label="Constancia de situación fiscal"
                          variant="outlined"
                          density="compact"
                          prepend-icon=""
                          show-size
                          accept=".pdf"
                          :rules="rules.fileRequired"
                        />
                      </div>
                      <div
                        v-if="item.tax_certificate_doc"
                        class="pt-1 flex-shrink-0"
                      >
                        <BtnDocPreview
                          :file="item.tax_certificate_doc"
                          tooltip="Ver"
                          variant="outlined"
                        />
                      </div>
                    </div>
                  </v-col>

                  <v-col cols="12" md="4">
                    <div class="d-flex align-start ga-2">
                      <div class="flex-grow-1">
                        <v-file-input
                          v-model="item.positive_opinion_doc"
                          label="Opinión positiva SAT"
                          variant="outlined"
                          density="compact"
                          prepend-icon=""
                          show-size
                          accept=".pdf"
                          :rules="rules.fileRequired"
                        />
                      </div>
                      <div
                        v-if="item.positive_opinion_doc"
                        class="pt-1 flex-shrink-0"
                      >
                        <BtnDocPreview
                          :file="item.positive_opinion_doc"
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
                  <CardTitle text="DATOS FISCALES" sub />
                </div>

                <div />
              </v-card-title>

              <v-card-text>
                <v-row dense>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="item.fiscal_code"
                      label="RFC"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="20"
                      counter
                      :rules="rules.textRequired"
                      autocomplete="off"
                    />
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="item.fiscal_name"
                      label="Razón social"
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
                    <v-select
                      v-model="item.fiscal_regime_id"
                      label="Régimen Fiscal"
                      :items="fiscal_regimes"
                      :loading="fiscal_regimesLoading"
                      item-value="id"
                      item-title="name"
                      variant="outlined"
                      density="compact"
                      :rules="rules.requiredNotNull"
                    />
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-select
                      v-model="item.cfdi_usage_id"
                      label="Uso de CFDI"
                      :items="cfdi_usages"
                      :loading="cfdi_usagesLoading"
                      item-value="id"
                      item-title="name"
                      variant="outlined"
                      density="compact"
                      :rules="rules.requiredNotNull"
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="item.fiscal_zip"
                      label="Código postal fiscal"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="50"
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
            <v-card>
              <v-card-title class="d-flex align-center justify-space-between">
                <div class="d-flex align-center">
                  <CardTitle text="CERTIFICACIONES" sub />
                </div>

                <div />
              </v-card-title>

              <v-card-text>
                <v-row dense>
                  <v-col cols="12">
                    <div class="text-caption text-grey mb-4">
                      Selecciona las certificaciones que posees
                    </div>
                    <div class="d-flex flex-wrap ga-2">
                      <v-btn
                        v-for="certification in certifications"
                        :key="certification.id"
                        :color="
                          isCertificationSelected(certification.id)
                            ? 'primary'
                            : 'grey-lighten-2'
                        "
                        :variant="
                          isCertificationSelected(certification.id)
                            ? 'flat'
                            : 'outlined'
                        "
                        size="small"
                        rounded="pill"
                        @click="toggleCertification(certification.id)"
                        class="text-capitalize"
                      >
                        <v-icon
                          v-if="isCertificationSelected(certification.id)"
                          start
                          size="small"
                        >
                          mdi-check
                        </v-icon>
                        {{ certification.name }}
                      </v-btn>
                    </div>
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
  fiscal_regime_id: null,
  cfdi_usage_id: null,
  state_id: null,
  municipality_id: null,
  logo_doc: null,
  phone: null,
  website_url: null,
  description: null,
  address: null,
  zip: null,
  fiscal_code: null,
  fiscal_name: null,
  fiscal_zip: null,
  tax_certificate_doc: null,
  positive_opinion_doc: null,
  supplier_certifications: [],
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

// Función para verificar si una certificación está seleccionada
const isCertificationSelected = (certificationId) => {
  if (!item.value?.supplier_certifications) return false;
  return item.value.supplier_certifications.some(
    (sc) => sc.certification_id === certificationId
  );
};

// Función para agregar/quitar certificaciones
const toggleCertification = (certificationId) => {
  if (!item.value.supplier_certifications) {
    item.value.supplier_certifications = [];
  }

  const exists = item.value.supplier_certifications.some(
    (sc) => sc.certification_id === certificationId
  );

  if (exists) {
    item.value.supplier_certifications =
      item.value.supplier_certifications.filter(
        (sc) => sc.certification_id !== certificationId
      );
  } else {
    item.value.supplier_certifications.push({
      certification_id: certificationId,
    });
  }
};

const getCatalogs = async () => {
  try {
    const endpoint1 = `${URL_API}/v1/suppliers/catalogs/fiscal_regimes`;
    const response1 = await axios.get(endpoint1, authHdrs());
    fiscal_regimes.value = getRsp(response1)?.data?.items || [];
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    fiscal_regimesLoading.value = false;
  }

  try {
    const endpoint2 = `${URL_API}/v1/suppliers/catalogs/cfdi_usages`;
    const response2 = await axios.get(endpoint2, authHdrs());
    cfdi_usages.value = getRsp(response2)?.data?.items || [];
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    cfdi_usagesLoading.value = false;
  }

  try {
    const endpoint3 = `${URL_API}/v1/suppliers/catalogs/states`;
    const response3 = await axios.get(endpoint3, authHdrs());
    states.value = getRsp(response3)?.data?.items || [];
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    statesLoading.value = false;
  }

  try {
    const endpoint4 = `${URL_API}/v1/suppliers/certifications`;
    const response4 = await axios.get(endpoint4, authHdrs());
    certifications.value = getRsp(response4)?.data?.items || [];
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    certificationsLoading.value = false;
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
    const endpoint = `${URL_API}/v1/suppliers/catalogs/municipalities`;
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
    const endpoint = `${URL_API}/v1/suppliers/profile`;
    const response = await axios.get(endpoint, authHdrs());

    const data = getRsp(response)?.data?.item || null;

    if (data) {
      // Extraer state_id desde la estructura anidada
      if (data.municipality && data.municipality.state) {
        data.state_id = data.municipality.state.id;
        data.municipality_id = data.municipality.id;
      }

      // Transformar supplier_certifications al formato esperado
      if (
        data.supplier_certifications &&
        data.supplier_certifications.length > 0
      ) {
        data.supplier_certifications = data.supplier_certifications.map(
          (sc) => ({
            certification_id: sc.certification_id,
          })
        );
      } else {
        data.supplier_certifications = [];
      }

      // Convertir archivos base64 a File objects
      data.logo_doc = b64ToFile(data?.logo_b64);
      data.tax_certificate_doc = b64ToFile(data?.tax_certificate_b64);
      data.positive_opinion_doc = b64ToFile(data?.positive_opinion_b64);

      item.value = data;

      // Cargar municipios si hay un state_id
      if (item.value.state_id) {
        await getMunicipalitiesByState(item.value.state_id);
      }
    } else {
      item.value = {
        name: null,
        fiscal_regime_id: null,
        cfdi_usage_id: null,
        state_id: null,
        municipality_id: null,
        logo_doc: null,
        phone: null,
        website_url: null,
        description: null,
        address: null,
        zip: null,
        fiscal_code: null,
        fiscal_name: null,
        fiscal_zip: null,
        tax_certificate_doc: null,
        positive_opinion_doc: null,
        supplier_certifications: [],
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

    const endpoint = `${URL_API}/v1/suppliers/profile`;

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