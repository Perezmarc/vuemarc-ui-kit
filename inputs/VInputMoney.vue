<template>
  <v-input
    class="v-input-money"
    v-bind="$options.propsData"
    :class="{ 'v-input--dirty': dirty, error: required && dirty && !value }"
  >
    <input
      v-model="inputMoney"
      v-bind="$attrs"
      @blur="
        onBlur();
        formatMoneyOnInput($event.target.value);
      "
    />
  </v-input>
</template>

<script lang="ts">
import { Component, Prop, Mixins, Watch } from "vue-property-decorator";
import VInputMixin from "./VInputMixin";
// import { Money } from "./VInputMixin";

@Component({
  inheritAttrs: false
})
export default class VInputMoney extends Mixins(VInputMixin) {
  inputMoney?: string = this.formatMoney(this.inputValue);
  @Prop()
  currency!: string;

  @Watch("value")
  handleInputValueChange(val: string | undefined) {
    if (val === this.unformatMoney(this.inputMoney)) return;
    this.inputMoney = this.formatMoney(val && val.toString());
  }

  set inputValue(val: string | number | undefined) {
    this.$emit("change", val);
  }

  get inputValue() {
    return this.value;
  }

  @Watch("inputMoney")
  handleInputMoney(val: string | undefined) {
    this.inputValue = this.unformatMoney(val);
  }

  @Watch("currency")
  currencyChanged() {
    this.inputMoney = this.formatMoney(this.inputValue);
  }

  unformatMoney(val: string | undefined) {
    if (!val) return undefined;
    const value = parseInt(val.replace(/\D/g, ""), 10);
    // Temporary value while typing. Needed for label behaviour.
    // Once Blurred, the input is formatted and if isNaN, the value is set to 0
    if (isNaN(value)) return val;
    return value;
  }

  formatMoney(moneyIn: string | number | undefined): string | undefined {
    let money = moneyIn;
    if (!money) return "";
    if (typeof money === "number") money = money.toString();
    money =
      this.$options.filters &&
      (this.$options.filters.money({
        amount: parseInt(money, 10),
        currency: this.currency || "EUR"
      }) as string);
    return money;
  }

  formatMoneyOnInput(money: string | number | undefined): string | undefined {
    if (typeof money === "number") money = money.toString();
    if (!money || typeof money !== "string") return "";
    // TOO: Find last , or . in string to determine the units separators
    // (money.match(/(?!.*(\.|\,))/) || ',').toString()
    const decSeparator = ",";
    // const centSeparator = decSeparator === "," ? "." : ",";
    const numbers = money.split(decSeparator);
    numbers[0] = numbers[0] && numbers[0].replace(/\D/g, "");
    numbers[1] = numbers[1] && numbers[1].replace(/\D/g, "").slice(0, 2);
    if (!numbers[1]) numbers[1] = "00";
    money = numbers[0] + "" + numbers[1];
    money =
      this.$options.filters &&
      (this.$options.filters.money({
        amount: parseInt(money, 10),
        currency: this.currency || "EUR"
      }) as string);
    this.inputMoney = money;
    this.inputValue = this.unformatMoney(money);
    return money;
  }
}
</script>
