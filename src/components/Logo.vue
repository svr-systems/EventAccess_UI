<template>
  <img :src="computedSrc" v-bind="imgAttrs" :alt="alt" loading="lazy" />
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  src: { type: String, default: null },
  base64: { type: [String, Object], default: null },
  width: { type: [Number, String], default: null },
  height: { type: [Number, String], default: null },
  alt: { type: String, default: "Logo" },
});

const defaultLogo = new URL("@/assets/logo.png", import.meta.url).href;

const computedSrc = computed(() => {
  const b64 = props.base64;

  if (b64 && typeof b64 === "object") {
    const content = b64.content || null;
    if (content) {
      const mime = b64.mime || "image/png";
      return `data:${mime};base64,${content}`;
    }
  }

  if (typeof b64 === "string") {
    const content = b64.trim();
    if (content) return `data:image/png;base64,${content}`;
  }

  if (props.src) return props.src;

  return defaultLogo;
});

const imgAttrs = computed(() => {
  if (props.width) {
    return {
      width: typeof props.width === "number" ? `${props.width}px` : props.width,
    };
  }

  if (props.height) {
    return {
      height:
        typeof props.height === "number" ? `${props.height}px` : props.height,
    };
  }

  return { width: "48px" };
});
</script>
