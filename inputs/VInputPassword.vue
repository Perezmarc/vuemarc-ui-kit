<template>
  <v-input
    ref="vinput"
    :class="{
      'v-input--dirty': dirty,
      'v-input--typed': focused || !isEmpty,
      error: (required && dirty && !value) || (errors && dirty)
    }"
    class="v-text-field v-input-appended-icon"
    v-bind="$options.propsData"
  >
    <input
      ref="input"
      v-model="inputValue"
      v-bind="$attrs"
      @blur="onBlur()"
      @focus="onFocus()"
      v-on="listeners"
      :type="viewPassword ? 'text' : 'password'"
    />
    <i
      @click="togglePasswordView"
      class="appended-icon fas"
      :class="viewPassword ? ' fa-eye-slash' : ' fa-eye'"
    ></i>
  </v-input>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import VInputMixin from "./VInputMixin";

@Component({
  inheritAttrs: false
})
export default class VInputPassword extends Mixins(VInputMixin) {
  viewPassword = false;

  set inputValue(val: string | number | undefined) {
    this.$emit("change", val);
  }

  get inputValue() {
    return this.value;
  }

  get listeners() {
    return Object.assign({}, this.$listeners, {
      // This ensures that the component works with v-model
      change: (event: any) => {
        this.$emit("change", event.target.value);
      }
    });
  }

  togglePasswordView() {
    this.viewPassword = !this.viewPassword;
    (this.$refs.input as any).focus();
  }
}
</script>
