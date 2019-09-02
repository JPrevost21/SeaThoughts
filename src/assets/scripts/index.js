import Vue from 'vue';

let app = new Vue({
  el: '#app',
  data: {
    showingShareThoughts: false,
    submissionTextInput: '',
    loading: false,
    confirmation: false,
    viewing: false
  },
  methods: {
    shareThoughts: function() {
      this.showingShareThoughts = true;
      this.submissionTextInput = '';
    },
    goHome: function() {
      this.showingShareThoughts = false;
      this.loading = false;
      this.confirmation = false;
      this.viewing = false;
    },
    submit: function() {
      console.log(this.submissionTextInput);
      this.loading = true;

      // TODO: send to server
  
      setTimeout(() => {
        this.confirmation = true;
      }, 1000);
    },
    viewMessage: function() {
      this.viewing = true;
    }
   }
});
