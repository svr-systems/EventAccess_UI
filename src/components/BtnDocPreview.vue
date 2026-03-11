<template>
  <div class="d-inline-flex flex-column">
    <div
      v-if="label"
      class="font-weight-light text-caption text-medium-emphasis"
    >
      {{ label }}
    </div>

    <v-btn
      icon
      :variant="variant"
      :size="size"
      :density="density"
      :disabled="!hasSource"
      @click="handleClick"
    >
      <v-icon :size="hasSource ? undefined : 'x-small'">
        {{ hasSource ? "mdi-eye" : "mdi-alert-circle-outline" }}
      </v-icon>

      <v-tooltip activator="parent" location="left">
        {{ hasSource ? tooltip : emptyTooltip }}
      </v-tooltip>
    </v-btn>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { getBlob } from "@/utils/coders";

const props = defineProps({
  file: { type: [File, Array, Object, null], default: null },
  doc: { type: Object, default: null }, // { content, mime, name, ext }

  tooltip: { type: String, default: "Ver / descargar" },
  emptyTooltip: { type: String, default: "Sin archivo" },

  variant: { type: String, default: "text" },
  size: { type: String, default: "x-small" },
  label: { type: String, default: null },
  density: { type: String, default: "comfortable" },
});

const previewUrl = ref(null);
const isObjectUrl = ref(false);

const resolvedFile = computed(() => {
  if (!props.file) return null;
  return Array.isArray(props.file) ? props.file[0] : props.file;
});

const hasSource = computed(() => {
  return !!resolvedFile.value || !!props.doc?.content;
});

const resolvedExt = computed(() => {
  if (props.doc?.ext) return String(props.doc.ext).toLowerCase();

  if (resolvedFile.value?.name) {
    const parts = String(resolvedFile.value.name).split(".");
    if (parts.length > 1) return parts.pop().toLowerCase();
  }

  const mime = String(props.doc?.mime || "");
  if (mime.includes("pdf")) return "pdf";
  if (mime.includes("png")) return "png";
  if (mime.includes("jpeg") || mime.includes("jpg")) return "jpg";

  return "";
});

const resolvedName = computed(() => {
  if (props.doc?.name) return props.doc.name;
  if (resolvedFile.value?.name) return resolvedFile.value.name;
  if (resolvedExt.value) return `archivo.${resolvedExt.value}`;
  return "archivo";
});

const isPreviewable = computed(() => {
  const ext = resolvedExt.value;
  const previewExt = [
    "pdf",
    "png",
    "jpg",
    "jpeg",
    "gif",
    "webp",
    "svg",
    "xml",
    "txt",
    "html",
    "htm",
  ];
  return !!ext && previewExt.includes(ext);
});

const resetUrl = () => {
  if (isObjectUrl.value && previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
  }
  isObjectUrl.value = false;
  previewUrl.value = null;
};

const buildUrl = () => {
  resetUrl();

  if (resolvedFile.value instanceof File) {
    previewUrl.value = URL.createObjectURL(resolvedFile.value);
    isObjectUrl.value = true;
    return;
  }

  if (props.doc?.content && resolvedExt.value) {
    const blob = getBlob(props.doc.content, resolvedExt.value);
    previewUrl.value = URL.createObjectURL(blob);
    isObjectUrl.value = true;
  }
};

const openInNewTab = () => {
  if (!previewUrl.value) return;
  window.open(previewUrl.value, "_blank");
};

const downloadDoc = () => {
  if (!previewUrl.value) return;

  const link = document.createElement("a");
  link.href = previewUrl.value;
  link.setAttribute("target", "_blank");
  link.download = resolvedName.value;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const handleClick = () => {
  if (!hasSource.value) return;

  if (!previewUrl.value) buildUrl();
  if (!previewUrl.value) return;

  if (isPreviewable.value) openInNewTab();
  else downloadDoc();
};

watch(
  () => [resolvedFile.value, props.doc?.content],
  () => {
    resetUrl();
  },
);

onBeforeUnmount(() => {
  resetUrl();
});
</script>
