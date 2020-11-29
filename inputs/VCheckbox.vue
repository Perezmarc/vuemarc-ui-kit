<template>
  <v-input
    class="v-checkbox"
    v-bind="$options.propsData"
    :class="{
      'v-input--dirty': dirty,
      error: required && dirty && !value,
      active: value
    }"
    @click.native="inputValue = !inputValue"
  >
    <div class="v-checkbox v-input__slot__input">
      <img src="./img/check-thick.svg" alt="" />
    </div>
  </v-input>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import VInputMixin from "./VInputMixin";

export interface VSelectOptions {
  text: string;
  value: string;
}

@Component({
  inheritAttrs: false
})
export default class VCheckbox extends Mixins(VInputMixin) {
  set inputValue(val: boolean | undefined) {
    this.$emit("change", val);
  }

  get inputValue() {
    return this.value;
  }
}
</script>

<style lang="stylus">
.v-checkbox.v-input
  cursor pointer

  .v-input__slot
    background none
    flex-wrap nowrap
    display flex
    flex-direction row
    align-items center

  label
    margin-left 10px
    order 2
    padding 0
    flex 1 1 auto
    width auto
    position relative
    cursor pointer

    &.dirty
      opacity 1 !important
      transform none !important

  .v-input__slot__input
    border-radius 2.5px
    border 1px solid
    background-color #fff
    flex 0 0 auto
    width 18px
    height 18px
    padding 0
    display flex
    align-items center
    justify-content center
    border-color $color-grey--lighten-3

    img
      opacity 0
      height 11px

  // Selected checkbox
  &.active
    .v-input__slot__input
      border-color $color-primary
      background $color-primary

      img
        opacity 1
        transition .3s $transition-standard
</style>
