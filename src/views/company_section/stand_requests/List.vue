<template>
  <v-card elevation="24" :disabled="isLoading">
    <v-card-title class="d-flex align-center justify-space-between">
      <div class="d-flex align-center">
        <BtnBack :route="{ name: 'company_section_events' }" />
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
              <div class="text-right d-flex gap-2 justify-end">
                <v-btn
                  icon
                  variant="text"
                  size="x-small"
                  :color="item.is_active ? '' : 'red-darken-3'"
                  :to="{
                    name: `${routeName}/show`,
                    params: {
                      id: getEncodeId(item.id),
                      event: getEncodeId(eventId),
                    },
                  }"
                >
                  <v-icon>mdi-eye</v-icon>
                  <v-tooltip activator="parent" location="left"
                    >Detalle</v-tooltip
                  >
                </v-btn>
                <v-btn
                  icon
                  variant="text"
                  size="x-small"
                  color="warning"
                  @click="openApprovalDialog(item)"
                  :disabled="item.is_approved !== null"
                >
                  <v-icon>mdi-check-decagram</v-icon>
                  <v-tooltip activator="parent" location="left"
                    >Aprobar/Rechazar</v-tooltip
                  >
                </v-btn>
              </div>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-card-text>

    <!-- Dialog para aprobar/rechazar solicitud -->
    <v-dialog v-model="approvalDialogVisible" max-width="500px" persistent>
      <v-card :loading="approvalLoading">
        <v-card-title class="bg-primary text-white">
          <span class="text-h6">Revisar solicitud</span>
        </v-card-title>

        <v-card-text class="pt-4">
          <v-form ref="approvalFormRef">
            <v-row dense>
              <v-col cols="12">
                <v-textarea
                  v-model="approvalForm.notes"
                  label="Notas"
                  type="text"
                  variant="outlined"
                  density="compact"
                  rows="3"
                  maxlength="200"
                  counter
                  :rules="rules.textRequired"
                  autocomplete="off"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn
            color="grey-darken-1"
            variant="text"
            @click="closeApprovalDialog"
            :disabled="approvalLoading"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="error"
            variant="flat"
            @click="handleReject"
            :loading="approvalLoading"
          >
            Rechazar
          </v-btn>
          <v-btn
            color="success"
            variant="flat"
            @click="handleApprove"
            :loading="approvalLoading"
          >
            Aceptar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
import { getRules } from "@/utils/validators";
import CardTitle from "@/components/CardTitle.vue";
import BtnBack from "@/components/BtnBack.vue";

const routeName = "company_stand_requests";
const alert = inject("alert");
const confirm = inject("confirm");
const store = useStore();
const route = useRoute();

const isLoading = ref(false);
const items = ref([]);
const search = ref("");
const isActive = ref(1);
const rules = getRules();

// Estado del diálogo de aprobación
const approvalDialogVisible = ref(false);
const approvalLoading = ref(false);
const approvalFormRef = ref(null);
const selectedItem = ref(null);
const approvalForm = ref({
  notes: "",
});

const isItemsEmpty = computed(() => items.value.length === 0);
const isAdmin = computed(() => store.getUser?.role_id === 1);

const eventId = ref(
  route.params.event ? getDecodeId(route.params.event) : null
);

const isActiveOptions = [
  { id: 1, name: "ACTIVOS" },
  { id: 0, name: "INACTIVOS" },
];

const headers = [
  { title: "#", key: "index", filterable: false, sortable: false, width: 60 },
  { title: "Descripción", key: "offer.description" },
  { title: "Tipo de estante", key: "offer.stand_type.name" },
  { title: "", key: "action", filterable: false, sortable: false, width: 100 },
];

// Función para abrir el diálogo
const openApprovalDialog = (item) => {
  selectedItem.value = item;
  approvalForm.value = {
    notes: "",
  };
  approvalDialogVisible.value = true;
};

const closeApprovalDialog = () => {
  approvalDialogVisible.value = false;
  selectedItem.value = null;
  approvalForm.value = { notes: "" };
};

// Función para aprobar
const handleApprove = async () => {
  const confirmed = await confirm?.show(
    "¿Confirma aprobar esta solicitud de estante?"
  );
  if (!confirmed) return;

  await submitApproval(1);
};

// Función para rechazar
const handleReject = async () => {
  const confirmed = await confirm?.show(
    "¿Confirma rechazar esta solicitud de estante?"
  );
  if (!confirmed) return;

  await submitApproval(0);
};

// Función común para enviar la aprobación/rechazo
const submitApproval = async (isApproved) => {
  if (!selectedItem.value) return;

  approvalLoading.value = true;

  try {
    const endpoint = `${URL_API}/v1/company/events/stand_requests/${selectedItem.value.id}/approved`;

    const payload = {
      notes: approvalForm.value.notes,
      is_approved: isApproved,
    };

    const response = await axios.post(
      endpoint,
      payload,
      getHdrs({ token: store.getAuth?.token })
    );

    const rsp = getRsp(response);
    alert?.show(
      "success",
      rsp?.message ||
        (isApproved
          ? "Solicitud aprobada exitosamente"
          : "Solicitud rechazada exitosamente")
    );

    closeApprovalDialog();
    await getItems();
  } catch (err) {
    alert?.show(
      "red-darken-1",
      getErr(err) || "Error al procesar la solicitud"
    );
  } finally {
    approvalLoading.value = false;
  }
};

// Función para cargar items
const getItems = async () => {
  isLoading.value = true;
  items.value = [];

  try {
    const endpoint = `${URL_API}/v1/company/events/stand_requests`;
    const response = await axios.get(endpoint, {
      params: {
        is_active: isActive.value,
        event_id: eventId.value,
        is_approved: null,
      },
      ...getHdrs({ token: store.getAuth?.token }),
    });

    items.value = getRsp(response)?.data?.items || [];
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

<style scoped>
.gap-2 {
  gap: 8px;
}
</style>