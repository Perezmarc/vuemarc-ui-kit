<template>
  <v-input
    class="v-textarea"
    v-bind="$options.propsData"
    :class="dirty ? 'v-input--dirty' : ''"
  >
    <textarea v-model="inputValue" v-bind="$attrs" @blur="onBlur()" />
  </v-input>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import VInputMixin from "./VInputMixin";

@Component({
  inheritAttrs: false
})
export default class VTextArea extends Mixins(VInputMixin) {
  set inputValue(val: string | undefined) {
    this.$emit("change", val);
  }

  get inputValue() {
    return this.value;
  }
}
</script>

<style lang="stylus">
.v-textarea
  .v-input__slot
    label
      align-items flex-start
</style>
