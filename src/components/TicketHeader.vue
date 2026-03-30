<template>
  <v-app-bar app elevation="4" class="global-header">
    <v-container fluid class="px-4">
      <v-row align="center" no-gutters>
        <v-col cols="auto" class="mr-4">
          <div class="d-flex align-center">
            <span class="text-h6 font-weight-bold">{{ APP_NAME }}</span>
          </div>
        </v-col>

        <v-spacer />

        <v-col cols="auto">
          <div class="d-flex align-center">
            <BtnTheme size="x-small" class="mr-2" />
            <v-btn
              icon
              variant="flat"
              size="x-small"
              color="info"
              :to="{ name: 'login' }"
            >
              <v-icon>mdi-account</v-icon>
              <v-tooltip activator="parent" location="bottom">
                Iniciar sesión
              </v-tooltip>
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-app-bar>
</template>

<script setup>
import BtnTheme from "@/components/BtnTheme.vue";
import { APP_NAME } from "@/utils/config";
</script>

<style scoped>
.global-header {
  background-color: rgb(var(--v-theme-surface));
  border-bottom: 1px solid rgba(var(--v-border-color), 0.1);
}

:deep(.v-toolbar__content) {
  padding: 0;
}
</style>