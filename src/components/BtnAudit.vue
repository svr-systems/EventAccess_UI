<template>
  <div>
    <v-btn
      icon
      variant="flat"
      size="x-small"
      :disabled="disabled || !item"
      @click.prevent="isOpen = true"
    >
      <v-icon>mdi-clock-outline</v-icon>
      <v-tooltip activator="parent" location="left">Auditoría</v-tooltip>
    </v-btn>

    <v-dialog v-model="isOpen" persistent scrim="black" max-width="600">
      <v-card flat>
        <v-card-title>
          <v-row dense>
            <v-col cols="11">
              <CardTitle text="AUDITORÍA" icon="mdi-clock-outline" sub />
            </v-col>
            <v-col cols="1" class="text-right">
              <v-btn icon variant="text" size="x-small" @click="isOpen = false">
                <v-icon>mdi-close</v-icon>
                <v-tooltip activator="parent" location="left">Cerrar</v-tooltip>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-title>

        <v-card-text v-if="item">
          <v-row dense>
            <v-col cols="6">
              <VisVal
                label="Creación"
                :value="item.created_by?.email"
                :subvalue="item.created_at"
              />
            </v-col>

            <v-col cols="6">
              <VisVal
                label="Últ. edición"
                :value="item.updated_by?.email"
                :subvalue="item.updated_at"
              />
            </v-col>

            <v-col v-if="item.email_verified_at" cols="6">
              <VisVal
                label="Email verificado"
                :value="item.email_verified_at"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref } from "vue";

import CardTitle from "@/components/CardTitle.vue";
import VisVal from "@/components/VisVal.vue";

const props = defineProps({
  item: { type: Object, default: null },
  disabled: { type: Boolean, default: false },
});

const isOpen = ref(false);
</script>
