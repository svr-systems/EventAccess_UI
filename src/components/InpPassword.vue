<template>
  <v-text-field
    :model-value="modelValue"
    :label="label"
    :type="isVisible ? 'text' : 'password'"
    :rules="rules"
    :counter="counter"
    :disabled="disabled"
    :prepend-inner-icon="prepend"
    :variant="variant"
    :density="density"
    :maxlength="maxlength"
    :autocomplete="autocomplete"
    :hide-details="hideDetails"
    :clearable="clearable"
    @update:model-value="emitValue"
  >
    <template #append-inner>
      <v-btn
        type="button"
        icon
        variant="plain"
        size="x-small"
        class="text-none"
        :aria-label="isVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'"
        @click.stop="toggleVisibility"
      >
        <v-icon>
          {{ isVisible ? "mdi-eye-off" : "mdi-eye" }}
        </v-icon>

        <v-tooltip activator="parent" location="top">
          {{ isVisible ? "Ocultar" : "Mostrar" }}
        </v-tooltip>
      </v-btn>
    </template>
  </v-text-field>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  label: { type: String, default: "Contraseña" },
  modelValue: { type: String, default: "" },
  rules: { type: Array, default: () => [] },
  counter: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  prepend: { type: String, default: null },
  maxlength: { type: [Number, String], default: 20 },
  autocomplete: { type: String, default: "current-password" },
  variant: { type: String, default: "outlined" },
  density: { type: String, default: "compact" },
  hideDetails: { type: [Boolean, String], default: false },
  clearable: { type: Boolean, default: false },
});

const emit = defineEmits(["update:modelValue"]);

const isVisible = ref(false);

const toggleVisibility = () => {
  isVisible.value = !isVisible.value;
};

const emitValue = (val) => {
  emit("update:modelValue", val);
};
</script>
