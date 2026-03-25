<template>
  <v-card :loading="isLoading">
    <v-card-title class="d-flex align-center justify-space-between">
      <div class="d-flex align-center">
        <BtnBack
          :route="{
            name: routeName,
            params: {
              event_stand_config: getEncodeId(event_stand_configId),
              offer: getEncodeId(offerId),
              supplier: getEncodeId(supplierId),
              event: getEncodeId(eventId),
            },
          }"
        />
        <CardTitle :text="route.meta.title" :icon="route.meta.icon" />
      </div>
    </v-card-title>

    <v-card-text v-if="item">
      <v-row>
        <v-col v-if="!item.is_active" cols="12">
          <v-alert type="error" density="compact" class="rounded">
            <v-row dense>
              <v-col class="grow pt-2">El registro se encuentra inactivo</v-col>
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
                  <VisVal
                    label="¿Pagado?"
                    :value="
                      item.is_paid === 1
                        ? 'Sí'
                        : item.is_paid === 0
                        ? 'No'
                        : null
                    "
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
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

const routeName = "stand_allocations";

const alert = inject("alert");
const confirm = inject("confirm");
const store = useStore();
const router = useRouter();
const route = useRoute();

const itemId = ref(getDecodeId(route.params.id));
const event_stand_configId = ref(
  route.params.event_stand_config
    ? getDecodeId(route.params.event_stand_config)
    : null
);
const offerId = ref(
  route.params.offer ? getDecodeId(route.params.offer) : null
);
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

onMounted(() => {
  getItem();
});
</script>
