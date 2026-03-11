<template>
  <div>
    <v-btn
      :variant="btnVariant"
      :size="btnSize"
      class="text-none font-weight-thin text-medium-emphasis"
      :disabled="disabled"
      @click="open"
    >
      {{ buttonText }}
    </v-btn>

    <v-dialog
      v-model="isOpen"
      :max-width="maxWidth"
      :fullscreen="isMobile"
      scrollable
    >
      <v-card rounded="lg">
        <v-card-title class="d-flex align-center justify-space-between">
          <span class="text-h6">{{ title }}</span>

          <v-btn
            icon="mdi-close"
            variant="text"
            :aria-label="`Cerrar ${buttonText}`"
            @click="close"
          />
        </v-card-title>

        <v-divider />

        <v-card-text class="py-4">
          <div class="text-body-2 legal-content">
            <slot />
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useDisplay } from "vuetify";

const props = defineProps({
  title: { type: String, default: "Términos y Condiciones" },
  buttonText: { type: String, default: "Términos y Condiciones" },
  disabled: { type: Boolean, default: false },
  maxWidth: { type: [Number, String], default: 980 },

  btnVariant: { type: String, default: "text" },
  btnSize: { type: String, default: "x-small" },
});

const emit = defineEmits(["open", "close"]);

const { smAndDown } = useDisplay();
const isMobile = computed(() => smAndDown.value);

const isOpen = ref(false);

const open = () => {
  isOpen.value = true;
  emit("open");
};

const close = () => {
  isOpen.value = false;
  emit("close");
};

defineExpose({ open, close });
</script>

<style scoped>
ul {
  padding-left: 1.2rem;
}
li {
  margin: 0.25rem 0;
}
a {
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}
</style>
