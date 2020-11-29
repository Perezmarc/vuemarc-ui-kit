<template>
  <button
    class="v-button"
    :class="{
      loading: loading,
      'v-button-icon v-icon': icon,
      'v-button-flat': flat,
      'v-button-outline': outline,
      'v-button-link': link,
      small: small,
      large: large
    }"
    :disabled="loading || disabled"
  >
    <div class="v-button__slot">
      <slot />
    </div>
  </button>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({})
export default class VButton extends Vue {
  @Prop({ type: Boolean })
  small?: boolean;
  @Prop({ type: Boolean })
  large?: boolean;
  @Prop({ type: Boolean })
  disabled?: boolean;
  @Prop({ type: Boolean })
  loading?: boolean;
  @Prop({ type: Boolean })
  icon?: boolean;
  @Prop({ type: Boolean })
  flat?: boolean;
  @Prop({ type: Boolean })
  outline?: boolean;
  @Prop({ type: Boolean })
  link?: boolean;
}
</script>
