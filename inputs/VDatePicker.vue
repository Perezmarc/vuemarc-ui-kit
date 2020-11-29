<template>
  <v-input
    class="v-date-picker"
    v-bind="$options.propsData"
    :class="{
      'v-input--dirty': dirty,
      'v-input--typed': focused || !isEmpty,
      error: required && dirty && !value,
      active: showCalendar
    }"
    v-click-outside="hideCalendar"
  >
    <div
      class="v-input__slot__input"
      @click="inputClicked()"
      :class="{ disabled: $attrs.disabled }"
    >
      <i class="material-icons">calendar_today</i> {{ value | date }}
      <input
        v-model="value"
        v-bind="$attrs"
        @blur="onBlur()"
        @focus="onFocus()"
        v-on="listeners"
      />
    </div>
    <div class="v-date-picker__calendar" :class="{ active: showCalendar }">
      <div class="v-date-picker__calendar__header">
        <v-button flat icon @click.native="decreaseMonth()" class="large">
          <i class="v-icon large material-icons">keyboard_arrow_left</i>
        </v-button>
        <div>{{ monthsString[viewingMonth] }} {{ viewingYear }}</div>
        <v-button flat icon @click.native="increaseMonth()" class="large">
          <i class="v-icon large material-icons">keyboard_arrow_right</i>
        </v-button>
      </div>
      <div
        class="v-date-picker__calendar__container"
        :class="`start-day-${monthData.offset}`"
      >
        <div v-for="(day, index) in daysString" :key="index">
          {{ day }}
        </div>
        <button
          v-for="i in monthData.days"
          :key="`asdf${i}`"
          @click="selectDate(i)"
          class="cell"
          :class="{ selected: isDateSelected(i) }"
        >
          {{ i }}
        </button>
      </div>
    </div>
  </v-input>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from "vue-property-decorator";
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
export default class VDatePicker extends Mixins(VInputMixin) {
  showCalendar = false;
  today: Date = new Date();
  viewingYear: number = new Date().getFullYear();
  viewingMonth: number = new Date().getMonth();
  selectedDate: Date | null = null;

  monthsString: string[] = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  daysString: string[] = ["M", "T", "W", "T", "F", "S", "S"];

  @Watch("selectedDate")
  onSelectedDateChanged(val: Date | undefined) {
    if (val) this.$emit("change", val.toISOString());
  }

  created() {
    this.selectedDate = new Date(this.value) || this.today;
  }

  inputClicked() {
    if (this.$attrs.disabled) return;
    this.showCalendar = !this.showCalendar;
  }

  get listeners() {
    return Object.assign({}, this.$listeners, {
      // This ensures that the component works with v-model
      change: (event: any) => {
        this.$emit("change", event.target.value);
      }
    });
  }

  isDateSelected(day: number) {
    if (!this.selectedDate) return false;
    if (this.selectedDate.getDate() !== day) {
      return false;
    }
    if (this.selectedDate.getMonth() !== this.viewingMonth) {
      return false;
    }
    if (this.selectedDate.getFullYear() !== this.viewingYear) {
      return false;
    }
    return true;
  }

  get monthData() {
    const firstDay = new Date(this.viewingYear, this.viewingMonth, 1);
    const lastDay = new Date(this.viewingYear, this.viewingMonth + 1, 0);
    return {
      firstDay,
      lastDay,
      offset: firstDay.getDay(),
      days: Array.from(Array(lastDay.getDate()).keys()).map((d: number) => d + 1)
    };
  }

  selectDate(day: number) {
    this.selectedDate = new Date(this.viewingYear, this.viewingMonth, day);
  }

  hideCalendar() {
    this.showCalendar = false;
  }

  increaseMonth() {
    if (this.viewingMonth < 11) {
      this.viewingMonth++;
    } else {
      this.viewingMonth = 0;
      this.viewingYear++;
    }
  }

  decreaseMonth() {
    if (this.viewingMonth > 0) {
      this.viewingMonth--;
    } else {
      this.viewingMonth = 11;
      this.viewingYear--;
    }
  }
}
</script>

<style lang="stylus">
.v-input.v-date-picker
  .v-input__slot__input
    cursor pointer

    &.disabled
      cursor default

    input
      display none

    i
      font-size 17px
      margin-right 10px

  .v-date-picker__calendar
    opacity 0
    display none
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

    .v-date-picker__calendar__header
      padding 20px 20px 0 20px
      display flex
      justify-content space-between

      div
        display flex
        align-items center

    &__container
      padding 20px
      overflow-x hidden
      overflow-y auto
      display grid
      grid-template-columns 1fr 1fr 1fr 1fr 1fr 1fr 1fr

      & > *
        background transparent
        height 30px
        width 30px
        padding 5px
        text-align center
        border-radius 20px
        display flex
        align-items center
        justify-content center
        justify-self center
        font-size 12px

      .cell
        cursor pointer
        border none
        margin 1px
        transition .3s $transition-standard

        &:hover
          background $color-grey--lighten-4
          transition .3s $transition-standard

        &.selected
          background $color-primary
          color #fff
          transition .3s $transition-standard

      for i in range(0, 6)
        &.start-day-{i} .cell:nth-child(8)
          grid-column-start i

    &.active
      z-index 5
      display block
      opacity 1
      margin-bottom 40px
      transition .5s $transition-standard
</style>
