<template>
  <div class="text-caption font-weight-thin text-disabled">
    <div>SVR © {{ getCurrentYear() }}</div>
    <div>
      <small>{{ APP_NAME }} | v{{ APP_VERSION }}</small>
    </div>
  </div>
</template>

<script setup>
import { APP_NAME, APP_VERSION } from "@/utils/config";
import { getCurrentYear } from "@/utils/helpers";
</script>
