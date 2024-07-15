<template src="./guestProfilePannel.template.html"></template>
<script>
  import moment from "moment-timezone";

  export default {
    name: "guestProfilePannel",
    props: ['default', 'searchObj'],
    data() {
      return {
        TotalGuests: null,
        time: null,
        reRender: false,
        options: {
          scrollbars: true,
          interactiveScrollbars: true,
          probeType: 3,
          mouseWheel: true,
          mouseWheelSpeed: 1
        },
        searching: false,

        variable: false,
        totalLength: null,
        pullDownTextObj: {
          trigger: 'Loading...',
          begin: 'Loading...',
          complete: 'There are no items',
          error: 'There is server error',
          refresh: 'Loading...'
        },
        listType: 'list',
        SearchObject: {},
        guestsList: [],
        items: [],
        timeout: null,
        isLoading: false,
        fromValue: false,
        filterObj: {
          SortBy: null,
          SortOrder: null,
          PageNumber: 1
        },
      };
    },
    methods: {
      getMoreData($stateChange) {
        this.searching = false;
        if (this.items.length >= this.TotalGuests) {
          $stateChange('complete')
        } else {
          setTimeout(() => {
            //   // let length = this.items.length
            //   // for (let i = length; i < length + 20; i++) {
            //   //   this.items.push({
            //   //     text: i,
            //   //     id: i,

            //   //   })
            //   // }
            //   // this.filterObj.PageNumber = this.filterObj.PageNumber + 1;


            $stateChange('loaded')
          }, 1500)
          this.loading = false;
          this.filterObj.PageNumber++;
          this.getSearchResults();
        }
      },
      refreshData($pullStateChange) {
        setTimeout(() => {
          this.items.splice(0)
          for (let i = 0; i < 50; i++) {
            this.items.push({
              text: i,
              id: i,

            })
          }
          $pullStateChange('complete')
        }, 1500)
      },

      formatDate(date) {
        // DD-MMM-YYYY
        let vm = this;
        return moment(date).format("DD-MMM-YYYY");
      },

      sendGuestInfoToDetail(item) {
        let vm = this;
        vm.$store.state.bus.$emit("sendGuestInfoToDetail", { guestInfo: item });
        //  setTimeout(function () {
        vm.closeSummaryPannel();
        // }, 10);



      },

      showGuestSerachPanel() {
        let vm = this;
        vm.isLoading = true;
        $(".reservationSummary").removeClass("animated fadeOutRight");
        $(".reservationSummary").addClass("expand animated fadeInRight");
        $(".menuMaskRevSum").show();
        // $(".reservationSummary").removeClass("menuMaskRevSum");

      },

      closeSummaryPannel(from) {
        let vm = this;
        vm.guestsList = [];
        $(".menuMaskRevSum").hide();
        $(".reservationSummary").removeClass("expand fadeInRight");
        $(".reservationSummary").addClass("animated fadeOutRight");
        if (from && from == 'close') {
          vm.$store.state.bus.$emit("closepannel", { isClosed: false,profileType:vm.SearchObject.profileType });

        }
        else {
          vm.$store.state.bus.$emit("closepannel", { isClosed: true ,profileType:vm.SearchObject.profileType });

        }

      },
      getSearchResults(from) {
        let vm = this;
        console.log("SearchObject===============>", vm.SearchObject);
        vm.guestsList = [];
        // vm.items = [];
        vm.reRender = false;

        if (from && from == 'search') {
          vm.filterObj.PageNumber = 1;
          vm.isLoading = true;
          vm.items.splice(0)
        }
        vm.$store.dispatch("dataRequestHandler", {
          key: "Get_GuestProfileList",
          params: {
            SearchText: vm.SearchObject,
            IsFromSearch: 1,
            SortOrder: vm.filterObj.SortOrder,
            SortBy: vm.filterObj.SortBy,
            PageNumber: vm.filterObj.PageNumber,
            propertyId: null,
            statusId: null,
            profileType: vm.SearchObject.profileType
          },
          callback: function (err, response) {
            if (err) {
              console.log("Error in Get_GuestProfileList ==============================> ", err);
              return;
            }
            if (response) {
              // vm.reRender = false;

              console.log("response in Get_GuestProfileList => ", response);
              if (vm.filterObj.PageNumber === 1 && response[0] && response[0].length != 0) {

                vm.items.splice(0, vm.items.length, ...response[0]);

              }
              else if (vm.filterObj.PageNumber > 1 && response[0] && response[0].length != 0) {
                vm.items.splice(vm.items.length, 0, ...response[0]);
              }
              if (response[1] && response[1][0]) {
                vm.TotalGuests = response[1][0].TotalGuests;
              }
              if(response[0] && response[0].length == 0){
                vm.reRender = false;
                vm.isLoading = false;
              }
              vm.guestsList = response[0];
              // if(vm.guestsList.length > 0){
              //   vm.showGuestSerachPanel();
              // }                                        
              // if(vm.guestsList.length == 0){
              //   vm.closeSummaryPannel();
              // }
              vm.$store.state.bus.$emit("guestListLength", vm.guestsList);
              // setTimeout(() => {
              //   vm.isLoading = false;
                // vm.reRender = true;
              // }, 1500)

            }
          }
        });

      }


    },
    computed: {
      reservationsListObj() {

        if (this.items && this.items.length > 0) {
          return this.items.reduce((acc, guest) => {
            acc[guest.GuestProfileId] = { guestObj: guest };
            console.log("this.items", acc)
            return acc;
          }, {})
        }
        return {};
      },
      // reRender() {
      //   // setTimeout(() => {
      //   // console.log("true")
      //   let vm = this;
      //   // clearTimeout(vm.time);
      //   //   vm.time = setTimeout(() => {
      //   //   }, 1500);

      //   if (vm.items.length > 0) {

      //     // setTimeout(() => {
      //       // console.log("true")
      //       return true;
      //     // }, 1500)

      //   }
      //   else {
      //     return false;
      //   }

      //   // }, 1500)

      // }
    },
    mounted() {
    },
    watch: {
      items() {
        console.log("watcheddddddddddddddddddd")
        let vm = this;
        if(vm.searching == true){
          vm.reRender = false;
        vm.isLoading = true;
        // vm.searching = false;
        // clearTimeout(vm.time);
        //   vm.time = setTimeout(() => {
        //   }, 1500);

        if (vm.items.length > 0) {

          setTimeout(() => {
            console.log("true")
            vm.reRender = true;
            vm.isLoading = false;
          }, 1500)

        }
        // else if(vm.items.length == 0){
        //   // vm.reRender = false;
        //   setTimeout(() => {
        //     vm.isLoading = false;
        //   }, 1800)

        // }
        else {
          // setTimeout(() => {
          vm.reRender = false;
          vm.isLoading = true;
        // }, 1500)
        }
        

        // }, 1500)

        }
        // else{
        //   vm.reRender = true;
        // }
        
      },
      searchObj() {
        let vm = this;
        vm.isLoading = true;
        vm.reRender = false;
        // handler: function (unitObj, oldVal) {
        //     console.log("searchObj", unitObj);
        console.log(" hereeeeeeeeeeeeeeee1111111111111111", vm.searchObj)

        if (vm.searchObj) {
          // vm.showGuestSerachPanel();
          vm.SearchObject = vm.searchObj;
          vm.items = [];
          vm.showGuestSerachPanel();
          clearTimeout(vm.timeout);
          vm.timeout = setTimeout(function () {
          if (vm.SearchObject.Address == null && vm.SearchObject.Address2 == null && vm.SearchObject.CityName == null && vm.SearchObject.CountryName == null && vm.SearchObject.Email == null && vm.SearchObject.GuestFirstName == null && vm.SearchObject.GuestLastName == null && vm.SearchObject.PhoneNumber == null && vm.SearchObject.PostalCode == null && vm.SearchObject.StateName == null) {
            vm.searching = false;
            vm.isLoading = false;
            console.log("response");
            vm.guestsList = [];
            vm.items = [];
            vm.reRender = true;
            vm.TotalGuests = 0;
            
            vm.$store.state.bus.$emit("guestListLength", vm.guestsList);
          }
          else {
            vm.searching = true;
            vm.getSearchResults('search');

          }


          }, 2000);

        }
        else {
          vm.closeSummaryPannel();
        }

        console.log("searchobj changed")
        // },
        // deep: true
      }
    },
  };
</script>