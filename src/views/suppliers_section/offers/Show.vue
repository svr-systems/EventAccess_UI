<template>
  <v-card :loading="isLoading">
    <v-card-title class="d-flex align-center justify-space-between">
      <div class="d-flex align-center">
        <BtnBack
          :route="{
            name: routeName,
            params: {
              supplier: getEncodeId(supplierId),
              event: getEncodeId(eventId),
            },
          }"
        />
        <CardTitle :text="route.meta.title" :icon="route.meta.icon" />
      </div>

      <div>
        <v-btn
          icon
          variant="flat"
          size="x-small"
          color="info"
          class="mr-2"
          v-if="item"
          :to="{
            name: 'event_stand_config',
            params: {
              offer: getEncodeId(itemId),
              event: getEncodeId(eventId),
              supplier: getEncodeId(supplierId),
            },
          }"
        >
          <v-icon>mdi-fireplace-off</v-icon>
          <v-tooltip activator="parent" location="bottom"
            >Ver configuración de stands</v-tooltip
          >
        </v-btn>
        <v-btn
          v-if="item?.is_active"
          icon
          variant="flat"
          size="x-small"
          color="warning"
          :to="{
            name: `${routeName}/update`,
            params: {
              id: getEncodeId(item.id),
              supplier: getEncodeId(supplierId),
              event: getEncodeId(eventId),
            },
          }"
        >
          <v-icon>mdi-pencil</v-icon>
          <v-tooltip activator="parent" location="left">Editar</v-tooltip>
        </v-btn>
      </div>
    </v-card-title>

    <v-card-text v-if="item">
      <v-row>
        <v-col v-if="!item.is_active" cols="12">
          <v-alert type="error" density="compact" class="rounded">
            <v-row dense>
              <v-col class="grow pt-2">El registro se encuentra inactivo</v-col>

              <v-col class="shrink text-right">
                <v-btn
                  icon
                  variant="flat"
                  size="x-small"
                  color="success"
                  @click.prevent="activateItem"
                >
                  <v-icon>mdi-delete-restore</v-icon>
                  <v-tooltip activator="parent" location="left">
                    Reactivar
                  </v-tooltip>
                </v-btn>
              </v-col>
            </v-row>
          </v-alert>
        </v-col>

        <v-col cols="12">
          <v-card>
            <v-card-title class="d-flex align-center justify-space-between">
              <div class="d-flex align-center">
                <CardTitle :text="'GENERAL | ' + item.display_id" sub />
              </div>

              <div>
                <BtnAudit :item="item" />
              </div>
            </v-card-title>

            <v-card-text>
              <v-row dense>
                <v-col cols="12" md="4">
                  <VisVal label="Descripción" :value="item.description" />
                </v-col>
                <v-col cols="12" md="4">
                  <VisVal
                    label="Tipo de stand"
                    :value="item.stand_type.name"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col v-if="item.is_active" cols="12">
          <v-btn
            icon
            variant="flat"
            size="x-small"
            color="red-darken-1"
            @click.prevent="deleteItem"
          >
            <v-icon>mdi-minus-thick</v-icon>
            <v-tooltip activator="parent" location="right">Inactivar</v-tooltip>
          </v-btn>
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

import BtnBack from "@/components/BtnBack.vue";
import CardTitle from "@/components/CardTitle.vue";
import BtnAudit from "@/components/BtnAudit.vue";
import VisVal from "@/components/VisVal.vue";
import BtnDocPreview from "@/components/BtnDocPreview.vue";

const routeName = "offers";

const alert = inject("alert");
const confirm = inject("confirm");
const store = useStore();
const router = useRouter();
const route = useRoute();

const itemId = ref(getDecodeId(route.params.id));
const supplierId = ref(
  route.params.supplier ? getDecodeId(route.params.supplier) : null
);
const eventId = ref(
  route.params.event ? getDecodeId(route.params.event) : null
);

const isLoading = ref(false);
const item = ref(null);

const isAdmin = computed(() => store.getUser?.role_id === 1);
const authHdrs = () => getHdrs({ token: store.getAuth?.token });

const getItem = async () => {
  isLoading.value = true;

  try {
    const endpoint = `${URL_API}/v1/suppliers/${routeName}/${itemId.value}`;
    const response = await axios.get(endpoint, authHdrs());
    item.value = getRsp(response)?.data?.item || null;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

const deleteItem = async () => {
  const confirmed = await confirm?.show("¿Confirma inactivar el registro?");
  if (!confirmed) return;

  isLoading.value = true;

  try {
    const endpoint = `${URL_API}/v1/suppliers/${routeName}/${itemId.value}`;
    const rsp = getRsp(await axios.delete(endpoint, authHdrs()));

    alert?.show("success", rsp?.message || "Registro inactivado correctamente");
    router.push({ name: routeName });
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

const activateItem = async () => {
  const confirmed = await confirm?.show("¿Confirma activar el registro?");
  if (!confirmed) return;

  isLoading.value = true;

  try {
    const endpoint = `${URL_API}/v1/suppliers/${routeName}/${itemId.value}/activate`;
    const rsp = getRsp(await axios.patch(endpoint, {}, authHdrs()));

    alert?.show("success", rsp?.message || "Registro activado correctamente");
    await getItem();
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  getItem();
});
</script>
