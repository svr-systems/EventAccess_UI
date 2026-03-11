<!-- src/components/BtnTheme.vue -->
<template>
  <v-btn
    type="button"
    icon
    :variant="variant"
    :size="size"
    :aria-label="isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'"
    @click="toggleTheme"
  >
    <v-icon>mdi-brightness-6</v-icon>
    <v-tooltip activator="parent" location="bottom">Cambiar tema</v-tooltip>
  </v-btn>
</template>

<script setup>
import { computed } from "vue";
import { useTheme } from "vuetify";
import { useStore } from "@/store";

const props = defineProps({
  variant: { type: String, default: "text" },
  size: { type: String, default: "small" },
});

const store = useStore();
const theme = useTheme();

const isDark = computed(() => !!store.conf?.theme_dark);

const applyVuetifyTheme = (is_dark) => {
  const name = is_dark ? "dark" : "light";

  if (typeof theme.change === "function") {
    theme.change(name);
    return;
  }

  theme.global.name.value = name;
};

const setTheme = (is_dark) => {
  if (is_dark === isDark.value) return;

  store.setThemeDarkAction(is_dark);
  applyVuetifyTheme(is_dark);
};

const toggleTheme = () => setTheme(!isDark.value);
</script>
