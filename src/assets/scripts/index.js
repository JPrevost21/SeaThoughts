import { firebaseConfig } from './firebase';

import Vue from 'vue';

let app = new Vue({
  el: '#app',

  data: {
    showingShareThoughts: false,
    submissionTextInput: '',
    loading: false,
    confirmation: false,
    viewing: false,
    db: null,
    currentThought: ''
  },

  methods: {
    /**
     * Show the share your thoughts screen to the user
     */
    shareThoughts: function() {
      this.showingShareThoughts = true;
      this.submissionTextInput = '';
    },

    /**
     * Return to the home screen
     */
    goHome: function() {
      this.showingShareThoughts = false;
      this.loading = false;
      this.confirmation = false;
      this.viewing = false;
    },

    /**
     * Submits the user's thought to the database
     */
    submit: function() {
      console.log(this.submissionTextInput);
      this.loading = true;

      // TODO: send to server
  
      setTimeout(() => {
        this.confirmation = true;
      }, 1000);
    },

    /**
     * Display a random anonymous thought from the database
     */
    viewMessage: function() {
      this.loading = true;

      // Get all thoughts in the database
      this.db.collection('thoughts').get().then(handleThoughts.bind(this));

      function handleThoughts(thoughts) {

        // Get previous thoughts displayed on this browser
        const previousThoughts = this.getPreviousThoughts();
        const document = this.chooseFreshThought(thoughts, previousThoughts);

        if (document) {
          // Save this thought in our local cache
          this.saveNewThoughtAsViewed(document);

          this.currentThought = document.data().thought;
        } else {
          this.currentThought = 'Could not find anything. Please try again later.';
        }

        // Show the viewing thoughts screen
        this.viewing = true;
      }
    },

    /**
     * Retrieve any thoughts displayed in the past on this browser
     */
    getPreviousThoughts: function() {
      let previousThoughtsString = localStorage.getItem('previous-sea-thoughts');

      if (!previousThoughtsString) {
        localStorage.setItem('previous-sea-thoughts', JSON.stringify([]));
        previousThoughtsString = '[]';
      }

      // Load previously saved thoughts
      return JSON.parse(previousThoughtsString);
    },

    /**
     * Record a thought as having been viewed on this browser
     */
    saveNewThoughtAsViewed: function(thought) {
      const previousThoughts = this.getPreviousThoughts();
      previousThoughts.push(thought.id);
      localStorage.setItem('previous-sea-thoughts', JSON.stringify(previousThoughts));
    },

    /**
     * Chooses a thought that has not been previously picked
     */
    chooseFreshThought: function(documents, previousThoughts) {
      /** The freshly chosen document */
      let document;

      /** The maximum number of attempts to find a fresh document */
      const maxCount = 50;

      /** The current amount of attempts that have been made */
      let count = 0;

      /** If we have found a fresh document */
      let found = false;

      // While we have NOT found a fresh document...
      while (!found) {

        // Increase our attempt counter
        count++;

        // If we have made more attempts than allowed...
        if (count >= maxCount) {

          // Set our document to null and end the loop
          document = null;
          break;
        }

        // Get a new random thought
        document = this.chooseRandomArrayItem(documents.docs);

        /** Will be true if the randomly chosen thought has been seen before */
        const exists = previousThoughts.find(thoughtID => thoughtID === document.id);

        // If this thought has NOT been seen before...
        if (!exists) {

          // End the loop
          found = true;
        }
      }

      return document;
    },

    /**
     * Gets a random item from within an array
     * @param array The array you want to get a random item from
     */
    chooseRandomArrayItem: function(array) {
      return array[
        Math.floor(
          Math.random() * array.length
        )
      ];
    }
  },

  created: function() {
    firebase.initializeApp(firebaseConfig);
    this.db = firebase.firestore();
  }
});
