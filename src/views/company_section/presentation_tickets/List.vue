<template>
  <v-card elevation="24" :loading="isLoading">
    <v-card-title class="d-flex align-center justify-space-between">
      <div class="d-flex align-center"></div>

      <div>
        <v-btn
          color="success"
          size="small"
          prepend-icon="mdi-plus"
          @click="openCreateDialog"
        >
          Agregar boleto
        </v-btn>
      </div>
    </v-card-title>

    <v-card-text>
      <v-row>
        <v-col cols="12">
          <div
            v-if="tickets.length === 0 && !isLoading"
            class="text-center py-8"
          >
            <v-icon size="60" color="grey-lighten-1" class="mb-4">
              mdi-ticket
            </v-icon>
            <div class="text-h6 text-grey">No hay boletos configurados</div>
            <div class="text-body-2 text-grey mt-2">
              Haz clic en "Nuevo boleto" para comenzar
            </div>
          </div>

          <v-row v-if="!isLoading && tickets.length > 0" dense>
            <v-col
              v-for="ticket in tickets"
              :key="ticket.id"
              cols="12"
              sm="6"
              md="4"
              lg="3"
            >
              <v-card elevation="6" class="ticket-card">
                <v-card-title class="d-flex align-center justify-space-between">
                  <span class="text-h6 font-weight-bold">{{
                    ticket.name
                  }}</span>
                  <v-btn
                    icon
                    variant="flat"
                    size="x-small"
                    color="primary"
                    @click="openEditDialog(ticket)"
                  >
                    <v-icon>mdi-pencil</v-icon>
                    <v-tooltip activator="parent" location="left"
                      >Editar</v-tooltip
                    >
                  </v-btn>
                </v-card-title>

                <v-card-text>
                  <div class="text-body-2 text-grey mb-2">
                    {{ ticket.description || "Sin descripción" }}
                  </div>

                  <v-divider class="my-3" />

                  <div class="info-section">
                    <div class="info-item">
                      <v-icon size="small" color="primary" class="mr-2"
                        >mdi-currency-usd</v-icon
                      >
                      <span class="text-body-2"
                        >Precio: {{ formatCurrency(ticket.price) }}</span
                      >
                    </div>

                    <div class="info-item">
                      <v-icon size="small" color="primary" class="mr-2"
                        >mdi-account-group</v-icon
                      >
                      <span class="text-body-2"
                        >Capacidad: {{ ticket.capacity }} boletos</span
                      >
                    </div>

                    <div class="info-item">
                      <v-icon size="small" color="primary" class="mr-2"
                        >mdi-ticket-confirmation</v-icon
                      >
                      <span class="text-body-2"
                        >Vendidos: {{ ticket.sold || 0 }}</span
                      >
                    </div>

                    <div class="info-item">
                      <v-icon size="small" color="primary" class="mr-2"
                        >mdi-calendar</v-icon
                      >
                      <span class="text-body-2"
                        >Inicio venta:
                        {{ formatDateTime(ticket.start_sale) }}</span
                      >
                    </div>

                    <div class="info-item">
                      <v-icon size="small" color="primary" class="mr-2"
                        >mdi-calendar-end</v-icon
                      >
                      <span class="text-body-2"
                        >Fin venta: {{ formatDateTime(ticket.end_sale) }}</span
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

    <!-- Dialog: Crear/Editar boleto -->
    <v-dialog v-model="ticketDialog" max-width="700px">
      <v-card>
        <v-card-title class="d-flex align-center justify-space-between">
          <span>{{ isEditMode ? "Editar boleto" : "Agregar boleto" }}</span>
          <v-btn icon variant="text" size="small" @click="ticketDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-divider />

        <v-card-text class="pa-4">
          <v-form ref="ticketFormRef" @submit.prevent="saveTicket">
            <v-row dense>
              <v-col cols="12">
                <v-select
                  v-model="formData.presentation_date_id"
                  label="Fecha de presentación"
                  :items="presentationDates"
                  :loading="presentationDatesLoading"
                  item-value="id"
                  item-title="date"
                  variant="outlined"
                  density="compact"
                  :rules="rules.requiredNotNull"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.name"
                  label="Nombre del boleto"
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
                  v-model="formData.price"
                  label="Precio"
                  type="number"
                  variant="outlined"
                  density="compact"
                  prefix="$"
                  :rules="rules.requiredNumber"
                />
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="formData.description"
                  label="Descripción"
                  variant="outlined"
                  density="compact"
                  rows="3"
                  maxlength="500"
                  counter
                  :rules="rules.textRequired"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.capacity"
                  label="Capacidad total"
                  type="number"
                  variant="outlined"
                  density="compact"
                  :rules="rules.requiredNumber"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.max_sale"
                  label="Máximo por persona"
                  type="number"
                  variant="outlined"
                  density="compact"
                  :rules="rules.requiredNumber"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.start_sale"
                  label="Inicio de venta"
                  type="datetime-local"
                  variant="outlined"
                  density="compact"
                  :rules="rules.requiredNotNull"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.end_sale"
                  label="Fin de venta"
                  type="datetime-local"
                  variant="outlined"
                  density="compact"
                  :rules="rules.requiredNotNull"
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
            :loading="deletingTicket"
            @click="deleteTicket"
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
            :loading="savingTicket"
            @click="saveTicket"
          >
            <v-icon>{{ isEditMode ? "mdi-pencil" : "mdi-check" }}</v-icon>
            <v-tooltip activator="parent" location="left">{{
              isEditMode ? "Editar" : "Crear"
            }}</v-tooltip>
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
const savingTicket = ref(false);
const deletingTicket = ref(false);
const rules = getRules();

// Datos
const tickets = ref([]);
const presentationDates = ref([]);
const presentationDatesLoading = ref(true);

// Dialog
const ticketDialog = ref(false);
const isEditMode = ref(false);
const currentTicketId = ref(null);
const ticketFormRef = ref(null);

const eventId = ref(getDecodeId(route.params.event));

const formData = ref({
  presentation_date_id: null,
  name: "",
  description: "",
  price: null,
  capacity: null,
  max_sale: 1,
  start_sale: "",
  end_sale: "",
});

const authHdrs = (useFormData = false) =>
  getHdrs({ token: store.getAuth?.token, useFormData });

// Formatear moneda
const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return "$0.00";
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  }).format(amount);
};

// Formatear fecha y hora
const formatDateTime = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return date.toLocaleString("es-MX", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
};

// Cargar fechas de presentación
const getPresentationDates = async () => {
  presentationDatesLoading.value = true;
  try {
    const endpoint = `${URL_API}/v1/company/events/presentation_dates`;
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
      display_title: `${item.display_id} - ${item.date}`,
    }));
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    presentationDatesLoading.value = false;
  }
};

// Cargar boletos
const getTickets = async () => {
  isLoading.value = true;
  try {
    const endpoint = `${URL_API}/v1/company/events/presentation_tickets`;
    const response = await axios.get(endpoint, {
      params: {
        is_active: 1,
        event_id: eventId.value,
      },
      ...authHdrs(),
    });
    tickets.value = getRsp(response)?.data?.items || [];
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

// Abrir diálogo para crear nuevo boleto
const openCreateDialog = () => {
  isEditMode.value = false;
  currentTicketId.value = null;
  formData.value = {
    presentation_date_id: null,
    name: "",
    description: "",
    price: null,
    capacity: null,
    max_sale: 1,
    start_sale: "",
    end_sale: "",
  };
  ticketDialog.value = true;
};

// Abrir diálogo para editar boleto
const openEditDialog = (ticket) => {
  isEditMode.value = true;
  currentTicketId.value = ticket.id;
  formData.value = {
    presentation_date_id: ticket.presentation_date_id,
    name: ticket.name,
    description: ticket.description || "",
    price: parseFloat(ticket.price),
    capacity: ticket.capacity,
    max_sale: ticket.max_sale || 1,
    start_sale: ticket.start_sale?.slice(0, 16) || "",
    end_sale: ticket.end_sale?.slice(0, 16) || "",
  };
  ticketDialog.value = true;
};

// Guardar boleto (crear o editar)
const saveTicket = async () => {
  const { valid } = await ticketFormRef.value.validate();
  if (!valid) {
    alert?.show("red-darken-1", "Revisa los detalles señalados");
    return;
  }

  const confirmed = await confirm?.show(
    `¿Confirma ${isEditMode.value ? "editar" : "crear"} el boleto?`
  );
  if (!confirmed) return;

  savingTicket.value = true;

  try {
    const payload = {
      event_id: eventId.value,
      presentation_date_id: formData.value.presentation_date_id,
      name: formData.value.name,
      description: formData.value.description,
      price: parseFloat(formData.value.price),
      max_sale: parseInt(formData.value.max_sale),
      capacity: parseInt(formData.value.capacity),
      start_sale: formData.value.start_sale,
      end_sale: formData.value.end_sale,
    };

    let endpoint;
    if (isEditMode.value) {
      endpoint = `${URL_API}/v1/company/events/presentation_tickets/${currentTicketId.value}`;
      await axios.put(endpoint, payload, authHdrs());
    } else {
      endpoint = `${URL_API}/v1/company/events/presentation_tickets`;
      await axios.post(endpoint, payload, authHdrs());
    }

    alert?.show(
      "success",
      `Boleto ${isEditMode.value ? "actualizado" : "creado"} correctamente`
    );
    ticketDialog.value = false;
    await getTickets();
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    savingTicket.value = false;
  }
};

// Eliminar boleto
const deleteTicket = async () => {
  const confirmed = await confirm?.show(
    "¿Confirma eliminar este boleto? Esta acción no se puede deshacer."
  );
  if (!confirmed) return;

  deletingTicket.value = true;

  try {
    const endpoint = `${URL_API}/v1/company/events/presentation_tickets/${currentTicketId.value}`;
    await axios.delete(endpoint, authHdrs());

    alert?.show("success", "Boleto eliminado correctamente");
    ticketDialog.value = false;
    await getTickets();
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    deletingTicket.value = false;
  }
};

onMounted(() => {
  getPresentationDates();
  getTickets();
});
</script>

<style scoped>
.ticket-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
  overflow: hidden;
}

.ticket-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.2) !important;
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>