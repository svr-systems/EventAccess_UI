<template>
  <v-row dense>
    <v-col cols="12" class="text-right" style="height: 40px">
      <BtnTheme size="x-small" />
    </v-col>

    <v-col cols="12" class="text-center">
      <Logo width="50%" class="pb-9" />
      <h1 class="text-display-medium font-weight-light">{{ APP_NAME }}</h1>

      <slot />
    </v-col>
  </v-row>
</template>

<script setup>
import { APP_NAME } from "@/utils/config";

import Logo from "@/components/Logo.vue";
import BtnTheme from "@/components/BtnTheme.vue";
</script>
