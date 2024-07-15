<template>
  <section id="page-content">
    <!-- Header -->
    <nav id="custom-nav-bar" class="navbar fixed-top">
      <div id="headerMenu"></div>
      <div id="leftMenu"></div>
    </nav>

    <div class="mainContent">
      <section class="appcontent container-fluid" :class="maildevclass">
        <!-- <router-view></router-view> -->
        <p>Count: {{ count }}</p>
        <button @click="increment">Increment</button>
        <button @click="decrement">Decrement</button>
      </section>
    </div>
  </section>
</template>

<script>
import eventBus from './stores/eventBus';
import { useCounterStore } from './stores/counter.js';
import { convertToPlainObject } from './utils/storeUtils.js';
import { isProxy, toRaw } from 'vue';

export default {
  name: "app",
  data() {
    return {
      msg: "rawObjectOrArray",
      rawObjectOrArray: null,
      maildevclass: null,
      counterStore: useCounterStore(),  // Initialize the store
    };
  },
  computed: {
    count() {
      return this.counterStore.count;
    },
  },
  methods: {
    
    increment() {
      this.counterStore.increment();
    },
    decrement() {
      this.counterStore.decrement();
    },
    maildev() {
      if (window.location.hash === "#/TempoEmailServiceStatus") {
        this.maildevclass = "test";
      } else {
        this.maildevclass = null;
      }
    }
  },
  created() {
    eventBus.$on("mailDev", maildev => {
      this.maildev = maildev;
    });
  },
  mounted() {
    isProxy(this.counterStore) ? 'yup' : 'nope';
    const rawObjectOrArray = toRaw(this.counterStore)
    console.log("omfgggggggg", rawObjectOrArray)

    // console.log("bhanu1", {...this.counterStore.dataRequestHandler}); 
    convertToPlainObject(this.counterStore);
    // console.log("Apppppppppppppp2222222222", this.counterStore.dataRequestHandler);

    // Print actions directly from the store instance
    // console.log("Increment Action:", this.counterStore.increment);
    // console.log("Decrement Action:", this.counterStore.decrement);

    if (window.location.hash === "#/TempoEmailServiceStatus") {
      this.maildev = "maildev";
    } else {
      this.maildev = null;
    }
  }
};
</script>

<style lang="scss" scoped>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#headerMenu,
#leftMenu {
  width: 100%;
}

h1,
h2 {
  font-weight: normal;
}

a {
  color: #42b983;
}
</style>
