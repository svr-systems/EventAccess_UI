<template>
  <v-card elevation="24">
    <v-card-text>
      <v-row dense>
        <!-- Tarjetas de resumen -->
        <v-col cols="12" sm="6" md="3">
          <v-card class="metric-card" color="primary" dark>
            <v-card-text class="text-center pa-4">
              <v-icon size="40" color="white" class="mb-2">mdi-ticket</v-icon>
              <div class="text-h4 font-weight-bold white--text">
                {{ metrics.totalTickets }}
              </div>
              <div class="text-subtitle-2">Boletos vendidos</div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-card class="metric-card" color="success" dark>
            <v-card-text class="text-center pa-4">
              <v-icon size="40" color="white" class="mb-2"
                >mdi-currency-usd</v-icon
              >
              <div class="text-h4 font-weight-bold white--text">
                {{ formatCurrency(metrics.totalRevenue) }}
              </div>
              <div class="text-subtitle-2">Ingresos totales</div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-card class="metric-card" color="info" dark>
            <v-card-text class="text-center pa-4">
              <v-icon size="40" color="white" class="mb-2"
                >mdi-account-group</v-icon
              >
              <div class="text-h4 font-weight-bold white--text">
                {{ metrics.totalAttendees }}
              </div>
              <div class="text-subtitle-2">Asistentes registrados</div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-card class="metric-card" color="warning" dark>
            <v-card-text class="text-center pa-4">
              <v-icon size="40" color="white" class="mb-2"
                >mdi-calendar-check</v-icon
              >
              <div class="text-h4 font-weight-bold white--text">
                {{ metrics.completionRate }}%
              </div>
              <div class="text-subtitle-2">Tasa de cumplimiento</div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Ventas por día -->
        <v-col cols="12" md="8">
          <v-card class="pa-4">
            <div class="d-flex align-center justify-space-between mb-4">
              <CardTitle text="Ventas por día" sub />
              <v-chip size="small" color="primary" variant="flat">
                Últimos 7 días
              </v-chip>
            </div>
            <v-table density="compact">
              <thead>
                <tr>
                  <th
                    v-for="day in salesByDay"
                    :key="day.day"
                    class="text-center"
                  >
                    {{ day.day }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    v-for="day in salesByDay"
                    :key="day.day"
                    class="text-center pa-4"
                  >
                    <div class="text-h6 font-weight-bold">{{ day.sales }}</div>
                    <div class="text-caption text-grey">boletos</div>
                    <v-progress-linear
                      :model-value="getMaxPercentage(day.sales)"
                      color="primary"
                      height="8"
                      rounded
                      class="mt-2"
                    />
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card>
        </v-col>

        <!-- Distribución por tipo de ticket -->
        <v-col cols="12" md="4">
          <v-card class="pa-4">
            <div class="mb-4">
              <CardTitle text="Distribución por tipo" sub />
            </div>
            <div
              v-for="ticket in ticketDistribution"
              :key="ticket.type"
              class="mb-3"
            >
              <div class="d-flex justify-space-between align-center mb-1">
                <span class="text-body-2 font-weight-medium">{{
                  ticket.type
                }}</span>
                <span class="text-body-2">{{ ticket.count }} boletos</span>
              </div>
              <v-progress-linear
                :model-value="getTicketPercentage(ticket.count)"
                :color="ticket.color"
                height="10"
                rounded
              />
            </div>
            <div class="text-center mt-4 pt-2">
              <v-divider class="my-3" />
              <div class="d-flex justify-space-between">
                <span class="text-subtitle-2 font-weight-bold">Total</span>
                <span class="text-subtitle-2 font-weight-bold">{{
                  totalTickets
                }}</span>
              </div>
            </div>
          </v-card>
        </v-col>

        <!-- Próximas fechas -->
        <v-col cols="12" md="6">
          <v-card class="pa-4">
            <div class="mb-4">
              <CardTitle text="Próximas fechas" sub />
            </div>
            <v-list density="compact">
              <v-list-item
                v-for="date in upcomingDates"
                :key="date.id"
                class="mb-2"
              >
                <template #prepend>
                  <v-icon color="primary">mdi-calendar</v-icon>
                </template>
                <v-list-item-title class="font-weight-medium">
                  {{ formatDateFull(date.date) }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ date.start_time }} - {{ date.end_time }}
                </v-list-item-subtitle>
                <template #append>
                  <v-chip size="x-small" color="success">
                    {{ date.availableTickets }} disponibles
                  </v-chip>
                </template>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>

        <!-- Actividad reciente -->
        <v-col cols="12" md="6">
          <v-card class="pa-4">
            <div class="mb-4">
              <CardTitle text="Actividad reciente" sub />
            </div>
            <v-timeline density="compact" align="start" side="end">
              <v-timeline-item
                v-for="activity in recentActivities"
                :key="activity.id"
                :dot-color="activity.color"
                size="small"
              >
                <div class="d-flex justify-space-between align-center">
                  <div>
                    <div class="font-weight-medium">{{ activity.title }}</div>
                    <div class="text-caption text-grey">
                      {{ activity.description }}
                    </div>
                  </div>
                  <div class="text-caption text-grey">{{ activity.time }}</div>
                </div>
              </v-timeline-item>
            </v-timeline>
          </v-card>
        </v-col>

        <!-- Estadísticas de citas B2B -->
        <v-col cols="12">
          <v-card class="pa-4">
            <div class="mb-4">
              <CardTitle text="Estadísticas de citas B2B" sub />
            </div>
            <v-row>
              <v-col cols="12" sm="4">
                <div class="text-center pa-3">
                  <div class="text-h3 font-weight-bold text-primary">
                    {{ metrics.b2bMeetings.total }}
                  </div>
                  <div class="text-caption text-grey">Total de citas</div>
                  <v-progress-circular
                    :model-value="
                      (metrics.b2bMeetings.total / metrics.b2bMeetings.total) *
                      100
                    "
                    size="60"
                    width="5"
                    color="primary"
                    class="mt-2"
                  >
                    <span class="text-body-2">{{
                      metrics.b2bMeetings.total
                    }}</span>
                  </v-progress-circular>
                </div>
              </v-col>
              <v-col cols="12" sm="4">
                <div class="text-center pa-3">
                  <div class="text-h3 font-weight-bold text-success">
                    {{ metrics.b2bMeetings.confirmed }}
                  </div>
                  <div class="text-caption text-grey">Confirmadas</div>
                  <v-progress-circular
                    :model-value="
                      (metrics.b2bMeetings.confirmed /
                        metrics.b2bMeetings.total) *
                      100
                    "
                    size="60"
                    width="5"
                    color="success"
                    class="mt-2"
                  >
                    <span class="text-body-2">{{
                      metrics.b2bMeetings.confirmed
                    }}</span>
                  </v-progress-circular>
                </div>
              </v-col>
              <v-col cols="12" sm="4">
                <div class="text-center pa-3">
                  <div class="text-h3 font-weight-bold text-warning">
                    {{ metrics.b2bMeetings.pending }}
                  </div>
                  <div class="text-caption text-grey">Pendientes</div>
                  <v-progress-circular
                    :model-value="
                      (metrics.b2bMeetings.pending /
                        metrics.b2bMeetings.total) *
                      100
                    "
                    size="60"
                    width="5"
                    color="warning"
                    class="mt-2"
                  >
                    <span class="text-body-2">{{
                      metrics.b2bMeetings.pending
                    }}</span>
                  </v-progress-circular>
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import CardTitle from "@/components/CardTitle.vue";

const route = useRoute();
const eventId = computed(() => route.params.event);

// Datos de ejemplo (simulados)
const metrics = ref({
  totalTickets: 1247,
  totalRevenue: 89250,
  totalAttendees: 856,
  completionRate: 78,
  b2bMeetings: {
    total: 342,
    confirmed: 198,
    pending: 144,
  },
});

const salesByDay = ref([
  { day: "Lun", sales: 45 },
  { day: "Mar", sales: 62 },
  { day: "Mié", sales: 78 },
  { day: "Jue", sales: 55 },
  { day: "Vie", sales: 89 },
  { day: "Sáb", sales: 112 },
  { day: "Dom", sales: 98 },
]);

const ticketDistribution = ref([
  { type: "General", count: 450, color: "success" },
  { type: "VIP", count: 280, color: "warning" },
  { type: "Estudiante", count: 320, color: "info" },
  { type: "Cortesía", count: 197, color: "purple" },
]);

const upcomingDates = ref([
  {
    id: 1,
    date: "2026-06-03",
    start_time: "09:00",
    end_time: "18:00",
    availableTickets: 234,
  },
  {
    id: 2,
    date: "2026-06-04",
    start_time: "10:00",
    end_time: "17:00",
    availableTickets: 156,
  },
  {
    id: 3,
    date: "2026-06-05",
    start_time: "09:30",
    end_time: "16:30",
    availableTickets: 89,
  },
]);

const recentActivities = ref([
  {
    id: 1,
    title: "Nueva venta de boletos",
    description: "5 boletos VIP adquiridos por Juan Pérez",
    time: "Hace 5 min",
    color: "success",
  },
  {
    id: 2,
    title: "Cita B2B confirmada",
    description: "Comprador con proveedor MegaTech",
    time: "Hace 2 horas",
    color: "primary",
  },
  {
    id: 3,
    title: "Nuevo registro",
    description: "Proveedor Soluciones Rápidas se ha registrado",
    time: "Hace 4 horas",
    color: "info",
  },
  {
    id: 4,
    title: "Pregunta del evento",
    description: "¿Cuándo inicia la apertura de puertas?",
    time: "Ayer",
    color: "warning",
  },
]);

const totalTickets = computed(() => {
  return ticketDistribution.value.reduce(
    (sum, ticket) => sum + ticket.count,
    0
  );
});

const getMaxPercentage = (sales) => {
  const maxSales = Math.max(...salesByDay.value.map((d) => d.sales));
  return (sales / maxSales) * 100;
};

const getTicketPercentage = (count) => {
  return (count / totalTickets.value) * 100;
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  }).format(amount);
};

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
</script>

<style scoped>
.metric-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: default;
}

.metric-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.white--text {
  color: white !important;
}
</style>