// main.js
import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
// import $ from "jquery";
import router from './router/index';
import { createPinia } from 'pinia';
import Header from './components/Header.vue';
import About from './components/About.vue';
import Home from './components/Home.vue';
import HeaderComponent from './components/homeModule/headerComponent/headerComponent.vue';
import LeftMenuComponent from './components/homeModule/leftMenuComponent/leftMenuComponent.vue'
import './content/scssStyles.scss';
import Login from './components/login/login.vue'
import pageloading from './components/pageLoadingComponent/pageLoading.vue';
import ReservationDetail from './components/reservations/reservationDetailVue/reservationDetailVue.vue'
import { useCounterStore } from './stores/counter';
window.global = window;

const pinia = createPinia();

const app = createApp(App);
app.use(pinia);
app.use(router);
app.config.globalProperties.$store = useCounterStore(pinia);

// Register global components for the main app
app.component('HeaderComponent', Header);
app.component('Login', Login);
app.component('AboutComponent', About);
app.component('HomeComponent', Home);
app.component('pageLoadingComponent', pageloading);
app.component('headerMenu', HeaderComponent);
app.component('leftMenu', LeftMenuComponent);
app.component('ReservationDetail', ReservationDetail)

// Mount the main app to #app element
app.mount('#app');

// Separate header instance
const headerApp = createApp(HeaderComponent);
headerApp.use(pinia);
headerApp.use(router);
headerApp.config.globalProperties.$store = useCounterStore(pinia);
headerApp.mount('#headerMenu');

// Separate left menu instance
const leftMenuApp = createApp(LeftMenuComponent);
leftMenuApp.use(pinia);
leftMenuApp.use(router);
leftMenuApp.config.globalProperties.$store = useCounterStore(pinia);
leftMenuApp.mount('#leftMenu');
