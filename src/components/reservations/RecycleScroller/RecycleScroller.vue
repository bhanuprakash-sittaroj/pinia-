<!-- <template>
  <div class="infiniteBody">
    <virtual-list :items="items" uniqueKey="id" :iscrollOptions="options" :variable="variable" :infinite="true" :pulldown="true"
      :pulldownText="pullDownTextObj" @loadMore="getMoreData" @pullRefresh="refreshData">
      <template slot="content" slot-scope="props">
        <div class="demo-item" style="height: 75px">
          <span>
            {{props.item.GuestFullName}}
          </span>
          <span>
            {{props.item.Persons}}
          </span>
          <span>
            {{props.item.BookedBy}}
          </span>         
        </div>
      </template>
    </virtual-list>
  </div>
</template> -->
<template src="./RecycleScroller.template.html"></template>
<script>
  import Vue from 'vue'
  import virtualScroll from './src/component/VirtualScroll'
  import 'vue-virtual-infinite-scroll/dist/css/vue-virtual-infinite-scroll.css'
 
  Vue.component('virtual-list', virtualScroll)
  import moment from "moment-timezone";
  export default {
    name: 'rs',
    data() {
      return {
        items: [],
        options: {
          scrollbars: true,
          interactiveScrollbars: true,
          probeType: 3,
          mouseWheel: true,
          mouseWheelSpeed: 1
        },
        variable: false,
        filterObj: {
          PropertyId: -99,
          UnitClassId: -99,
          ViewListId: -1,
          SortBy: null,
          SortOrder: null,
          resSourceId: -99,
          TagsList: [],
          SearchText: [],
          Properties: [],
          UnitClasses: [],
          Sources: [],
          Units: [],
          StatusList: [],
          Columns: [],
          PageNumber: 1,
          ItemsPerPage: 20,
          userDate: moment().format("YYYY-MM-DD"),
        },
        reservationList: [],
        totalLength: null,
        pullDownTextObj: {
          trigger: 'Loading...',
          begin: 'Loading...',
          complete: 'There are no items',
          error: 'There is server error',
          refresh: 'Loading...'
        }
      }
    },
    // created() {
    //   let list = []
    //   for (let i = 1000; i < 10000; i++) {
    //     list.push({
    //       text: i,
    //       id: i,

    //     })
    //   }
    //   this.items = list
    // },
    methods: {
      getMoreData($stateChange) {
        if (this.items.length >= this.totalLength) {
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
          this.filterObj.PageNumber++;
          this.getReservationsList();
        }
      },

      getReservationsList: function () {
        let vm = this;

        vm.$store.dispatch("dataRequestHandler", {
          key: "GetReservationsList",
          params: vm.filterObj,
          callback: function (err, response) {
            if (err) {
              console.log("err in GetReservationsList", err);
              return
            }

            if (response) {
              console.log("responseresponseresponse", response);
              vm.totalLength = response.customViewObj.TotalReservations;
              // console.log("vm.totalLength", vm.totalLength);
              if (vm.filterObj.PageNumber === 1) {
                vm.items.splice(0, vm.items.length, ...response.reservationList);
              }
              else if (vm.filterObj.PageNumber > 1) {
                vm.items.splice(vm.items.length, 0, ...response.reservationList);
              }

            }
          }
        })
        // vm.scrollEvent();
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
    },
    mounted() {

      this.getReservationsList();
    }
  }
</script>
<style>
  .infiniteBody {
    position: absolute;
    top: 20px;
    bottom: 20px;
    left: 100px;
    right: 20px;
  }
</style>