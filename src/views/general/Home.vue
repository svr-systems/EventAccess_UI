<template>
  <v-row justify="center" class="text-center">
    <v-col cols="12" class="pt-3" />
    <v-col cols="12">
      <div class="text-h5 font-weight-light">Bienvenido</div>
    </v-col>
  </v-row>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useStore } from "@/store";
import { getEncodeId } from "@/utils/coders";

const router = useRouter();
const store = useStore();
</script>
