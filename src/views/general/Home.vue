<template>
  <v-row justify="center" class="text-center">
    <v-col cols="12" class="pt-3" />
    <v-col cols="12">
      <div class="text-h5 font-weight-light">Bienvenido</div>
    </v-col>

    <!-- Card para completar perfil -->
    <v-col cols="12" class="d-flex justify-center mt-8">
      <v-card
        elevation="6"
        max-width="500px"
        width="100%"
        class="pa-6 text-center rounded-lg"
      >
        <v-icon size="60" color="primary" class="mb-4">
          mdi-account-edit
        </v-icon>

        <div class="text-h6 font-weight-bold mb-2">Completa tu perfil</div>

        <div class="text-body-2 text-grey mb-6">
          Agrega la información necesaria para completar tu registro como
          {{ userRoleName }}
        </div>

        <v-btn color="primary" size="large" :to="profileRoute" class="px-8">
          <v-icon start>mdi-arrow-right</v-icon>
          Comenzar
        </v-btn>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "@/store";
import { getEncodeId } from "@/utils/coders";

const router = useRouter();
const store = useStore();

// Obtener el rol del usuario
const userRole = computed(() => store.getUser?.role_id);

// Determinar la ruta según el rol
const profileRoute = computed(() => {
  switch (userRole.value) {
    case 6:
      return { name: "supplier_information" };
    case 8:
      return { name: "buyer_information" };
    default:
      return;
  }
});

// Obtener el nombre del rol para mostrar en el texto
const userRoleName = computed(() => {
  switch (userRole.value) {
    case 6:
      return "proveedor";
    case 8:
      return "comprador";
    default:
      return;
  }
});
</script>

<style scoped>
.v-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.v-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
}
</style>