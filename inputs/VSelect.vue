<template>
  <v-input
    class="v-select"
    v-bind="$options.propsData"
    :class="{
      'v-input--dirty': dirty,
      error: required && dirty && !value,
      active: showOptions
    }"
    v-click-outside="hideOptions"
  >
    <div class="v-select__selected v-input__slot__input" @click="showOptions = true">
      <span>{{ inputValue.text }}</span>
      <i class="material-icons" @click.stop="toggleOptions()">arrow_drop_down</i>
    </div>
    <!-- <input :value="inputValue" v-bind="$attrs" 
    @blur="onBlur()" @click="showOptions = true"> -->
    <slot name="options">
      <div class="v-select__options-list" :class="{ active: showOptions }">
        <div class="v-select__options-list__container">
          <div
            v-for="(option, index) of options"
            :key="option.value"
            class="v-select__options-list__option"
            :class="{ active: inputValue.value === option.value }"
            @click="
              inputValue = option;
              hideOptions();
            "
          >
            <div :class="'option-' + index">
              <slot name="optionListItem" :option="option">
                {{ option.text }}
              </slot>
            </div>
          </div>
        </div>
      </div>
    </slot>
  </v-input>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from "vue-property-decorator";
import VInputMixin from "./VInputMixin";
import ClickOutside from "vue-click-outside";

export interface VSelectOptions {
  text: string;
  value: string;
}

@Component({
  inheritAttrs: false,
  directives: {
    ClickOutside
  }
})
export default class VTextField extends Mixins(VInputMixin) {
  @Prop()
  options!: VSelectOptions[];
  showOptions = false;

  set inputValue(val: string | number | undefined) {
    this.$emit("change", val);
  }

  get inputValue() {
    return this.value;
  }

  hideOptions() {
    this.showOptions = false;
  }

  toggleOptions() {
    this.showOptions = !this.showOptions;
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../styles/global/theme.styl'

.v-select__options-list
  opacity 0
  position absolute
  top calc(100% - 5px)
  padding-top 5px
  background #fff
  width 100%
  z-index -1
  border-radius 0 0 5px 5px
  border 0px solid transparent
  box-shadow $shadow-1
  transition .5s $transition-standard
  overflow hidden
  user-select none

  &__container
    max-height 200px
    overflow-x hidden
    overflow-y auto

  &__option
    padding 15px 20px
    cursor pointer
    transition .5s $transition-standard

    &:hover
      background-color alpha($color-grey--lighten-3, .3)

    &.active
      color $color-primary

    for i in range(0, 8)
      .v-select__options-list__option div.option-{i}
        opacity 1
        transform translateY(0px)
        transition .3s $transition-standard
        transition-delay unit(i * 100, 'ms')

    & > div
      opacity .1
      transform translateY(20px)
      transition .3s $transition-standard

.v-input__slot__input
  min-height 49px
  cursor pointer
  display flex
  align-items center

  i:last-child
    user-select none
    line-height inherit
    margin-left auto
    transform rotate(0deg)
    transition .3s $transition-standard

// Active
.v-select.active
  .v-input__slot__input
    i:last-child
      transform rotate(180deg)
      transition .3s $transition-standard

  .v-select__options-list
    z-index 1
    display block
    opacity 1
    transition .5s $transition-standard

    for i in range(0, 8)
      .v-select__options-list__option div.option-{i}
        opacity 1
        transform translateY(0px)
        transition .3s $transition-standard
        transition-delay unit((i + 1) * 100, 'ms')
</style>
