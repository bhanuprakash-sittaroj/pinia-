<template src="./notes.template.html"></template>
<script>
import moment from "moment-timezone";

export default {
  name: "notes",
  props: ["noteObj", "parentCallback"],
  data() {
    return {
      notesDetailById: {
        noteId: -1,
        noteTypeId: null,
        noteSubject: "",
        noteDetails: "",
        isActionReqd: false,
        dateOrTimeDue: null,
        taskTypeId: null
      },
      notesTypeDropdown: [],
      taskTypeDropdown: [],
      isSummaryLoading: false,
      reservationDetails: {
        resGuestName: null,
        resStatusName: null,
        resGuests: null,
        ColorCode: null,
        UnitClassName : null,
        propertyNickName: null,
        unitNickName: null,
        resCheckInDate: null,
        resCheckOutDate: null
      },
      reservationId: null,
      dueDate: "",
      unitId: "",
      isSelectedFromDropdown: false
    };
  },

  methods: {
    showNotesPanel(inst) {
      let vm = this;
      console.log("inst", inst);
      $(".notesPanel").removeClass("animated fadeOutRight");
      $(".notesPanel").addClass("expand animated fadeInRight");
      $(".clientList").removeClass("expand");
      $("#notification").removeClass("expand");
      $(".menuMaskNotesSum").toggle();
      $(".notesPanel").removeClass("menuMaskNotesSum");
      vm.isSummaryLoading = true;
      // vm.reservationDetails = inst.resObj.unitDetails;
      vm.reservationDetails.ColorCode= inst.resObj.unitDetails.ColorCode
      vm.reservationDetails.UnitClassName = inst.resObj.unitDetails.UnitClassName
      vm.reservationDetails.propertyNickName= inst.resObj.unitDetails.propertyNickName
      vm.reservationDetails.unitNickName= inst.resObj.unitDetails.unitNickName
      if (inst.resObj.unitDetails.UnitStatus == "Occupied") {
        if(inst.resObj.unitDetails.priorResStatusName == 'In-House'){
          vm.reservationId = inst.resObj.unitDetails.priorReservationId;
          vm.reservationDetails.resGuestName= inst.resObj.unitDetails.priorResGuestName
          vm.reservationDetails.resStatusName= inst.resObj.unitDetails.priorResStatusName
          vm.reservationDetails.resCheckInDate= inst.resObj.unitDetails.priorResCheckInDate
          vm.reservationDetails.resCheckOutDate= inst.resObj.unitDetails.priorResCheckOutDate
          vm.reservationDetails.resGuests= inst.resObj.unitDetails.priorResGuests
        }else if(inst.resObj.unitDetails.nextResStatusName == 'In-House'){
          vm.reservationId = inst.resObj.unitDetails.nextReservationId
          vm.reservationDetails.resGuestName= inst.resObj.unitDetails.nextResGuestName
          vm.reservationDetails.resStatusName= inst.resObj.unitDetails.nextResStatusName
          vm.reservationDetails.resCheckInDate= inst.resObj.unitDetails.nextResCheckInDate
          vm.reservationDetails.resCheckOutDate= inst.resObj.unitDetails.nextResCheckOutDate
          vm.reservationDetails.resGuests= inst.resObj.unitDetails.nextResGuests
        }
        
      }
      vm.unitId = inst.resObj.unitDetails.unitId;
      vm.dueDate = inst.selectedDate;
      vm.getNotesDetailsById(inst);
    },
    closeSummaryPannel() {
      $(".menuMaskNotesSum").hide();
      $(".notesPanel").removeClass("expand animated fadeInRight");
      $(".notesPanel").addClass("animated fadeOutRight");
      $(".notesPanel").removeClass("expand");
    },
    getNotesDetailsById(inst) {
      let vm = this;
      vm.$store.dispatch("dataRequestHandler", {
        key: "Get_NotesDetails",
        params: {
          ModuleAction: "Get_NotesDetails",
          ReservationId: inst.resObj.unitDetails.priorReservationId,
          NoteId: inst.noteId
        },
        callback: function(err, response) {
          if (err) {
            return;
          }
          if (response) {
            //console.log("response in Get_NotesDetails by id", response);
            vm.notesDetailById.noteId = -1;
            vm.notesTypeDropdown = response[1];
            vm.taskTypeDropdown = response[2];
            vm.notesDetailById.noteTypeId = 2;
            if(inst.resObj.unitDetails.UnitStatus == "Occupied"){
              vm.notesDetailById.noteSubject = "Interim Cleaning";
              vm.notesDetailById.taskTypeId = 2;
            }
            else{
              vm.notesDetailById.noteSubject = "Turnover Cleaning";
              vm.notesDetailById.taskTypeId = 1;
            }
            vm.notesDetailById.noteDetails = "";
            vm.notesDetailById.isActionReqd = true;
            vm.notesDetailById.dateOrTimeDue = vm.dueDate;
            //console.log("vm.notesTypeDropdown", vm.notesTypeDropdown)
          }
        }
      });

      //console.log("ID", Id);
    },
    updateDueDate(key, dateObj) {
      let vm = this;
      vm.notesDetailById.dateOrTimeDue = dateObj
        ? dateObj.format("DD MMM YYYY")
        : null;
    },
    saveNotesDetails(noteId, sendEmail) {
      //console.log("saveNotesDetails noteid", noteId);

      let vm = this;
      console.log("noteId", noteId);
      //console.log("notesDetailById", vm.notesDetailById);
      //   vm.displayNotesDetail = "NotesDetail";
      //   vm.showNotesDetailButton = false;
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
          ReservationId: vm.reservationId,
          NoteId: noteIdToSend,
          NoteTypeId: vm.notesDetailById.noteTypeId,
          noteStatusId: vm.notesDetailById.noteStatusId ? vm.notesDetailById.noteStatusId : 0,
          taskTypeId: vm.notesDetailById.taskTypeId,
          isAutoGenerated: vm.notesDetailById.isAutoGenerated,
          NoteSubject: vm.notesDetailById.noteSubject,
          NoteDetails: vm.notesDetailById.noteDetails,
          IsActionReqd: vm.notesDetailById.isActionReqd,
          DateOrTimeDue: DateOrTimeDue,
          reCalculateFolio: vm.tempSaveAssignRoomParams
            ? vm.tempSaveAssignRoomParams.reCalculateFolio
            : vm.notesDetailById.isActionReqd ? true : false,
          sendEmail: sendEmail,
          unitId: vm.unitId
        },
        callback: function(err, response) {
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
            if (response[1] && response[1][0] && response[1][0].ErrorMessage) {
              vm.$store.dispatch("toastr", {
                type: "error",
                header: "Error",
                message: "Error While creating Task!"
              });
            } else if (
              noteId &&
              noteId != -99 &&
              !response[1][0].ErrorMessage
            ) {
              vm.$store.dispatch("toastr", {
                type: "success",
                header: "Success!",
                message: "Task Created Successfully"
              });
            }
            vm.closeSummaryPannel();
            // vm.getNotesDetails();
            // vm.getFolioSummary();
            if (
              response[0] &&
              response[0].length > 0 &&
              response[0][0].NoteId
            ) {
              console.log("noted id .............");
              // vm.getNotesDetailsById(-1);
              //  vm.notesDetailById.noteId = response[0][0].NoteId
            }
            if (vm.parentCallback) {
              vm.parentCallback();
            }
          }
        }
      });
    },
    GetUserEntitlementsAndDefaultProperty() {
      let vm = this;
      vm.$store.dispatch("dataRequestHandler", {
        key: "GetUserEntitlementsAndDefaultProperty",
        params: {
          ModuleAction: "GetUserEntitlementsAndDefaultProperty"
        },
        callback: function(err, response) {
          if (err) {
            return;
          }
          if (response) {
            console.log(
              "response in GetUserEntitlementsAndDefaultProperty",
              response
            );
            vm.userEntitlementList = response.userEntitlementList;
            vm.UserProperties = response.properties;
          }
        }
      });
    },
    changeSubject(taskTypeId) {
      let vm = this;
      if (taskTypeId == 1 && vm.isSelectedFromDropdown == false) {
        vm.notesDetailById.noteSubject = "TurnOver Cleaning";
      } else if (taskTypeId == 2 && vm.isSelectedFromDropdown == false) {
        vm.notesDetailById.noteSubject = "Interim Cleaning";
      }
    },
    getActionReqd(e) {
      let vm = this;
      if (e.target.checked) {
        vm.notesDetailById.isActionReqd = true;
        if (
          vm.notesDetailById.noteTypeId == 2 &&
          vm.notesDetailById.isActionReqd
        ) {
          vm.notesDetailById.taskTypeId = 2;
          vm.notesDetailById.dateOrTimeDue = vm.dueDate;
        }
      } else {
        vm.notesDetailById.isActionReqd = false;
        vm.notesDetailById.dateOrTimeDue = null;
        vm.notesDetailById.taskTypeId = null;
      }
    },
    enteredNotes() {
      let vm = this;
      if (vm.notesDetailById.noteSubject) {
        vm.isSelectedFromDropdown = true;
      } else {
        vm.isSelectedFromDropdown = false;
      }
      console.log("enteredNotes");
    },
    changeNote() {
      let vm = this;
      if (vm.notesDetailById.noteTypeId != 2) {
        vm.notesDetailById.taskTypeId = null;
        vm.notesDetailById.noteSubject = "";
      } else {
        vm.notesDetailById.taskTypeId = 2;
        vm.notesDetailById.noteSubject = "Interim Cleaning";
      }
    }
  },
  watch: {
    noteObj: {
      handler: function(resObj, oldVal) {
        if (resObj) {
          console.log(resObj);
          this.reservationId = null
          this.showNotesPanel(resObj);
        }
      },
      deep: true
    }
  },
  computed: {
    userEntitlementList() {
      let entitlementList = this.$store.getters.getUserEntitlements();
      if (entitlementList && Object.keys(entitlementList).length > 0) {
        return entitlementList;
      }
      return {};
    },
    fncIsNotesSave() {
      let vm = this;
      if (vm.notesDetailById.noteId > 1) {
        return vm.$store.state.userEntitlementList.hasOwnProperty(
          "fncNotesUpdate"
        )
          ? vm.$store.state.userEntitlementList.fncNotesUpdate
          : null;
      } else {
        return vm.$store.state.userEntitlementList.hasOwnProperty(
          "fncNotesSave"
        )
          ? vm.$store.state.userEntitlementList.fncNotesSave
          : null;
      }
    }
  },

  mounted() {
    let vm = this;
    console.log("notes");
    // vm.GetUserEntitlementsAndDefaultProperty();
    vm.$store.dispatch("GetUserEntitlementsAndDefaultProperty");
  }
};
</script>