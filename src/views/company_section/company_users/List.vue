<template>
  <v-card elevation="24" :disabled="isLoading">
    <v-card-title class="d-flex align-center justify-space-between">
      <div class="d-flex align-center">
        <CardTitle :text="route.meta.title" :icon="route.meta.icon" />
      </div>

      <div>
        <v-btn
          icon
          variant="flat"
          size="x-small"
          color="success"
          v-if="companyId"
          :to="{
            name: `${routeName}/store`,
            params: { company: getEncodeId(companyId) },
          }"
        >
          <v-icon>mdi-plus</v-icon>
          <v-tooltip activator="parent" location="bottom">Agregar</v-tooltip>
        </v-btn>
      </div>
    </v-card-title>

    <v-card-text>
      <v-row dense>
        <v-col cols="12" md="9" class="pb-0">
          <v-row dense>
            <v-col v-if="isAdmin" cols="12" md="3" class="pb-0">
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
          <v-btn
            block
            size="small"
            :color="isItemsEmpty ? 'info' : 'grey-darken-1'"
            :loading="isItemsEmpty && isLoading"
            @click.prevent="isItemsEmpty ? getItems() : (items = [])"
          >
            {{ isItemsEmpty ? "Aplicar" : "Cambiar" }} filtros
            <v-icon end>mdi-filter</v-icon>
          </v-btn>
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

            <template #item.action="{ item }">
              <div class="text-right">
                <v-btn
                  icon
                  v-if="companyId"
                  variant="text"
                  size="x-small"
                  :color="item.is_active ? '' : 'red-darken-3'"
                  :to="{
                    name: `${routeName}/show`,
                    params: {
                      id: getEncodeId(item.id),
                      company: getEncodeId(companyId),
                    },
                  }"
                >
                  <v-icon>mdi-eye</v-icon>
                  <v-tooltip activator="parent" location="left"
                    >Detalle</v-tooltip
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
import CardTitle from "@/components/CardTitle.vue";

const routeName = "company_section_users";
const alert = inject("alert");
const store = useStore();
const route = useRoute();

const isLoading = ref(false);
const items = ref([]);
const companies = ref([]);
const companyId = ref(null);
const search = ref("");
const isActive = ref(1);

const isItemsEmpty = computed(() => items.value.length === 0);
const isAdmin = computed(() => store.getUser?.role_id === 1);

const isActiveOptions = [
  { id: 1, name: "ACTIVOS" },
  { id: 0, name: "INACTIVOS" },
];

const headers = [
  { title: "#", key: "index", filterable: false, sortable: false, width: 60 },
  { title: "Nombre", key: "user.full_name" },
  { title: "E-mail", key: "user.email" },
  { title: "Identificador", key: "user.display_id" },
  { title: "", key: "action", filterable: false, sortable: false, width: 60 },
];

const getItems = async () => {
  isLoading.value = true;
  items.value = [];

  try {
    const endpoint = `${URL_API}/v1/company/companies`;
    const response = await axios.get(endpoint, {
      ...getHdrs({ token: store.getAuth?.token }),
    });

    companies.value = getRsp(response)?.data?.items || [];
    companyId.value = companies.value.length > 0 ? companies.value[0].id : null;
    
    const endpoint2 = `${URL_API}/v1/company/users`;
    const response2 = await axios.get(endpoint2, {
      params: { is_active: isActive.value, company_id: companyId.value },
      ...getHdrs({ token: store.getAuth?.token }),
    });

    items.value = getRsp(response2)?.data?.items || [];
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  getItems();
});
</script>
