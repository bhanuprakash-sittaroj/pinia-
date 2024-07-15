<template src="./reservationSummaryPanel.template.html"></template>
<script>
  import moment from "moment-timezone";
  import foliomodal from "../reservationDetailVue/folioRecalculateConfirmationModal.vue";
  import accounting from "accounting";
  import * as axios from "axios";

  export default {
    name: "reservationSummaryPanel",
    props: ["reservationObj", "parentCallback", "updateReservationObj", "updateSchedulerConfig"],

    data() {
      return {
        showicon: true,
        Tagdisable: true,
        statusbutton: true,
        unassignbutton: true,
        checkinoutbutton: true,
        Reservation_Status: {
          StatusId: null,
          StatusName: null
        },
        isSummaryLoading: false,
        reservationSummaryInfo: {
          guestInfo: null,
          statusList: null,
          folioCharges: null
        },
        notesDetailById: {
          noteId: -1
        },
        previousReservationSummaryInfo: {},
        folioSummaryDetail: {},
        ShowLessfolioItemsDetails: {},
        entitlements: {},
        notes: [],
        notificationAmount: null,
        ActualInventoryValue: null,
        honourFolio: false,
        dynamicAnimationclassName: false,
        isModalVisible: false,
        modalParams: null,
        lastMessageObject: {},
        showdeclineRequestReservation: false,
        declineReasonsList: [],
        apiUrl: window.location.protocol + "//" + window.location.hostname + (window.location.port ? ":1339" : ""),
      };
    },
    methods: {
      GetLastMessageList() {
                let vm = this;
                vm.$store.dispatch("dataRequestHandler", {
                    key: "GetLastMessageList",
                    params: {
                        ConversationId: null,
                        ReservationId: vm.reservationSummaryInfo.guestInfo.ReservationId
                    },
                    callback: function (err, response) {
                        if (err) {
                            console.log("GetLastMessageList", err);
                            return;
                        }
                        if (response) {
                            console.log("GetLastMessageList res=", response)    
                            if (response[1] && response[1].length > 0) {
                                vm.lastMessageObject = response[1][0]
                            }                    
                        }
                    }
                })
            },
      cancelRequestDeclineAction(cancelRequestDeclineActionval){
        let vm = this;
        vm.showdeclineRequestReservation = false
        if(cancelRequestDeclineActionval){
          setTimeout(() => {
            vm.get_ReservationDetails_Summary()
          }, 5000);
          // vm.reservationSummaryInfo.guestInfo.StatusId = 11
          // vm.onChangeReservationStatus(11)
        }
      },
      AcceptorDecline(acceptorDeclineVal,event) {
        let vm = this;
        if(acceptorDeclineVal == 0){
          const dataToPost = {
            ConfirmationNumber: vm.lastMessageObject.ConfirmationNumber,
            unitId: vm.reservationSummaryInfo.guestInfo.UnitId,
            clientId: null,
          };
          axios
            .post(`${this.apiUrl}/getAirbnbDeclineResons`, dataToPost)
            .then((response) => {
              console.log("Declined Reasons", response.data);
              vm.displaySectionValue = "declineRequestReservation";
              vm.showdeclineRequestReservation = true
              event.stopPropagation();
              vm.declineReasonsList.splice(0,vm.declineReasonsList.length,...response.data)
            })
            .catch((error) => {
              console.error("Error fetching data:", error);
            });
          return;
        }
        // vm.$store.dispatch("toastr", {
        //   type: "warning",
        //   header: "Warning!",
        //   message: "Please wait for few seconds don't perfome any action",
        // });
        // alert(acceptorDeclineVal + ' = Accept/Decline')
        vm.$store.dispatch("dataRequestHandler", {
          key: "AcceptorDecline",
          params: {
            lastMessageObject: vm.lastMessageObject,
            acceptorDeclineVal: acceptorDeclineVal,
            assignRoomInfo: {}
          },
          callback: function (err, response) {
            if(err){
              return
            }
            if(response){
              vm.showdeclineRequestReservation = false
              setTimeout(() => {
                vm.get_ReservationDetails_Summary()
              }, 5000);

              if(acceptorDeclineVal){
                if (
                (vm.previousReservationSummaryInfo.guestInfo.StatusId == "4" ||
                  vm.previousReservationSummaryInfo.guestInfo.StatusId == "10" ||
                  vm.previousReservationSummaryInfo.guestInfo.StatusId == "11" ||
                  vm.previousReservationSummaryInfo.guestInfo.StatusId == "12") &&
                  vm.reservationSummaryInfo.guestInfo.StatusId == "1"
                ) {
                  vm.saveRoomInfo();
                }
              }
              // vm.reservationSummaryInfo.guestInfo.StatusId = 1
              // vm.onChangeReservationStatus(1)
              // event.stopPropagation();
            }
          }
        })
      },
      folioRecalculateCloseModal() {
        this.isModalVisible = false;
      },
      checkBalanceColor(balance) {

        let formatBalance = Number(balance.replace(/,/g, ''))
        console.log("typeof ===== >", formatBalance)
        if (formatBalance < 0) {
          return "negativeBalance"
        }
        else if (formatBalance == 0) {
          return "zeroBalance"
        }
        else if (formatBalance > 0) {
          return "positiveBalance"
        } else {
          return "fail nuber"
        }
      },
      checkinAndOut() {
        let vm = this;
        console.log(
          "vm.entitlements.fncReservationUpdate.isAssigned",
          vm.entitlements.fncReservationUpdate.isAssigned
        );
        if (vm.entitlements.fncReservationUpdate.isAssigned === 1) {
          vm.checkinoutbutton = true;
        } else {
          vm.checkinoutbutton = false;
        }
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
              console.log(
                "response in GetUserEntitlementsAndDefaultProperty",
                response
              );
              vm.UserProperties = response.properties;
              vm.entitlements = response.userEntitlementList;
              vm.fncIsResUpdate();
              vm.UnassignAndStatus();
              vm.statusButton();

              // vm.DefaultProperty = response.defaultPropertyId;
            }
          }
        });
      },
      UnassignAndStatus() {
        let vm = this;
        if (vm.entitlements && vm.entitlements.fncHousekeeper.isAssigned === 1) {
          vm.unassignbutton = true;
        } else {
          vm.unassignbutton = false;
        }
      },
      fncIsResUpdate() {
        let vm = this;

        if (vm.entitlements.fncReservationUpdate.isAssigned === -1) {
          vm.Tagdisable = false;
        } else {
          vm.Tagdisable = true;
        }
      },
      statusButton() {
        let vm = this;
        if (
          vm.entitlements.fncReservationUpdate.isAssigned === 1 ||
          vm.entitlements.fncHousekeeper.isAssigned === 1
        ) {
          vm.statusbutton = true;
        } else {
          vm.statusbutton = false;
        }
      },
      formatDate(date) {
        let vm = this;
        let diff = moment(date).diff(vm.today, "months");
        console.log("diff", Math.abs(diff));
        return moment(date, "YYYY-MM-DD").format("DD MMM YYYY");
      },

      saveRoomInfo() {
        let vm = this;
        let NumberOfAdults;
        let NumberOfChildren;
        let Persons;
        if (
          vm.reservationSummaryInfo.guestInfo.Persons != null ||
          vm.reservationSummaryInfo.guestInfo.Persons != ""
        ) {
          Persons = vm.reservationSummaryInfo.guestInfo.Persons;
          NumberOfAdults = null;
          NumberOfChildren = null;
        } else if (
          vm.reservationSummaryInfo.guestInfo.Persons == null ||
          vm.reservationSummaryInfo.guestInfo.Persons == ""
        ) {
          Persons = null;
          NumberOfAdults = vm.reservationSummaryInfo.guestInfo.NumberOfAdults;
          NumberOfChildren = vm.reservationSummaryInfo.guestInfo.NumberOfChildren;
        }
        vm.getNotesDetails();
        //console.log("here");
        vm.$store.dispatch("dataRequestHandler", {
          key: "SaveReservation_AssignRooms",
          params: {
            ModuleAction: "SaveReservation_AssignRooms",
            PropertyId: vm.reservationSummaryInfo.guestInfo.PropertyId,
            // StatusId: vm.$route.params.StatusId,
            StatusId: vm.reservationSummaryInfo.guestInfo.StatusId,
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
            ReservationMode: 0,
            RatePlanId: vm.reservationSummaryInfo.guestInfo.RatePlanId,
            Promocode: vm.reservationSummaryInfo.guestInfo.Promocode
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
                vm.$set(
                  vm.reservationSummaryInfo.guestInfo,
                  "reservationMode",
                  response[5][0].ReservationMode
                );
                // vm.updateReservationObj && vm.updateReservationObj(vm.reservationSummaryInfo.guestInfo.ReservationId, response[8][0])
                // vm.GetReservations_ById(vm.reservationSummaryInfo.guestInfo.ReservationId,vm.reservationSummaryInfo.guestInfo.StatusId)
              }

              vm.notesDetailById.noteTypeId = 2;
              vm.notesDetailById.noteSubject = "Turnover cleaning";
              vm.notesDetailById.isActionReqd = 1;
              vm.notesDetailById.noteStatusId = 0;
              vm.notesDetailById.taskTypeId = 1;
              vm.notesDetailById.isAutoGenerated = 1;
              vm.notesDetailById.dateOrTimeDue = moment(
                vm.reservationSummaryInfo.guestInfo.departureDate
              ).format("YYYY-MM-DD");

              let notedId, statusId
              for (let note of vm.notes) {
                if (note.isAutogenerated == 1 || note.isAutogenerated == true) {
                  notedId = note.noteId;
                  statusId = note.noteStatusId;
                }
              }
              vm.notesDetailById.noteStatusId = statusId;
              vm.saveNotesDetails(notedId, statusId, response[6] && response[6][0]);
              if (
                response[6] &&
                response[6][0] &&
                response[6][0].hasOwnProperty("reservationID")
              ) {
                vm.$store.dispatch("toastr", {
                  type: "success",
                  header: "Success!",
                  message: "Reservation saved successfully!"
                });
              }

              // vm.reservationSummaryInfo.guestInfo.reservationMode =
            }
          }
        });
      },

      saveNotesDetails(noteId, sendEmail, resObj) {
        //console.log("saveNotesDetails noteid", noteId);

        let vm = this;
        console.log("noteId", noteId);
        //console.log("notesDetailById", vm.notesDetailById);
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
            sendEmail: sendEmail,
            unitId: vm.reservationSummaryInfo.guestInfo.UnitId
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

              if (response[1] && response[1][0] && response[1][0].ErrorMessage) {
                vm.$store.dispatch("toastr", {
                  type: "error",
                  header: "Error",
                  message: "Error While Saving Notes!"
                });
              } else if (
                noteId &&
                noteId != -99 &&
                !response[1][0].ErrorMessage
              ) {
                vm.$store.dispatch("toastr", {
                  type: "success",
                  header: "Success!",
                  message: "Note Saved Successfully"
                });
              }

              if (resObj) {
                console.log("saveNotesDetails====>", resObj);
                // vm.get_ReservationDetails_Summary({
                //   ReservationId: resObj.reservationID
                // });
                // vm.getReservationFolioSummary({
                //   ReservationId: resObj.reservationID
                // });
                vm.GetReservations_ById(resObj.reservationID, resObj.ResStatusId);
              }
              // vm.getReservationFolioSummary({ ReservationId: vm.reservationSummaryInfo.guestInfo.ReservationId });
            }
          }
        });
      },
      getNotesDetails() {
        let vm = this;
        vm.$store.dispatch("dataRequestHandler", {
          key: "Get_NotesDetails",
          params: {
            ModuleAction: "Get_NotesDetails",
            ReservationId: vm.reservationSummaryInfo.guestInfo.ReservationId,
            NoteId: null
          },
          callback: function (err, response) {
            if (err) {
              return;
            }
            if (response) {
              //console.log("response in Get_NotesDetails", response);
              if (vm.reservationSummaryInfo.guestInfo.ReservationId != -1) {
                vm.notes = response[0];
              }
            }
          }
        });
      },
      onChangeReservationStatus(resStatusId) {
        let vm = this;
        // vm.$store.state.bus.$emit('ActionsItems', resStatusId);

        let resid = vm.reservationSummaryInfo.guestInfo.ReservationId;
        vm.$store.dispatch("dataRequestHandler", {
          key: "UpdateReservationStatus",
          params: {
            ReservationId: vm.reservationSummaryInfo.guestInfo.ReservationId,
            StatusId: resStatusId,
            IsFromRU: 0,
            userdate: moment().format("YYYY-MM-DD HH:mm:ss"),
            voidfutureitems: 0
          },
          callback: function (err, response) {
            if (response) {
              console.log("result in UpdateReservationStatussssss", response);

              if (response[1] && response[1][0] && response[1][0]["StatusId"]) {
                vm.reservationSummaryInfo.statusList = response[1];
              } else if (
                response[2] &&
                response[2][0] &&
                response[2][0]["StatusId"]
              ) {
                vm.reservationSummaryInfo.statusList = response[2];
              }
              vm.$store.dispatch("toastr", {
                type: "success",
                header: "Success!",
                message: response[0][0].SuccessMessage
              });
              //  let notificationEventId =null;
              // if (status.StatusId == 6) {
              //       notificationEventId = 4;
              // }
              // else if(status.StatusId == 7)    
              // {
              //   notificationEventId = 5; 
              // } 
              // else{
              //   notificationEventId = 6;
              // }      
              let NotificationEventID = [], notiSubEventId;

              if (resStatusId == 6) {
                NotificationEventID = [{ notificationEventId: 4, notiSubEventId: 14 }];
              }
              else if (resStatusId == 7) {
                NotificationEventID = [{ notificationEventId: 5, notiSubEventId: 17 }];
              }
              else {
                if (resStatusId == 1) {
                  NotificationEventID = [{ notificationEventId: 6, notiSubEventId: "20" }]
                }
                else if (resStatusId == 5) {
                  NotificationEventID = [{ notificationEventId: 6, notiSubEventId: "21" }]
                } else if (resStatusId == 8) {
                  NotificationEventID = [{ notificationEventId: 6, notiSubEventId: "22" }]
                } else if (resStatusId == 3) {
                  NotificationEventID = [{ notificationEventId: 6, notiSubEventId: "23" }]
                } else if (resStatusId == 4) {
                  NotificationEventID = [{ notificationEventId: 6, notiSubEventId: "24" }]
                } else if (resStatusId == 11) {
                  NotificationEventID = [{ notificationEventId: 6, notiSubEventId: "25" }]
                }
              }


              let EventID = [], SubEventId = null, deleteEvent = null
              if (resStatusId == 1) {
                if (vm.previousReservationSummaryInfo.guestInfo.StatusId == 4 ||
                  vm.previousReservationSummaryInfo.guestInfo.StatusId == 8 ||
                  vm.previousReservationSummaryInfo.guestInfo.StatusId == 10 ||
                  vm.previousReservationSummaryInfo.guestInfo.StatusId == 11 ||
                  vm.previousReservationSummaryInfo.guestInfo.StatusId == 12) {
                  EventID = [{ eventId: 4, subEventId: "15" }, { eventId: 6, subEventId: "20" }]
                } else {
                  EventID = [{ eventId: 6, subEventId: "20" }]
                }
              } else if (resStatusId == 5) {
                EventID = [{ eventId: 6, subEventId: "21" }]
              } else if (resStatusId == 8) {
                EventID = [{ eventId: 6, subEventId: "22" }]
              } else if (resStatusId == 3) {
                EventID = [{ eventId: 6, subEventId: "23" }]
              } else if (resStatusId == 4) {
                EventID = [{ eventId: 6, subEventId: "24" }]
              } else if (resStatusId == 11) {
                EventID = [{ eventId: 6, subEventId: "25" }]
              }

              if ((vm.previousReservationSummaryInfo.guestInfo.StatusId == 6 ||
                vm.previousReservationSummaryInfo.guestInfo.StatusId == 7 ||
                vm.previousReservationSummaryInfo.guestInfo.StatusId == 8) && resStatusId == 1) {
                deleteEvent = "4,5"
              }

              if ((vm.previousReservationSummaryInfo.guestInfo.StatusId == 1 || vm.previousReservationSummaryInfo.guestInfo.StatusId == 3 || vm.previousReservationSummaryInfo.guestInfo.StatusId == 5) && (resStatusId == 4 || resStatusId == 8 || resStatusId == 10 || resStatusId == 11 || resStatusId == 12)) {
                deleteEvent = "4"
              }



              // if (vm.previousReservationSummaryInfo.guestInfo.StatusId == 10 && resStatusId == 1) {
              //   EventID = "3,6"
              //   SubEventId = "6"
              // }
              // else if (vm.previousReservationSummaryInfo.guestInfo.StatusId == 1 && resStatusId == 5) {
              //   EventID = 7
              // }
              // else if (vm.previousReservationSummaryInfo.guestInfo.StatusId == 1 && resStatusId == 8) {
              //   EventID = "8"
              //   deleteEvent = "3"
              // }
              // else if (vm.previousReservationSummaryInfo.guestInfo.StatusId == 1 && resStatusId == 3) {
              //   EventID = 9
              // }
              // else if (resStatusId == 4) {
              //   EventID = 10
              // }
              // else if (resStatusId == 11) {
              //   EventID = 11
              // }
              // else if (vm.previousReservationSummaryInfo.guestInfo.StatusId == 4 && resStatusId == 1) {
              //   EventID = "3,12"
              //   SubEventId = "6"
              // }
              // else if (vm.previousReservationSummaryInfo.guestInfo.StatusId == 11 && resStatusId == 1) {
              //   EventID = "3,13"
              //   SubEventId = "6"
              // }
              // else if ((vm.previousReservationSummaryInfo.guestInfo.StatusId == 6 || vm.previousReservationSummaryInfo.guestInfo.StatusId == 7 || vm.previousReservationSummaryInfo.guestInfo.StatusId == 8) && resStatusId == 1) {
              //   EventID = "3"
              //   SubEventId = "6"
              //   deleteEvent = "3,4"
              // }
              // else {
              //   EventID = null
              // }

              // if (vm.previousReservationSummaryInfo.guestInfo.StatusId == 1 && (resStatusId == 4 || resStatusId == 10 || resStatusId == 11)) {
              //   deleteEvent = "3"
              // }
              // vm.get_JobDetails(deleteEvent);
              // vm.getLogIdsByEventID(EventID, SubEventId)
              if (
                (vm.previousReservationSummaryInfo.guestInfo.StatusId == "4" ||
                  vm.previousReservationSummaryInfo.guestInfo.StatusId == "10" ||
                  vm.previousReservationSummaryInfo.guestInfo.StatusId == "11" ||
                  vm.previousReservationSummaryInfo.guestInfo.StatusId == "12") &&
                vm.reservationSummaryInfo.guestInfo.StatusId == "1"
              ) {
                vm.saveRoomInfo();
                setTimeout(function () {
                  for (let notifiyId of NotificationEventID) {
                    vm.save_Notification(notifiyId.notificationEventId, notifiyId.notiSubEventId, vm.notificationAmount);
                  }
                  vm.get_JobDetails(deleteEvent);

                  for (let event of EventID) {
                    vm.getLogIdsByEventID(event.eventId, event.subEventId)
                  }
                }, 1000);

              } else {

                // vm.updateReservationObj && vm.updateReservationObj(vm.reservationSummaryInfo.guestInfo.ReservationId, response[4][0])
                vm.GetReservations_ById(
                  vm.reservationSummaryInfo.guestInfo.ReservationId,
                  resStatusId
                );
                for (let notifiyId of NotificationEventID) {
                  vm.save_Notification(notifiyId.notificationEventId, notifiyId.notiSubEventId, vm.notificationAmount);
                }
                vm.get_JobDetails(deleteEvent);

                for (let event of EventID) {
                  vm.getLogIdsByEventID(event.eventId, event.subEventId)
                }
                // vm.getReservationFolioSummary({
                //   ReservationId: vm.reservationSummaryInfo.guestInfo.ReservationId
                // });
                // vm.get_ReservationDetails_Summary({
                //   ReservationId: vm.reservationSummaryInfo.guestInfo.ReservationId
                // });
              }

              if (vm.parentCallback) {
                vm.parentCallback({
                  ReservationId: resid,
                  StatusId: resStatusId
                });
                if(document.getElementById('container')) {
                  document.getElementById('container').innerHTML = "<h5>Beta Calendar</h5>";
                  vm.updateSchedulerConfig();
                }
              }
            }

          }
        });
      },
      getLogIdsByEventID(eventId, SubEventId) {
        let vm = this;
        vm.$store.dispatch("dataRequestHandler", {
          key: "Get_LogDetails_ByEventId",
          params: {
            ReservationId: vm.reservationSummaryInfo.guestInfo.ReservationId,
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
      },

      save_Notification(notificationEventId, notifsubeventId, amount) {
        let vm = this;
        var notificationToaster = null;
        var headerToaster = null;
        vm.$store.dispatch("dataRequestHandler", {
          key: "SaveNotification",
          params: {
            ReservationId: vm.reservationSummaryInfo.guestInfo.ReservationId,
            EventId: notificationEventId,
            PropertyId: vm.reservationSummaryInfo.guestInfo.PropertyId,
            SubEventId: notifsubeventId,
            Amount: amount,

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
              if (response && response.recordset[0] && response.recordset[0].EventDescription) {
                notificationToaster = response.recordset[0].Messagecontent;
                headerToaster = response.recordset[0].EventDescription;
              }
              if (notificationToaster != null) {
                vm.$store.dispatch("toastr", {
                  type: "success",
                  header: ` ${headerToaster} `,
                  message: ` ${notificationToaster} `

                });
              }
              vm.get_NotificationCount();
              console.log("response in save_Notification", response);
            }
          }
        });
      },
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
      get_JobDetails(eventId) {
        let vm = this;
        vm.$store.dispatch("dataRequestHandler", {
          key: "get_JobDetails",
          params: {
            ReservationId: vm.reservationSummaryInfo.guestInfo.ReservationId,
            EventId: eventId,
          },
          callback: function (err, response) {
            if (err) {
              return;
            }
            if (response) {
              console.log("response in get_JobDetails", response);
            }
          }
        });
      },
      showReservationSummaryPanel(inst) {
        let vm = this;
        console.log("inst", inst);
        if (inst.pagename && inst.pagename == 'messageInbox') {
          $(".reservationSummary").addClass("messageInboxSummary");
        } else {
          $(".reservationSummary").removeClass("messageInboxSummary");
        }
        $(".reservationSummary").removeClass("animated fadeOutRight");
        $(".reservationSummary").addClass("expand animated fadeInRight");
        $(".clientList").removeClass("expand");
        $("#notification").removeClass("expand");
        $(".menuMaskRevSum").toggle();
        $(".reservationSummary").removeClass("menuMaskRevSum");
        vm.isSummaryLoading = true;
        vm.get_ReservationDetails_Summary(inst);
      },
      getReservationFolioSummary(inst) {
        let vm = this;
        console.log("getFolioSummary resId", inst.ReservationId);
        vm.$store.dispatch("dataRequestHandler", {
          key: "Get_FolioSummary",
          params: {
            ModuleAction: "Get_FolioSummary",
            ReservationId: inst.ReservationId
          },
          callback: function (err, response) {
            if (err) {
              return;
            }
            if (response) {
              console.log("response in GetFolioSummary", response);
              vm.folioSummaryDetail = response[0];
              vm.ShowLessfolioItemsDetails = response[0].slice(0, 5);
              // vm.folioItemsDetails = response[1];
              vm.reservationSummaryInfo.folioCharges = response[2][0];
              vm.previousReservationSummaryInfo.folioCharges = response[2][0];
              vm.ActualInventoryValue = response[5][0].ActualInventory;
              if (vm.ActualInventoryValue == 2) {

                vm.honourFolio = true;
              }
              else {
                vm.honourFolio = false;
              }
            }
          }
        });
      },
      get_ReservationDetails_Summary(inst) {
        let vm = this;
        // vm.isDateBeforeOrAfterSixMonths = false
        vm.reservationSummaryInfo.guestInfo = null;
        vm.reservationSummaryInfo.statusList = null;
        vm.reservationSummaryInfo.folioCharges = null;

        vm.getReservationFolioSummary(inst);
        console.log("get_ReservationDetails_Summary resId", inst.ReservationId);
        vm.$store.dispatch("dataRequestHandler", {
          key: "get_ReservationDetails_Summary",
          params: {
            ModuleAction: "get_ReservationDetails_Summary",
            ReservationId: inst.ReservationId
          },
          callback: function (err, response) {
            if (err) {
              return;
            }
            if (response) {
              console.log("get_ReservationDetails_Summary", response);

              vm.reservationSummaryInfo.guestInfo = response[2][0];
              vm.reservationSummaryInfo.statusList = response[1];

              // vm.$set(vm.Reservation_Status, 'StatusId', response[2][0].StatusId);
              // vm.$set(vm.Reservation_Status, 'StatusName', response[2][0].StatusName);
              if (response && response[2] && response[2][0] && response[2][0]) {
                let StartMonth = moment(response[2][0].arrivalDate).format("MMM");
                vm.$set(
                  vm.reservationSummaryInfo.guestInfo,
                  "StartMonth",
                  StartMonth
                );

                let StartDate = moment(response[2][0].arrivalDate).format("DD");
                vm.$set(
                  vm.reservationSummaryInfo.guestInfo,
                  "StartDate",
                  StartDate
                );
                let StartDay = moment(response[2][0].arrivalDate).format("ddd");
                vm.$set(vm.reservationSummaryInfo.guestInfo, "StartDay", StartDay);

                let StartYear = moment(response[2][0].arrivalDate).format("YYYY");
                vm.$set(
                  vm.reservationSummaryInfo.guestInfo,
                  "StartYear",
                  StartYear
                );
                let EndMonth = moment(response[2][0].departureDate).format("MMM");
                vm.$set(vm.reservationSummaryInfo.guestInfo, "EndMonth", EndMonth);

                let EndDate = moment(response[2][0].departureDate).format("DD");
                vm.$set(vm.reservationSummaryInfo.guestInfo, "EndDate", EndDate);

                let EndDay = moment(response[2][0].departureDate).format("ddd");
                vm.$set(vm.reservationSummaryInfo.guestInfo, "EndDay", EndDay);

                let EndYear = moment(response[2][0].departureDate).format("YYYY");
                vm.$set(vm.reservationSummaryInfo.guestInfo, "EndYear", EndYear);
                vm.isSummaryLoading = false;
                let diff = moment(response[2][0].arrivalDate).diff(
                  vm.today,
                  "months"
                );
                console.log("response", vm.reservationSummaryInfo);
                if (Math.abs(diff) >= 6) {
                  // vm.isDateBeforeOrAfterSixMonths = true;
                }
              }

              vm.previousReservationSummaryInfo = JSON.parse(
                JSON.stringify(vm.reservationSummaryInfo)
              );
              vm.isSummaryLoading = false;
              vm.GetLastMessageList();
            }
          }
        });
      },
      formatBalanceTransferAmount(amount) {
        if (amount != undefined && amount != null && amount != "null" && amount != "undefined") {
        let currency = accounting.formatMoney(amount,
          {
            symbol: '$', format: {
              pos: "%s %v",
              neg: "%s %v",
              zero: "%s  %v"
            }, 
            thousand: ",",
            precision: 2,
            decimal: "."
          })
        return currency;
        }
        else {
        return "";
        }
      },
      viewReservationDetailById(currReservationId) {
        let vm = this;
        console.log("windows.location.href", vm.$route.name)
        if (vm.$route.name == "MessageInbox") {
          if (vm.parentCallback) vm.parentCallback();
        }
        vm.$router.push("/newReservation/" + currReservationId);
      },
      closeSummaryPannel() {
        $(".menuMaskRevSum").hide();
        $(".reservationSummary").removeClass("expand fadeInRight");
        $(".reservationSummary").addClass("animated fadeOutRight");
      },
      formatMoney(amount) {
        return this.$store.state.getFormattedAmount("$", amount);
      },
      assignOrUnassign(reservationMode, event, oversell) {
        let vm = this;
        if (reservationMode || oversell) {
          var toasterMsg
          if (oversell == 1) {
            toasterMsg = "Unallocated"
          }
          else if (oversell == 2) {
            toasterMsg = "allocated"
          }
          else if (oversell == 3) {
            toasterMsg = "Unassigned"
          }
          vm.$store.dispatch("dataRequestHandler", {
            key: "UpdateUnitToUnAssigned",
            params: {
              ReservationId: vm.reservationObj.ReservationId,
              Oversell: oversell
            },
            callback: function (err, response) {
              console.log("UpdateUnitToUnAssigned", response);
              if (err) {
                vm.$store.dispatch("toastr", {
                  type: "error",
                  header: "Error!",
                  message: `Error While ${toasterMsg} Unit Info!`
                });
                console.log("Error in UpdateUnitToUnAssigned => ", err);
                return;
              }
              if (response) {
                console.log("UpdateUnitToUnAssigned=>", response);
                if (
                  response[0] &&
                  response[0][0] &&
                  response[0][0].ErrorMessage != ""
                ) {
                  vm.$store.dispatch("toastr", {
                    type: "error",
                    header: "Error!",
                    message: response[0][0].ErrorMessage
                  });
                  return
                }
                vm.GetReservations_ById(vm.reservationObj.ReservationId, status);
                // else if (response[0] && response[0][0] && response[0][0].ErrorMessage == "") {
                //     if (response[5] && response[5][0]) {
                //         vm.updateReservationObj && vm.updateReservationObj(vm.reservationObj.ReservationId, response[5][0])
                //     }

                if (vm.reservationSummaryInfo.guestInfo.IsHostMode == true) {
                  vm.$store.dispatch("toastr", {
                    type: "success",
                    header: "Success!",
                    message: `Unit has ${toasterMsg} successfully!`
                  });
                }
                else {
                  vm.$store.dispatch("toastr", {
                    type: "success",
                    header: "Success!",
                    message: `Unit has ${toasterMsg} successfully!`
                  });
                }


                // vm.get_ReservationDetails_Summary(vm.reservationObj);
                if (vm.parentCallback) {
                  vm.parentCallback();
                  if(document.getElementById('container')) {
                    document.getElementById('container').innerHTML = "<h5>Beta Calendar</h5>";
                    vm.updateSchedulerConfig();
                  }
                }
              }
            }
          });
        }
        else {
          // vm.$router.push();
          vm.$router.push({ path: "/newReservation/" + vm.reservationObj.ReservationId, query: { name: 'fromSummary' } })
        }

        event.stopPropagation();
      },
      changeStatus(status, ReservationId) {
        console.log("changeStatus", ReservationId);
        let vm = this;
        let resId = ReservationId;
        // vm.$store.state.bus.$emit('ActionsItems', resId);
        let currentdate = moment().format("YYYY-MM-DD")
        if(status == 7 && moment(currentdate).isBefore(vm.reservationSummaryInfo.guestInfo.departureDate)){
          vm.modalParams = {
              popupTitle: "void charges for future dates",
              popupMessage: "Would you like to update the remaining charges ?",
              //"Do you want to void charges for future dates",
              displayYesNoButtons: true,
              yesButtontext: "Yes",
              noButtonText: "No",
              yesButtonCallback: vm.checkinOrCheckout,
              noButtonCallback: vm.noCheckout,
              sendEmailButton: null
          };
          vm.isModalVisible = true
        }else{
          vm.checkinOrCheckout(status, ReservationId,0)
        }

      },
      noCheckout(){
        let vm = this;
        let ReservationId = ReservationId ? ReservationId : vm.reservationSummaryInfo.guestInfo.ReservationId
        vm.isModalVisible = false
        vm.checkinOrCheckout(7, ReservationId, 0)
      },
      checkinOrCheckout(status, ReservationId,voidfutureitems){
        console.log("changeStatus", voidfutureitems ? voidfutureitems : 1);
        let vm = this;
        if(vm.isModalVisible){
          status = 7
          voidfutureitems = 1
        }
        ReservationId = ReservationId ? ReservationId : vm.reservationSummaryInfo.guestInfo.ReservationId;
        let resId = ReservationId;
        vm.isModalVisible = false
        vm.$store.dispatch("dataRequestHandler", {
          key: "UpdateReservationStatus",
          params: {
            ReservationId: ReservationId,
            StatusId: status,
            IsFromRU: 0,
            userdate: moment().format("YYYY-MM-DD HH:mm:ss"),
            voidfutureitems: voidfutureitems 
          },
          callback: function (err, response) {
            let NotificationEventID = [], notiSubEventId;
            let EventID, SubEventId = null
            if (status == 6) {
              // EventID = "3,4";
              // SubEventId = "5,7,9"
              EventID = [{ eventId: 4, subEventId: "14,16" }, { eventId: 5, subEventId: 18 }];
              NotificationEventID = [{ notificationEventId: 4, notiSubEventId: 14 }];
            }
            else if (status == 7) {
              // EventID = 4;
              // SubEventId = "8,10"
              EventID = [{ eventId: 5, subEventId: "17,19" }]
              NotificationEventID = [{ notificationEventId: 5, notiSubEventId: 17 }];
            }
            else {
              EventID = [];
              SubEventId = null;
              NotificationEventID = [];
              notiSubEventId = null;
            }
            for (let event of EventID) {
              vm.getLogIdsByEventID(event.eventId, event.subEventId)
            }
            for (let event of NotificationEventID) {
              vm.save_Notification(event.notificationEventId, event.notiSubEventId, vm.notificationAmount);
            }
            vm.GetReservations_ById(ReservationId, status);
            vm.$store.dispatch("toastr", {
              type: "success",
              header: "Success!",
              message: response[0][0].GuestReservationMessage
            });
          }
        });
      },

      GetReservations_ById(ReservationId, status) {
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
              console.log(
                "result in UpdateReservationStatussummery==>",
                response
              );
              vm.get_ReservationDetails_Summary({ ReservationId: ReservationId });
              // vm.reservationSummaryInfo.statusList = response[2];

              vm.updateReservationObj &&
                vm.updateReservationObj(ReservationId, response[0][0]);

              if (vm.parentCallback) {
                vm.parentCallback({
                  ReservationId: ReservationId,
                  StatusId: status
                });
                if(document.getElementById('container')) {
                  document.getElementById('container').innerHTML = "<h5>Beta Calendar</h5>";
                  vm.updateSchedulerConfig();
                }
              } 
            }
          }
        });
      }
    },
    computed: {
      fncIsFolioView() {
        let vm = this;
        if (vm.$store.state.userEntitlementList.hasOwnProperty("fncFolioView")) {
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
      }
      // fncIsHousekeepingTaskList() {
      //     let vm = this;
      //     if (vm.$store.state.userEntitlementList.fncHousekeepingTaskList.isAssigned === 1) {
      //         return false;
      //     }
      //     else {
      //         return true;
      //     }
      // },
    },
    mounted() {
      this.GetUserEntitlementsAndDefaultProperty();
    },
    components: {
      foliomodal
    },
    watch: {
      
      reservationObj: {
        handler: function (resObj, oldVal) {
          this.isModalVisible = false;
          if (resObj.ReservationId) {
            this.showReservationSummaryPanel(resObj);
          } else {
            this.closeSummaryPannel();
          }
        },
        deep: true
      }
    },
    destroyed() { }
  };
</script>