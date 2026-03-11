<template>
  <v-row dense>
    <v-col cols="12" class="pt-6">
      <Terms>
        <TermsContent />
      </Terms>
    </v-col>

    <v-col cols="12" class="pt-2">
      <Version />
    </v-col>
  </v-row>
</template>

<script setup>
import Terms from "@/components/Terms.vue";
import TermsContent from "@/components/TermsContent.vue";
import Version from "@/components/Version.vue";
</script>
