<template>
  <v-row justify="center">
    <v-col cols="12" class="pt-3">
      <v-card elevation="24" :loading="isLoading">
        <v-card-title>
          <v-row dense align="center">
            <v-col cols="auto">
              <BtnBack
                :route="{
                  name: 'event_details',
                  params: { id: getEncodeId(eventId) },
                }"
              />
            </v-col>
            <v-col>
              <CardTitle text="Compra de boletos" icon="mdi-ticket" />
            </v-col>
          </v-row>
        </v-card-title>

        <v-card-text>
          <v-row dense>
            <v-col cols="12" md="9">
              <v-card elevation="6">
                <v-card-text class="pa-4">
                  <v-select
                    v-model="selectedDateId"
                    :items="presentationDates"
                    item-title="display_text"
                    item-value="id"
                    label="Selecciona una fecha de presentación"
                    variant="outlined"
                    density="compact"
                    :loading="datesLoading"
                    :disabled="datesLoading"
                    @update:model-value="onDateSelected"
                    class="mb-4"
                  >
                    <template #append-inner>
                      <v-icon v-if="datesLoading" size="small" class="mr-2">
                        mdi-loading mdi-spin
                      </v-icon>
                    </template>
                  </v-select>

                  <div
                    v-if="!datesLoading && presentationDates.length === 0"
                    class="text-center py-8"
                  >
                    <v-icon size="60" color="grey-lighten-1" class="mb-4">
                      mdi-calendar-remove
                    </v-icon>
                    <div class="text-h6 text-grey">
                      No hay fechas disponibles
                    </div>
                    <div class="text-body-2 text-grey mt-2">
                      No se encontraron fechas de presentación para este evento
                    </div>
                  </div>

                  <div
                    v-else-if="selectedDateId && ticketsLoading"
                    class="text-center py-8"
                  >
                    <v-progress-circular indeterminate color="primary" />
                    <div class="text-body-2 text-grey mt-2">
                      Cargando boletos...
                    </div>
                  </div>

                  <div
                    v-else-if="
                      selectedDateId && tickets.length === 0 && !ticketsLoading
                    "
                    class="text-center py-8"
                  >
                    <v-icon size="60" color="grey-lighten-1" class="mb-4">
                      mdi-ticket
                    </v-icon>
                    <div class="text-h6 text-grey">
                      No hay boletos disponibles
                    </div>
                    <div class="text-body-2 text-grey mt-2">
                      No se encontraron tipos de boletos para esta fecha
                    </div>
                  </div>

                  <v-row v-else-if="selectedDateId && tickets.length > 0" dense>
                    <v-col v-for="item in tickets" :key="item.id" cols="12">
                      <v-card elevation="2" class="ticket-card mb-2">
                        <v-card-text class="pa-3">
                          <div
                            class="d-flex align-center justify-space-between"
                          >
                            <div class="d-flex align-center flex-grow-1">
                              <div>
                                <div class="text-subtitle-1 font-weight-bold">
                                  {{
                                    item.ticket_type?.name ||
                                    "Ticket sin nombre"
                                  }}
                                </div>
                                <div class="text-caption">
                                  {{ item.display_id }}
                                </div>
                                <div
                                  class="text-caption text-truncate"
                                  style="max-width: 200px"
                                >
                                  {{
                                    item.ticket_type?.description ||
                                    "Sin descripción"
                                  }}
                                </div>
                              </div>

                              <div class="ml-12">
                                <div>Precio</div>
                                <div
                                  class="text-subtitle-1 font-weight-bold text-primary"
                                >
                                  {{ formatCurrency(item.price) }}
                                </div>
                              </div>

                              <div class="ml-12">
                                <div>Disponibles</div>
                                <div class="text-subtitle-1 font-weight-bold">
                                  {{ calculateAvailable(item) }}
                                  <span class="text-caption text-grey">
                                    / {{ item.capacity || "0" }}
                                  </span>
                                </div>
                                <v-progress-linear
                                  :model-value="soldPercentage(item)"
                                  :color="
                                    getAvailabilityColor(
                                      calculateAvailable(item)
                                    )
                                  "
                                  height="4"
                                  rounded
                                  class="mt-1"
                                  style="width: 80px"
                                />
                              </div>
                            </div>

                            <div class="d-flex align-center">
                              <v-btn
                                :disabled="getItemQuantity(item.id) === 0"
                                size="small"
                                color="error"
                                variant="outlined"
                                density="compact"
                                icon
                                @click="decrementTicket(item)"
                              >
                                <v-icon size="small">mdi-minus</v-icon>
                              </v-btn>

                              <div class="text-h6 font-weight-bold mx-6">
                                {{ getItemQuantity(item.id) }}
                              </div>

                              <v-btn
                                :disabled="
                                  getItemQuantity(item.id) >=
                                  calculateAvailable(item)
                                "
                                size="small"
                                color="success"
                                variant="outlined"
                                density="compact"
                                icon
                                @click="incrementTicket(item)"
                              >
                                <v-icon size="small">mdi-plus</v-icon>
                              </v-btn>
                            </div>
                          </div>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col v-if="hasOrderItems" cols="12" md="3">
              <v-card elevation="6" class="order-card">
                <v-card-title>
                  <span class="text-h6">Tu pedido</span>
                </v-card-title>

                <v-card-text class="pa-4">
                  <div
                    v-for="(quantity, ticketId) in orderItems"
                    :key="ticketId"
                    class="order-item mb-3"
                  >
                    <div class="d-flex justify-space-between align-center">
                      <div>
                        <div class="text-body-2 font-weight-medium">
                          {{ getTicketName(Number(ticketId)) }}
                        </div>
                        <div class="text-caption text-grey">
                          {{ quantity }} x
                          {{ formatCurrency(getTicketPrice(Number(ticketId))) }}
                        </div>
                      </div>
                      <div class="text-body-2 font-weight-bold">
                        {{
                          formatCurrency(
                            quantity * getTicketPrice(Number(ticketId))
                          )
                        }}
                      </div>
                    </div>
                  </div>

                  <v-divider class="my-3" />

                  <div class="d-flex justify-space-between mb-4">
                    <div class="text-subtitle-1 font-weight-bold">Total</div>
                    <div class="text-subtitle-1 font-weight-bold text-primary">
                      {{ formatCurrency(calculateOrderTotal()) }}
                    </div>
                  </div>

                  <v-btn
                    block
                    color="success"
                    variant="flat"
                    size="large"
                    @click="openUserDialog"
                  >
                    <v-icon size="small" class="mr-1">mdi-credit-card</v-icon>
                    Pagar
                  </v-btn>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col v-else cols="12" md="3" class="d-none d-md-block">
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>

    <v-dialog v-model="userDialogVisible" max-width="550px" persistent>
      <v-card :loading="userDialogLoading" class="user-dialog">
        <v-btn
          class="close-btn"
          icon
          variant="text"
          size="small"
          @click="closeUserDialog"
          :disabled="userDialogLoading"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>

        <div class="dialog-header">
          <v-icon size="48" color="white" class="mb-2">mdi-account-plus</v-icon>
          <div class="text-h5 font-weight-bold text-white">
            ¡Completa tu registro!
          </div>
          <div class="text-body-2 text-white opacity-75 mt-1">
            Necesitamos tus datos para generar tu boleto
          </div>
        </div>

        <v-card-text class="pt-6 pb-4">
          <v-form ref="userFormRef" @submit.prevent="handleUserRegistration">
            <v-row dense>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="userForm.name"
                  label="Nombre"
                  type="text"
                  variant="outlined"
                  density="comfortable"
                  maxlength="50"
                  counter
                  :rules="rules.textRequired"
                  autocomplete="off"
                  prepend-inner-icon="mdi-account"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="userForm.paternal_surname"
                  label="Apellido paterno"
                  type="text"
                  variant="outlined"
                  density="comfortable"
                  maxlength="25"
                  counter
                  :rules="rules.textRequired"
                  autocomplete="off"
                  prepend-inner-icon="mdi-account"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="userForm.maternal_surname"
                  label="Apellido materno *"
                  type="text"
                  variant="outlined"
                  density="comfortable"
                  maxlength="25"
                  counter
                  :rules="rules.textOptional"
                  autocomplete="off"
                  prepend-inner-icon="mdi-account"
                  persistent-hint
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="userForm.email"
                  label="Correo electrónico"
                  type="email"
                  variant="outlined"
                  density="comfortable"
                  maxlength="65"
                  counter
                  :rules="rules.emailRequired"
                  autocomplete="off"
                  inputmode="email"
                  autocapitalize="none"
                  spellcheck="false"
                  prepend-inner-icon="mdi-email"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-4 pt-0">
          <v-spacer />
          <v-btn
            color="success"
            variant="flat"
            size="small"
            icon
            @click="handleUserRegistration"
            :loading="userDialogLoading"
          >
            <v-icon>mdi-check</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="successDialogVisible" max-width="450px" persistent>
      <v-card class="success-dialog">
        <div class="success-header">
          <v-icon size="64" color="white" class="mb-2">mdi-check-circle</v-icon>
          <div class="text-h5 font-weight-bold text-white">
            ¡Compra exitosa!
          </div>
        </div>

        <v-card-text class="pt-6 pb-4 text-center">
          <div class="text-h6 mb-3">¡Felicidades!</div>
          <div class="text-body-1 text-grey-darken-1 mb-4">
            Tu compra ha sido procesada exitosamente. Los boletos han sido
            enviados a tu correo electrónico.
          </div>
          <div class="text-caption text-grey">
            Revisa tu bandeja de entrada o spam para encontrar tus boletos
          </div>
        </v-card-text>

        <v-card-actions class="pa-4 pt-0">
          <v-spacer />
          <v-btn
            color="success"
            variant="flat"
            size="large"
            block
            @click="closeSuccessDialog"
          >
            <v-icon left size="small" class="mr-2">mdi-check</v-icon>
            Aceptar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="errorDialogVisible" max-width="450px" persistent>
      <v-card class="error-dialog">
        <div class="error-header">
          <v-icon size="64" color="white" class="mb-2">mdi-alert-circle</v-icon>
          <div class="text-h5 font-weight-bold text-white">
            ¡Error en la compra!
          </div>
        </div>

        <v-card-text class="pt-6 pb-4 text-center">
          <div class="text-h6 mb-3">Lo sentimos</div>
          <div class="text-body-1 text-grey-darken-1 mb-4">
            {{
              errorMessage ||
              "Ocurrió un problema al procesar tu compra. Por favor, inténtalo nuevamente."
            }}
          </div>
          <div class="text-caption text-grey">
            Si el problema persiste, contacta con soporte
          </div>
        </v-card-text>

        <v-card-actions class="pa-4 pt-0">
          <v-spacer />
          <v-btn
            color="error"
            variant="flat"
            size="large"
            block
            @click="closeErrorDialog"
          >
            <v-icon left size="small" class="mr-2">mdi-close</v-icon>
            Cerrar
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
import BtnTheme from "@/components/BtnTheme.vue";

const router = useRouter();
const route = useRoute();
const store = useStore();
const alert = inject("alert");
const isLoading = ref(false);
const eventId = ref(route.params.id ? getDecodeId(route.params.id) : null);

// Estado de fechas de presentación
const presentationDates = ref([]);
const datesLoading = ref(false);
const selectedDateId = ref(null);

// Estado de tickets
const tickets = ref([]);
const ticketsLoading = ref(false);

// Estado del pedido
const orderItems = ref({});

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

// Diálogos de resultado
const successDialogVisible = ref(false);
const errorDialogVisible = ref(false);
const errorMessage = ref("");

const rules = getRules();

// Computed para verificar si hay items en el pedido
const hasOrderItems = computed(() => {
  return Object.keys(orderItems.value).length > 0;
});

// Auth headers
const authHdrs = (useFormData = false) =>
  getHdrs({ token: store.getAuth?.token, useFormData });

// Obtener fechas de presentación
const getPresentationDates = async () => {
  datesLoading.value = true;
  presentationDates.value = [];

  try {
    const endpoint = `${URL_API}/v1/public/events/presentation_dates`;
    const response = await axios.get(endpoint, {
      params: {
        is_active: 1,
        event_id: eventId.value,
      },
      ...authHdrs(),
    });

    const items = getRsp(response)?.data?.items || [];
    presentationDates.value = items.map((item) => ({
      ...item,
      display_text: formatDateFull(item.date),
    }));
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    datesLoading.value = false;
  }
};

// Obtener tickets por fecha de presentación
const getTickets = async () => {
  if (!selectedDateId.value) return;

  ticketsLoading.value = true;
  tickets.value = [];

  try {
    const endpoint = `${URL_API}/v1/public/events/presentation_tickets`;
    const response = await axios.get(endpoint, {
      params: {
        is_active: true,
        presentation_date_id: selectedDateId.value,
      },
      ...authHdrs(),
    });

    tickets.value = getRsp(response)?.data?.items || [];
    orderItems.value = {};
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    ticketsLoading.value = false;
  }
};

// Manejar selección de fecha
const onDateSelected = () => {
  if (selectedDateId.value) {
    getTickets();
  }
};

// Funciones de formato
const formatDateFull = (dateString) => {
  if (!dateString) return "N/A";

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-MX", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
};

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

// Funciones del pedido
const getItemQuantity = (ticketId) => {
  return orderItems.value[ticketId] || 0;
};

const getTicketName = (ticketId) => {
  const ticket = tickets.value.find((t) => t.id === ticketId);
  return ticket?.ticket_type?.name || "Ticket no encontrado";
};

const getTicketPrice = (ticketId) => {
  const ticket = tickets.value.find((t) => t.id === ticketId);
  return ticket?.price || 0;
};

const incrementTicket = (item) => {
  const currentQty = getItemQuantity(item.id);
  const available = calculateAvailable(item);

  if (currentQty < available) {
    orderItems.value = {
      ...orderItems.value,
      [item.id]: currentQty + 1,
    };
  }
};

const decrementTicket = (item) => {
  const currentQty = getItemQuantity(item.id);

  if (currentQty > 0) {
    if (currentQty === 1) {
      const { [item.id]: _, ...rest } = orderItems.value;
      orderItems.value = rest;
    } else {
      orderItems.value = {
        ...orderItems.value,
        [item.id]: currentQty - 1,
      };
    }
  }
};

const calculateOrderTotal = () => {
  let total = 0;
  Object.entries(orderItems.value).forEach(([ticketId, quantity]) => {
    total += getTicketPrice(parseInt(ticketId)) * quantity;
  });
  return total;
};

// Funciones del diálogo de usuario
const openUserDialog = () => {
  if (Object.keys(orderItems.value).length === 0) {
    alert?.show("warning", "No has seleccionado ningún boleto");
    return;
  }

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

    const userId = rsp?.data?.item?.id;

    userDialogVisible.value = false;

    await processSale(userId);
  } catch (err) {
    console.error("Error completo:", err);
    errorMessage.value = getErr(err) || "Error al registrar usuario";
    errorDialogVisible.value = true;
  } finally {
    userDialogLoading.value = false;
  }
};

// Procesar venta
const processSale = async (userId) => {
  const salePayload = {
    user_id: userId,
    presentation_tickets: Object.entries(orderItems.value).map(
      ([ticketId, total]) => ({
        id: parseInt(ticketId),
        total: total,
      })
    ),
  };

  try {
    const endpoint = `${URL_API}/v1/public/events/sale`;
    const response = await axios.post(endpoint, salePayload, authHdrs());
    const rsp = getRsp(response);

    orderItems.value = {};

    await getTickets();

    successDialogVisible.value = true;
  } catch (err) {
    console.error("Error completo:", err);
    errorMessage.value = getErr(err) || "Error al procesar la compra";
    errorDialogVisible.value = true;
  }
};

// Funciones de diálogos de resultado
const closeSuccessDialog = () => {
  successDialogVisible.value = false;
};

const closeErrorDialog = () => {
  errorDialogVisible.value = false;
  errorMessage.value = "";
};

onMounted(() => {
  getPresentationDates();
});
</script>

<style scoped>
.ticket-card {
  transition: all 0.2s ease;
}

.ticket-card:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
}

.order-card {
  position: sticky;
  top: 20px;
}

.order-item {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  padding-bottom: 8px;
}

.order-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.text-body-3 {
  font-size: 0.8125rem;
  line-height: 1.2;
}

.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Estilos para el diálogo de registro */
.user-dialog {
  border-radius: 16px !important;
  overflow: hidden;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 1;
  color: white;
}

.close-btn:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.dialog-header {
  padding: 32px 24px;
  text-align: center;
}

.opacity-75 {
  opacity: 0.75;
}

/* Estilos para el diálogo de éxito */
.success-dialog {
  border-radius: 16px !important;
  overflow: hidden;
}

.success-header {
  background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
  padding: 32px 24px;
  text-align: center;
}

/* Estilos para el diálogo de error */
.error-dialog {
  border-radius: 16px !important;
  overflow: hidden;
}

.error-header {
  background: linear-gradient(135deg, #f44336 0%, #c62828 100%);
  padding: 32px 24px;
  text-align: center;
}
</style>