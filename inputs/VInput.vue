<template>
  <div class="v-input">
    <div v-if="!hideErrors" class="v-input__errors">
      <div class="v-input__errors-content" :class="errors && dirty ? 'active' : ''">
        {{ errors }}
      </div>
    </div>
    <div class="v-input__slot">
      <label v-if="label">{{ label }}</label>
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import VInputMixin from "./VInputMixin";

@Component({ inheritAttrs: false })
export default class VInput extends Mixins(VInputMixin) {}
</script>
