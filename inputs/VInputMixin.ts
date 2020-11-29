import { Component, Vue, Prop, Model } from "vue-property-decorator";
export interface Money {
  amount: number;
  currency: string;
}
@Component({})
export default class VInputMixin extends Vue {
  @Model("change")
  value!: any;
  @Prop()
  label?: string;
  @Prop({ type: Boolean })
  required?: boolean;
  @Prop({ default: null })
  errors?: string;
  @Prop({ default: false })
  hideErrors?: boolean;

  dirty = false;
  focused = false;

  onFocus() {
    this.focused = true;
  }

  get isEmpty() {
    return !(this.value || this.value === 0);
  }

  onBlur() {
    this.$emit("blur");
    this.dirty = true;
    this.focused = false;
    if (this.$refs.vinput) (this.$refs.vinput as any).onBlur();
  }
}
