<template>
  <v-input
    class="v-text-field"
    v-bind="$options.propsData"
    :class="{ 'v-input--dirty': dirty, error: required && dirty && !value }"
  >
    <v-button :outline="outline" @click.native="$refs.file.click()">{{ title }}</v-button>
    <input
      ref="file"
      type="file"
      v-bind="$attrs"
      @blur="onBlur()"
      v-on="listeners"
      style="display: none"
    />
    <img v-if="preview" :src="inputValue" alt="" ref="preview" />
  </v-input>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from "vue-property-decorator";
import VInputMixin from "./VInputMixin";

@Component({
  inheritAttrs: false
})
export default class VInputFile extends Mixins(VInputMixin) {
  // set inputValue(val: string | number | undefined) {
  //   this.$emit('change', val);
  // }
  @Prop({ default: true })
  preview!: boolean;

  @Prop({ default: true })
  outline?: boolean;

  @Prop({ default: "Upload file" })
  title?: string;

  image: any = "";
  base64: any = "";
  file?: any;

  set inputValue(val: string | undefined | any) {
    this.$emit("change", val);
  }

  get inputValue() {
    return this.value;
  }

  get listeners() {
    return Object.assign({}, this.$listeners, {
      // This ensures that the component works with v-model
      change: (event: any) => {
        this.onFileChange(event);
        // this.$emit("change", event.target.value);
      }
    });
  }

  onFileChange(e: any) {
    if (!e) return;
    const files = e.target.files || e.dataTransfer.files;
    if (!files.length) return;
    this.file = files[0];
    this.createImage(files[0]);
  }

  createImage(file: File) {
    // let image = new Image();
    const reader = new FileReader();

    reader.onload = (e: any) => {
      this.base64 = e.target.result;
      this.inputValue = e.target.result;
      this.$emit("changeExtended", { file, base64: this.base64 });
    };
    reader.readAsDataURL(file);
  }

  removeImage() {
    this.inputValue = "";
  }
}
</script>
<style lang="stylus" scoped>
img
  width 100%
  margin 10px 0
  border-radius 10px

.v-input .v-input__slot label
  padding 0
</style>
