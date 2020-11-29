import Vue from "vue";

// Buttons
import VButton from "./buttons/VButton.vue";
Vue.component("v-button", VButton);

// Fields
import VCheckbox from "./inputs/VCheckbox.vue";
Vue.component("v-checkbox", VCheckbox);

import VDatePicker from "./inputs/VDatePicker.vue";
Vue.component("v-date-picker", VDatePicker);

import VInput from "./inputs/VInput.vue";
Vue.component("v-input", VInput);

import VInputIban from "./inputs/VInputIban.vue";
Vue.component("v-input-iban", VInputIban);

import VInputMoney from "./inputs/VInputMoney.vue";
Vue.component("v-input-money", VInputMoney);

import VSelect from "./inputs/VSelect.vue";
Vue.component("v-select", VSelect);

import VTextArea from "./inputs/VTextArea.vue";
Vue.component("v-text-area", VTextArea);

import VTextField from "./inputs/VTextField.vue";
Vue.component("v-text-field", VTextField);

import VInputPassword from "./inputs/VInputPassword.vue";
Vue.component("v-input-password", VInputPassword);

import VInputFile from "./inputs/VInputFile.vue";
Vue.component("v-input-file", VInputFile);

import VMediaVideo from "./media/VMediaVideo.vue";
Vue.component("v-media-video", VMediaVideo);

import VSteps from "./navigation/VSteps.vue";
Vue.component("v-steps", VSteps);

import VStep from "./navigation/VStep.vue";
Vue.component("v-step", VStep);

// Modals
import VModal from "./modals/VModal.vue";
Vue.component("v-modal", VModal);
import VFlashNotice from "./modals/VFlashNotice.vue";
Vue.component("v-flash-notice", VFlashNotice);
