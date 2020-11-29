<template>
  <div
    v-if="active"
    class="v-step"
    role="tabpanel"
    :id="tabId"
    :aria-hidden="!active"
    :aria-labelledby="`step-${tabId}`"
  >
    <slot :active="active"> </slot>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Inject } from "vue-property-decorator";

@Component({
  inject: ["addTab", "removeTab"]
})
export default class VStep extends Vue {
  @Inject() addTab!: Function;
  @Inject() removeTab!: Function;
  @Prop()
  title?: string;
  /***
   * Icon name for the upper circle corresponding to the tab
   */
  @Prop()
  icon?: string;
  @Prop()
  beforeChange!: Function;
  /***
   * Function to execute after tab switch. Return void for now.
   * Safe to assume necessary validation has already occured
   */
  @Prop()
  afterChange!: Function;

  @Prop()
  route?: string | Record<string, any>;

  @Prop()
  additionalInfo?: Record<string, any>;

  active = false;
  validationError: string | null = null;
  checked = false;
  tabId = "";

  mounted() {
    this.addTab(this);
  }

  destroyed() {
    if (this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el);
    }
    this.removeTab(this);
  }
}
</script>
<style lang="stylus" scoped>
.v-step
  display flex
  flex-direction column
  flex 1 1 auto
  animation-name fadeInRight
  animation-duration .5s
  animation-timing-function ease-out

@keyframes fadeInRight
  0%
    opacity 0
    transform translateX(100%)

  70%
    opacity 1
    transform translateX(10%)

  90%
    opacity 1
    transform translateX(2%)

  100%
    opacity 1
    transform translateX(0)
</style>
