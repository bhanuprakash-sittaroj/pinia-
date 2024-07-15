<template src="./reservationListVue.template.html"></template>

<script>
  import moment from "moment-timezone";
  import * as axios from 'axios';
  import modal from './modal.template.vue';
  import Vue from 'vue'


  import virtualScroll from './src/component/VirtualScroll'
  import 'vue-virtual-infinite-scroll/dist/css/vue-virtual-infinite-scroll.css'

  import foliomodal from "../reservationDetailVue/folioRecalculateConfirmationModal.vue";

  Vue.component('virtual-list', virtualScroll)

  export default {
    name: "reservationListComponent",
    props: ['default', 'sidebar'],

    data() {
      return {
        showPropertyList: false,
        showunitList: false,
        showunitTypeList:false,
        showsourceList: false,
        showunitNameList: false,
        showstatusList: false,
        showtagList: false,
        items: [],
        isHostModeObj: null,
        viewFilterMetadata: {
          "-1": [1, 3, 4, 5, 6, 7, 8, 9, 10, 11],
          "-2": [6],
          "-3": [1, 3, 5],
          "-4": [6],
          "-5": [1, 3, 5, 8, 10],
          "-6": [1, 3, 5, 6, 7, 8, 9, 11]
        },
        options: {
          scrollbars: true,
          interactiveScrollbars: true,
          probeType: 3,
          mouseWheel: true,
          mouseWheelSpeed: 1
        },

        variable: false,
        totalLength: null,
        pullDownTextObj: {
          trigger: 'Loading...',
          begin: 'Loading...',
          complete: 'There are no items',
          error: 'There is server error',
          refresh: 'Loading...'
        },
        Tagdisable: true,
        checkinbutton: true,
        checkOutbutton: true,
        statusbutton: true,
        Amountlabel: true,
        unassignbutton: true,
        showicon: true,
        entitlements: {},
        linearProgress: false,
        reservationList: [],
        currResObj: {},
        isSummaryLoading: true,
        isDateBeforeOrAfterSixMonths: false,
        loading: true,
        isGreyOut: false,
        isSummaryLoading: false,
        scrllCount: 50,
        scrlBtns: false,
        propertyList: [],
        unitClassList: [],
        unitTypeList:[],
        sourceList: [],
        tagsList: [],
        unitList: [],
        statusList: [],
        notesDetailById: {
          noteId: -1,
        },
        viewList: [
          { Label: 'All Reservations', ViewListId: -1, IsChecked: 0, isSortLoading: false },
          { Label: 'Currently In House', ViewListId: -2, IsChecked: 0, isSortLoading: false },
          { Label: 'Arriving Today', ViewListId: -3, IsChecked: 0, isSortLoading: false },
          { Label: 'Departing Today', ViewListId: -4, IsChecked: 0, isSortLoading: false },
          { Label: 'Upcoming Reservations', ViewListId: -5, IsChecked: 1, isSortLoading: false },
          { Label: 'Today’s Reservations', ViewListId: -6, IsChecked: 0, isSortLoading: false },
        ],
        headerColumnList: {
          Actions: { Label: "Actions", IsChecked: true, ColumnName: "Actions" },
          Status: {
            Label: "Status", IsChecked: true, ColumnName: "StatusName", class: "filterLoad", isAscOrDesc: null,
            sortLabels: {
              StatusName: {
                ColumnName: "StatusName",
                isSortLoading: false,
                Label: "Status Name",
                SortOder: '',
                isActive: "",
                isSortAscOrDesc: ''
              },
              SourceName: {
                ColumnName: "SourceName",
                isSortLoading: false,
                Label: "Source name",
                SortOder: '',
                isActive: "",
                isSortAscOrDesc: ''
              },
              SubSourceName: {
                ColumnName: "SubSourceName",
                isSortLoading: false,
                Label: "Sub Source Name",
                SortOder: '',
                isActive: "",
                isSortAscOrDesc: ''
              }
            }
          },
          GuestName: {
            Label: "Guest Name",
            IsChecked: true,
            ColumnName: "GuestFirstName",
            class: "filterLoad",
            isAscOrDesc: null,
            sortLabels: {
              GuestFirstName: {
                ColumnName: "GuestFirstName",
                isSortLoading: false,
                Label: "Guest First Name",
                SortOder: '',
                isActive: "",
                isSortAscOrDesc: ''
              },
              GuestLastName: {
                ColumnName: "GuestLastName",
                isSortLoading: false,
                Label: "Guest Last Name",
                SortOder: '',
                isActive: "",
                isSortAscOrDesc: ''
              },
              NumberOfAdults: {
                ColumnName: "NumberOfAdults",
                isSortLoading: false,
                Label: "Adults",
                SortOder: '',
                isActive: "",
                isSortAscOrDesc: ''
              },
              NumberOfChildren: {
                ColumnName: "NumberOfChildren",
                isSortLoading: false,
                Label: "Children",
                SortOder: '',
                isActive: "",
                isSortAscOrDesc: ''
              },
              Persons: {
                ColumnName: "Persons",
                isSortLoading: false,
                Label: "Persons",
                SortOder: '',
                isActive: "",
                isSortAscOrDesc: ''
              }
            }
          },

          StartDate: {
            Label: "Stay", IsChecked: true, ColumnName: "StartDate", class: "filterLoad", isAscOrDesc: null,
            sortLabels: {
              StartDate: {
                ColumnName: "StartDate",
                isSortLoading: false,
                Label: "Check-In",
                SortOder: '',
                isActive: "",
                isSortAscOrDesc: ''
              },
              EndDate: {
                ColumnName: "EndDate",
                isSortLoading: false,
                Label: "Check-Out",
                SortOder: '',
                isActive: "",
                isSortAscOrDesc: ''
              },
              Nights: {
                ColumnName: "Nights",
                isSortLoading: false,
                Label: "Nights",
                SortOder: '',
                isActive: "",
                isSortAscOrDesc: ''
              }
            }
          },



          BookedBy: {
            Label: "Date Booked", IsChecked: true, ColumnName: "DateBooked", class: "filterLoad",
            sortLabels: {
              DateBooked: {
                ColumnName: "DateBooked",
                isSortLoading: false,
                Label: "Date Booked",
                SortOder: '',
                isActive: "",
                isSortAscOrDesc: ''
              },
              BookedBy: {
                ColumnName: "BookedBy",
                isSortLoading: false,
                Label: "Booked By",
                SortOder: '',
                isActive: "",
                isSortAscOrDesc: ''
              }

            }
          },
          Unit: {
            Label: "Unit", IsChecked: true, ColumnName: "UnitName", class: "filterLoad", isAscOrDesc: null,
            sortLabels: {
              UnitName: {
                ColumnName: "UnitName",
                isSortLoading: false,
                Label: "Unit Name",
                SortOder: '',
                isActive: "",
                isSortAscOrDesc: ''
              },
              UnitClassName: {
                ColumnName: "UnitClassName",
                isSortLoading: false,
                Label: "Unit Class Name",
                SortOder: '',
                isActive: "",
                isSortAscOrDesc: ''
              }
            }
          },
          Amount: {
            Label: "Amount", IsChecked: true, ColumnName: "TotalAmount", columnClass: "numeriColumn", class: "filterLoad", isAscOrDesc: null,
            sortLabels: {
              TotalAmount: {
                ColumnName: "TotalRate",
                isSortLoading: false,
                Label: "Total Amount",
                SortOder: '',
                isActive: "",
                isSortAscOrDesc: ''
              },
              DueAmount: {
                ColumnName: "BalanceRate",
                isSortLoading: false,
                Label: "Due Amount",
                SortOder: '',
                isActive: "",
                isSortAscOrDesc: ''
              }
            }
          },
        },
        listType: "list",
        RowsPerPage: 10,
        totalCount: 0,
        viewSaveObject: {
          viewId: -1,
          name: null,
          isPublic: false,
          entityId: 4,
          propertyId: -99,
          UnitClassId: -99,
          resSourceId: -99,
          sortColumn: null,
          sortOrder: null,
          filters: [],
          tags: [],
          columns: [],
          properties: [],
          UnitClasses: [],
          UnitTypes:[],
          sources: [],
          units: [],
          statusList: [],
          stayStartDate:null,
          stayEndDate:null
        },
        viewAttrsChanged: false,
        viewObjectChanged: false,
        isModalVisible: false,
        today: moment().format("MMM DD YYYY"),
        filterObj: {
          PropertyId: -99,
          UnitClassId: -99,
          ViewListId: -5,
          SortBy: null,
          SortOrder: null,
          resSourceId: -99,
          TagsList: [],
          SearchText: [],
          Properties: [],
          UnitClasses: [],
          UnitTypes:[],
          Sources: [],
          Units: [],
          StatusList: [],
          Columns: [],
          PageNumber: 1,
          ItemsPerPage: 20,
          resid: null,
          userDate: moment().format("YYYY-MM-DD"),
          showUnAllocatedReservations:false,
          includeObsoleteInventory: false,
          stayStartDate:null,
          stayEndDate:null
        },
        clearTags: false,
        customViewList: [],
        selectedViewObj: null,
        toggleFilterPanel: false,
        selectedFilterColumn: null,
        filterSearchTagText: null,
        filterSearchPropertyText: null,
        filterSearchUnitClassText: null,
        filterSearchUnitTypeText:null,
        filterSearchSourceTypeText: null,
        filterSearchUnitNameText: null,
        filterSearchStatusText: null,
        reservationSummaryInfo: {},
        previousReservationSummaryInfo: {},
        Reservation_Status: {},
        folioSummaryDetail: {},
        clearfilterForsearchText: false,
        folioCharges: {},
        notificationAmount :null,
        filterColumnList: {
          ConfirmationNumber: { Label: "Tempo Confirmation Number", ColumnName: "ConfirmationNumber", Type: "text" },
          ExternalConfirmationNumber: { Label: "External Confirmation Number", ColumnName: "SourceConfirmationNumber", Type: "text" },
          Email: { Label: "Email", ColumnName: "Email", Type: "text" },
          PhoneNumber: { Label: "Phone Number", ColumnName: "PhoneNumber", Type: "text" },
          GuestFirstName: { Label: "First Name", ColumnName: "GuestFirstName", Type: "text" },
          GuestLastName: { Label: "Last Name", ColumnName: "GuestLastName", Type: "text" },
          CheckinDates: { Label: "Check-In/Out Dates(s)", ColumnName: "CheckinCheckoutDate", Type: "date" },
          // StayDate: { Label: "Stay Date(s)", ColumnName: "StayDate", Type: "date" },
          BookedDate: { Label: "Booked Date(s)", ColumnName: "DateBooked", Type: "date" },
          BookedBy: { Label: "Booked By", ColumnName: "BookedBy", Type: "text" },
        },
        selectedReservation: null,    
        resDetail: null,
        isModalVisibleVal: false,
        modalParams: null,

        opens: null,
        minDate: null,
        maxDate: null,
        singleDatePicker: null,
        timePicker: null,
        timePicker24Hour: null,
        showWeekNumbers: null,
        showDropdowns: null,
        autoApply: null,
        linkedCalendars: null,
        dateFormat: 'DD MMM YYYY',
        stayDateRange: { startDate: null, endDate: null }, 
        filterColumnsDateRange: { startDate: null, endDate: null },
        filterColumnsDateRange2: { startDate: null, endDate: null },
      };
    },
    methods: {
      folioRecalculateCloseModal() {
        this.isModalVisibleVal = false;
      },
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
          this.loading = false;
          this.filterObj.PageNumber++;
          this.getReservationsList();
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


      GetUserEntitlementsAndDefaultProperty() {
        let vm = this;
        vm.$store.dispatch("dataRequestHandler", {
          key: "GetUserEntitlementsAndDefaultProperty",
          params: {
            ModuleAction: "GetUserEntitlementsAndDefaultProperty"
          },
          callback: function (err, response) {
            if (err) {
              return;
            }
            if (response) {
              console.log("response in GetUserEntitlementsAndDefaultProperty", response);
              vm.UserProperties = response.properties;
              vm.entitlements = response.userEntitlementList;
              vm.fncIsHousekeepingTaskList();
              vm.UnassignAndStatus();
              vm.checkin();
              vm.tagDisabling();
              vm.CheckOutbutton();
              vm.statusButton();
              vm.AmountLabel();


              // vm.DefaultProperty = response.defaultPropertyId;
            }
          }
        });
      },
      UnassignAndStatus() {
        let vm = this;
        if (vm.entitlements && vm.entitlements.fncHousekeeper.isAssigned === 1) {
          vm.unassignbutton = true;
        }
        else {
          vm.unassignbutton = false;
        }
      },
      fncIsHousekeepingTaskList() {
        let vm = this;
        console.log("vm.entitlements.fncHousekeeper.isAssigned", vm.entitlements.fncHousekeeper.isAssigned);
        if (vm.entitlements.fncHousekeeper.isAssigned === 1) {
          vm.showicon = false;

        }
        else {
          vm.showicon = true;

        }
      },
      tagDisabling() {
        let vm = this;
        if (vm.entitlements.fncReservationUpdate.isAssigned === -1) {
          vm.Tagdisable = false;
        }
        else {
          vm.Tagdisable = true;
        }
      },


      checkin() {
        let vm = this;
        // console.log("vm.entitlements.fncReservationUpdate.isAssigned", vm.entitlements.fncReservationUpdate.isAssigned);
        if (vm.entitlements.fncReservationUpdate.isAssigned === 1 || vm.entitlements.fncHousekeeper.isAssigned === 1) {
          vm.checkinbutton = true;

        }
        else {
          vm.checkinbutton = false;

        }
      },
      CheckOutbutton() {
        let vm = this;
        //  console.log("fncHousekeepingTaskUpdate+ fncReservationSave+fncReservationUpdate+ fncReservationList",fncHousekeepingTaskUpdate);
        if (vm.entitlements.fncReservationUpdate.isAssigned === 1 || vm.entitlements.fncHousekeeper.isAssigned === 1) {
          vm.checkOutbutton = true;
        }
        else {
          vm.checkOutbutton = false;
        }
      },
      statusButton() {
        let vm = this;
        if (vm.entitlements.fncReservationUpdate.isAssigned === 1 || vm.entitlements.fncHousekeeper.isAssigned === 1) {
          vm.statusbutton = true;
        }
        else {
          vm.statusbutton = false;
        }
      },

      AmountLabel() {
        let vm = this;
        if (vm.entitlements && vm.entitlements.fncFolioView.isAssigned === -1) {
          vm.Amountlabel = false;
        }
        else {
          vm.Amountlabel = true;


        }

      },


      formatStartYear(date) {
        let scope = this;
        let diff = moment(date).diff(
          scope.today,
          "months"
        );
        // if (Math.abs(diff) >= 6) {
        return moment(date, "YYYY-MM-DD").format("YYYY");
        // }
        // else {
        //   return null;
        // }
      },
      formatStartDate(date) {
        return moment(date, "YYYY-MM-DD").format("MMM DD");
      },
      formatEndDate(date) {
        return moment(date, "YYYY-MM-DD").format("MMM DD");
      },
      assignOrUnassign(reservationMode, event) {
        let vm = this;
        vm.$set(vm.reservationSummaryInfo.guestInfo, 'reservationMode', reservationMode);
        vm.$store.dispatch("dataRequestHandler", {
          key: "UpdateUnitToUnAssigned",
          params: {
            ReservationId: vm.reservationSummaryInfo.guestInfo.ReservationId
          },
          callback: function (err, response) {
            if (err) {
              vm.$store.dispatch("toastr", {
                type: "error",
                header: "Error!",
                message: "Error While Unassigning Unit Info!"
              });
              console.log("Error in UpdateUnitToUnAssigned =>", err);
              return;
            }
            if (response) {

              if (response[0] && response[0][0] && response[0][0].ErrorMessage != "") {
                vm.$store.dispatch("toastr", {
                  type: "error",
                  header: "Error!",
                  message: "Error While Unassigning Unit Info!"
                });
              }
              else if (response[0] && response[0][0] && response[0][0].ErrorMessage == "") {
                vm.$store.dispatch("toastr", {
                  type: "success",
                  header: "Success!",
                  message: "Unit has unassigned successfully!"
                });
              }
              vm.getReservationsList();
              vm.getReservationFolioSummary(vm.selectedReservation);
              vm.get_ReservationDetails_Summary(vm.selectedReservation);
            }
          }
        })
        event.stopPropagation();
      },
      saveRoomInfo() {
        let vm = this;
        let NumberOfAdults;
        let NumberOfChildren;
        let Persons;
        if (vm.reservationSummaryInfo.guestInfo.Persons != null || vm.reservationSummaryInfo.guestInfo.Persons != "") {
          Persons = vm.reservationSummaryInfo.guestInfo.Persons;
          NumberOfAdults = null;
          NumberOfChildren = null;
        }
        else if (vm.reservationSummaryInfo.guestInfo.Persons == null || vm.reservationSummaryInfo.guestInfo.Persons == "") {
          Persons = null;
          NumberOfAdults = vm.reservationSummaryInfo.guestInfo.NumberOfAdults;
          NumberOfChildren = vm.reservationSummaryInfo.guestInfo.NumberOfChildren;
        }
        vm.$store.dispatch("dataRequestHandler", {
          key: "SaveReservation_AssignRooms",
          params: {
            ModuleAction: "SaveReservation_AssignRooms",
            PropertyId: vm.reservationSummaryInfo.guestInfo.PropertyId,
            StatusId: vm.Reservation_Status.StatusId,
            NumberOfAdults: NumberOfAdults,
            NumberOfChildren: NumberOfChildren,
            ReservationId: vm.reservationSummaryInfo.guestInfo.ReservationId,
            UnitId: vm.reservationSummaryInfo.guestInfo.UnitId,
            StartDate: vm.reservationSummaryInfo.guestInfo.arrivalDate,
            EndDate: vm.reservationSummaryInfo.guestInfo.departureDate,
            Ext_ReservationId: null,
            Persons: Persons,
            SourceId: 1,
            StayInfoId: -1,
            ReservationMode: 1

          },
          callback: function (err, response) {
            if (err) {
              console.log("err in saveRoomInfo", err);
              vm.$store.dispatch("toastr", {
                type: "error",
                header: "Error!",
                message: "Error While Saving Room Info!"
              });
              return;
            }
            if (response) {
              console.log("response in SaveReservation_AssignRooms", response);
              if (response[5] && response[5][0]) {
                vm.$set(vm.reservationSummaryInfo.guestInfo, 'reservationMode', response[5][0].ReservationMode);
              }
              vm.get_ReservationDetails_Summary({ ReservationId: response[6][0].reservationID });
              vm.getReservationFolioSummary({ ReservationId: vm.reservationSummaryInfo.guestInfo.ReservationId });
              vm.notesDetailById.noteTypeId = 2;
              vm.notesDetailById.noteSubject = "Turnover cleaning";
              vm.notesDetailById.isActionReqd = 1;
              vm.notesDetailById.noteStatusId = 0;
              vm.notesDetailById.taskTypeId = 1;
              vm.notesDetailById.isAutoGenerated = 1;
              vm.notesDetailById.dateOrTimeDue = moment(vm.reservationSummaryInfo.guestInfo.departureDate).format("YYYY-MM-DD");
              vm.saveNotesDetails(-99, 1);

            }
          }
        })

      },
      saveNotesDetails(noteId, sendEmail) {

        let vm = this;
        console.log("noteId", noteId);
        vm.displayNotesDetail = "NotesDetail";
        vm.showNotesDetailButton = false;
        let noteIdToSend;
        if (!noteId || noteId == -99) {
          noteIdToSend = -1;
        } else {
          noteIdToSend = noteId;
        }
        let DateOrTimeDue;
        if (
          vm.notesDetailById.dateOrTimeDue === null ||
          vm.notesDetailById.dateOrTimeDue === "" ||
          vm.notesDetailById.dateOrTimeDue === undefined
        ) {
          DateOrTimeDue = null;
        } else {
          DateOrTimeDue = moment(vm.notesDetailById.dateOrTimeDue).format(
            "YYYY-MM-DD"
          );
        }
        if (
          vm.notesDetailById.isActionReqd === null ||
          vm.notesDetailById.isActionReqd === undefined ||
          vm.notesDetailById.isActionReqd === ""
        ) {
          vm.notesDetailById.isActionReqd = 0;
        }
        if (vm.notesDetailById.isAutoGenerated != 1) {
          vm.notesDetailById.isAutoGenerated = 0;
        }
        vm.$store.dispatch("dataRequestHandler", {
          key: "SaveNotesDetails",
          params: {
            ModuleAction: "SaveNotesDetails",
            ReservationId: vm.reservationSummaryInfo.guestInfo.ReservationId,
            NoteId: noteIdToSend,
            NoteTypeId: vm.notesDetailById.noteTypeId,
            noteStatusId: vm.notesDetailById.noteStatusId,
            taskTypeId: vm.notesDetailById.taskTypeId,
            isAutoGenerated: vm.notesDetailById.isAutoGenerated,
            NoteSubject: vm.notesDetailById.noteSubject,
            NoteDetails: vm.notesDetailById.noteDetails,
            IsActionReqd: vm.notesDetailById.isActionReqd,
            DateOrTimeDue: DateOrTimeDue,
            reCalculateFolio: 1,
            sendEmail: sendEmail
          },
          callback: function (err, response) {
            if (err) {
              console.log("error", err);
              vm.$store.dispatch("toastr", {
                type: "error",
                header: "Error",
                message: "Error While Saving Notes!"
              });
              return;
            }
            if (response) {
              console.log("response in saveNotesDetails", response);
              vm.getReservationFolioSummary({ ReservationId: vm.reservationSummaryInfo.guestInfo.ReservationId });
              if (response[1] && response[1][0] && response[1][0].ErrorMessage) {
                vm.$store.dispatch("toastr", {
                  type: "error",
                  header: "Error",
                  message: "Error While Saving Notes!"
                });
              }
              else if ((noteId && noteId != -99) && !response[1][0].ErrorMessage) {
                vm.$store.dispatch("toastr", {
                  type: "success",
                  header: "Success!",
                  message:
                    "Note Saved Successfully"
                });

              }
            }
          }
        });
      },
      formatDateBooked(date) {
        let vm = this;
        let diff = moment(date).diff(vm.today, 'months');
        // if (Math.abs(diff) >= 6) {
        return moment(date, "YYYY-MM-DD").format("DD MMM ");
        // }
        // else {
        //   return moment(date, "YYYY-MM-DD").format("DD MMM");
        // }

      },
      formatYear(date) {
        let vm = this;
        let diff = moment(date).diff(vm.today, 'months');
        return moment(date, "YYYY-MM-DD").format("YYYY");
      },


      applyFilter() {

        let vm = this;
        vm.items = [];
        vm.filterObj.PageNumber = 1;
        vm.toggleFilterPanel = false;
        vm.showPropertyList= false,
        vm.showunitList= false,
        vm.showunitTypeList = false,
        vm.showsourceList= false,
        vm.showunitNameList=false,
        vm.showstatusList= false,
        vm.showtagList= false,
        vm.viewSaveObject.propertyId = vm.filterObj.PropertyId;
        vm.viewSaveObject.UnitClassId = vm.filterObj.UnitClassId;
        vm.viewSaveObject.resSourceId = vm.filterObj.resSourceId;
        vm.viewSaveObject.tags.splice(0, vm.viewSaveObject.tags.length, ...vm.filterObj.TagsList);
        vm.viewSaveObject.properties.splice(0, vm.viewSaveObject.properties.length, ...vm.filterObj.Properties);
        vm.viewSaveObject.UnitTypes.splice(0, vm.viewSaveObject.UnitTypes.length, ...vm.filterObj.UnitTypes);
        vm.viewSaveObject.UnitClasses.splice(0, vm.viewSaveObject.UnitClasses.length, ...vm.filterObj.UnitClasses);
        vm.viewSaveObject.sources.splice(0, vm.viewSaveObject.sources.length, ...vm.filterObj.Sources);
        vm.viewSaveObject.units.splice(0, vm.viewSaveObject.units.length, ...vm.filterObj.Units);
        vm.viewSaveObject.statusList.splice(0, vm.viewSaveObject.statusList.length, ...vm.filterObj.StatusList);

        for (let col of vm.filterObj.Columns) {
          if(col.colunmName != "StayDate" && col.colunmName != "DateBooked" && col.colunmName != "CheckinCheckoutDate"){
          col.value = null
          }
        }
        
        vm.viewSaveObject.columns = {};
        vm.viewSaveObject.columns = JSON.parse(JSON.stringify(vm.filterObj.Columns));

        // vm.viewSaveObject.columns.splice(0, vm.viewSaveObject.columns.length, ...vm.filterObj.Columns);
        if (vm.viewSaveObject.tags.length > 1 || vm.viewSaveObject.properties.length > 1 || vm.viewSaveObject.UnitClasses.length > 1 || vm.viewSaveObject.sources.length > 1 || vm.viewSaveObject.units.length > 1 || vm.viewSaveObject.statusList.length > 1 || vm.filterObj.SearchText.length > 1) {
          vm.viewAttrsChanged = true;
        }
        else if (((vm.viewSaveObject.tags.length == 1) && (vm.viewSaveObject.properties.length == 1 || vm.viewSaveObject.UnitClasses.length == 1 || vm.viewSaveObject.UnitTypes.length || vm.viewSaveObject.sources.length == 1 || vm.viewSaveObject.units.length == 1 || vm.viewSaveObject.statusList.length == 1 || vm.filterObj.SearchText.length == 1)) ||
          ((vm.viewSaveObject.properties.length == 1) && (vm.viewSaveObject.tags.length == 1 || vm.viewSaveObject.UnitClasses.length == 1 || vm.viewSaveObject.UnitTypes.length|| vm.viewSaveObject.sources.length == 1 || vm.viewSaveObject.units.length == 1 || vm.viewSaveObject.statusList.length == 1 || vm.filterObj.SearchText.length == 1)) ||
          ((vm.viewSaveObject.UnitClasses.length == 1) && (vm.viewSaveObject.tags.length == 1 || vm.viewSaveObject.properties.length == 1 || vm.viewSaveObject.UnitTypes.length|| vm.viewSaveObject.sources.length == 1 || vm.viewSaveObject.units.length == 1 || vm.viewSaveObject.statusList.length == 1 || vm.filterObj.SearchText.length == 1)) ||
          ((vm.viewSaveObject.sources.length == 1) && (vm.viewSaveObject.tags.length == 1 || vm.viewSaveObject.properties.length == 1 || vm.viewSaveObject.UnitClasses.length == 1 || vm.viewSaveObject.UnitTypes.length || vm.viewSaveObject.units.length == 1 || vm.viewSaveObject.statusList.length == 1 || vm.filterObj.SearchText.length == 1)) ||
          ((vm.viewSaveObject.units.length == 1) && (vm.viewSaveObject.tags.length == 1 || vm.viewSaveObject.properties.length == 1 || vm.viewSaveObject.UnitClasses.length == 1 || vm.viewSaveObject.UnitTypes.length|| vm.viewSaveObject.sources.length == 1 || vm.viewSaveObject.statusList.length == 1 || vm.filterObj.SearchText.length == 1)) ||
          ((vm.viewSaveObject.UnitTypes.length == 1) && (vm.viewSaveObject.tags.length == 1 || vm.viewSaveObject.properties.length == 1 || vm.viewSaveObject.UnitClasses.length == 1 || vm.viewSaveObject.sources.length == 1 || vm.viewSaveObject.statusList.length == 1 || vm.viewSaveObject.units.length == 1 || vm.filterObj.SearchText.length == 1)) ||
          ((vm.viewSaveObject.statusList.length == 1) && (vm.viewSaveObject.tags.length == 1 || vm.viewSaveObject.properties.length == 1 || vm.viewSaveObject.UnitClasses.length == 1 || vm.viewSaveObject.UnitTypes.length || vm.viewSaveObject.sources.length == 1 || vm.viewSaveObject.units.length == 1 || vm.filterObj.SearchText.length == 1))) {
          vm.viewAttrsChanged = true;
        }
        else {
          vm.viewAttrsChanged = false;
        }
        if (vm.viewSaveObject.columns.length >= 1) {
          let result = vm.viewSaveObject.columns.filter(col => (col.value != null || col.rangeVal != null));

          let result2 = vm.viewSaveObject.columns.filter(col => col.arrText.length > 0);
          vm.filterObj.Columns = result.concat(result2);

          console.log("result", result)
          console.log("result2", result2)
          if (result.length > 1 || (result.length == 0 && result2.length > 1) || (result2.length > 0 && result.length == 1)) {
            vm.viewAttrsChanged = true;
          }
          for (var column = 0; vm.viewSaveObject.columns.length > column; column++) {

            if (vm.viewSaveObject.columns[column]["arrText"].length > 1) {
              vm.viewAttrsChanged = true;
            }
            else if (((vm.viewSaveObject.columns[column]["arrText"].length == 1) || (vm.viewSaveObject.columns[column]["arrText"].length == 0 && vm.viewSaveObject.columns[column].value != null)) && (vm.viewSaveObject.tags.length == 1 || vm.viewSaveObject.properties.length == 1 || vm.viewSaveObject.UnitClasses.length == 1 || vm.viewSaveObject.sources.length == 1 || vm.viewSaveObject.units.length == 1 || vm.viewSaveObject.statusList.length == 1 || vm.filterObj.SearchText.length == 1)) {
              vm.viewAttrsChanged = true;
            }

            else if (vm.viewSaveObject.columns[column]["arrText"].length == 0 && vm.viewSaveObject.columns[column].value == null) {

            }
          }

        }
        vm.viewObjectChanged = true;
        vm.getReservationsList();

      },
      reservationsView(viewObj) {
        let vm = this;
        vm.items = [];

        vm.filterObj.PageNumber = 1;

        vm.filterObj.ViewListId = viewObj.ViewId ? viewObj.ViewId : viewObj.ViewListId;
        if (viewObj.ViewListId) {
          for (var i in vm.viewList) {
            if (vm.filterObj.ViewListId == vm.viewList[i].ViewListId) {
              vm.isGreyOut = true;
              vm.viewList[i].isSortLoading = true;
            }
          }
        }
        else if (viewObj.ViewId) {
          for (var i in vm.customViewList) {
            if (vm.filterObj.ViewListId == vm.customViewList[i].ViewId) {
              vm.isGreyOut = true;
              vm.customViewList[i].isSortLoading = true;
            }
          }
        }
        vm.selectedViewObj = viewObj;
        vm.getReservationsList();
      },
      descSort(sortBy, sortOrder) {
        let vm = this;
        vm.items = [];
        vm.filterObj.SortBy = sortBy;
        vm.filterObj.SortOrder = sortOrder;
        vm.getReservationsList();
      },
      ascSort(sortBy, sortOrder) {
        let vm = this;
        vm.items = [];
        vm.filterObj.PageNumber = 1;
        if (sortOrder == '') {
          sortOrder = 'desc'
        }
        console.log("sortBy", sortBy);
        vm.filterObj.SortBy = sortBy;
        vm.filterObj.SortOrder = sortOrder;
        vm.linearProgress = true;
        vm.isGreyOut = true;
        vm.viewAttrsChanged = false;
        for (var i in vm.headerColumnList) {
          vm.headerColumnList[i].isAscOrDesc = null;
          if (vm.headerColumnList[i].ColumnName !== "Actions") {
            var obj = vm.headerColumnList[i];
            console.log("obj", obj)
            for (var j in obj.sortLabels) {
              vm.headerColumnList[i].sortLabels[j].isSortAscOrDesc = '';
              if (sortBy.toString() === obj.sortLabels[j].ColumnName) {
                console.log("obj.ColumnName", obj.sortLabels[j].ColumnName);
                vm.headerColumnList[i].sortLabels[j].isSortLoading = true;
                vm.headerColumnList[i].sortLabels[j].isActive = sortBy.toString();
                vm.headerColumnList[i].isAscOrDesc = sortOrder.toString();
                if (sortOrder.toString() === 'desc') {
                  console.log("sortOrderToSend === 'desc'")
                  vm.headerColumnList[i].sortLabels[j].SortOder = 'asc';
                  vm.headerColumnList[i].sortLabels[j].isSortAscOrDesc = 'desc';
                }
                if (sortOrder.toString() === 'asc') {
                  console.log("sortOrderToSend === 'asc'")
                  vm.headerColumnList[i].sortLabels[j].SortOder = 'desc';
                  vm.headerColumnList[i].sortLabels[j].isSortAscOrDesc = 'asc';
                }
              }
            }
          }
        }
        vm.getReservationsList();
      },
      scrollRight: function () {
        var container = this.$el.querySelector("#tagScrollSection");
        var cnt = this.scrllCount++;
        container.scrollLeft = cnt;
        console.log("scroll counter before" + cnt);
        this.scrllCount = this.scrllCount + 50;
        console.log("scroll counter after" + cnt);
        this.scrollLeft = cnt;


      },
      scrollLeft: function () {

        var container = this.$el.querySelector(".scrollingTags");
        console.log("Inner width -" + container.clientWidth);
        if (this.scrllCount == -1) {
          var container = this.$el.querySelector("#tagScrollSection");
          container.scrollLeft = 0;
          console.log("If");
        } else {
          var container = this.$el.querySelector("#tagScrollSection");
          var cnt2 = this.scrllCount--;
          container.scrollLeft = cnt2;
          console.log("scroll counter before" + cnt2);
          this.scrllCount = this.scrllCount - 50;
          console.log("scroll counter after" + cnt2);
        }
      },
      getReservationsList: function () {
        let vm = this;

        console.log("today", vm.today)
        console.log("vm.filterobj", vm.filterObj)
        console.log("in reservations list view:", vm.filterObj.PropertyId, vm.filterObj.UnitClassId, vm.filterObj.ViewListId);



        if (vm.items.length == 0) {
          vm.loading = true;
        }
        else if (vm.items.length > 0) {
          vm.loading = false;
        }
        vm.$store.dispatch("dataRequestHandler", {
          key: "GetReservationsList",
          params: vm.filterObj,
          callback: function (err, response) {
            if (err) {
              console.log("err in GetReservationsList", err);
              return
            }

            var itemsWrap = $("#tagScrollSection").width();
            var tagBtnGrp = $(".tagBtnGrp").width();
            var calcWidth = itemsWrap + 300;
            if (calcWidth >= tagBtnGrp) {
              vm.scrlBtns = true;
            }
            else {
              vm.scrlBtns = false;
            }

            if (response) {
              // vm.reservationList.splice(0, vm.reservationList.length, ...response.reservationList);

              console.log("responseresponseresponse", response);
              vm.totalLength = response.customViewObj.TotalReservations;
              // console.log("vm.totalLength", vm.totalLength);   
              
              
              if (vm.filterObj.PageNumber === 1) {

                vm.items.splice(0, vm.items.length, ...response.reservationList);

              }
              else if (vm.filterObj.PageNumber > 1) {
                vm.items.splice(vm.items.length, 0, ...response.reservationList);
                // vm.items.splice(0, vm.items.length, ...response.reservationList);
              }
              // vm.viewSaveObject.statusList = [];
              // vm.viewSaveObject.columns = [];
              // vm.filterObj.StatusList = [];
              // vm.filterObj.Columns = [];
              // for (var x in response.filterViews[0]) {
              //   if (response.filterViews[0][x].Filtercolumn == "Status") {
              //     vm.viewSaveObject.statusList.push({ StatusName: response.filterViews[0][x].FilterValues, StatusId: response.filterViews[0][x].StatusId });
              //     console.log("vm.viewSaveObject.statusList", vm.viewSaveObject.statusList);
              //   }
              //   if ( response.filterViews[0][x].Filtercolumn && response.filterViews[0][x].Filtercolumn == "Stay Date(s)") {
              //     let dates = response.filterViews[0][x].FilterValues.split('-');
              //     vm.viewSaveObject.columns.push({ value: dates[0], rangeVal: dates[1], label: "Stay Date(s)",type:"date",ColumnName:"StayDate",arrText:[] });

              //   }

              // }

              // for (var y in response.filterViews[0]) {

              //   if (response.filterViews[0][y].Filtercolumn == "Status") {
              //     vm.filterObj.StatusList.push({ StatusName: response.filterViews[0][y].FilterValues, StatusId: response.filterViews[0][y].StatusId });

              //   }

              //   if ( response.filterViews[0][y].Filtercolumn && response.filterViews[0][y].Filtercolumn == "Stay Date(s)") {
              //     let dates = response.filterViews[0][y].FilterValues.split('-');
              //     vm.filterObj.Columns.push({ value: dates[0], rangeVal: dates[1], label: "Stay Date(s)",type:"date",ColumnName:"StayDate",arrText:[]});
              //   }

              // }




              // console.log(" vm.ViewFilterObjects", vm.ViewFilterObjects);


              console.log("response in reservation list", response);
              vm.selectedViewObj = response.customViewObj;
              // vm.filterObj = response.filtersView;
              //Setting filter which are saved with View             
              if (response.customViewObj) {
                vm.filterObj.PropertyId = response.customViewObj.PropertyId;
                vm.filterObj.UnitClassId = response.customViewObj.UnitClassId;
                vm.filterObj.resSourceId = response.customViewObj.resSourceId;
                vm.filterObj.SortBy = vm.filterObj.SortBy ? vm.filterObj.SortBy : response.customViewObj.SortBy;
                vm.filterObj.SortOrder = vm.filterObj.SortOrder ? vm.filterObj.SortOrder : response.customViewObj.SortOrder;
              }
              // custom views columns code
              // if (response.customViewColumns.length > 0) {
              //   Object.keys(vm.headerColumnList).forEach(function (key) {
              //     let colIndex = response.customViewColumns.findIndex((colObj) => {
              //       vm.headerColumnList[key]["IsChecked"] = true;
              //       return colObj.ColumnName === vm.headerColumnList[key]["ColumnName"];
              //     })
              //     if (colIndex == -1)
              //       vm.headerColumnList[key]["IsChecked"] = false;
              //   })
              // }
              // else {
              //   Object.keys(vm.headerColumnList).forEach(function (key) {
              //     if (vm.headerColumnList[key]["IsChecked"])
              //       vm.headerColumnList[key]["IsChecked"] = true;
              //   })
              // }
              vm.loading = false;
              for (var i in vm.headerColumnList) {
                if (vm.headerColumnList[i].ColumnName !== "Actions") {
                  var obj = vm.headerColumnList[i];
                  for (var j in obj.sortLabels) {
                    if (vm.filterObj.SortBy === obj.sortLabels[j].ColumnName.toString()) {
                      console.log("obj.ColumnName", obj.sortLabels[j].ColumnName);
                      vm.headerColumnList[i].sortLabels[j].isSortLoading = false;
                      vm.headerColumnList[i].sortLabels[j].isActive = "";
                      vm.isGreyOut = false;
                      vm.linearProgress = false;
                      $('ul.dropdown-menu').removeClass('show').addClass('hide');
                      // }
                    }
                  }
                }
              }
              if(response.isHostModeObj && response.isHostModeObj.length){
                vm.isHostModeObj = response.isHostModeObj;
                console.log("headerColumnList.units", vm.headerColumnList.Unit)
                if(response.isHostModeObj[0].IsHostMode == false){
                  vm.headerColumnList.Unit.sortLabels.UnitClassName.ColumnName = "UnitTypeName";
                  vm.headerColumnList.Unit.sortLabels.UnitClassName.Label = "Unit Type Name";
                }
                else{
                  vm.headerColumnList.Unit.sortLabels.UnitClassName.ColumnName = "UnitClassName";
                  vm.headerColumnList.Unit.sortLabels.UnitClassName.Label = "Unit Class Name";
                }
              }
              if (response.customViewObj && response.customViewObj.EntityId && (response.customViewObj.EntityId !== null || response.customViewObj.EntityId !== undefined)) {

                for (var i in vm.customViewList) {
                  if (vm.filterObj.ViewListId == vm.customViewList[i].ViewId) {
                    vm.isGreyOut = false;
                    vm.customViewList[i].isSortLoading = false
                  }
                }
              }
              for (var i in vm.viewList) {
                if (vm.filterObj.ViewListId == vm.viewList[i].ViewListId) {
                  vm.isGreyOut = false;
                  vm.viewList[i].isSortLoading = false
                }
              }
              $('ul.dropdown-menu').removeClass('show').addClass('hide');
              if (vm.filterObj.ViewListId == "-1" && vm.filterObj.PageNumber == 1) {
                vm.$store.dispatch("toastr", {
                  type: "success",
                  header: "Success!",
                  message: "Rendered All Reservations Successfully!"
                });
              }

              else if (vm.filterObj.ViewListId == "-2" && vm.filterObj.PageNumber == 1) {
                vm.$store.dispatch("toastr", {
                  type: "success",
                  header: "Success!",
                  message: "Rendered Currently In-House Reservations!"
                });
              }

              else if (vm.filterObj.ViewListId == "-3" && vm.filterObj.PageNumber == 1) {
                vm.$store.dispatch("toastr", {
                  type: "success",
                  header: "Success!",
                  message: "Rendered Reservations Arriving Today!"
                });
              }


              else if (vm.filterObj.ViewListId == "-4" && vm.filterObj.PageNumber == 1) {
                vm.$store.dispatch("toastr", {
                  type: "success",
                  header: "Success!",
                  message: "Rendered Reservations Departing Today!"
                });
              }


              else if (vm.filterObj.ViewListId == "-5" && vm.filterObj.PageNumber == 1) {
                vm.$store.dispatch("toastr", {
                  type: "success",
                  header: "Success!",
                  message: "Rendered Upcoming Reservations!"
                });
              }

              else if (vm.filterObj.ViewListId == "-6" && vm.filterObj.PageNumber == 1) {
                vm.$store.dispatch("toastr", {
                  type: "success",
                  header: "Success!",
                  message: "Rendered Todays's Reservations!"
                });
              }
            }
          }
        })
        // vm.scrollEvent();
      },

      // changeStatus(status, ReservationId) {
      //   console.log("changeStatus", ReservationId);
      //   let vm = this;
      //   // vm.items = [];



      //   vm.$store.dispatch("dataRequestHandler", {
      //     key: "UpdateReservationStatus",
      //     params: {
      //       ReservationId: ReservationId,
      //       StatusId: status,
      //       IsFromRU: 0,
      //       userdate: moment().format("YYYY-MM-DD HH:mm:ss")
      //     },
      //     callback: function (err, response) {
      //       if (err) {
      //         console.log("err in UpdateReservationStatus", err);
      //         return
      //       }
      //       if (response) {
      //         console.log("result in UpdateReservationStatus", response);
      //         vm.getReservationsList();
      //         vm.reservationSummaryInfo.statusList = response[1];
      //         console.log("vm.reservationSummaryInfo.statusList", vm.reservationSummaryInfo.statusList);
      //         vm.$store.dispatch("toastr", {
      //           type: "success",
      //           header: "Success!",
      //           message: response[0][0].GuestReservationMessage
      //         });
      //       }
      //     }
      //   })
      // },
      switchView() {
        if (this.listType === "list") {
          this.listType = "card";
        } else {
          this.listType = "list";
        }
      },
      changeStatus(resDetail) {
        console.log("changeStatus", resDetail.PropertyId);
        let vm = this;
        vm.resDetail = resDetail
        // vm.items = [];
        // vm.$store.state.bus.$emit('ActionsItems', resId);
        let currentdate = moment().format("YYYY-MM-DD")
        let endDate = moment(resDetail.originalEndDate).format("YYYY-MM-DD")
        if(resDetail.nextStatusId == 7 && moment(currentdate).isBefore(endDate)){
          vm.modalParams = {
              popupTitle: "void charges for future dates",
              popupMessage: "Would you like to update the remaining charges ?",
              //"Do you want to void charges for future dates",
              displayYesNoButtons: true,
              yesButtontext: "Yes",
              noButtonText: "No",
              yesButtonCallback: vm.checkinOrCheckout,
              noButtonCallback: vm.noCheckout
          };
          vm.isModalVisibleVal = true
        }else{
          vm.checkinOrCheckout(resDetail,0)
        }
      },
      noCheckout(){
        let vm = this;
        vm.isModalVisibleVal = false
        vm.checkinOrCheckout(vm.resDetail,0)
      },
      checkinOrCheckout(resDetail, voidfutureitems){
        let vm = this;
        if(vm.isModalVisibleVal){
          resDetail = vm.resDetail
          voidfutureitems = 1
          vm.isModalVisibleVal = false
        }
        vm.$store.dispatch("dataRequestHandler", {
          key: "UpdateReservationStatus",
          params: {
            ReservationId: resDetail.ReservationId,
            StatusId: resDetail.nextStatusId,
            IsFromRU: 0,
            userdate: moment().format("YYYY-MM-DD HH:mm:ss"),
            voidfutureitems: voidfutureitems
          },
          callback: function (err, response) {
            if (err) {
              console.log("err in UpdateReservationStatus", err);
              return
            }
            if (response) {

              vm.GetReservations_ById(resDetail.ReservationId);

              console.log("result in UpdateReservationStatus", response); 
            
              // for email sending start
              let EventID, SubEventId = null
                let  NotificationEventID = [], NotiSubEventId;
              if (resDetail.nextStatusId == 6) {
                EventID = [{eventId:4,subEventId: "14,16"},{eventId:5,subEventId: "18"}];
                  NotificationEventID = [{ notificationEventId :4, NotiSubEventId: 14 }] ; 
                // EventID = "3,4";
                // SubEventId = "5,7,9"
              }
              else if (resDetail.nextStatusId == 7) {
                EventID = [{eventId:5,subEventId: "17,19"}]
                NotificationEventID = [{ notificationEventId :5, NotiSubEventId: 17 }] ;  
                // EventID = 4;
                // SubEventId = "8,10"
              }
              else {
                EventID = null;
                SubEventId = null;
                NotificationEventID =  null;
                NotiSubEventId = null;

              }
              for(let event of EventID){
                vm.getLogIdsByEventID(event.eventId, event.subEventId, resDetail.ReservationId)
              }
               for(let notificationEvent of NotificationEventID){
                vm.save_Notification(notificationEvent.notificationEventId, notificationEvent.NotiSubEventId,vm.notificationAmount,resDetail.ReservationId,resDetail.PropertyId)
              }
              // for email sending end

              //vm.reservationSummaryInfo.statusList = response[1];
              // const newResObj = response[4][0];

              // vm.updateReservationObj(ReservationId, newResObj)

              // const cResObj = vm.reservationsListObj[ReservationId];

              // let resObj = vm.items[cResObj.resInd];

              // vm.items.splice(cResObj.resInd, 1, Object.assign({}, resObj, newResObj));

              vm.$store.dispatch("toastr", {
                type: "success",
                header: "Success!",
                message: response[0][0].GuestReservationMessage
              });
            }
          }
        })
      },
      getLogIdsByEventID(eventId, SubEventId, ReservationId) { // for email sending strat
        let vm = this;
        vm.$store.dispatch("dataRequestHandler", {
          key: "Get_LogDetails_ByEventId",
          params: {
            ReservationId: ReservationId,
            EventId: eventId,
            SubEventId: SubEventId
          },
          callback: function (err, response) {
            if (err) {
              return;
            }
            if (response) {
              console.log("response in getLogIdsByEventID", response);
            }
          }
        });
      },// for email sending end
            get_NotificationCount() {
      let vm = this;
      vm.$store.dispatch("dataRequestHandler", {
        key: "GetNotificationCountByUser",
        params: {},
        callback: function (err, response) {
          if (err) {
            return;
          }
          if (response) {
            vm.$store.commit('setNotificationCount', response.NotificationCount);
            console.log("response in get_NotificationCount", response);
          }
        },
      });
    },
   
       save_Notification(notificationEventId,notifSubEventId,amount,resId,propertyId) {
        let vm = this;
        var notificationToaster =null;
        var headerToaster =null; 
        vm.$store.dispatch("dataRequestHandler", {
          key: "SaveNotification",
          params: {
            ReservationId: resId,
            EventId: notificationEventId,
            PropertyId:propertyId,
            SubEventId: notifSubEventId,
            Amount:amount,

          },
          callback: function (err, response) {
            if (err) {
               vm.$store.dispatch("toastr", {
                  type: "error",
                  header: "Error!",
                  message: `Error While saving notification !`
                });
              return;
            }
            if (response[0] && response[0][0] && response[0][0].ErrorMessage != "") {
                  vm.$store.dispatch("toastr", {
                    type: "error",
                    header: "Error!",
                    message: response[0][0].ErrorMessage
                  });
            }
            if (response) {
              if (response[0] && response[0] &&recordset[0].Messagecontent)
              {
                 notificationToaster =response.recordset[0].Messagecontent;
                 headerToaster =response.recordset[0].EventDescription; 
              }
             
            if(notificationToaster !=null)
              {
               vm.$store.dispatch("toastr", {
                    type: "success",
                    header: ` ${headerToaster} `,
                   message: ` ${notificationToaster} `

                  });
              }
              
              console.log("response in save_Notification", response);
            vm.get_NotificationCount();
            }
          }
        });
      },

      GetReservations_ById(ReservationId) {
        let vm = this;
        vm.$store.dispatch("dataRequestHandler", {
          key: "GetReservations_ById",
          params: {
            ReservationId: ReservationId
          },
          callback: function (err, response) {
            if (err) {
              return;
            }
            if (response) {
              console.log("response in GetReservations_ById", response);
              if (response) {

                const newResObj = response[0][0];
                vm.updateReservationObj(ReservationId, newResObj);
              }
            }
          }
        });
      },
      updateReservationObj(resId, newResListItemObj) {
        console.log("this.items===>", this.reservationsListObj);
        const cResObj = this.reservationsListObj[resId];

        if (cResObj) {
          this.$set(this.items, cResObj.resInd, Object.assign({}, newResListItemObj))
          if (this.filterObj && this.filterObj.ViewListId && this.viewFilterMetadata[this.filterObj.ViewListId.toString()]) {
            if (this.viewFilterMetadata[this.filterObj.ViewListId.toString()].indexOf(newResListItemObj.StatusId) > -1) {
              if (this.filterObj.StatusList.length > 0) {
                for (let status of this.filterObj.StatusList) {
                  if (newResListItemObj.StatusName == status.StatusName) {
                    return true;
                  }
                }
              }
              else {
                return true;
              }
            }
          }
        }
        this.currResObj = {};
        this.items.splice(0);
        this.getReservationsList();
      },
      getPropertyMetaData: function () {
        let scope = this;
        console.log("scope.propertyId", scope.propertyId)
        this.$store.dispatch("dataRequestHandler", {
          key: "GetPropertyMetaData",
          params: {
            ModuleAction: "GetPropertyMetaData",
            PropertyId: scope.propertyId
          },
          callback: function (err, response) {
            if (response) {
              console.log("response in getPropertyMetaData", response)
              scope.propertyList = response.recordsets[0];
              scope.unitClassList = response.recordsets[1];
              scope.sourceList = response.recordsets[2];
            } else {
              console.log(err);
            }
          }
        });
      },
      viewReservationDetailById() {
        let vm = this;
        if (vm.reservationSummaryInfo.guestInfo.GuestProfileId === null) {
          vm.reservationSummaryInfo.guestInfo.GuestProfileId = -1
        }
        vm.$router.push("/newReservation/" + vm.reservationSummaryInfo.guestInfo.ReservationId);
      },
      GetActionButtons() {
      },
      viewConcessionDetails() { },
      /* Method to call node API to write data to excel sheet and download it */
      exportToExcelOrPdf(param, selectedfilename, toasterMessage) {
        let vm = this;
        console.log(vm.filterObj)
        if(!vm.totalLength || vm.totalLength <= 0){
          vm.$store.dispatch("toastr", {
            type: "info",
            header: "Information!",
            message: "No data to export"
          });
          return
        }
        // creating a dynamic form to send values to backend route. More DOM elements can be added here //
        var form = document.createElement("form");
        var filename = document.createElement("input");
        var modulename = document.createElement("input");
        var clientmode = document.createElement("input");
        var propertyId = document.createElement("input");
        var UnitClassId = document.createElement("input");
        var viewListId = document.createElement("input");
        var filterObj = document.createElement("input");
        var token = document.createElement("input");
        var Source = document.createElement("input");
        var SourceId = document.createElement("input");
        var userDate = document.createElement("input");
        var resSourceId = document.createElement("input");
        var format = document.createElement("input");
        var Columns = document.createElement("input");
        form.method = "POST";
        form.action = this.$store.state.reportHttpUrl + "/exportToExcel";
        filename.value = selectedfilename;
        filename.name = "filename";
        filename.hidden = true;
        form.appendChild(filename);
        form.appendChild
        modulename.value = selectedfilename == 'reservation' ? 'reservations' : selectedfilename;
        modulename.name = "modulename";
        modulename.hidden = true;
        clientmode.value = this.isHostModeObj[0].IsHostMode;
        clientmode.name = "clientmode";
        clientmode.hidden = true;
        propertyId.value = -99;
        propertyId.name = "PropertyId";
        propertyId.hidden = true;
        UnitClassId.value = -99;
        UnitClassId.name = "UnitClassId";
        UnitClassId.hidden = true;
        viewListId.value = vm.filterObj.ViewListId;
        viewListId.name = "ViewListId";
        viewListId.hidden = true;

        filterObj.value = JSON.stringify(vm.filterObj);
        filterObj.name = "filterObj";
        filterObj.hidden = true;

        userDate.value = moment().format("YYYY-MM-DD HH:mm:ss");
        userDate.name = "userDate";
        userDate.hidden = true;
        resSourceId.value = -99;
        resSourceId.name = "resSourceId";
        resSourceId.hidden = true;
        token.value = window.localStorage.getItem('rttoken');
        token.name = "token";
        token.hidden = true;
        Source.value = "Web";
        Source.name = "Source";
        Source.hidden = true;
        SourceId.value = window.location.hostname;
        SourceId.name = "SourceId";
        SourceId.hidden = true;
        format.value = param.toString();
        format.name = "format";
        format.hidden = true;
        Columns.name = "Columns";
        Columns.value = [];
        Columns.hidden = true;
        form.appendChild(modulename);
        form.appendChild(clientmode);
        form.appendChild(propertyId);
        form.appendChild(UnitClassId);
        form.appendChild(viewListId);
        form.appendChild(filterObj);
        form.appendChild(SourceId);
        form.appendChild(Source);
        form.appendChild(token);
        form.appendChild(resSourceId);
        form.appendChild(format);
        form.appendChild(Columns);
        form.appendChild(userDate);
        // document.body.appendChild(systemParams);
        document.body.appendChild(form);
        form.submit();
        vm.$store.dispatch("toastr", {
          type: "info",
          header: "Information!",
          message: toasterMessage//"Exporting Data To" + " " + selectedfilename
        });
      },
      /* Method to call node API to write data to excel sheet and download it */
      // exportToPdf(){
      // },
      saveView() {
        let vm = this;
        Object.keys(vm.headerColumnList).forEach(function (key) {
          if (vm.headerColumnList[key]["IsChecked"]) {
            vm.viewSaveObject.columns.push(vm.headerColumnList[key]);
          }
        })
        vm.isModalVisible = true;
      },
      updateView() {
        let vm = this;
        Object.keys(vm.headerColumnList).forEach(function (key) {
          if (vm.headerColumnList[key]["IsChecked"]) {
            vm.viewSaveObject.columns.push(vm.headerColumnList[key]);
          }
        })
        vm.viewSaveObject.isUpdate = true;
        vm.viewSaveObject.propertyId = vm.filterObj.PropertyId;
        vm.viewSaveObject.UnitClassId = vm.filterObj.UnitClassId;
        vm.viewSaveObject.resSourceId = vm.filterObj.resSourceId;
        vm.viewSaveObject.viewId = vm.selectedViewObj.ViewId;
        vm.viewSaveObject.name = vm.selectedViewObj.ViewName;
        vm.viewSaveObject.tags.splice(0, vm.viewSaveObject.tags.length, ...vm.filterObj.TagsList);
        vm.isModalVisible = true;
      },
      saveasView() {
        let vm = this;
        Object.keys(vm.headerColumnList).forEach(function (key) {
          if (vm.headerColumnList[key]["IsChecked"]) {
            vm.viewSaveObject.columns.push(vm.headerColumnList[key]);
          }
        })
        vm.viewSaveObject.isSaveAs = true;
        vm.viewSaveObject.propertyId = vm.filterObj.PropertyId;
        vm.viewSaveObject.UnitClassId = vm.filterObj.UnitClassId;
        vm.viewSaveObject.resSourceId = vm.filterObj.resSourceId;
        vm.viewSaveObject.viewId = vm.selectedViewObj.ViewId;
        vm.viewSaveObject.name = vm.selectedViewObj.ViewName;
        vm.viewSaveObject.tags.splice(0, vm.viewSaveObject.tags.length, ...vm.filterObj.TagsList);
        vm.isModalVisible = true;
      },
      closeModal() {
        this.viewSaveObject = {
          viewId: -1,
          name: null,
          isPublic: false,
          entityId: 4,
          propertyId: -99,
          UnitClassId: -99,
          resSourceId: -99,
          sortColumn: null,
          sortOrder: null,
          filters: [],
          tags: [],
          columns: []
        };
        this.isModalVisible = false;
        this.viewAttrsChanged = false;
        this.clearTags = true;
      },
      addTagToFilters(tagObj) {
        if (tagObj)
          this.filterObj.TagsList.push(tagObj);
      },
      deleteTagFromFilters(tagObj) {
        if (tagObj) {
          let index = this.filterObj.TagsList.findIndex((tag) => {
            return tag.TagId === tagObj.TagId;
          })
          if (index > -1) {
            this.filterObj.TagsList.splice(index, 1);
          }
        }
      },
      selectColumn(column, event) {
        let vm = this;
        vm.$store.state.bus.$emit("headerIsChecked", column);
        let isAnyColumnUnchecked = false;
        Object.keys(vm.headerColumnList).forEach(function (key) {
          if (!vm.headerColumnList[key]["IsChecked"] || !event.currentTarget.checked) {
            isAnyColumnUnchecked = true;
          }
        })
      },

      getReservationCustomViews() {
        let scope = this;
        this.$store.dispatch("dataRequestHandler", {
          key: "GetEntityCustomViewList",
          params: {
            EntityId: 4
          },
          callback: function (err, response) {
            if (response) {
              scope.customViewList = response.customViewList;
            } else {
              console.log(err);
            }
          }
        });
      },
      viewSaveCallback() {
        this.getReservationCustomViews();
      },
      addPropertyToFilter(propertyObj) {
        let vm = this;
        vm.filterObj.Properties.push(propertyObj);
        vm.filterSearchPropertyText = null;
        var index = vm.propertyList.indexOf(propertyObj);
        if (index > -1) {
          vm.propertyList.splice(index, 1);
        }
        vm.GetUnitClasssListBySearchText();
        // vm.GetUnitTypeListBySearchText();
        vm.selectedFilterColumn = null;
      },
      showpropertyFnc() {
        this.showPropertyList = true;
      },
      showUnitClassFnc() {
        this.showunitList = true;
      },
      showUnitTypeFnc() {
        this.showunitTypeList = true;
      },

      showsourceFnc() {
        this.showsourceList = true;
      },
      showunitNameFnc() {
        this.showunitNameList = true;
      },
      showstatusFnc() {
        this.showstatusList = true;
      },
      showtagFnc() {
        this.showtagList = true;
      },



      removePropertyFromFilter(propertyObj, event) {
        let vm = this;
        var index = vm.filterObj.Properties.indexOf(propertyObj);
        if (index > -1) {
          vm.filterObj.Properties.splice(index, 1);
        }
        vm.propertyList.push(propertyObj);
        if (event)
          event.stopPropagation();
      },
      addUnitClassToFilter(UnitClassObj) {
        let vm = this;
        vm.filterObj.UnitClasses.push(UnitClassObj);
        vm.filterSearchUnitClassText = null;
        var index = vm.unitClassList.indexOf(UnitClassObj);
        console.log("index of Amenities=>", index, UnitClassObj);
        if (index > -1) {
          vm.unitClassList.splice(index, 1);
          console.log("index", index)
          console.log("vm.unitClassList", vm.unitClassList)
        }
        vm.selectedFilterColumn = null;
      }, 
      removeUnitClassFromFilter(UnitClassObj, event) {
        let vm = this;
        var index = vm.filterObj.UnitClasses.indexOf(UnitClassObj);
        if (index > -1) {
          vm.filterObj.UnitClasses.splice(index, 1);
        }
        vm.unitClassList.push(UnitClassObj);
        if (event)
          event.stopPropagation();
      },
      addUnitTypeToFilter(UnitTypeObj) {
        console.log("UnitTypeObj",UnitTypeObj);
        let vm = this;
        vm.filterObj.UnitTypes.push(UnitTypeObj);
        vm.filterSearchUnitTypeText = null;
        var index = vm.unitTypeList.indexOf(UnitTypeObj);
        console.log("index of Amenities=>", index, UnitTypeObj);
        if (index > -1) {
          vm.unitTypeList.splice(index, 1);
          console.log("index", index)
          // console.log("vm.unitClassList", vm.unitClassList)
        }
        vm.selectedFilterColumn = null;
      },
      removeUnitTypeFromFilter(UnitTypeObj, event) {
        let vm = this;
        var index = vm.filterObj.UnitTypes.indexOf(UnitTypeObj);
        if (index > -1) {
          vm.filterObj.UnitTypes.splice(index, 1);
        }
        vm.unitTypeList.push(UnitTypeObj);
        if (event)
          event.stopPropagation();
      },
      addSourceToFilter(sourceObj) {
        let vm = this;
        vm.filterObj.Sources.push(sourceObj);
        vm.filterSearchSourceTypeText = null;
        var index = vm.sourceList.indexOf(sourceObj);
        console.log("index of Amenities=>", index, sourceObj);
        if (index > -1) {
          vm.sourceList.splice(index, 1);
          console.log("index", index)
          console.log("vm.unitClassList", vm.sourceList)
        }
        vm.selectedFilterColumn = null;
      },
      removeSourceFromFilter(sourceObj, event) {
        let vm = this;
        var index = vm.filterObj.Sources.indexOf(sourceObj);
        if (index > -1) {
          vm.filterObj.Sources.splice(index, 1);
        }
        vm.sourceList.push(sourceObj);
        if (event)
          event.stopPropagation();
      },
      addUnitToFilter(unitObj) {
        let vm = this;
        vm.filterObj.Units.push(unitObj);
        vm.filterSearchUnitNameText = null;
        var index = vm.unitList.indexOf(unitObj);

        if (index > -1) {
          vm.unitList.splice(index, 1);
        }
        vm.selectedFilterColumn = null;
      },
      addStatusToFilter(statusObj) {
        let vm = this;
        vm.filterObj.StatusList.push(statusObj);
        vm.filterSearchStatusText = null;
        var index = vm.statusList.indexOf(statusObj);

        if (index > -1) {
          vm.statusList.splice(index, 1);
        }
        vm.selectedFilterColumn = null;
      },
      removeUnitFromFilter(unitObj, event) {
        let vm = this;
        var index = vm.filterObj.Units.indexOf(unitObj);
        if (index > -1) {
          vm.filterObj.Units.splice(index, 1);
        }
        vm.unitList.push(unitObj);
        if (event)
          event.stopPropagation();
      },
      removeStatusFromFilter(statusObj, event) {
        let vm = this;
        var index = vm.filterObj.StatusList.indexOf(statusObj);
        if (index > -1) {
          vm.filterObj.StatusList.splice(index, 1);
        }
        vm.statusList.push(statusObj);
        if (event)
          event.stopPropagation();
      },
      getClientTags(searchText) {
        let vm = this;
        vm.$store.dispatch("dataRequestHandler",
          {
            key: "GetClientTagsBySearchText",
            params: {
              searchText: searchText
            },
            callback: function (err, response) {
              if (err) {
                return;
              }
              if (response) {
                // vm.tagsList.splice(0, vm.tagsList.length, ...response[0]);

                let List = response[0];
                for (var i = 0; i < vm.filterObj.TagsList.length; i++) {
                  console.log("vm.filterObj.TagsList[i].TagId", vm.filterObj.TagsList[i].TagId)
                  let index = List.findIndex(x => x.TagId == vm.filterObj.TagsList[i].TagId);
                  if (index > -1)
                    List.splice(index, 1);
                  console.log("index", index);
                }

                vm.tagsList.splice(0, vm.tagsList.length, ...List);
              }
              if (vm.tagsList.length)
                vm.showTagInFilter = true;
            }
          });
      },
      addTagToFilter(tagObj) {
        let vm = this;
        vm.filterObj.TagsList.push(tagObj);
        vm.showTagInFilter = false;
        vm.filterSearchTagText = null;
        var index = vm.tagsList.indexOf(tagObj);
        console.log("index of Amenities=>", index, tagObj);
        if (index > -1) {
          vm.tagsList.splice(index, 1);
          console.log("index", index)
          console.log("vm.unitClassList", vm.tagsList)
        }
        vm.selectedFilterColumn = null;
      },
      removeTagFromFilter(tagObj, event) {
        let vm = this;
        var index = vm.filterObj.TagsList.indexOf(tagObj);
        if (index > -1) {
          vm.filterObj.TagsList.splice(index, 1);
        }
        vm.tagsList.push(tagObj);
        if (event)
          event.stopPropagation();
      },
      showFilterByType(filterCol) {
        let vm = this;
        setTimeout(function () {
          vm.selectedFilterColumn = filterCol;
          if (filterCol == "property") {
            vm.getPropertiesBySearchText();
            // }
            $("#propertyDropDown").show();
            // setTimeout(function () {

            //   $("#propertyDropDown").show();
            // }, 10);
          }
          else if (filterCol == "UnitClass") {
            vm.GetUnitClasssListBySearchText();
            $("#UnitClassDropDown").show();
            // setTimeout(function () {

            //   $("#UnitClassDropDown").show();
            // }, 10);
          }
          else if (filterCol == "UnitType") {
            vm.GetUnitTypeListBySearchText();
            $("#UnitTypeDropDown").show();
            // setTimeout(function () {

            //   $("#UnitClassDropDown").show();
            // }, 10);
          }
          else if (filterCol == "source") {
            vm.getSourceListBySearchText();
            $("#sourceDropDown").show();
            // setTimeout(function () {

            //   $("#sourceDropDown").show();
            // }, 10);

          }
          else if (filterCol == "tag") {
            vm.getClientTags();
            $("#tagDropDown").show();
            // setTimeout(function () {

            //   $("#tagDropDown").show();
            // }, 10);
          }
          else if (filterCol == "unitName") {
            vm.getUnitNamesBySearchText();
            $("#unitNameDropDown").show();
            // setTimeout(function () {

            //   $("#unitNameDropDown").show();
            // }, 10);

          }
          else if (filterCol == "status") {
            vm.getStatusBySearchText();
            $("#statusDropDown").show();
            // setTimeout(function () {

            //   $("#statusDropDown").show();
            // }, 10);

          }
        }, 10);
      },
      closeAllSuggestions(evt) {
      },
      getPropertiesBySearchText(searchText) {
        let vm = this;
        vm.$store.dispatch("dataRequestHandler",
          {
            key: "GetPropertiesBySearchText",
            params: {
              searchText: searchText
            },
            callback: function (err, response) {
              if (err) {
                return;
              }
              if (response) {
                console.log("...response.propertyList", response.propertyList)

                let List = response.propertyList;
                for (var i = 0; i < vm.filterObj.Properties.length; i++) {
                  console.log("vm.filterObj.Properties[i].PropertyId", vm.filterObj.Properties[i].PropertyId)
                  let index = List.findIndex(x => x.PropertyId == vm.filterObj.Properties[i].PropertyId);
                  if (index > -1)
                    List.splice(index, 1);
                  console.log("index", index);
                }

                vm.propertyList.splice(0, vm.propertyList.length, ...List);
              }
            }
          });
      },
      GetUnitClasssListBySearchText(searchText) {
        let vm = this;
        let resultObj = vm.filterObj.Properties.map(obj => obj.PropertyId);
        console.log("resultObj", resultObj);
        vm.$store.dispatch("dataRequestHandler",
          {
            key: "GetUnitClasssListBySearchText",
            params: {
              searchText: searchText,
              PropertyId: resultObj.toString()
            },
            callback: function (err, response) {
              if (err) {
                return;
              }
              if (response) {
                console.log("response", response);

                let List = response.unitClassList;
                for (var i = 0; i < vm.filterObj.UnitClasses.length; i++) {
                  console.log("vm.filterObj.UnitClasses[i].UnitClassId", vm.filterObj.UnitClasses[i].UnitClassId)
                  let index = List.findIndex(x => x.UnitClassId == vm.filterObj.UnitClasses[i].UnitClassId);
                  if (index > -1)
                    List.splice(index, 1);
                  console.log("index", index);
                }

                vm.unitClassList.splice(0, vm.unitClassList.length, ...List);
              }
            }
          });
      },
      GetUnitTypeListBySearchText(searchText) {
        let vm = this;
        let resultObj = vm.filterObj.Properties.map(obj => obj.PropertyId);
        console.log("resultObj", resultObj);
        vm.$store.dispatch("dataRequestHandler",
          {
            key: "GetUnitTypeListBySearchText",
            params: {
              searchText: searchText,
              PropertyId: resultObj.toString(),
              FromSetup: false
            },
            callback: function (err, response) {
              if (err) {
                return;
              }
              if (response) {
                console.log("unitTypeListunitTypeList", response);

                let List = response.unitTypeList;
                // console.log("List============>",List);
                for (var i = 0; i < vm.filterObj.UnitTypes.length; i++) {
                  console.log("vm.filterObj.UnitTypes[i].UnitTypeId", vm.filterObj.UnitTypes[i].UnitTypeId)
                  let index = List.findIndex(x => x.UnitTypeId == vm.filterObj.UnitTypes[i].UnitTypeId);
                  if (index > -1)
                    List.splice(index, 1);
                  console.log("index", index);
                }

                vm.unitTypeList.splice(0, vm.unitTypeList.length, ...List);
              }
            }
          });
      },
      getSourceListBySearchText(searchText) {
        let vm = this;
        vm.$store.dispatch("dataRequestHandler",
          {
            key: "GetSourceListBySearchText",
            params: {
              searchText: searchText
            },
            callback: function (err, response) {
              if (err) {
                return;
              }
              if (response) {
                let List = response.sourceList;
                for (var i = 0; i < vm.filterObj.Sources.length; i++) {
                  console.log("vm.filterObj.Sources[i].sourceID", vm.filterObj.Sources[i].sourceID)
                  let index = List.findIndex(x => x.sourceID == vm.filterObj.Sources[i].sourceID);
                  if (index > -1)
                    List.splice(index, 1);
                  console.log("index", index);
                }

                vm.sourceList.splice(0, vm.sourceList.length, ...List);
              }
            }
          });
      },
      getUnitNamesBySearchText(searchText) {
        let vm = this;
        let resultObj = vm.filterObj.Properties.map(obj => obj.PropertyId);
        vm.$store.dispatch("dataRequestHandler",
          {
            key: "GetUnitListBySearchText",
            params: {
              searchText: searchText,
              PropertyId: resultObj.toString()
            },
            callback: function (err, response) {
              if (err) {
                return;
              }
              if (response) {
                let List = response.unitList;
                for (var i = 0; i < vm.filterObj.Units.length; i++) {
                  console.log("vm.filterObj.Units[i].UnitId", vm.filterObj.Units[i].UnitId)
                  let index = List.findIndex(x => x.UnitId == vm.filterObj.Units[i].UnitId);
                  if (index > -1)
                    List.splice(index, 1);
                  console.log("index", index);
                }

                vm.unitList.splice(0, vm.unitList.length, ...List);
              }
            }
          });
      },
      getStatusBySearchText(searchText) {
        let vm = this;
        vm.$store.dispatch("dataRequestHandler",
          {
            key: "GetResevationStatusListBySearchText",
            params: {
              searchText: searchText
            },
            callback: function (err, response) {
              if (err) {
                return;
              }
              if (response) {
                let List = response.statusList;
                for (var i = 0; i < vm.filterObj.StatusList.length; i++) {
                  console.log("vm.filterObj.StatusList[i].StatusId", vm.filterObj.StatusList[i].StatusId)
                  let index = List.findIndex(x => x.StatusId == vm.filterObj.StatusList[i].StatusId);
                  if (index > -1)
                    List.splice(index, 1);
                  console.log("index", index);
                }

                vm.statusList.splice(0, vm.statusList.length, ...List);
              }
            }
          });
      },
      closeFilter() {
        let vm = this;
        vm.toggleFilterPanel = false;
        vm.showPropertyList= false,
        vm.showunitList= false,
        vm.showunitTypeList=false
        vm.showsourceList= false,
        vm.showunitNameList=false,
        vm.showstatusList= false,
        vm.showtagList= false
        if (vm.filterObj.Columns.length >= 1) {
          let result = vm.filterObj.Columns.filter(col => col.value != null);

          let result2 = vm.filterObj.Columns.filter(col => col.arrText.length > 0);
          vm.filterObj.Columns = result.concat(result2);
        }
      },
      deleteSelectedPropertyFromFilter(index, propObj) {
        this.removePropertyFromFilter(propObj);
        this.viewSaveObject.properties.splice(index, 1);
        this.applyFilter();
      },
      deleteSelectedUnitClassFromFilter(index, UnitClassObj) {
        this.removeUnitClassFromFilter(UnitClassObj);
        this.viewSaveObject.UnitClasses.splice(index, 1);
        this.applyFilter();
      },
      deleteSelectedUnitTypeFromFilter(index,UnitTypeObj){
        this.removeUnitTypeFromFilter(UnitTypeObj);
        this.viewSaveObject.UnitTypes.splice(index, 1);
        this.applyFilter();
      },
      deleteSelectedSourceFromFilter(index, sourceObj) {
        this.removeSourceFromFilter(sourceObj);
        this.viewSaveObject.sources.splice(index, 1);
        this.applyFilter();
      },
      deleteUnAllocatedReservations(){
       this.filterObj.showUnAllocatedReservations = false;
       this.applyFilter();
      },
      deleteIncludeObsoleteInventory(){
        this.filterObj.includeObsoleteInventory = false;
        this.applyFilter();
      },
      deleteSearchText(searchTextIndex, searchText) {
        let vm = this;
        vm.filterObj.PageNumber = 1;
        vm.items = [];
        this.filterObj.SearchText.splice(searchTextIndex, 1);
        if (vm.filterObj.SearchText.length > 1) {
          vm.viewAttrsChanged = true;
        }
        else if (vm.filterObj.SearchText.length == 1 && (vm.viewSaveObject.tags.length > 1 || vm.viewSaveObject.properties.length > 1 || vm.viewSaveObject.UnitTypes.length > 1|| vm.viewSaveObject.UnitClasses.length > 1 || vm.viewSaveObject.sources.length > 1 || vm.viewSaveObject.units.length > 1 || vm.viewSaveObject.statusList.length > 1 || vm.filterObj.SearchText.length > 1 || vm.viewSaveObject.tags.length == 1 || vm.viewSaveObject.properties.length == 1 || vm.viewSaveObject.UnitTypes.length == 1 || vm.viewSaveObject.UnitClasses.length == 1 || vm.viewSaveObject.sources.length == 1 || vm.viewSaveObject.units.length == 1 || vm.viewSaveObject.statusList.length == 1 || vm.filterObj.SearchText.length == 1)) {
          vm.viewAttrsChanged = true;
        }
        else {
          vm.viewAttrsChanged = false;
        }

        vm.getReservationsList();
      },
      deleteSelectedTagFromFilter(index, tagObj) {
        this.removeTagFromFilter(tagObj);
        this.viewSaveObject.tags.splice(index, 1);
        this.applyFilter();
      },
      deleteSelectedUnitFromFilter(index, unitObj) {
        this.removeUnitFromFilter(unitObj);
        this.viewSaveObject.units.splice(index, 1);
        this.applyFilter();
      },
      deleteSelectedStatusFromFilter(index, statusObj) {
        this.removeStatusFromFilter(statusObj);
        this.viewSaveObject.statusList.splice(index, 1);
        this.applyFilter();
      },
      addColumnToFilters(colObj) {
        let index = this.filterObj.Columns.findIndex((currCol) => {
          return currCol.colunmName === colObj.ColumnName;
        })
        if (index === -1) {
          this.filterObj.Columns.push(JSON.parse(JSON.stringify(
            { colunmName: colObj.ColumnName, label: colObj.Label, value: null, arrText: [], rangeVal: null, type: colObj.Type }
          )));
        }
      },
      addSearcTextToColumn(filterCol, event) {
        if (event.key == "Enter") {
          if (filterCol.value != null) {
            filterCol.arrText.push(filterCol.value);
            filterCol.value = null;
          }
        }
      },
      removeSearchTextFromColumn(selectedText, filterCol) {
        let vm = this;	
        // console.log("filterCol", vm.filterObj.Columns)	
        // let index = vm.filterObj.Columns.findIndex((col) => {	
        //   return col.ColumnName == filterCol.ColumnName;	
        // });	
        vm.viewSaveObject = JSON.parse(JSON.stringify(vm.viewSaveObject));	
        // if (index > -1) {	
        //   vm.filterObj.Columns[index]["arrText"].splice(vm.filterObj.Columns[index]["arrText"].indexOf(selectedText), 1);	
        //   // console	
        //   // this.removeSearchTextFromColumn(text, viewColObj);	
        // }	

        if (filterCol.arrText.indexOf(selectedText) > -1) {
          filterCol.arrText.splice(filterCol.arrText.indexOf(selectedText), 1)
        }
        else if (filterCol.rangeVal || filterCol.value) {
          filterCol.value = null;
          filterCol.rangeVal = null;
        }
        //this.applyFilter();
      },
      removeSelectedColumnTextFromFilter(text, viewColObj) {
        let index = this.viewSaveObject.columns.findIndex((col) => {
          return col.ColumnName == viewColObj.ColumnName;
        });
        if (index > -1) {
          this.viewSaveObject.columns[index]["arrText"].splice(this.viewSaveObject.columns[index]["arrText"].indexOf(text), 1);
          this.removeSearchTextFromColumn(text, viewColObj);
        }
        this.filterColumnsDateRange.startDate = null,
        this.filterColumnsDateRange.endDate = null,
        this.applyFilter();
      },
      removeSelectedStayDatesFromFilter(filterObj) {
        //staydates
        filterObj.stayEndDate = null,
        filterObj.stayStartDate = null,
        this.stayDateRange.startDate = null,
        this.stayDateRange.endDate = null,
        this.applyFilter();
      },
      showReservationSummaryPanel(inst) {
        let vm = this;
        if (inst) {
          vm.currResObj = { ReservationId: inst.ReservationId };
          // vm.getHouseKeepinglist();
        }

        // vm.isSummaryLoading = true;
        // vm.reservationSummaryInfo = {};
        // vm.selectedReservation = inst;
        // console.log("inst", inst);
        // $(".reservationSummary").addClass("expand");
        // $(".clientList").removeClass("expand");
        // $("#notification").removeClass("expand");
        // $(".menuMaskRevSum").toggle();
        // $(".reservationSummary").removeClass("menuMaskRevSum");

        // vm.getReservationFolioSummary(inst);
        // vm.get_ReservationDetails_Summary(inst);
      },
      panelCallback(resObj) {
        let vm = this;
        // vm.items = [];
        // vm.filterObj.PageNumber = 1;
        // vm.getReservationsList();
        // vm.$store.state.bus.$emit("ResSummaryUpdate", resObj);
      },


      formatMoney(amount) {
        return this.$store.state.getFormattedAmount("$", amount);
      },
      onChangeStatus(status) {
        console.log("changeStatus", status.StatusId);
        let vm = this;
        vm.$store.dispatch("dataRequestHandler", {
          key: "UpdateReservationStatus",
          params: {
            // FunctionId: null,
            ReservationId: vm.reservationSummaryInfo.guestInfo.ReservationId,
            // Ext_ReservationId: null,
            StatusId: status.StatusId,
            IsFromRU: 0,
            userdate: moment().format("YYYY-MM-DD HH:mm:ss")
          },
          callback: function (err, response) {
            if (err) {
              console.log("err in UpdateReservationStatus", err);
              return
            }
            if (response) {
              console.log("result in UpdateReservationStatus", response);
              vm.getReservationsList();
              // vm.getReservationsList(-99, -99, 1, null, null, -99);
              vm.reservationSummaryInfo.statusList = response[1];

              if (response[1] && response[1][0] && response[1][0]["StatusId"]) {
                vm.reservationSummaryInfo.statusList = response[1];
              }
              else if (response[2] && response[2][0] && response[2][0]["StatusId"]) {
                vm.reservationSummaryInfo.statusList = response[2];
              }

              vm.$store.dispatch("toastr", {
                type: "success",
                header: "Success!",
                message: response[0][0].SuccessMessage
              });
              // vm.getFolioSummary();
              // vm.get_ReservationDetails_Summary({ ReservationId: vm.reservationSummaryInfo.guestInfo.ReservationId });

              if ((vm.previousReservationSummaryInfo.guestInfo.StatusId == "4" || vm.previousReservationSummaryInfo.guestInfo.StatusId == "10" || vm.previousReservationSummaryInfo.guestInfo.StatusId == "11") && vm.Reservation_Status.StatusId == "1") {
                vm.saveRoomInfo();
              }
              else {
                vm.getReservationFolioSummary({ ReservationId: vm.reservationSummaryInfo.guestInfo.ReservationId });
                vm.get_ReservationDetails_Summary({ ReservationId: vm.reservationSummaryInfo.guestInfo.ReservationId });
              }

            }
          }
        })
      },
      updateFilterStartDate(key, dateObj, objectPassedToParent) {
        objectPassedToParent.value = dateObj ? dateObj.format("DD MMM YYYY") : null;
      },
      updateFilterEndDate(key, dateObj, objectPassedToParent) {
        objectPassedToParent.rangeVal = dateObj ? dateObj.format("DD MMM YYYY") : null;
      },
      updateFilterStayStartDate(key, dateObj, objectPassedToParent) {
          this.filterObj.stayStartDate = dateObj ? dateObj.format("DD MMM YYYY") : null;
      },
      updateFilterStayEndDate(key, dateObj, objectPassedToParent) {
          this.filterObj.stayEndDate = dateObj ? dateObj.format("DD MMM YYYY") : null;
      },
      //update function for date-range-picker for stay dates
      updateStayDateValues(value) {
        this.filterObj.stayStartDate = moment(value.startDate).format('DD MMM YYYY')
        this.filterObj.stayEndDate = moment(value.endDate).format('DD MMM YYYY')
      },
      //update function for date-range-picker for booked dates and checkin/checkout dates
      updateFilterValues(objectPassedToParent){
          objectPassedToParent.value = moment(this.filterColumnsDateRange.startDate).format('DD MMM YYYY');
          objectPassedToParent.rangeVal = moment(this.filterColumnsDateRange.endDate).format('DD MMM YYYY');
      },
      clearAllFilters() {
        this.items = [];
        this.showPropertyList= false,
        this.showunitList= false,
        this.showunitTypeList = false,
        this.showsourceList= false,
        this.showunitNameList=false,
        this.showstatusList= false,
        this.showtagList= false
        this.scrlBtns = false;
        this.viewAttrsChanged = false;
        this.filterObj.ViewListId = this.filterObj.ViewListId
        this.filterObj = {
          PropertyId: -99,
          UnitClassId: -99,
          ViewListId: this.filterObj.ViewListId,
          SortBy: null,
          SortOrder: null,
          resSourceId: -99,
          TagsList: [],
          SearchText: [],
          Properties: [],
          UnitClasses: [],
          UnitTypes:[],
          Sources: [],
          Units: [],
          StatusList: [],
          Columns: [],
          PageNumber: 1,
          ItemsPerPage: 20,
          stayStartDate:null,
          stayEndDate:null
        };

        this.viewSaveObject = {
          viewId: -1,
          name: null,
          isPublic: false,
          entityId: 4,
          propertyId: -99,
          UnitClassId: -99,
          resSourceId: -99,
          sortColumn: null,
          sortOrder: null,
          filters: [],
          tags: [],
          columns: [],
          properties: [],
          UnitClasses: [],
          UnitTypes:[],
          sources: [],
          units: [],
          statusList: [],
          stayStartDate:null,
          stayEndDate:null
        },
        // after clearing the filters passing the date range as current day
        this.stayDateRange.startDate = new Date(); 
        this.stayDateRange.endDate = new Date();


        this.filterColumnsDateRange.startDate = null, 
        this.filterColumnsDateRange.endDate = null, 

          this.clearfilterForsearchText = false;

        this.getReservationsList();
      },
      openResSummaryPanel(inst) {
        let vm = this;
        if (inst) {
          vm.currResObj = { ReservationId: inst.ReservationId };
        }
      }
    },
    computed: {
      fncIsMenuReservations() {
        let vm = this;
        if (vm.$store.state.userEntitlementList.hasOwnProperty("fncMenuReservations")) {
          return vm.$store.state.userEntitlementList.hasOwnProperty("fncMenuReservations") ? vm.$store.state.userEntitlementList.fncMenuReservations : null;
        }
      },
      fncIsReservationSelect() {
        let vm = this;
        if (vm.$store.state.userEntitlementList.hasOwnProperty("fncReservationSelect")) {
          return vm.$store.state.userEntitlementList.hasOwnProperty("fncReservationSelect") ? vm.$store.state.userEntitlementList.fncReservationSelect : null;
        }
      },
      fncIsFolioView() {
        let vm = this;
        if (
          vm.$store.state.userEntitlementList.hasOwnProperty(
            "fncFolioView"
          )
        ) {
          return vm.$store.state.userEntitlementList.hasOwnProperty(
            "fncFolioView"
          )
            ? vm.$store.state.userEntitlementList.fncFolioView
            : null;
        }
      },
      fncIsReservationUpdate() {
        let vm = this;
        if (
          vm.$store.state.userEntitlementList.hasOwnProperty(
            "fncReservationUpdate"
          )
        ) {
          return vm.$store.state.userEntitlementList.hasOwnProperty(
            "fncReservationUpdate"
          )
            ? vm.$store.state.userEntitlementList.fncReservationUpdate
            : null;
        }
      },
      fncIsReservationReports() {
        let vm = this;
        if (
          vm.$store.state.userEntitlementList.hasOwnProperty(
            "fncReservationReports"
          )
        ) {
          return vm.$store.state.userEntitlementList.hasOwnProperty(
            "fncReservationReports"
          )
            ? vm.$store.state.userEntitlementList.fncReservationReports
            : null;
        }
      },
      reservationsListObj() {
        if (this.items && this.items.length > 0) {
          return this.items.reduce((acc, res, ind) => {
            acc[res.ReservationId] = { resObj: res, resInd: ind };
            console.log("this.items", acc)
            return acc;
          }, {})
        }
        return {};
      },

      showpDropdownList() {
        setTimeout(function () {
          this.selectedFilterColumn = !this.selectedFilterColumn
          $("#propertyDropDownlist").show();
        }, 10);
      },
      // uiFilteredItems() {
      //   if (this.items && this.items.length && this.filterObj && this.filterObj.ViewListId && this.viewFilterMetadata[this.filterObj.ViewListId.toString()]) {
      //     return this.items.filter(item => {
      //       return this.viewFilterMetadata[this.filterObj.ViewListId.toString()].indexOf(item.StatusId) > -1;
      //     })
      //   }
      //   return this.items;
      // }
      // fncIsHousekeepingTaskList() {
      //   let vm = this;
      //   if (vm.$store.state.userEntitlementList.fncHousekeepingTaskList.isAssigned === 1) {
      //     return false;
      //   }
      //   else{
      //     return true;
      //   }
      // },
    },
    watch: {
      loading(){
        this.$store.state.bus.$emit('reservationListLoading', this.loading);
      },
      items(newArr, oldArr) {
        console.log("items changed", oldArr, newArr);
      },
      viewSaveObject: {
        handler: function (after, before) {
          console.log(this.viewSaveObject)
          if (this.viewSaveObject.viewId === -1 && this.viewSaveObject.name === null &&
            this.viewSaveObject.isPublic === false && this.viewSaveObject.entityId === 4 &&
            this.viewSaveObject.propertyId === -99 && this.viewSaveObject.UnitClassId === -99 &&
            this.viewSaveObject.resSourceId === -99 && this.viewSaveObject.sortColumn === null &&
            this.viewSaveObject.sortOrder === null && this.viewSaveObject.filters.length === 0 &&
            this.viewSaveObject.tags.length === 0 && this.viewSaveObject.columns.length === 0 &&
            this.viewSaveObject.properties.length === 0 && this.viewSaveObject.UnitClasses.length === 0 &&
            this.viewSaveObject.sources.length === 0 && this.viewSaveObject.units.length === 0 &&
            this.viewSaveObject.statusList.length === 0
          ) {
            console.log("no change in view object");
            this.viewObjectChanged = false;
          }
          else {
            console.log("change in view object");
            this.viewObjectChanged = true;
          }
        },
        deep: true,
      },

      filterSearchTagText(newValue, oldValue) {
        let vm = this;
        // if (newValue)
        vm.getClientTags(newValue);
      },
      filterSearchPropertyText(newValue, oldValue) {
        this.getPropertiesBySearchText(newValue);
      },
      filterSearchUnitClassText(searchText) {
        // if (searchText) {
        this.GetUnitClasssListBySearchText(searchText);
        // }
      },
      filterSearchUnitTypeText(searchText) {
        // if (searchText) {
        this.GetUnitTypeListBySearchText(searchText);
        // }
      },
      filterSearchSourceTypeText(searchText) {
        // if (searchText) {
        this.getSourceListBySearchText(searchText);
        // }
      },
      filterSearchUnitNameText(searchText) {
        // if (searchText) {
        this.getUnitNamesBySearchText(searchText);
        // }
      },
      filterSearchStatusText(searchText) {
        // if (searchText) {
        this.getStatusBySearchText(searchText);
        // }
      },

      // updated(startIndex,endIndex){
      //   console.log("startIndex",startIndex);
      //   console.log("endIndex",endIndex);
      // },
    },
    mounted() {
      //this.getData();
      $(document).click(function (e) {
        console.log("clicked on doc");
        $("#propertyDropDownlist").show();
        // vm.showLedgerAccounts = false;
        // vm.showAmenitiesList =false;
      });
      this.$store.state.bus.$emit('reservationListLoading', this.loading);
      console.log("Reservations mount");
      let vm = this;
      vm.getReservationsList();
      vm.GetUserEntitlementsAndDefaultProperty();
      // vm.numbers();
      // vm.getHouseKeepingListForApp();
      // vm.getReservationCustomViews();
      vm.$store.state.bus.$on('Search-In-Reservation-List', function (searchText) {
        vm.filterObj.SearchText.push(searchText);
        vm.loading = true;
        if (vm.filterObj.SearchText.length > 1) {
          vm.viewAttrsChanged = true;
        }
        vm.items = [];
        console.log("from bus")
        vm.filterObj.PageNumber = 1;
        vm.getReservationsList();
      });
      $(this.$el).find("ul.dropdown-menu").click(function (e) {
        e.stopPropagation();
      });
      $(document).click(function (e) {
        $(".form-control.searchResultsAmenities").hide();
        vm.selectedFilterColumn = null;
      })
    },
    components: {
      modal,
      foliomodal

    },
    // components: {
    //   modal,
    // },

    init() {
      console.log("created Reservation list");
    },
    beforeDestroy() {
      //Detach bus events before destroy the component
      this.$store.state.bus.$off('Search-In-Reservation-List');
    }
  };

</script>
<!-- <style scoped>
  .scroller {
    height: 100%;
  }

  .user {
    height: 32%;
    padding: 0 12px;
    display: flex;
    align-items: center;
  }
</style> -->
<style>
  .infiniteBody {
    position: absolute;
    top: 20px;
    bottom: 20px;
    left: 100px;
    right: 20px;
  }
</style>