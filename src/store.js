import {reactive} from 'vue';

export const store = reactive({
  isLoading: false,
  toggleLoading: function () {
    this.isLoading = !this.isLoading;
  },
  setLoading: function(newState) {
    this.isLoading = !!newState;
  }
})
