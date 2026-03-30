<template>
  <v-footer class="global-footer mt-8" elevation="4" height="200">
    <v-container>
      <v-row dense class="fill-height">
        <v-col
          cols="12"
          md="4"
          class="text-center text-md-left d-flex align-center"
        >
          <div>
            <div class="d-flex align-center justify-center justify-md-start">
              <v-icon size="large" class="mr-2">mdi-ticket</v-icon>
              <span class="text-h6 font-weight-bold">{{ APP_NAME }}</span>
            </div>
            <div class="text-caption mt-2">
              Tu plataforma de venta de boletos
            </div>
          </div>
        </v-col>

        <v-col
          cols="12"
          md="8"
          class="text-center text-md-right d-flex align-center justify-center justify-md-end"
        >
          <div>
            <div class="text-subtitle-2 font-weight-bold mb-2">Contacto</div>
            <div class="text-caption">
              <v-icon size="small" class="mr-1">mdi-email</v-icon>
              soporte@eventaccess.com
            </div>
            <div class="text-caption mt-1">
              <v-icon size="small" class="mr-1">mdi-phone</v-icon>
              (52) 461-200-5678
            </div>
          </div>
        </v-col>

        <v-col cols="12" class="text-center mt-4">
          <v-divider class="mb-4" />
          <div class="text-caption">
            SVR &copy; {{ currentYear }}. Todos los derechos reservados.
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script setup>
import { computed } from "vue";
import { APP_NAME } from "@/utils/config";

const currentYear = computed(() => new Date().getFullYear());

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};
</script>

<style scoped>
.global-footer {
  border-top: 1px solid rgba(var(--v-border-color), 0.1);
  height: 200px;
  min-height: 200px;
  max-height: 200px;
}

.fill-height {
  height: 100%;
}
</style>