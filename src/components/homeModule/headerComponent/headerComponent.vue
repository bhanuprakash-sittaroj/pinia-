<template src="./headerComponent.template.html"></template>

<script>
// const socket = require('socket.io');
import moment from "moment-timezone";
import { defineRule, configure, validate } from 'vee-validate';
import { required, confirmed } from '@vee-validate/rules';
import { localize } from '@vee-validate/i18n';
// import convertToPlainObject from '../../../utils/storeUtils.js'
import pageLoadingComponent from '../../pageLoadingComponent/pageLoading.vue'
import virtualList from "../../reservations/reservationListVue/src";
import $ from "jquery";
import eventBus  from "../../../stores/eventBus.js";
import { isProxy, toRaw } from 'vue';
// moment.calendarFormat = function (myMoment, now) {
//   var diff = myMoment.diff(now, "days", true);
//   var previousMonth = now.clone().add(-1, "month");
//   var retVal =
//     diff <= 0 && diff >= -1
//       ? "sameDay"
//       : diff > -2 && diff < -1
//       ? "lastDay"
//       : diff > -7 && diff <= -2
//       ? "lastWeek"
//       : // introduce thisMonth
//       myMoment.month() === now.month() && myMoment.year() === now.year()
//       ? "thisMonth"
//       : previousMonth.month() === myMoment.month() ||
//         previousMonth.year() === myMoment.year()
//       ? "lastMonth"
//       : previousMonth.year() !== myMoment.year()
//       ? "lastYear"
//       : "sameElse";
//   //(myMoment.year() < now.year()) ? 'previousYear': 'sameElse';
//   return retVal;
// };

export default {
    // options
    name: "headerMenu",
    props: [],
    components: {
        pageLoadingComponent,
        virtualList
    },
    data() {
        return {
            showphone: true,
            apiUrl:
                window.location.protocol +
                "//" +
                window.location.hostname +
                (window.location.port ? ":1339" : ""),
            isActiveForCalendar: true,
            isActiveForCogs: false,
            isActiveForNotification: false,
            isActiveForSupport: false,
            isActiveForPassword: false,
            isActiveForUser: false,
            isBgColor1: false,
            notificationList: [],
            clientList: [],
            errors: {},
            filterType: "prepared",
            clientPanel: false,
            parentModuleName: "Reservations",
            // submenuModuleName: "",
            // notificatoinKeyList: [],
            userImage:
                "https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-512.png",
            userName: null,
            userNotifications: [],
            // notificationCount: 0,
            userProfile: null,
            unreadCount: 0,
            // ClientId: null,
            ClientName: "",
            ClientId: null,
            seen: true,
            selectedClientObj: {},
            propertyList: [],
            searchTextNotification: null,
            UserPassword: "",
            newpassword: "",
            confirmPassword: "",
            searchText: null,
            clear: false,
            loadGif: false,
            functions: {},
            entitlements: {},
            showicon: true,
            showsearchText: true,
            showCalendar: true,
            resLoading: false,
            unreadNotifications: false,
            allNotifications: true,
            archivedNotifications: false,
            isNotificationRead: false,
            notificationUserActionId: null,
            isProcessed: null,
            notificationstatusId: null,
            userNotificationsList: [],
            allNotificationsCount: 0,
            unreadNotificationsCount: 0,
            archivedNotificationsCount: 0,
            notificationsList: [],
            notificationLoading: false,
            eventsStack: [],
            reRender: false,
            readLoading: true,
            pullDownTextObj: {
                trigger: "Loading...",
                begin: "Loading...",
                complete: "There are no items",
                error: "There is server error",
                refresh: "Loading...",
            },
            variable: false,
            options: {
                scrollbars: true,
                interactiveScrollbars: true,
                probeType: 3,
                mouseWheel: true,
                mouseWheelSpeed: 1,
            },
            items: [],
            pageNo: 1,
            itemsPerPage: 20,
            totalLength: null,
            notificationFilter: "",
            notificationFilterList: [],
            notificationFilterList1: {},
            filteredSubevents: [],

            formats: {
                sameDay: "[Today]",
                lastDay: "[Yesterday]",
                //thisWeek:'[This Week]',
                lastWeek: "[Last Week]",
                thisMonth: "[This Month]",
                lastMonth: "MMMM",
                lastYear: "YYYY",
                sameElse: "YYYY",
            },
            dateFormats: {
                sameDay: "hh:mm A",
                nextDay: "hh:mm A",
                nextWeek: "ddd MM/DD",
                lastDay: "ddd hh:mm A",
                lastWeek: "ddd hh:mm A",
                sameElse: "DD MMM YYYY",
            },
            enableVirtualList: true,
            notificationStatusUpdate: false,
            markAllasRead: false,
            stopNotificationCall: false,
            headerSelectedFilterColumn: null,
            headerUnitList: [],
            headerShowunitNameList: false,
            headerFilterSearchUnitNameText: null,
            btnDangerHover: {
                color: "#fff !important",
                backgroundColor: "#c82333 !important",
                borderColor: "#bd2130 !important"
            },
            btnPlaneHover: {
                // backgroundColor: "white !important",
                // background: "none !important",
                // color: "#dc3545 !important",
                // border: "transparent !important"
            },
            headerFilterObj: {
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
                UnitTypes: [],
                Sources: [],
                Units: [],
                UnitIds: [],
                StatusList: [],
                Columns: [],
                PageNumber: 1,
                ItemsPerPage: 20,
                resid: null,
                userDate: moment().format("YYYY-MM-DD"),
                showUnAllocatedReservations: false,
                includeObsoleteInventory: false
            }
        };
    },
    updated() {
        var headerSearchResultsAmenitiesDivId = document.getElementById("headerSearchResultsAmenitiesDiv")
        headerSearchResultsAmenitiesDivId.scrollTop = headerSearchResultsAmenitiesDivId.scrollHeight - headerSearchResultsAmenitiesDivId.clientHeight
    },
    methods: {
        async validateField(name, value, rules) {
            const result = await validate(value, rules, { name });
            if (!result.valid) {
                this.$set(this.errors, name, result.errors[0]);
            } else {
                this.$delete(this.errors, name);
            }
        },
        removeHtmlTagfromMessageContent(messageContent) {

            var div = document.createElement("div");
            div.innerHTML = messageContent;
            // console.log("messageContent = ",messageContent.replace(/(<([^>]+)>)/ig, ' '))
            let acctualMessage = messageContent ? messageContent.replace(/(<([^>]+)>)/ig, ' ') : messageContent;
            acctualMessage = acctualMessage ? acctualMessage.replace("&nbsp;", " ") : acctualMessage;
            return acctualMessage
        },
        applyHeaderFilter() {
            let vm = this;
            vm.filterNotifications();
            setTimeout(function () {
                console.log("Closing the panel");
                $(".headerUnit").removeClass("show");
            }, 10);
        },
        closeHeaderFilterPanel() {
            $(".headerUnit").removeClass("show");
        },
        clearAllHeaderFilters() {
            let vm = this;
            vm.headerFilterObj.Units = [];
            vm.headerFilterObj.UnitIds = [];
            vm.clearHeaderFilter();
            let checkboxes = document.getElementsByName("eventCheckBox");
            vm.filteredSubevents = [];
            for (var i = 0; i < checkboxes.length; i++) {
                let subEventCheckBoxes = document.getElementsByName(checkboxes[i].id);
                for (var j = 0; j < subEventCheckBoxes.length; j++) {
                    subEventCheckBoxes[j].checked = true;
                }
                document.getElementById(checkboxes[i].id).checked = true;
            }
            vm.filterNotifications();
        },
        clearHeaderFilter() {
            let vm = this;
            vm.headerUnitList = [];
            vm.headerShowunitNameList = false;
        },
        headerShowFilterByType(filterCol) {
            let vm = this;
            vm.headerShowunitNameList = true;
            setTimeout(function () {
                vm.headerSelectedFilterColumn = filterCol;

                if (filterCol == "unitName") {
                    vm.getUnitNamesBySearchText();
                    $("#headerUnitNameDropDown").show();
                }
            }, 10);
        },
        getMoreNotificationData($stateChange) {
            if (this.userNotifications.length >= this.totalLength) {
                $stateChange("complete");
            } else {
                setTimeout(() => {
                    $stateChange("loaded");
                }, 1500);
                this.notificationLoading = false;
                this.pageNo++;
                this.get_NotificationsList(
                    this.searchTextNotification,
                    this.filteredSubevents.join()
                );
            }
        },
        refreshNotificationData($pullStateChange) {
            setTimeout(() => {
                this.userNotifications.splice(0);
                for (let i = 0; i < 50; i++) {
                    this.userNotifications.push({
                        text: i,
                        id: i,
                    });
                }
                $pullStateChange("complete");
            }, 1500);
        },
        actionOnEventSelection(event) {
            let subEventCheckBoxes = document.getElementsByName(event.target.id);
            for (var i = 0; i < subEventCheckBoxes.length; i++) {
                subEventCheckBoxes[i].checked = event.target.checked;
            }
            //this.filterNotifications();
        },
        actionOnSubEventSelection(event) {
            //this.filterNotifications();
            document.getElementById(event.target.name).checked = true;
        },
        filterNotifications() {
            let vm = this;
            vm.notificationLoading = true;
            window.clearTimeout(vm.timer)
            let checkboxes = document.getElementsByName("eventCheckBox");
            vm.filteredSubevents = [];
            for (var i = 0; i < checkboxes.length; i++) {
                let atLeastOneChecked = false;
                let subEventCheckBoxes = document.getElementsByName(checkboxes[i].id);
                for (var j = 0; j < subEventCheckBoxes.length; j++) {
                    if (subEventCheckBoxes[j].checked) {
                        atLeastOneChecked = true;
                        vm.filteredSubevents.push(subEventCheckBoxes[j].id);
                        if (subEventCheckBoxes[j].id == 1) {
                            vm.filteredSubevents.push(2);
                        }
                    }
                }
                document.getElementById(checkboxes[i].id).checked = atLeastOneChecked;
            }
            console.log("vm.filteredSubevents", vm.filteredSubevents.join());
            vm.pageNo = 1;
            vm.timer = setTimeout(() => {
                vm.userNotifications.splice(0, vm.userNotifications.length)
                vm.get_NotificationsList(
                    vm.searchTextNotification,
                    vm.filteredSubevents.join()
                );
            }, 1000);

        },
        GetUserEntitlementsAndDefaultProperty() {
            let vm = this;
            vm.$store.dispatch("dataRequestHandler", {
                key: "GetUserEntitlementsAndDefaultProperty",
                params: {
                    ModuleAction: "GetUserEntitlementsAndDefaultProperty",
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
                        // vm.UserProperties = response.properties;
                        vm.entitlements = response.userEntitlementList;
                        vm.showsearchInput();
                        vm.setupPannel();
                        vm.calendarIcon();

                        // vm.DefaultProperty = response.defaultPropertyId;
                    }
                },
            });
        },

        showsearchInput() {
            let vm = this;
            if (
                vm.entitlements.fncReservationUpdate &&
                vm.entitlements.fncReservationUpdate.isAssigned === -1
            ) {
                // vm.showphone= false;
                vm.showsearchText = false;
            } else {
                vm.showsearchText = true;
            }
        },

        setupPannel() {
            let vm = this;
            if (
                (vm.entitlements &&
                    vm.entitlements.fncClientList &&
                    vm.entitlements.fncPropertyList &&
                    vm.entitlements.fncUnitList &&
                    vm.entitlements.fncUserList &&
                    vm.entitlements.fncRoleList &&
                    vm.entitlements.fncListManagementView &&
                    vm.entitlements.fncListManagementView &&
                    vm.entitlements.fncTaxItemsView &&
                    vm.entitlements.fncClientList.isAssigned === 1) ||
                vm.entitlements.fncPropertyList.isAssigned === 1 ||
                vm.entitlements.fncUnitList.isAssigned === 1 ||
                vm.entitlements.fncUserList.isAssigned === 1 ||
                vm.entitlements.fncUserList.isAssigned === 1 ||
                vm.entitlements.fncRoleList.isAssigned === 1 ||
                vm.entitlements.fncListManagementView.isAssigned === 1 ||
                vm.entitlements.fncListManagementView.isAssigned === 1 ||
                vm.entitlements.fncTaxItemsView.isAssigned === 1
            ) {
                vm.showicon = true;
            } else {
                vm.showicon = false;
            }
        },
        calendarIcon() {
            let vm = this;
            if (
                vm.entitlements &&
                (vm.entitlements.fncReservationSelect.isAssigned === 1 ||
                    vm.entitlements.fncHousekeeper.isAssigned === 1)
            ) {
                vm.showCalendar = true;
            } else {
                vm.showCalendar = false;
            }
        },

        imageURLS(imgGuid) {
            let isBase64 = /^data:image\/([a-zA-Z]*);base64,([^\"]*)/.test(imgGuid);
            if (isBase64) {
                return imgGuid;
            }
            return this.apiUrl + "/downloadImage/" + imgGuid + "/430x300";
        },
        async changePassword() {
            this.errors = {};

            // Validate fields
            await this.validateField('UserPassword', this.UserPassword, 'required');
            await this.validateField('newpassword', this.newpassword, 'required');
            await this.validateField('confirmPassword', this.confirmPassword, {
                required: true,
                confirmed: this.newpassword
            });

            if (this.hasErrors) return;

            // Call API if no errors
            try {
                await this.$store.dispatch('dataRequestHandler', {
                    key: 'UpdateLogginPassword',
                    params: {
                        OldPassword: this.UserPassword,
                        NewPassword: this.newpassword,
                        ModuleAction: 'UpdateLogginPassword',
                    },
                    callback: (err, response) => {
                        if (err) return;
                        if (response) {
                            this.$store.dispatch('toastr', {
                                type: 'success',
                                message: 'Password changed successfully',
                                header: 'Success',
                            });
                            this.UserPassword = '';
                            this.newpassword = '';
                            this.confirmPassword = '';
                        }
                    },
                });
            } catch (err) {
                console.error('Error updating password', err);
            }
        },
        toggleNotification: function () {
            let vm = this;
            vm.isActiveForNotification = !vm.isActiveForNotification;
            if (!vm.isActiveForNotification) {
                vm.enableVirtualList = false;
            } else {
                vm.enableVirtualList = true;
            }
            vm.isActiveForCogs = true;
            vm.isActiveForUser = false;
            vm.isActiveForCalendar = true;
            vm.isActiveForSupport = false;
            vm.allNotifications = true;
            vm.unreadNotifications = false;
            vm.archivedNotifications = false;
            $("#notification").toggleClass("expand");
            $(".notoficationButton").toggleClass("active");
            $(".menuMaskN").toggle();
            $(".clientList").removeClass("expand");
            vm.$nextTick(() => {
                vm.searchTextNotification = null;
                vm.notificationLoading = true;
                vm.pageNo = 1;
                vm.userNotifications.splice(0, vm.userNotifications.length);
                vm.allNotificationsCount = 0;
                vm.archivedNotificationsCount = 0;
                vm.unreadNotificationsCount = 0;
                vm.checkAllEvents();
                vm.filterNotifications();
            });
        },
        checkAllEvents() {
            let checkboxes = document.getElementsByName("eventCheckBox");
            for (var i = 0; i < checkboxes.length; i++) {
                let subEventCheckBoxes = document.getElementsByName(checkboxes[i].id);
                for (var j = 0; j < subEventCheckBoxes.length; j++) {
                    subEventCheckBoxes[j].checked = true;
                }
                document.getElementById(checkboxes[i].id).checked = true;
            }
        },
        toggleNotificationDiv() {
            let vm = this;
            vm.isActiveForNotification = false;
            vm.isActiveForPassword = false;
            vm.isActiveForCogs = false;
            vm.isActiveForCalendar = true;
            vm.isActiveForUser = false;
            if (!vm.isActiveForNotification) {
                vm.enableVirtualList = false;
            } else {
                vm.enableVirtualList = true;
            }
            //$(".notoficationButton").toggleClass("active");
            $(".menuMaskN").toggle();
            $(".clientList").removeClass("expand");
            $("#notification").removeClass("expand");
            vm.headerFilterObj.Units = [];
            vm.headerFilterObj.UnitIds = [];
            vm.clearHeaderFilter();
        },
        formatDateTime(date) {
            return moment(date).calendar(null, this.dateFormats);
        },
        formatDate(date) {
            let vm = this;
            return moment(date).format("MMM DD");
        },
        formatUTCDate(date) {
            let vm = this;
            if (date) {
                return moment.utc(date).format("MMM DD");
            }
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
                        vm.$store.commit(
                            "setNotificationCount",
                            response.NotificationCount
                        );
                        console.log("response in get_NotificationCount", response);
                    }
                },
            });
        },
        clearSearchNotification() {
            let vm = this;
            vm.notificationLoading = true;
            vm.searchTextNotification = ""
            vm.get_NotificationsList(vm.searchTextNotification);
        },
        searchNotification(value) {
            let vm = this;
            if (((value.which <= 90 && value.which >= 48) ||
                value.which == 8 || value.which == 46)
                && value.code != "MetaLeft"
                && value.code != " ControlLeft") {
                vm.notificationLoading = true;
                clearTimeout(vm.timeout);
                vm.timeout = setTimeout(function () {
                    // if(value.which && value.code != "Tab"){
                    console.log("value.which", value.which);
                    console.log("value.code", value.code);
                    // vm.loading = true;
                    vm.reRender = false;
                    (vm.pageNo = 1),
                        vm.userNotifications.splice(0, vm.userNotifications.length);
                    //  if (event.key == "Enter") {
                    // console.log(event.key);
                    vm.get_NotificationsList(vm.searchTextNotification);
                    // }
                    // }
                }, 2000);
            }
        },

        groupBy(array, key) {
            const result = {};

            array.forEach((item) => {
                if (!result[item[key]]) {
                    result[item[key]] = [];
                }
                result[item[key]].push(item);
            });
            return result;
        },
        get_NotificationsList(searchTextNotification, subEventIdsParam) {
            let vm = this;
            vm.readLoading = true;
            let notificationType;
            if (vm.allNotifications) {
                notificationType = 1;
            } else if (vm.unreadNotifications) {
                notificationType = 2;
            } else if (vm.archivedNotifications) {
                notificationType = 3;
            }
            if (!vm.isActiveForNotification) {
                vm.enableVirtualList = false;
            } else {
                vm.enableVirtualList = true;
            }
            this.eventsStack.push(notificationType);
            vm.$store.dispatch("dataRequestHandler", {
                key: "GetNotificationsList",
                params: {
                    searchText: searchTextNotification,
                    pageNo: vm.pageNo,
                    itemsPerPage: vm.itemsPerPage,
                    notificationType: notificationType,
                    subEventIds: subEventIdsParam,
                    UnitsList: vm.headerFilterObj.UnitIds.length > 0 ? vm.headerFilterObj.UnitIds.toString() : ""
                },
                callback: function (err, response) {
                    if (err) {
                        return;
                    }
                    if (response) {
                        vm.reRender = false;
                        if (!vm.notificationStatusUpdate && vm.pageNo === 1) {
                            vm.enableVirtualList = false;
                        }
                        vm.$store.commit("setRefreshNotificationPanel", false);
                        vm.get_NotificationCount();
                        vm.allNotificationsCount = response[2][0].AllNotifications;
                        vm.archivedNotificationsCount = response[2][0].Archived;
                        vm.unreadNotificationsCount = response[2][0].Unread;
                        if (vm.allNotifications) {
                            vm.totalLength = vm.allNotificationsCount;
                        } else if (vm.unreadNotifications) {
                            vm.totalLength = vm.unreadNotificationsCount;
                        } else if (vm.archivedNotifications) {
                            vm.totalLength = vm.archivedNotificationsCount;
                        }
                        vm.notificationFilterList.splice(
                            0,
                            vm.notificationFilterList.length,
                            ...response[3]
                        );
                        console.log("filteredSubevents:::", vm.filteredSubevents);
                        vm.notificationFilterList1 = vm.groupBy(
                            vm.notificationFilterList,
                            "EventName"
                        );
                        console.log(
                            "notificationFilterList1:::",
                            vm.notificationFilterList1
                        );
                        if (vm.pageNo === 1 && response[1] && response[1].length != 0) {
                            vm.userNotificationsList.splice(
                                0,
                                vm.userNotificationsList.length,
                                ...response[1]
                            );
                        } else if (
                            vm.pageNo > 1 &&
                            response[1] &&
                            response[1].length != 0
                        ) {
                            vm.userNotificationsList.splice(
                                vm.userNotificationsList.length,
                                0,
                                ...response[1]
                            );
                            console.log("userNotificationsList:::", vm.userNotificationsList);
                        } else if (
                            vm.pageNo === 1 &&
                            response[1] &&
                            response[1].length == 0
                        ) {
                            vm.userNotificationsList.splice(
                                0,
                                vm.userNotificationsList.length,
                                ...response[1]
                            );
                        } else if (
                            vm.pageNo > 1 &&
                            response[1] &&
                            response[1].length == 0
                        ) {
                            vm.userNotificationsList.splice(
                                vm.userNotificationsList.length,
                                0,
                                ...response[1]
                            );
                        }
                        //vm.notificationsList.splice(0, vm.notificationsList.length, ...response[1]);
                        //console.log("response in NotificationsList", vm.notificationsList);
                        // let groupLabelSet = new Set();
                        // vm.userNotificationsList.forEach((notification, index) => {
                        //     let momentDate = moment(notification.CreatedDate).format("YYYY MMM DD");
                        //     let dateText = ""
                        //     let groupLabel = moment(momentDate).calendar(null, vm.formats);
                        //     if (!groupLabelSet.has(groupLabel)) {
                        //         dateText += `<div class="notif-title">`
                        //         dateText += `<span class="">`
                        //         dateText += groupLabel;
                        //         dateText += `</span>`
                        //         dateText += `</div>`
                        //         groupLabelSet.add(groupLabel);
                        //     }
                        //     console.log("response in NotificationsList", dateText);
                        //     vm.$set(notification, "dateText", dateText);
                        // });
                        if (vm.unreadNotifications) {
                            vm.userNotifications = vm.userNotificationsList.filter(
                                (userNotification) => userNotification.IsProcessed == 0
                            );
                        } else if (vm.archivedNotifications) {
                            vm.userNotifications = vm.userNotificationsList.filter(
                                (userNotification) => userNotification.NotificationStatusId == 2
                            );
                        } else if (vm.allNotifications) {
                            //vm.userNotifications = vm.userNotificationsList;
                            vm.userNotifications = vm.userNotificationsList.filter(
                                (userNotification) => userNotification.NotificationStatusId == 1
                            );
                        }
                        if (!vm.notificationStatusUpdate && vm.pageNo === 1) {
                            vm.$nextTick(() => {
                                vm.enableVirtualList = true;
                            });
                        } else {
                            vm.notificationStatusUpdate = false;
                        }
                        vm.$nextTick(() => {
                            if (vm.userNotifications.length > 0) {
                                vm.notificationLoading = false;
                            } else {
                                setTimeout(() => {
                                    vm.notificationLoading = false;
                                }, 1000);
                            }
                        });
                        console.log("vm.userNotifications", vm.userNotifications);
                        vm.readLoading = false;
                        vm.eventsStack.pop();
                        console.log("after user noti. list", vm.userNotifications.length);
                    }
                },
            });
        },
        showAllNotifications() {
            let vm = this;
            vm.notificationLoading = true;
            vm.pageNo = 1;
            // vm.userNotifications.splice(0, vm.userNotifications.length);
            vm.allNotifications = true;
            vm.archivedNotifications = false;
            vm.unreadNotifications = false;
            vm.filterNotifications();
        },
        showUnreadNotifications() {
            let vm = this;
            vm.notificationLoading = true;
            vm.pageNo = 1;
            // vm.userNotifications.splice(0, vm.userNotifications.length);
            vm.unreadNotifications = true;
            vm.archivedNotifications = false;
            vm.allNotifications = false;
            vm.filterNotifications();
        },
        showArchivedNotifications() {
            let vm = this;
            vm.notificationLoading = true;
            vm.pageNo = 1;
            // vm.userNotifications.splice(0, vm.userNotifications.length);
            vm.archivedNotifications = true;
            vm.allNotifications = false;
            vm.unreadNotifications = false;
            vm.filterNotifications();
        },
        readNotification(notification) {
            let vm = this;
            vm.markAllasRead = false;
            vm.readLoading = true;
            // vm.notificationStatusUpdate = true;
            // vm.notificationLoading = true;
            vm.stopNotificationCall = true;
            notification.IsProcessed = 1;
            let index = vm.userNotifications.findIndex(
                (no) => no.NotificationId === notification.NotificationId
            );
            if (vm.unreadNotifications && vm.unreadNotificationsCount > 1) {
                vm.enableVirtualList = false;
                vm.userNotifications.splice(index, 1);
                vm.unreadNotificationsCount--;
                vm.$nextTick(() => {
                    vm.enableVirtualList = true;
                });
            } else if (vm.unreadNotifications && vm.unreadNotificationsCount == 1) {
                vm.userNotifications[index]["IsProcessed"] = 1;
                vm.userNotificationsList[index]["IsProcessed"] = 1;
                vm.unreadNotificationsCount--;
                vm.stopNotificationCall = false;
            } else if (vm.showAllNotifications && vm.unreadNotificationsCount > 1) {
                vm.userNotifications[index]["IsProcessed"] = 1;
                vm.userNotificationsList[index]["IsProcessed"] = 1;
                vm.unreadNotificationsCount--;
                console.log(
                    "vm.unreadNotificationsCount :::",
                    vm.unreadNotificationsCount
                );
            }
            vm.notificationStatusUpdate = true;
            vm.update_Notification(
                notification.NotificationUserActionId,
                notification.IsProcessed,
                notification.NotificationStatusId
            );
            //  vm.userNotifications.splice(0,vm.userNotifications.length)
        },
        markNotificationsAllRead(userNotifications) {
            let vm = this;
            vm.markAllasRead = true;
            vm.notificationLoading = true;
            vm.notificationstatusId = 1;
            vm.isProcessed = 1;
            vm.notificationUserActionId = null;
            vm.update_Notification(
                vm.notificationUserActionId,
                vm.isProcessed,
                vm.notificationstatusId
            );
            // vm.userNotifications.splice(0, vm.userNotifications.length);
        },
        clearArchiveNotifications(userNotifications, allClear) {
            let vm = this;
            // vm.notificationLoading = true;
            console.log("userNotifications = ", vm.userNotifications);
            if (allClear) {
                vm.notificationstatusId = -1;
                vm.notificationUserActionId = -1;
                vm.markAllasRead = true;
            } else if (vm.archivedNotificationsCount > 1) {
                vm.enableVirtualList = false;
                vm.notificationUserActionId =
                    userNotifications.NotificationUserActionId;
                vm.notificationStatusUpdate = true;
                vm.stopNotificationCall = true;
                vm.markAllasRead = false;
                vm.notificationstatusId = -1;
                vm.archivedNotificationsCount--;
                let index = vm.userNotifications.findIndex(
                    (no) => no.NotificationId === userNotifications.NotificationId
                );
                vm.userNotifications.splice(index, 1);
                vm.userNotificationsList.splice(index, 1);
                vm.$nextTick(() => {
                    vm.enableVirtualList = true;
                });
            } else if (vm.archivedNotificationsCount == 1) {
                vm.notificationUserActionId =
                    userNotifications.NotificationUserActionId;
                vm.notificationStatusUpdate = true;
                vm.stopNotificationCall = false;
                vm.markAllasRead = false;
                vm.notificationstatusId = -1;
            }
            vm.update_Notification(
                vm.notificationUserActionId,
                vm.isProcessed,
                vm.notificationstatusId
            );
        },
        archiveNotification(notification) {
            let vm = this;
            vm.markAllasRead = false;
            vm.readLoading = true;
            // vm.stopNotificationCall = true;
            vm.enableVirtualList = false;
            let index = vm.userNotifications.findIndex(
                (no) => no.NotificationId === notification.NotificationId
            );
            vm.userNotifications.splice(index, 1);
            vm.$nextTick(() => {
                vm.enableVirtualList = true;
            });
            notification.NotificationStatusId = 2;
            vm.notificationStatusUpdate = true;
            vm.update_Notification(
                notification.NotificationUserActionId,
                notification.IsProcessed,
                notification.NotificationStatusId
            );

        },
        archiveAll() {
            let vm = this;
            vm.markAllasRead = true;
            vm.notificationLoading = true;
            vm.notificationstatusId = 2;
            vm.notificationUserActionId = -1;
            vm.update_Notification(
                vm.notificationUserActionId,
                vm.isProcessed,
                vm.notificationstatusId
            );
            vm.userNotifications.splice(0, vm.userNotifications.length);
        },

        unReadNotification(notification) {
            let vm = this;
            vm.readLoading = true;
            vm.markAllasRead = false;
            vm.notificationStatusUpdate = true;
            vm.stopNotificationCall = true;
            // vm.enableVirtualList = false;
            //vm.notificationLoading = true;
            notification.IsProcessed = 0;
            console.log("vm.unreadNotificationsCount :::", vm.unreadNotificationsCount)
            vm.unreadNotificationsCount++;
            // let index = vm.userNotifications.findIndex(
            //   (no) => no.NotificationId === notification.NotificationId
            // );
            // vm.userNotifications[index]['IsProcessed']=0;
            // vm.userNotificationsList[index]['IsProcessed']=0;
            // vm.$nextTick(() => {
            //   vm.enableVirtualList = true;
            // });
            vm.update_Notification(
                notification.NotificationUserActionId,
                notification.IsProcessed,
                notification.NotificationStatusId
            );
            // vm.userNotifications.splice(0, vm.userNotifications.length);
        },
        navigateToNotification(notification) {
            let vm = this;
            let currReservationId;
            notification.IsProcessed = 1;
            (currReservationId = notification.ReservationId),
                vm.update_Notification(
                    notification.NotificationUserActionId,
                    notification.IsProcessed,
                    notification.NotificationStatusId
                );
            console.log("windows.location.href", vm.$route.name);
            if (notification.EventId == 7) {
                vm.$router.push("/messageInbox/" + notification.ConversationId + "/" + currReservationId);
            }
            else {
                vm.$router.push("/newReservation/" + currReservationId);
            }
            location.reload();
        },
        update_Notification(
            notificationUserActionId,
            isProcessed,
            notificationstatusId
        ) {
            let vm = this;
            vm.$store.dispatch("dataRequestHandler", {
                key: "UpdateStatusNotification",
                params: {
                    NotificationUserActionId: notificationUserActionId,
                    IsProcessed: isProcessed,
                    notificationstatusId: notificationstatusId,
                },
                callback: function (err, response) {
                    if (err) {
                        return;
                    }
                    if (response) {
                        vm.readLoading = true;
                        // vm.notificationLoading = true;
                        console.log("response in UpdateStatusNotification", response);
                        if (!vm.markAllasRead && !vm.stopNotificationCall) {
                            vm.get_NotificationsList(
                                vm.searchTextNotification,
                                vm.filteredSubevents.join()
                            );
                        } else if (!vm.stopNotificationCall) {
                            setTimeout(() => {
                                vm.pageNo = 1;
                                vm.checkAllEvents();
                                vm.filterNotifications();
                                // vm.get_NotificationsList(vm.searchTextNotification);
                            }, 200);
                        }
                        vm.get_NotificationCount();
                        vm.$nextTick(() => {
                            vm.stopNotificationCall = false;
                        })
                    }
                },
            });
        },

        togglepassword: function () {
            this.isActiveForPassword = true;
            this.isActiveForCogs = false;
            this.isActiveForUser = false;
            this.isActiveForNotification = false;
            $("#password").toggleClass("expand");
            // $(".notoficationButton").toggleClass("active");
            $(".menuMaskP").toggle();
            $(".clientList").removeClass("expand");
        },

        showClientPanel: function () {
            let vm = this;
            $(".clientList").toggleClass("expand");
            $("#notification").removeClass("expand");
            $(".menuMaskNCL").toggle();
            vm.getClientDetailList();
        },

        showPropertyPanel: function () {
            $(".propertyList").toggleClass("expand");
            $("#notification").removeClass("expand");
            $(".menuMaskNCL").toggle();
        },
        logout: function () {
            let self = this;
            self.$store.dispatch("dataRequestHandler", {
                key: "RemoveLoggedInUserSocketFromDb",
                params: {},
                callback: function (err, response) {
                    if (err) {
                        return;
                    } else if (response) {
                        window.localStorage.removeItem("rttoken");
                        var messageInboxKeys = [];
                        for (var i = 0; i < window.localStorage.length; i++) {
                            if (window.localStorage.key(i).startsWith("MessageInbox_")) {
                                messageInboxKeys.push(window.localStorage.key(i));
                            }
                            if (window.localStorage.key(i).startsWith("MessageInboxImage_")) {
                                messageInboxKeys.push(window.localStorage.key(i));
                            }
                        }

                        for (var i = 0; i < messageInboxKeys.length; i++) {
                            window.localStorage.removeItem(messageInboxKeys[i]);
                        }
                        // window.localStorage.removeItem('ShowBryntumCalendar');
                        window.location.href = "login.html";
                    }
                },
            });
        },
        redirectToReservation() {
            console.log("in redirectToReservation")
            let vm = this;
            vm.parentModuleName = "Reservations";
            vm.isActiveForNotification = false;
            eventBus.$emit("IsCalendarIcons", vm.parentModuleName);
            vm.searchText = null;
            vm.clear = false;
            $("#notification").removeClass("expand");
            // eventBus.$emit('clearSearchText');
            // making vm.$store.state.selectedUnitData as null when we go to new reservation screen as it storing previous selected data
            vm.$store.state.selectedUnitData = null
            vm.$router.push("/newReservation/-1");
        },
        redirectToHome: function () {
            window.location.href = this.$store.state.uiPageName; // + this.userDetail.response["p_9"]["txt"];
        },
        // toggle: function(){
        //   let vm = this;
        //   vm.isActiveForCogs = true;
        //   vm.isActiveForUser =  false;

        // },
        // toggle2:function(){},
        gotoHome() {
            //window.location.href = this.$store.state.uiPageName;
        },
        clearMessages: function () {
            changeNotificationStatus(scope.userNotifications, "archieved");
        },
        changeNotificationStatus: function (notifications, status) {
            let scope = this;
            scope.$store.dispatch("dataRequestHandler", {
                key: "UpdateNotification",
                params: { notifications: notifications, status: status },
                callback: function (err, response) {
                    //console.log(response);
                    scope.userNotifications = [];
                    scope.notificationCount = 0;
                },
            });
        },
        clientDetail() {
            //   window.location.href = this.$store.state.uiPageName + "#clientDetails/-1";
            this.$router.push("clientDetail/-1");
        },
        getUserProfile() {
            let self = this.$state;
            self = JSON.parse(JSON.stringify(self))
            console.log("self.clientList.ClientId", self)
            console.log("getUserProfile mounted",self);
            self.dataRequestHandler( {
                key: "GetUserProfile",
                params: {},
                callback: function (err, response) {
                    //console.log(err + "/" + response);
                    if (response) {
                        const response = JSON.parse(JSON.stringify(response))
                        // self.userProfile = response.recordsets[0][0];
                        // self.userImage = self.userProfile.ProfileImage;
                        // self.userName = self.userProfile.userFirstName + " " + self.userProfile.userLastName;
                        console.log("userProfile=>", response);
                        if (self.clientList.ClientId === response[0][0].ClientId) {
                            console.log("self.selectedClientObj11");
                            self.selectedClientObj = response[0][0];
                            console.log("self.selectedClientObj", self.selectedClientObj);
                            self.ClientName = response[0][0].ClientName;
                            // self.UserPassword = response[0][0].UserPassword;
                            console.log(
                                "selectedClientObj===================>",
                                self.selectedClientObj
                            );
                            self.getClientDetailList();
                        }
                    }
                },
            });
        },
        getClientDetailList() {
            let scope = this;
            // console.log("scope.selectedClientObj.ClientId", scope.selectedClientObj.ClientId)
            console.log("In get client detail list");
            console.log(
                "In get client detail scope.selectedClientObj",
                scope.selectedClientObj
            );

            if (scope.getUserProfile && scope.selectedClientObj !== null) {
                if (scope.selectedClientObj.ClientId === 1) {
                    console.log(
                        "scope.selectedClientObj.ClientId",
                        scope.selectedClientObj.ClientId
                    );
                    scope.ClientId = scope.selectedClientObj.ClientId;
                }
                this.$store.dispatch("dataRequestHandler", {
                    key: "GetClientList_Cpanel",
                    params: {
                        ModuleAction: "GetClientList_Cpanel",
                        ClientId: scope.ClientId,
                    },
                    callback(err, response) {
                        if (response) {
                            console.log(
                                "response getClientDetailList" +
                                JSON.stringify(response.recordsets[1])
                            );
                            scope.clientList = response.recordsets[0];
                            // scope.clientList = response;
                            console.log("GetClientList_Cpanel1", response);
                            console.log("GetClientList_Cpanel2", scope.clientList);
                        } else {
                            console.log(err);
                        }
                    },
                });
            }
        },
        // getPropertyDetailList: function () {
        //   let scope = this;
        //   console.log("In get propertydetail list");
        //   this.$store.dispatch("dataRequestHandler", {
        //     key: "GetPropertyList_CPanel",
        //     params: {
        //       ModuleAction: "GetPropertyList_CPanel",
        //       // PropertyId: scope.PropertyId

        //     },
        //     callback: function (err, response) {
        //       if (response) {
        //         console.log("got the propertyList", response)
        //         scope.propertyList = response[1];
        //       }
        //       else {
        //         console.log(err);
        //       }

        //     }
        //   });
        // },
        viewClientDetailById(Client) {
            // console.log("")
            console.log("client id in viewClientDetailById" + Client.ClientId);

            //  window.location.href = this.$store.state.uiPageName + "#clientDetails/" + ClientId;

            console.log("dispatching");
            let vm = this;
            vm.$router.push("/clientList");
            // vm.ClientId = ClientId,
            vm.$store.dispatch("dataRequestHandler", {
                key: "UpdateTokenWithClientId",
                params: {
                    ModuleAction: "UpdateTokenWithClientId",
                    ClientId: Client.ClientId,
                },
                callback: function (err, response) {
                    if (err) {
                        return;
                    }
                    if (response) {
                        console.log("response in UpdateTokenWithClientId", response.token);
                        window.localStorage.removeItem("rttoken");
                        window.localStorage.setItem("rttoken", response.token);
                        location.reload();
                        vm.getClientDetailByid();
                        vm.getPropertyDetailList();
                    }
                },
            });
        },
        getClientDetailByid: function () {
            let scope = this;
            console.log("iiiiiiii")
            console.log("In viewclientdetail" + scope.$route.params.clientId);
            scope.$store.dispatch("dataRequestHandler", {
                key: "GetClientDetailById",
                params: {
                    ModuleAction: "GetClientDetailById",
                },
                callback: function (err, response) {
                    if (err) {
                        console.log("Error in getClientDetailByid => ", err);
                        return;
                    }
                    if (response) {
                        console.log("responseeeeeeeeee",response)
                        if (response.recordsets[5]) {
                            scope.ClientName = response.recordsets[5][0].ClientName;
                            scope.ClientId = response.recordsets[5][0].ClientId;
                        }
                    }
                },
            });
        },
        getNotifications() { },
        getNotifications1() {
            //this.$store.dispatch("getNotificationKeys", { "params": {} })
        },
        showNotificationByType(type) {
            this.filterType = type;
        },
        redirectToNotifications: function () {
            window.location.href = this.$store.state.uiPageName + "#notifications";
        },
        redirectToChangePassword: function () {
            window.location.href = this.$store.state.uiPageName + "#password";
        },

        navigateToUserProfile: function () {
            // this.isActiveForUser = true;
            this.isActiveForCogs = false;
            this.isActiveForUser = true;
            this.isActiveForCalendar = false;
            this.isActiveForNotification = false;
            this.isActiveForSupport = false;
            // window.location.href = this.$store.state.uiPageName + "#userProfile";
            this.$store.state.bus.$emit("isActiveForUser", this.isActiveForUser);
            this.$router.push("/userDetail/" + this.selectedClientObj.UserId);
        },

        // redirectToChangePassword() {
        //   alert("password")
        //   this.isActiveForUser = true;
        //   this.isActiveForCogs = false;
        //   this.$store.state.bus.$emit('isActiveForUser', this.isActiveForUser);
        //   window.location.href = this.$store.state.uiPageName + "#changePassword";
        // },
        naviagateToDetail(notificationObj) {
            this.dismissNotification(notificationObj);
            window.location.href =
                this.$store.state.uiPageName +
                "#notifications/" +
                notificationObj.NotificationIdText;
        },
        dimissAllNotifications() {
            let scope = this;
            let arrNotificationIds = [];

            for (
                let index = 0;
                index < scope.notificatoinKeyList.response.length;
                index++
            ) {
                arrNotificationIds.push(
                    scope.notificatoinKeyList.response[index]["NotificationIdText"]
                );
            }

            if (arrNotificationIds.length > 0) {
                scope.updateNotificationStatus(arrNotificationIds);
                scope.notificatoinKeyList.response.splice(0, Infinity);
            }
        },
        updateNotificationStatus(arrNotificationIds) {
            let scope = this;

            scope.$store.dispatch("dataRequestHandler", {
                key: "DismissNotification",
                params: {
                    notificationId: arrNotificationIds,
                    statusId: 2,
                },
                callback: (err, response) => {
                    //console.log(response);
                    if (err) {
                        console.log("Error in updateNotificationStatus => ", err);
                        return;
                    }
                },
            });
        },
        updateNotificationCount(notificationObj) {
            let scope = this;
            let index = scope.notificatoinKeyList.response.findIndex(
                (x) => x.NotificationIdText == notificationObj.NotificationIdText
            );
            if (index > -1) {
                scope.notificatoinKeyList.response.splice(index, 1);
            }
        },

        redirectToProperty() {
            this.$router.push("/propertyList");
            this.isActiveForCogs = true;
            this.isActiveForUser = false;
            this.$store.state.bus.$emit("isActiveForCogs", this.isActiveForCogs);
            //window.location.href = this.$store.state.uiPageName+"#propertyList";
        },
        redirectToClient() {
            this.$router.push("/clientList");
            this.isActiveForCogs = true;
            this.isActiveForUser = false;
            this.$store.state.bus.$emit("isActiveForCogs", this.isActiveForCogs);
            //window.location.href = this.$store.state.uiPageName+"#clientList";
        },
        redirectToUnit() {
            this.$router.push("/unitList");
            this.isActiveForCogs = true;
            this.isActiveForUser = false;
            this.$store.state.bus.$emit("isActiveForCogs", this.isActiveForCogs);
        },
        redirectToUserTypes() {
            this.$router.push("/users");
            this.isActiveForCogs = true;
            this.isActiveForUser = false;
            this.$store.state.bus.$emit("isActiveForCogs", this.isActiveForCogs);
            //window.location.href = this.$store.state.uiPageName + "#users";
            $("#leftMenu").removeClass("expand");
            $("#nav-icon3").removeClass("open");
            $(".menuMask").hide();
        },
        redirectToUserGroups() {
            this.$router.push("/roles");
            this.isActiveForCogs = true;
            this.isActiveForUser = false;
            this.$store.state.bus.$emit("isActiveForCogs", this.isActiveForCogs);
            //window.location.href = this.$store.state.uiPageName + "#userGroupList";
            $("#leftMenu").removeClass("expand");
            $("#nav-icon3").removeClass("open");
            $(".menuMask").hide();
        },
        groupicons() {
            let vm = this;
            vm.parentModuleName = "Admin";
            vm.isActiveForCogs = true;
            vm.isActiveForUser = false;
            vm.isActiveForCalendar = false;
            vm.isActiveForNotification = false;
            vm.isActiveForSupport = false;
            $("#notification").removeClass("expand");
            eventBus.$emit("IsGroupIcons", vm.parentModuleName);
            eventBus.$emit("mailDev", "");
            if (
                vm.entitlements.fncClientList.isAssigned === -1 &&
                vm.entitlements.fncPropertyList.isAssigned === 1
            ) {
                vm.$router.push("/propertyList");
                eventBus.$emit("cogs", "PropertyList");
            } else if (
                vm.entitlements.fncClientList.isAssigned === -1 &&
                vm.entitlements.fncPropertyList.isAssigned === -1 &&
                vm.entitlements.fncUnitList.isAssigned === 1
            ) {
                vm.$router.push("/unitList");
                eventBus.$emit("cogs", "UnitList");
            } else if (
                vm.entitlements.fncClientList.isAssigned === -1 &&
                vm.entitlements.fncPropertyList.isAssigned === -1 &&
                vm.entitlements.fncUnitList.isAssigned === -1 &&
                vm.entitlements.fncRoleList.isAssigned === 1
            ) {
                vm.$router.push("/roles");
                eventBus.$emit("cogs", "RoleList");
            } else if (
                vm.entitlements.fncClientList.isAssigned === -1 &&
                vm.entitlements.fncPropertyList.isAssigned === -1 &&
                vm.entitlements.fncUnitList.isAssigned === -1 &&
                vm.entitlements.fncRoleList.isAssigned === -1 &&
                vm.entitlements.fncUserList.isAssigned === 1
            ) {
                vm.$router.push("/users");
                eventBus.$emit("cogs", "Users");
            } else if (
                vm.entitlements.fncClientList.isAssigned === -1 &&
                vm.entitlements.fncPropertyList.isAssigned === -1 &&
                vm.entitlements.fncUnitList.isAssigned === -1 &&
                vm.entitlements.fncRoleList.isAssigned === -1 &&
                vm.entitlements.fncUserList.isAssigned === -1 &&
                vm.entitlements.fncListManagementView.isAssigned === 1
            ) {
                vm.$router.push("/ListManagement");
                eventBus.$emit("cogs", "listManagement");
            } else if (
                vm.entitlements.fncClientList.isAssigned === -1 &&
                vm.entitlements.fncPropertyList.isAssigned === -1 &&
                vm.entitlements.fncUnitList.isAssigned === -1 &&
                vm.entitlements.fncRoleList.isAssigned === -1 &&
                vm.entitlements.fncUserList.isAssigned === -1 &&
                vm.entitlements.fncListManagementView.isAssigned === -1 &&
                vm.entitlements.fncTaxItemsView.isAssigned === 1
            ) {
                vm.$router.push("/tax");
                eventBus.$emit("cogs", "tax");
            } else {
                vm.$router.push("/clientList");
                eventBus.$emit("cogs", "ClientList");
            }
        },
        showSupportIcon() {
            let vm = this;
            vm.isActiveForCogs = false;
            vm.isActiveForUser = false;
            vm.isActiveForCalendar = false;
            vm.isActiveForNotification = false;
            vm.isActiveForSupport = true;
            $("#notification").removeClass("expand");
        },
        showProfile() {
            let vm = this;
            vm.isActiveForCogs = false;
            vm.isActiveForUser = true;
            vm.isActiveForCalendar = false;
            vm.isActiveForNotification = false;
            vm.isActiveForSupport = false;

            $("#notification").removeClass("expand");
        },
        calendar() {
            let vm = this;
            vm.parentModuleName = "Reservations";
            vm.isActiveForCogs = false;
            vm.isActiveForUser = false;
            vm.isActiveForCalendar = true;
            vm.isActiveForNotification = false;
            vm.isActiveForSupport = false;
            $("#notification").removeClass("expand");
            eventBus.$emit("IsCalendarIcons", vm.parentModuleName);
            eventBus.$emit("mailDev", "");
            if (vm.entitlements.fncReservationList.isAssigned === -1) {
                vm.$router.push("/houseKeepingStatus");
                eventBus.$emit("calendar", "HouseKeepingStatus");
            } else {
                vm.$router.push("/ReservationList");
            }

            eventBus.$emit("clearSearchText");
        },
        searchWithText(event) {
            if (event.key == "Enter") {
                this.clear = true;
                console.log(event.key);
                if (this.searchText && this.searchText.trim()) {
                    this.notifyTheRespectiveComponent();
                    this.clearResults();
                }
            }
        },
        clearResults() {
            this.searchText = null;
            //this.$store.state.bus.$emit('Clear-Search-Reservation-List')
            // this.notifyTheRespectiveComponent();
            this.clear = false;
            this.loadGif = !this.loadGif;
        },
        notifyTheRespectiveComponent() {
            if (this.$route.name === "ReservationList")
                this.$store.state.bus.$emit(
                    "Search-In-Reservation-List",
                    this.searchText
                );
            else if (this.$route.name === "Users")
                this.$store.state.bus.$emit("Search-In-Users-List", this.searchText);
            else if (this.$route.name === "RoleList")
                this.$store.state.bus.$emit("Search-In-Role-List", this.searchText);
            else if (this.$route.name === "PropertyList")
                this.$store.state.bus.$emit("Search-In-Property-List", this.searchText);
            else if (this.$route.name === "UnitList")
                this.$store.state.bus.$emit("Search-In-Unit-List", this.searchText);
        },
        getUnitNamesBySearchText(searchText) {
            let vm = this;
            let resultObj = vm.headerFilterObj.Properties.map(obj => obj.PropertyId);
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
                            let List = response.unitList.filter(function (unitObject) { return unitObject.StatusId == 1 });
                            for (var i = 0; i < vm.headerFilterObj.Units.length; i++) {
                                console.log("vm.headerFilterObj.Units[i].UnitId", vm.headerFilterObj.Units[i].UnitId)
                                let index = List.findIndex(x => x.UnitId == vm.headerFilterObj.Units[i].UnitId);
                                if (index > -1)
                                    List.splice(index, 1);
                                console.log("index", index);
                            }
                            vm.headerUnitList.splice(0, vm.headerUnitList.length, ...List);
                        }
                    }
                });
        },
        headerAddHeaderUnitToFilter(unitObj) {
            let vm = this;
            vm.headerFilterObj.Units.push(unitObj);
            vm.headerFilterObj.UnitIds.push(unitObj.UnitId.toString());
            vm.headerFilterSearchUnitNameText = null;
            var index = vm.headerUnitList.indexOf(unitObj);

            if (index > -1) {
                vm.headerUnitList.splice(index, 1);
            }
        },
        headerRemoveHeaderUnitFromFilter(unitObj, event) {
            let vm = this;
            var index = vm.headerFilterObj.Units.indexOf(unitObj);
            if (index > -1) {
                vm.headerFilterObj.Units.splice(index, 1);
            }
            var uidIndex = vm.headerFilterObj.UnitIds.indexOf(unitObj.UnitId.toString());
            if (uidIndex > -1) {
                vm.headerFilterObj.UnitIds.splice(uidIndex, 1);
            }
            vm.headerUnitList.push(unitObj);
            if (event)
                event.stopPropagation();
        }
    },

    computed: {
        filterClientList() {
            return this.clientList.filter((client) => client.ClientId >= 1);
        },
        hasErrors() {
            return Object.keys(this.errors).length > 0;
        },
        newNotificationCount() {
            console.log("first", this.$store.getNotificationCount)
            return this.$store.getNotificationCount;
        },
        // fncIsHousekeepingTaskList() {
        //   let vm = this;
        //   if (vm.functions.fncHousekeepingTaskList && vm.functions.fncHousekeepingTaskList.isAssigned === 1) {
        //     // vm.showphone= false;
        //     return false

        //     console.log("vm.showphone===>", vm.showphone);
        //   }
        // },

        notificatoinKeyList() {
            return []; //this.$store.getters.getNotificationKeys({ "params": {} });
        },
        notificationCount() {
            if (
                this.notificatoinKeyList &&
                this.notificatoinKeyList.status == "success"
            ) {
                let count = 0;
                for (
                    let index = 0;
                    index < this.notificatoinKeyList.response.length;
                    index++
                ) {
                    if (this.notificatoinKeyList.response[index]["Status"] == 1) {
                        count++;
                    }
                }
                return count;
            }
            return 0;
        },
        // fncIsReservationNew(){
        // let  vm = this;
        // return userEntitlementList.hasOwnProperty("fncReservationNew");
        // },
        fncIsMyProfile() {
            let vm = this;
            console.log("heyyyyyy")
            if (userEntitlementList.hasOwnProperty("fncMyProfile")) {
                console.log("fncMyProfile =>", userEntitlementList);
                let fncMyProfile = userEntitlementList.fncMyProfile;
                console.log("fncMyProfile", fncMyProfile);
                return fncMyProfile;
            }
            return null;
        },
        fncIsLogout() {
            let vm = this;
            if (userEntitlementList.hasOwnProperty("fncLogout")) {
                console.log("fncLogout =>", userEntitlementList);
                let fncLogout = userEntitlementList.fncLogout;
                console.log("fncLogout", fncLogout);
                return fncLogout;
            }
            return null;
        },

        fncIsReservationNew() {
            console.log("cccccccccc", this.$store)
            let vm = this;
            let userEntitlementList = { ...vm.$store.userEntitlementList };
            console.log("bbbbbbbb", userEntitlementList)

            if (
                userEntitlementList.hasOwnProperty("fncReservationNew")
            ) {
                console.log(
                    "fncIsReservationNew =>",
                    userEntitlementList
                );
                let fncReservationNew =
                    userEntitlementList.fncReservationNew;
                console.log("fncReservationNew", fncReservationNew);
                return fncReservationNew;
            }
            return null;
        },
        fncIsMyProfile() {
            console.log("amaaa-----", {...this.$store.userEntitlementList })
            let userEntitlementList = { ...this.$store.userEntitlementList };
            let vm = this;
            if (userEntitlementList.hasOwnProperty("fncMyProfile")) {
                console.log("fncMyProfile =>", userEntitlementList);
                let fncMyProfile = userEntitlementList.fncMyProfile;
                console.log("fncMyProfile", fncMyProfile);
                return fncMyProfile;
            }
            return null;
        },
        fncIsLogout() {
            let vm = this;
            if (userEntitlementList.hasOwnProperty("fncLogout")) {
                console.log("fncLogout =>", userEntitlementList);
                let fncLogout = userEntitlementList.fncLogout;
                console.log("fncLogout", fncLogout);
                return fncLogout;
            }
            return null;
        },
        getRefreshNotificationPanelStatus() {
            console.log("this.$store.getRefreshNotificationPanel", this.$store.getRefreshNotificationPanel)
            return this.$store.getRefreshNotificationPanel;
        },

        // setupPannel() {
        //   let vm = this;
        //   if (userEntitlementList && userEntitlementList.fncClientList && userEntitlementList.fncPropertyList && userEntitlementList.fncUnitList && userEntitlementList.fncUserList && userEntitlementList.fncRoleList && userEntitlementList.fncListManagementView && userEntitlementList.fncListManagementView && userEntitlementList.fncTaxItemsView && userEntitlementList.fncClientList.isAssigned === 1 || userEntitlementList.fncPropertyList.isAssigned === 1 || userEntitlementList.fncUnitList.isAssigned === 1 || userEntitlementList.fncUserList.isAssigned === 1 || userEntitlementList.fncUserList.isAssigned === 1 || userEntitlementList.fncRoleList.isAssigned === 1 || userEntitlementList.fncListManagementView.isAssigned === 1 || userEntitlementList.fncListManagementView.isAssigned === 1 || userEntitlementList.fncTaxItemsView.isAssigned === 1) {
        //     return true;
        //   }
        //  else {
        //   return false;
        //  }
        // }
        // fncIsPropertyList(){
        //   let vm = this;
        //   if(userEntitlementList.hasOwnProperty("fncPropertyList")){

        //     let fncPropertyList =  userEntitlementList.fncPropertyList

        //     return fncPropertyList;
        //   }
        //   return null;
        // },
        // fncIsRoleList(){
        //   let vm = this;
        //   if(userEntitlementList.hasOwnProperty("fncRoleList")){
        //     console.log("fncRoleList =>",userEntitlementList);
        //     let fncRoleList =  userEntitlementList.fncRoleList
        //     console.log("fncRoleList", fncRoleList)
        //     return fncRoleList;
        //   }
        //   return null;
        // },
        // fncIsUserList(){
        //   let vm = this;
        //   if(userEntitlementList.hasOwnProperty("fncUserList")){
        //     console.log("fncUserList =>",userEntitlementList);
        //     let fncUserList =  userEntitlementList.fncUserList
        //     console.log("fncUserList", fncUserList)
        //     return fncUserList;
        //   }
        //   return null;
        // }
        notificationMsgTime() {
            return (dateValue) => {
                if (dateValue) {
                    var weekday = new Array(7);
                    weekday[0] = "Sun";
                    weekday[1] = "Mon";
                    weekday[2] = "Tue";
                    weekday[3] = "Wed";
                    weekday[4] = "Thu";
                    weekday[5] = "Fri";
                    weekday[6] = "Sat";
                    let currentDate = new Date();
                    let requestDate = new Date(dateValue);
                    var seconds = Math.floor((currentDate - requestDate) / 1000);
                    var minutes = Math.floor(seconds / 60);
                    var hours = Math.floor(minutes / 60);
                    var day = Math.floor(hours / 24);
                    let cudate = moment(currentDate).format("YYYY MM DD");
                    let rqdate = moment(requestDate).format("YYYY MM DD");
                    console.log(
                        currentDate,
                        "== currentDate == requestDate == ",
                        moment(rqdate).isSame(cudate)
                    );
                    if (seconds < 60) {
                        return seconds + " sec ago";
                    } else if (minutes < 60) {
                        return minutes + " min ago";
                    } else if (hours < 24 && moment(rqdate).isSame(cudate)) {
                        //return requestDate.getHours() + ":" + requestDate.getMinutes();
                        return moment(dateValue).format("hh:mm A");
                    } else if (day <= 1) {
                        return moment(dateValue).format("ddd hh:mm A");
                    } else if (day > 1 && day <= 7) {
                        return moment(dateValue).format("ddd hh:mm A ");
                        //return weekday[requestDate.getDay()] + " " + requestDate.getHours() + ":" + requestDate.getMinutes();
                    } else if (day > 7) {
                        return moment(dateValue).format("ddd MM/DD ");
                        return (
                            weekday[requestDate.getDay()] +
                            " " +
                            requestDate.getMonth() +
                            "/" +
                            requestDate.getDate()
                        );
                    }
                }
            }
        },
        notificationDate() {
            return (dateValue) => {
                if (dateValue) {
                    return moment(dateValue).format("MMM DD");
                }
            }
        },
    },
    created() {
        // Register rules globally to avoid "No such validator 'required' exists" error
        defineRule('required', required);
        defineRule('confirmed', confirmed);

        // Configure custom error messages
        configure({
            generateMessage: localize('en', {
                messages: {
                    required: '{field} is required.',
                    confirmed: 'The password confirmation does not match.'
                },
                names: {
                    UserPassword: 'The currentpassword field',
                    newpassword: 'The password field',
                    confirmPassword: 'The password field'
                }
            })
        });

        let vm = this;
        eventBus.$on(
            "setParentAndSubmenuListGroupIcons",
            function (selected) {
                console.log("setParentAndSubmenuListGroupIcons", selected);
                vm.parentModuleName = selected.toString();
            }
        );
        eventBus.$on(
            "setParentAndSubmenuListCalendarIcons",
            function (selected) {
                vm.parentModuleName = selected.toString();
            }
        );
        eventBus.$on("reservationListLoading", function (resLoading) {
            console.log("resLoading", resLoading);
            vm.resLoading = resLoading;
        });
        eventBus.$on("isActiveForReservations", function (selected) {
            if (selected === true) {
                vm.isActiveForCogs = false;
                vm.isActiveForNotification = false;
                vm.isActiveForChangePassword = false;
                vm.isActiveForUser = false;
                console.log("this.isActive", vm.isActiveForCogs);
                console.log("this.isActive", vm.isActiveForNotification);
                console.log("this.isActive", vm.isActiveForUser);
            }
        });
        eventBus.$on("IsCalendarIcons", function (selected) {
            console.log("in IsCalendarIcons", selected);
            // submenuListName: "ReservationsList",
            vm.parentModuleName = selected.toString();
            vm.submenuListName = "ReservationsList";
            // if (selected === true) {
            //   vm.isActiveGroupIcons = true;
            //   vm.isActiveCalendarIcons = false;
            //   vm.isActiveForReservations = true;
            // }
        });
        eventBus.$on("clearSearchText", function () {
            console.log("Clear called from module");
            vm.searchText = null;
            vm.clearResults();
        });
    },
    watch: {
        headerFilterSearchUnitNameText(searchText) {
            this.getUnitNamesBySearchText(searchText);
        },
        namespaceInstanceId() {
            //console.log("test");
            //console.log(this.namespaceInstanceId);
            //Check whether user is belongs to admin group or not
        },
        getRefreshNotificationPanelStatus(oldVal, newVal) {
            console.log(this.getRefreshNotificationPanelStatus);
            if (
                this.getRefreshNotificationPanelStatus &&
                this.isActiveForNotification
            ) {
                this.get_NotificationsList(
                    this.searchTextNotification,
                    this.filteredSubevents.join()
                );
            }
        },
    },
    mounted() {
        //this.getNotifications1();
        isProxy(this.$store) ? 'yup' : 'nope'
        const rawObjectOrArray = toRaw(this.$store)

        // this.$store = convertToPlainObject(this.$store);
  

        let vm = this.$state;
        this.$state = rawObjectOrArray
        console.log("=========nhjhv==jkuj================", vm);
        // vm.ClientName = window.localStorage.getItem('CName');
        // function convertStoreToPlainObject() {
        //     return JSON.parse(JSON.stringify(vm.$store));
        // }
        // const storess = convertStoreToPlainObject();
        // console.log('Store State as Plain Object:', vm.$store.rowsPerPage);

        this.getUserProfile();
        // vm.getClientDetailByid();
        // vm.getClientDetailList();
        // vm.GetUserEntitlementsAndDefaultProperty();
        // vm.get_NotificationCount();

        // eventBus.$on("userEntitlementList", function (payload) {
        //     console.log("userEntitlementList======>", payload);
        //     vm.functions = payload;
        //     console.log("vm.functions", vm.functions);
        // });
        // eventBus.$on(
        //     "setParentAndSubmenuListCalendarIcons",
        //     function (selected) {
        //         console.log("selected", selected);
        //         vm.parentModuleName = selected.toString();
        //         console.log("vm.parentModuleName", vm.parentModuleName);
        //         // }
        //     }
        // );
        // eventBus.$on("reservationListLoading", function (resLoading) {
        //     console.log("resLoading", resLoading);
        //     vm.resLoading = resLoading;
        // });

        // //  alert(vm.$route.name)
        // if (vm.$route.name == "ReservationList") {
        //     vm.resLoading = true;
        // } else {
        //     vm.resLoading = false;
        // }
        // // vm.getPropertyDetailList();
        // // vm.getClientDetailList();

        // $(this.$el)
        //     .find("div.dropdown ul.dropdown-menu")
        //     .click(function (e) {
        //         var isTrue = e.target.classList.contains('headerSearchResultsAmenitiesDiv') || e.target.classList.contains('filter') || e.target.classList.contains('SelHeadUnitName');

        //         if (!isTrue && (e.target.type == undefined || e.target.type != "text")) {
        //             vm.headerShowunitNameList = false;
        //         }
        //         e.stopPropagation();
        //     });
        // $(document).click(function (e) {
        //     $(".form-control.headerSearchResultsAmenities").hide();
        //     if (e.target.type == undefined || e.target.type != "text") {
        //         vm.headerShowunitNameList = false;
        //     }
        // })
    },
};
</script>
<style scoped>
.headerSearchResultsAmenitiesDiv {
    border: 1px solid #ccc;
    display: inline-block !important;
    vertical-align: middle;
    border-radius: 3px;
    width: 316px;
    line-height: 20px;
    padding: 7px !important;
}

.headerUnitname>.col-md-12>.form-group label {
    margin-top: -6px !important;
    float: left;
    margin-bottom: 0.4em;
}

.headerUnitname>.form-group label {
    min-width: 30%;
    font-size: 12px;
    color: #868686;
}

.form-control.headerSearchResultsAmenities {
    height: unset;
}

.headerSearchResultsAmenities {
    max-height: 122px;
    overflow-y: scroll;
    width: 100%;
    margin-top: 0px;
    padding: 0px !important;
    position: absolute;
    z-index: 1;
    left: 0px !important;
}

.headerSearchResultsAmenities ul li {
    padding: 10px 15px;
    border-bottom: 1px solid #dfdddd;
    cursor: pointer !important;
}

.headerSearchResultsAmenitiesDiv ul.todo-list {
    display: inline;
}

.headerSearchResultsAmenitiesDiv .filter>input {
    border: none !important;
    margin: 0px;
    font-size: 12px;
    padding: 0px im !important;
    cursor: default !important;
}

.headerSearchResultsAmenitiesDiv .filter {
    padding-top: 0px !important;
}

.headerUnitname .todo-list li {
    margin-bottom: 0;
    padding: 0;
    margin-right: 15px;
    margin-bottom: 1px !important;
    position: relative;
    top: 3px;
}

.headerSearchResultsAmenitiesDiv .todo-list li {
    display: inline-block;
}

.headerSearchResultsAmenitiesDiv .todo-list li:hover {
    cursor: auto !important;
}

.headerUnitname .tags span {
    min-width: 100px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    display: inline-block;
    padding: 5px 25px 5px 15px;
}

.headerSearchResultsAmenitiesDiv .tags span {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 300px;
    display: inline-block;
}

.headerUnitname .tags [class*="fa"] {
    top: -10px;
    position: relative;
}

.overflow-scroll li:not(:first-child):hover {
    background-color: white !important;
}

.headerSearchResultsAmenities li:hover {
    background-color: white !important;
}

.headerUnit li ul li:hover {
    background-color: white !important;
}

.headerUnit li {
    margin-bottom: 5px !important;
    cursor: default !important;
}

#headerUnitNameDropDown li {
    margin-bottom: 0px !important;
    width: 330px !important;
}

.headerActionButtons {
    padding-left: 20px !important;
    padding-top: 15px !important;
    border-top: 1px solid #f7f7f7;
    margin-top: -5px;
    display: flex;
    justify-content: space-evenly;
}

.headerActionButtons .btn-primary {
    color: #fff;
    background-color: #4d70e0 !important;
    border-color: #4d70e0 !important;
    top: 0px !important;
    width: 101px !important;
    height: 32px !important;
    margin-right: 15px !important;
}

.headerActionButtons .btn-danger {
    color: #dc3545;
    background-color: #dc3545 !important;
    border-color: #dc3545 !important;
    top: 0px !important;
    width: 101px !important;
    height: 32px !important;
    margin-right: 15px !important;
}

.headerActionButtons .btn-danger:focus {
    box-shadow: none !important;
}

.headerActionButtons .btn-plane {
    background: none !important;
    color: #dc3545 !important;
    border: transparent !important;
}



.headerSearchResultsAmenitiesDiv .tags span {
    max-width: 280px !important;
    white-space: unset;
    text-overflow: unset;
    overflow: unset;
    display: inline-block;
}

.headerSearchResultsAmenitiesDiv .tags span.SelMesUnitName .textOverflowTag p:first-child {
    color: #2d2d2d;
    font-size: 12px;
    max-width: 180px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    display: block;
    float: left;
    margin: 0;
}

.headerSearchResultsAmenitiesDiv .tags span.SelMesUnitName .textOverflowTag p:last-child {
    color: #2d2d2d;
    font-size: 12px;
    width: 100%;
    margin: 0;
}

.headerSearchResultsAmenitiesDiv .tags i {
    right: 10px;
    top: 10px !important;
    position: absolute !important;
}

.headerSearchResultsAmenitiesDiv .todo-list li {
    margin-bottom: 5px !important;
}
</style>