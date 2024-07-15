<template src="./reservationListSearchPanel.template.html"></template>

<script>
    import moment from "moment-timezone";
    import * as axios from 'axios';
    import Vue from 'vue'
    import foliomodal from "../../reservations/reservationDetailVue/folioRecalculateConfirmationModal.vue";

    export default {
        name: "reservationListSearchPanel",
        props: ["linkReservationToConversationVal", "messageId", "ConversationId", "parentCallback"],

        data() {
            return {
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
                    UnitTypes: [],
                    Sources: [],
                    Units: [],
                    StatusList: [],
                    Columns: [],
                    PageNumber: 1,
                    ItemsPerPage: null,
                    resid: null,
                    userDate: moment().format("YYYY-MM-DD"),
                    showUnAllocatedReservations: false,
                    includeObsoleteInventory: false
                },
                reservationSearchText: "",
                reservationList: [],
                selectedReservationId: null,
                isModalVisible: false,
                modalParams: {},
                selectedReservationObj: null,
                showNoRes: false
            };
        },
        methods: {
            selectReservationToAssign(reservation) {
                let vm = this;
                vm.selectedReservationId = reservation.ReservationId
                vm.selectedReservationObj = reservation
                vm.$nextTick(function () {
                    vm.openPopup()
                })
            },
            openPopup(messageBody) {
                var vm = this;
                vm.isModalVisible = true;
                var html = vm.getPopupHTML();
                vm.modalParams = {
                    popupTitle: "Assign Conversation",
                    html: true,
                    popupMessage: html,
                    displayYesNoButtons: true,
                    yesButtontext: "Yes",
                    noButtonText: "No",
                    yesButtonCallback: vm.assignReservationToConversation,
                    noButtonCallback: vm.closePopup,
                    cancelbuttonCallback: vm.closePopup,
                    noCloseButton: false
                };
            },
            assignReservationToConversation() {
                let vm = this;
                vm.isModalVisible = false;
                // if (vm.parentCallback) {
                //     vm.parentCallback(vm.selectedReservationObj);
                // }

                // vm.selectedReservationId = null
                // vm.selectedReservationObj = null
                vm.$store.dispatch("dataRequestHandler", {
                    key: "AssignreservationtoConversation",
                    params: {
                        ReservationId: vm.selectedReservationId,
                        ConversationId: vm.ConversationId,
                        Unlink: 0,
                        messageId: vm.messageId
                    },
                    callback: function (err, response) {
                        if (err) {
                            console.log("err in AssignreservationtoConversation", err);
                            return
                        }
                        if (response) {
                            console.log("AssignreservationtoConversation", response.recordsets[2]);
                            let messageObj = response.recordsets[2][0]
                            messageObj.replyUsersList = response.recordsets[3] ? response.recordsets[3] : []
                            if (vm.parentCallback) {
                                vm.parentCallback(messageObj);
                            }
                            vm.reservationSearchText = ""
                            vm.selectedReservationId = null
                            vm.selectedReservationObj = null
                            vm.reservationList.splice(0)
                            vm.showNoRes = false
                        }
                    }
                })
            },
            closePopup() {
                let vm = this;
                vm.isModalVisible = false
                // vm.selectedReservationId = null
                // vm.selectedReservationObj = null
            },
            formatPriorStayDate(date) {
                // console.log("date====>", date)
                // return moment(date, "YYYY-MM-DD").format("DD MMM");
                let vm = this;
                return moment(date).format("MMM DD");
            },
            getDay(date) {
                let vm = this;
                return moment(date).format("ddd")
            },
            clearMessageSearchText() {
                let vm = this;
                vm.reservationSearchText = ""
                vm.selectedReservationId = null
                vm.selectedReservationObj = null
                vm.reservationList.splice(0)
                vm.showNoRes = false
            },
            getReservationsList: function () {
                let vm = this;
                vm.filterObj.SearchText = []
                vm.filterObj.SearchText.push(vm.reservationSearchText)
                vm.$store.dispatch("dataRequestHandler", {
                    key: "GetReservationsList",
                    params: vm.filterObj,
                    callback: function (err, response) {
                        if (err) {
                            console.log("err in GetReservationsList in message inbox", err);
                            return
                        }
                        if (response) {
                            console.log("GetReservationsListc in message inbox", response);
                            vm.reservationList.splice(0, vm.reservationList.length, ...response.reservationList);
                            vm.showNoRes = vm.reservationList.length < 1 ? true : false
                        }
                    }
                })

            },
            Searchtext(value) {
                let vm = this;
                vm.showNoRes = false
                if (vm.reservationSearchText.length < 1) {
                    vm.reservationList.splice(0)
                }
                if (((value.which <= 90 && value.which >= 48) || value.which == 8 || value.which == 46) && value.code != "MetaLeft") {
                    clearTimeout(vm.timeout);
                    vm.timeout = setTimeout(function () {
                        console.log("value.which", value)
                        if (vm.reservationSearchText.length > 0) {
                            vm.getReservationsList();
                        }
                    }, 2000);
                }
            },
            getPopupHTML() {
                var chatMessageLI = $($(".list-group").get(0)).find("li.active")[0];
                var chatMessageObject = chatMessageLI.cloneNode(true);
                chatMessageObject.style.setProperty('height', '84px');

                var searchDataLI = $($(".searchData").get(0)).find("li.active")[0];
                var searchDataObject = searchDataLI.cloneNode(true);
                searchDataObject.children[0].style.setProperty('border-top', 'none');
                searchDataObject.children[0].style.setProperty('width', 'unset');

                var chatMessage = '<span style="margin-left: 0px;font-weight: 500;">Assign this conversation...</span>' +
                    '<div style="box-shadow: 8px 7px 13px 5px #4c4b4b21;width: 410px;height: 85px;margin:15px auto 0 auto;grid-template-columns: unset;" class="row chat-inbox">' +
                    '<div style="height: auto" class="chat-list"><div style="height: auto" class="list-group">' +
                    '<ul class="list-group-item" style="height: auto;overflow-y:auto;">' + chatMessageObject.outerHTML + '</ul></div></div></div>';

                var searchData = '<span style="margin-left: 0px;font-weight: 500;">...to this reservation ' + this.selectedReservationObj.TempoConfirmationNumber + ' ?</span><div style="box-shadow: 8px 7px 13px 5px #4c4b4b21;width: 410px;height: 126px;margin:15px auto 0 auto;" class="asignResSearchBox"><div class="resSearchData">' +
                    '<div style="height: auto; min-height: auto;" class="miSearchPanel"><div style="height: auto" class="searchWraper">' +
                    '<div style="height: 150px;" class="searchData dTable">' +
                    '<ul style="width: unset;">' + searchDataObject.outerHTML + '</ul>' +
                    '</div></div></div>' +
                    '</div></div>'
                return chatMessage + "</br>" + searchData;
            }
        },
        computed: {},
        watch: {
            linkReservationToConversationVal: {
                handler: function (linkReservationToConversationVal, oldval) {
                    if (!linkReservationToConversationVal) {
                        this.reservationSearchText = ""
                        this.selectedReservationId = null
                        this.selectedReservationObj = null
                        this.reservationList.splice(0)
                        this.showNoRes = false
                    }
                }
            },
            ConversationId: {
                handler: function (conversationId, oldVal) {
                    this.reservationSearchText = ""
                    this.selectedReservationId = null
                    this.selectedReservationObj = null
                    this.reservationList.splice(0)
                    this.showNoRes = false
                },
                deep: true,
                immediate: true
            },
        },
        mounted() {
            let vm = this;
            // vm.getReservationsList();
        },
        components: {
            foliomodal
        },

        init() {
            console.log("created Reservation list");
        },
        beforeDestroy() {
        }
    };

</script>