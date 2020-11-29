<template>
  <v-input
    class="v-input-iban"
    v-bind="$options.propsData"
    :class="{ 'v-input--dirty': dirty, error: dirty && !valid }"
  >
    <input
      v-model="inputIban"
      v-bind="$attrs"
      @blur="
        onBlur();
        formatIbanOnInput($event.target.value);
      "
    />
  </v-input>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from "vue-property-decorator";
import VInputMixin from "./VInputMixin";
// import { Money } from "./VInputMixin";
// import IbanChecker from "iban";

@Component({
  inheritAttrs: false
})
export default class VInputIban extends Mixins(VInputMixin) {
  inputIban?: string = this.formatIban(this.inputValue as string);

  @Watch("inputValue")
  handleInputValueChange(val: string) {
    this.inputIban = this.formatIban(val);
  }

  get valid(): boolean {
    // const isValid: boolean = IbanChecker.isValid(this.inputIban);
    // return isValid;
    return true;
  }

  set inputValue(val: string | undefined) {
    this.$emit("change", val);
  }

  get inputValue() {
    return this.value;
  }

  unformatIban(val: string | undefined) {
    const value = val && val.replace(/[^\w\d]/gi, "");
    return (this.inputValue = value);
  }

  @Watch("inputIban")
  handleInputIban(val: string | undefined) {
    this.inputValue = this.unformatIban(val);
  }

  @Watch("valid")
  onChangeValid(val: boolean) {
    this.$emit("valid", val);
  }

  mounted() {
    this.$emit("valid", this.valid);
  }

  formatIban(iban: string | undefined): string | undefined {
    if (!iban) return "";
    iban = iban.replace(/[^\w\d]/gi, "").replace(/(.{4})/g, "$1 ");
    iban = iban.trim();
    return iban;
  }

  formatIbanOnInput(iban: string | undefined): string | undefined {
    if (!iban) return "";
    this.inputIban = this.formatIban(iban);
    this.inputValue = this.unformatIban(iban);
    return iban;
  }
}
</script>
