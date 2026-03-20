<template>
  <v-row justify="center">
    <v-col cols="12" class="pt-3">
      <v-card elevation="24" :loading="isLoading">
        <v-card-title>
          <v-row dense>
            <v-col cols="10" class="py-4">
              <BtnBack
                :route="{
                  name: 'public_presentation_dates',
                  params: { id: getEncodeId(itemId) },
                }"
              />
              <CardTitle
                text="Tipos de boletos disponibles"
                icon="mdi-ticket"
              />
            </v-col>
          </v-row>
        </v-card-title>

        <v-card-text>
          <v-row dense>
            <v-col cols="12">
              <v-text-field
                v-model="search"
                label="Buscar boletos"
                type="text"
                variant="outlined"
                density="compact"
                append-inner-icon="mdi-magnify"
                class="mb-4"
              />

              <div
                v-if="filteredItems.length === 0 && !isLoading"
                class="text-center py-8"
              >
                <v-icon size="60" color="grey-lighten-1" class="mb-4">
                  mdi-ticket-remove
                </v-icon>
                <div class="text-h6 text-grey">No hay boletos disponibles</div>
                <div class="text-body-2 text-grey mt-2">
                  No se encontraron tipos de boletos para esta fecha
                </div>
              </div>

              <v-row v-if="!isLoading && filteredItems.length > 0" dense>
                <v-col
                  v-for="item in filteredItems"
                  :key="item.id"
                  cols="12"
                  sm="6"
                  md="4"
                  lg="3"
                >
                  <v-card elevation="6" class="ticket-card">
                    <v-card-text class="pa-4">
                      <div
                        class="d-flex justify-space-between align-start mb-3"
                      >
                        <v-avatar
                          size="50"
                          :color="getTicketColor(item)"
                          rounded="lg"
                        >
                          <v-icon size="30" color="white">
                            {{ getTicketIcon(item) }}
                          </v-icon>
                        </v-avatar>
                        <v-chip
                          :color="item.is_active ? 'success' : 'error'"
                          size="x-small"
                          class="text-capitalize"
                        >
                          {{ item.is_active ? "Activo" : "Inactivo" }}
                        </v-chip>
                      </div>

                      <div class="text-h6 font-weight-bold text-center mb-1">
                        {{ item.ticket_type?.name || "Ticket sin nombre" }}
                      </div>

                      <div class="text-caption text-grey text-center mb-2">
                        {{ item.display_id }}
                      </div>

                      <div class="text-body-3 text-grey text-center mb-3">
                        {{ item.ticket_type?.description || "Sin descripción" }}
                      </div>

                      <v-divider class="my-3" />

                      <div class="text-center mb-3">
                        <div class="text-caption text-grey">Precio</div>
                        <div class="text-h5 font-weight-bold success--text">
                          {{ formatCurrency(item.price) }}
                        </div>
                      </div>

                      <div
                        class="d-flex justify-space-between align-center mb-2"
                      >
                        <div>
                          <div class="text-caption text-grey">Disponibles</div>
                          <div class="text-h6 font-weight-bold">
                            {{ calculateAvailable(item) }}
                          </div>
                        </div>

                        <div class="text-right">
                          <div class="text-caption text-grey">Capacidad</div>
                          <div class="text-body-1 font-weight-medium">
                            {{ item.capacity || "0" }}
                          </div>
                        </div>
                      </div>

                      <v-progress-linear
                        :model-value="soldPercentage(item)"
                        :color="getAvailabilityColor(calculateAvailable(item))"
                        height="6"
                        rounded
                        class="mt-2"
                      />

                      <div class="d-flex justify-space-between mt-2">
                        <div class="text-caption text-grey">
                          Vendidos: {{ item.sold || "0" }}
                        </div>
                        <v-chip
                          :color="
                            getAvailabilityColor(calculateAvailable(item))
                          "
                          size="x-small"
                          class="text-capitalize"
                        >
                          {{ getAvailabilityText(calculateAvailable(item)) }}
                        </v-chip>
                      </div>

                      <v-btn
                        block
                        color="primary"
                        variant="flat"
                        class="mt-4"
                        size="small"
                        :disabled="
                          calculateAvailable(item) === 0 || !item.is_active
                        "
                        @click="openBuyDialog(item)"
                      >
                        <v-icon size="small" class="mr-1">mdi-cart</v-icon>
                        Comprar boleto
                      </v-btn>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>

    <v-dialog v-model="userDialogVisible" max-width="500px" persistent>
      <v-card :loading="userDialogLoading">
        <v-card-title class="bg-primary text-white">
          <span class="text-h6">Registrar asistente</span>
        </v-card-title>

        <v-card-text class="pt-4">
          <v-form ref="userFormRef" @submit.prevent="handleUserRegistration">
            <v-row dense>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="userForm.name"
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

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="userForm.paternal_surname"
                  label="Apellido paterno"
                  type="text"
                  variant="outlined"
                  density="compact"
                  maxlength="25"
                  counter
                  :rules="rules.textRequired"
                  autocomplete="off"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="userForm.maternal_surname"
                  label="Apellido materno *"
                  type="text"
                  variant="outlined"
                  density="compact"
                  maxlength="25"
                  counter
                  :rules="rules.textOptional"
                  autocomplete="off"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="userForm.email"
                  label="Correo electrónico"
                  type="email"
                  variant="outlined"
                  density="compact"
                  maxlength="65"
                  counter
                  :rules="rules.emailRequired"
                  autocomplete="off"
                  inputmode="email"
                  autocapitalize="none"
                  spellcheck="false"
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
            @click="closeUserDialog"
            :disabled="userDialogLoading"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="primary"
            variant="flat"
            @click="handleUserRegistration"
            :loading="userDialogLoading"
          >
            Continuar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="quantityDialogVisible" max-width="400px" persistent>
      <v-card :loading="saleDialogLoading">
        <v-card-title class="bg-primary text-white">
          <span class="text-h6">¿Cuántos boletos deseas?</span>
        </v-card-title>

        <v-card-text class="pt-4">
          <v-form ref="quantityFormRef" @submit.prevent="handleSale">
            <v-row dense>
              <v-col cols="12">
                <v-text-field
                  v-model="quantityForm.total"
                  label="Cantidad de boletos"
                  type="number"
                  variant="outlined"
                  density="compact"
                  min="1"
                  :max="maxAvailable"
                  :rules="quantityRules"
                  autocomplete="off"
                  hide-details="auto"
                  @keyup.enter="handleSale"
                />
              </v-col>

              <v-col cols="12" class="mt-2">
                <div class="text-caption text-grey">
                  Boletos disponibles: {{ maxAvailable }}
                </div>
                <div class="text-caption text-grey">
                  Precio unitario: {{ formatCurrency(selectedTicket?.price) }}
                </div>
                <div class="text-subtitle-1 font-weight-bold mt-2">
                  Total: {{ formatCurrency(calculateTotal()) }}
                </div>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn
            color="grey-darken-1"
            variant="text"
            @click="closeQuantityDialog"
            :disabled="saleDialogLoading"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="success"
            variant="flat"
            @click="handleSale"
            :loading="saleDialogLoading"
          >
            Confirmar compra
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script setup>
import { ref, computed, inject, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

import { useStore } from "@/store";
import { URL_API } from "@/utils/config";
import { getHdrs, getErr, getRsp } from "@/utils/http";
import { getEncodeId, getDecodeId } from "@/utils/coders";
import { getRules } from "@/utils/validators";
import { getFormData, toStorePayload } from "@/utils/helpers";
import CardTitle from "@/components/CardTitle.vue";
import BtnBack from "@/components/BtnBack.vue";

const router = useRouter();
const route = useRoute();
const store = useStore();
const alert = inject("alert");

// Estado principal
const isLoading = ref(false);
const items = ref([]);
const search = ref("");
const rules = getRules();

// Estado del diálogo de usuario
const userDialogVisible = ref(false);
const userDialogLoading = ref(false);
const userFormRef = ref(null);
const userForm = ref({
  name: "",
  paternal_surname: "",
  maternal_surname: "",
  email: "",
});

// Estado del diálogo de cantidad
const quantityDialogVisible = ref(false);
const saleDialogLoading = ref(false);
const quantityFormRef = ref(null);
const quantityForm = ref({
  total: 1,
});

// Datos de la compra
const selectedTicket = ref(null);
const registeredUserId = ref(null);

const itemId = ref(route.params.id ? getDecodeId(route.params.id) : null);

// Auth headers
const authHdrs = (useFormData = false) =>
  getHdrs({ token: store.getAuth?.token, useFormData });

// Reglas para cantidad
const quantityRules = [
  (v) => !!v || "La cantidad es requerida",
  (v) => v > 0 || "Debe ser mayor a 0",
  (v) =>
    v <= maxAvailable.value ||
    `Máximo ${maxAvailable.value} boletos disponibles`,
];

// Máximo disponible
const maxAvailable = computed(() => {
  if (!selectedTicket.value) return 0;
  return calculateAvailable(selectedTicket.value);
});

// Filtrar items según búsqueda
const filteredItems = computed(() => {
  if (!search.value) return items.value;

  const searchTerm = search.value.toLowerCase();
  return items.value.filter((item) => {
    return (
      (item.display_id && item.display_id.toLowerCase().includes(searchTerm)) ||
      (item.ticket_type?.name &&
        item.ticket_type.name.toLowerCase().includes(searchTerm)) ||
      (item.ticket_type?.description &&
        item.ticket_type.description.toLowerCase().includes(searchTerm)) ||
      (item.price && item.price.toString().includes(searchTerm))
    );
  });
});

// Funciones de formato
const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return "$0.00";

  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  }).format(amount);
};

// Funciones de disponibilidad
const calculateAvailable = (item) => {
  const capacity = parseInt(item.capacity) || 0;
  const sold = parseInt(item.sold) || 0;
  return capacity - sold;
};

const getAvailabilityColor = (available) => {
  const numAvailable = parseInt(available) || 0;
  if (numAvailable === 0) return "error";
  if (numAvailable < 20) return "warning";
  return "success";
};

const getAvailabilityText = (available) => {
  const numAvailable = parseInt(available) || 0;
  if (numAvailable === 0) return "Agotado";
  if (numAvailable < 20) return "Pocos";
  return "Disponible";
};

const soldPercentage = (item) => {
  const capacity = parseInt(item.capacity) || 0;
  const sold = parseInt(item.sold) || 0;
  if (capacity === 0) return 0;
  return (sold / capacity) * 100;
};

const calculateTotal = () => {
  if (!selectedTicket.value || !quantityForm.value.total) return 0;
  return selectedTicket.value.price * quantityForm.value.total;
};

// Funciones para estilos de tickets
const getTicketColor = (item) => {
  const colors = [
    "primary",
    "success",
    "warning",
    "error",
    "info",
    "secondary",
  ];
  const index = (item.ticket_type_id || 1) % colors.length;
  return colors[index];
};

const getTicketIcon = (item) => {
  const icons = [
    "mdi-ticket-star",
    "mdi-ticket-confirmation",
    "mdi-ticket-percent",
    "mdi-ticket-account",
    "mdi-ticket",
  ];
  const index = (item.ticket_type_id || 1) % icons.length;
  return icons[index];
};

// Funciones del diálogo de usuario
const openBuyDialog = (item) => {
  if (calculateAvailable(item) === 0) {
    alert?.show("warning", "No hay boletos disponibles");
    return;
  }

  if (!item.is_active) {
    alert?.show("warning", "Este tipo de boleto no está activo");
    return;
  }

  selectedTicket.value = item;
  userForm.value = {
    name: "",
    paternal_surname: "",
    maternal_surname: "",
    email: "",
  };
  userDialogVisible.value = true;
};

const closeUserDialog = () => {
  userDialogVisible.value = false;
  if (!quantityDialogVisible.value) {
    selectedTicket.value = null;
  }
};

const handleUserRegistration = async () => {
  const { valid } = await userFormRef.value.validate();
  if (!valid) {
    alert?.show("red-darken-1", "Revisa los detalles señalados");
    return;
  }

  userDialogLoading.value = true;

  try {
    const payload = toStorePayload(userForm.value, true);
    const formData = getFormData(payload);

    const endpoint = `${URL_API}/v1/public/users`;
    const response = await axios.post(endpoint, formData, authHdrs(true));
    const rsp = getRsp(response);

    registeredUserId.value = rsp?.data?.item?.id;

    alert?.show("success", "Usuario registrado exitosamente");

    userDialogVisible.value = false;
    quantityForm.value.total = 1;
    quantityDialogVisible.value = true;
  } catch (err) {
    console.error("Error completo:", err);
    alert?.show("red-darken-1", getErr(err) || "Error al registrar usuario");
  } finally {
    userDialogLoading.value = false;
  }
};

// Funciones del diálogo de cantidad
const closeQuantityDialog = () => {
  quantityDialogVisible.value = false;
  selectedTicket.value = null;
  registeredUserId.value = null;
};

const handleSale = async () => {
  const { valid } = await quantityFormRef.value.validate();
  if (!valid) {
    alert?.show("red-darken-1", "Revisa la cantidad ingresada");
    return;
  }

  saleDialogLoading.value = true;

  try {
    const salePayload = {
      user_id: registeredUserId.value,
      presentation_tickets: [
        {
          id: selectedTicket.value.id,
          total: quantityForm.value.total,
        },
      ],
    };

    const endpoint = `${URL_API}/v1/public/events/sale`;
    const response = await axios.post(endpoint, salePayload, authHdrs());
    const rsp = getRsp(response);

    alert?.show("success", rsp?.message || "Compra realizada exitosamente");

    closeQuantityDialog();
    await getItems();
  } catch (err) {
    console.error("Error completo:", err);
    alert?.show("red-darken-1", getErr(err) || "Error al procesar la compra");
  } finally {
    saleDialogLoading.value = false;
  }
};

// Cargar tipos de tickets
const getItems = async () => {
  isLoading.value = true;
  items.value = [];

  try {
    const endpoint = `${URL_API}/v1/public/events/presentation_tickets`;
    const response = await axios.get(endpoint, {
      params: {
        is_active: 1,
        presentation_date_id: itemId.value,
      },
      ...authHdrs(),
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
.ticket-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  height: 100%;
}

.ticket-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
}

.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.text-body-3 {
  font-size: 0.8125rem;
  line-height: 1.2;
}

.bg-primary-lighten-5 {
  background-color: rgba(25, 118, 210, 0.1);
}
</style>