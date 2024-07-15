<template src="./leftMenuComponent.template.html"></template>
<script>
import $ from "jquery";
import eventBus from "../../../stores/eventBus.js";
import { convertToPlainObject } from '../../../utils/storeUtils.js';
import { useCounterStore } from "../../../stores/counter.js";
import { isProxy, toRaw } from 'vue';
// import { useCounterStore } from "../../../stores/counter.js";
// let rawObjectOrArray = null;
export default {
    // options
    // name: "leftMenu",
    props: ["instanceId", "clientId"],
    data() {
        return {
            isActiveForReservations: true,
            isActiveCalendarIcons: false,
            isActiveGroupIcons: true,
            isBgClient: true,
            parentModuleName: "Reservations",
            submenuListName: "/",
            isBgProperty: false,
            isBgRoles: false,
            isBgUsers: false,
            isBgUnit: false,
            isBgListManagement: false,
            isBgTax: false,
            isBgledgerAccount: false,
            isBgGuests: false,
            isBgUnit: false,
            selectedMenu: null,
            isHostMode: true,
            // rawObjectOrArray: null,
        };
    },

    methods: {
        getData: function () {
            $('[data-toggle="tooltip"]').tooltip();
        },
        toggleSideBar: function () {
            $("#leftMenu").toggleClass("expand");
            $("#nav-icon3").toggleClass("open");
            $(".menuMask").toggle();
            $("#notification").removeClass("expand");
        },
        pinSideBar: function () {
            $(".mainContent").toggleClass("fix");
            $(".sideBar").toggleClass("fix");
            $(".menuMask").hide();
            var currentItem = $(".pintx");
            if ($(currentItem).text() == "Always show sidebar") {
                $(currentItem).text("Hide sidebar");
                $(".sideBar").removeClass("expand");
            } else $(currentItem).text("Always show sidebar");
            $("#nav-icon3").removeClass("open");
        },
        getUserProfile() {
            const store = useCounterStore();
            console.log("babyyyyyyyyyy", this.$state)
            store.dataRequestHandler({
                key: "GetUserProfile",
                params: {},
                callback: (err, response) => {
                    if (err) {
                        console.error('Error fetching user profile:', err);
                    } else {
                        console.log('User profile:', response);
                        if (response && response[0] && response[0].IsHostMode !== undefined) {
                            console.log("666666666666")
                            this.isHostMode = response[0].IsHostMode;
                        }
                    }
                }
            });
        },
        // getUserProfile() {

        //     let vm = this;
        //     // console.log("/////**************//////////", vm.$store.dataRequestHandler);
        //     vm.dataStore.dataRequestHandler({
        //         key: "GetUserProfile",
        //         params: {},
        //         callback: (err, response) => {
        //             if (response) {
        //                 console.log("userProfile in left menu component=>", response);
        //                 if (response[0] && response[0].IsHostMode !== undefined) {
        //                     this.isHostMode = response[0].IsHostMode;
        //                 }
        //             }
        //         }
        //     });
        
        // },
        switchClient: function () {
            window.location.href = this.$store.state.uiPageName;
        },
        redirectToUsers: function () {
            this.$router.push("/reservations");
        },
        redirectToNotifications: function () {
            this.$router.push("/notifications");
            //window.location.href = this.$store.state.uiPageName + "#notifications";
            $("#leftMenu").removeClass("expand");
            $("#nav-icon3").removeClass("open");
            $(".menuMask").hide();
        },
        redirectToUserTypes() {
            // this.isBgClient = false;
            // this.isBgProperty = false;
            // this.isBgRoles = false;
            // this.isBgUsers = true;
            // this.isBgGuests = false;
            // this.isBgUnit = false;
            // this.isBgListManagement = false;
            // this.isBgTax = false;
            // this.isBgledgerAccount = false;
            this.submenuListName = "Users";
            this.$router.push("/users");
            //window.location.href = this.$store.state.uiPageName + "#users";
            $("#leftMenu").removeClass("expand");
            $("#nav-icon3").removeClass("open");
            $(".menuMask").hide();
            $("#notification").removeClass("expand");
        },
        redirectToGuestProfile() {
            let vm = this;
            $("#notification").removeClass("expand");
            // GuestProfileList

            this.submenuListName = "GuestProfileList";
            this.$router.push("/guestProfileList");
            $("#leftMenu").removeClass("expand");
            $("#nav-icon3").removeClass("open");
            $(".menuMask").hide();

        },
        redirectToGuestprofiles() {
            // this.isBgClient = false;
            // this.isBgProperty = false;
            // this.isBgRoles = false;
            // this.isBgUsers = false;
            // this.isBgGuests = true;
            // this.isBgUnit = false;
            // this.isBgListManagement = false;
            // this.isBgTax = false;
            // this.isBgledgerAccount = false;
            this.submenuListName = "GuestProfileList";
            this.$router.push("/guestProfileList");
            //window.location.href = this.$store.state.uiPageName + "#users";
            $("#leftMenu").removeClass("expand");
            $("#nav-icon3").removeClass("open");
            $(".menuMask").hide();
        },
        redirectToUserGroups() {
            // this.isBgClient = false;
            // this.isBgProperty = false;
            // this.isBgRoles = true;
            // this.isBgUsers = false;
            // this.isBgGuests = false;
            // this.isBgUnit = false;
            // this.isBgListManagement = false;
            // this.isBgTax = false;
            // this.isBgledgerAccount = false;
            this.submenuListName = "RoleList";
            this.$router.push("/roles");
            //window.location.href = this.$store.state.uiPageName + "#userGroupList";
            $("#leftMenu").removeClass("expand");
            $("#nav-icon3").removeClass("open");
            $(".menuMask").hide();
            $("#notification").removeClass("expand");
        },
        redirectToIntegrationPage() {
            // this.isBgClient = false;
            // this.isBgProperty = false;
            // this.isBgRoles = true;
            // this.isBgUsers = false;
            // this.isBgGuests = false;
            // this.isBgUnit = false;
            // this.isBgListManagement = false;
            // this.isBgTax = false;
            // this.isBgledgerAccount = false;
            this.submenuListName = "IntegrationPage";
            this.$router.push("/integrationPage");
            //window.location.href = this.$store.state.uiPageName + "#userGroupList";
            $("#leftMenu").removeClass("expand");
            $("#nav-icon3").removeClass("open");
            $(".menuMask").hide();
            $("#notification").removeClass("expand");
        },
        redirectToPaymentReports() {
            this.submenuListName = "PaymentReports";
            this.$router.push("/PaymentReports");
            $("#leftMenu").removeClass("expand");
            $("#nav-icon3").removeClass("open");
            $(".menuMask").hide();
            eventBus.$emit('mailDev', "");
            $("#notification").removeClass("expand");
        },
        redirectToDashboard() {
            this.submenuListName = "Dashboard";
            this.$router.push("/Dashboard");
            $("#leftMenu").removeClass("expand");
            $("#nav-icon3").removeClass("open");
            $(".menuMask").hide();
        },
        redirectToChangePassword() {
            this.$router.push("/reservations");
            window.location.href = this.$store.state.uiPageName + "#changePassword";
            $("#leftMenu").removeClass("expand");
            $("#nav-icon3").removeClass("open");
            $(".menuMask").hide();
        },
        redirectToReservationsList() {
            this.submenuListName = "Reservations";
            this.$router.push("/ReservationList");
            this.isActiveForReservations = true;
            console.log("here in left pannel");
            eventBus.$emit(
                "isActiveForReservations",
                this.isActiveForReservations
            );
            eventBus.$emit("clearSearchText");
            eventBus.$emit('mailDev', "");
            $("#notification").removeClass("expand");
            //window.location.href = this.$store.state.uiPageName + "#reservations";
        },
        redirectToTapeChartGrid() {
            this.submenuListName = "TapeChartGrid";
            this.$router.push("/tapechartGrid");
            this.isActiveForReservations = true;
            eventBus.$emit(
                "isActiveForReservations",
                this.isActiveForReservations
            );
            eventBus.$emit('mailDev', "");
            //window.location.href = this.$store.state.uiPageName + "#reservations";
        },
        redirectToTapeChart() {
            this.submenuListName = "CalendarView";
            $("#notification").removeClass("expand");
            this.$router.push("/calendarView");
            this.isActiveForReservations = true;
            eventBus.$emit(
                "isActiveForReservations",
                this.isActiveForReservations
            );
            //window.location.href = this.$store.state.uiPageName + "#reservations";
            eventBus.$emit('mailDev', "")
        },
        // isEmptyCart(){
        //   if(this.checkedProperty.isAssigned === 1){
        //      return false;
        //     }else{
        //      this.$router.push("/reservationList");
        //     }
        // },
        redirectToRoomInventory() {
            console.log("here");
            let vm = this;
            (vm.submenuListName = "RoomInventoryDetail"),
                vm.$router.push("/roomInventoryDetail");
        },
        redirectToProperty() {
            // this.isBgClient = false;
            // this.isBgProperty = true;
            // this.isBgRoles = false;
            // this.isBgUsers = false;
            // this.isBgGuests = false;
            // this.isBgUnit = false;
            // this.isBgListManagement = false;
            // this.isBgTax = false;
            // this.isBgledgerAccount = false;
            this.submenuListName = "PropertyList";
            this.$router.push("/propertyList");
            $("#notification").removeClass("expand");
            // window.location.href = this.$store.state.uiPageName+"#propertyList";
        },
        redirectToClient() {
            // this.isBgClient = true;
            // this.isBgProperty = false;
            // this.isBgRoles = false;
            // this.isBgUsers = false;
            // this.isBgGuests = false;
            // this.isBgUnit = false;
            // this.isBgListManagement = false;
            // this.isBgTax = false;
            // this.isBgledgerAccount = false;
            this.submenuListName = "ClientList";
            this.$router.push("/clientList");
            $("#notification").removeClass("expand");
        },
        redirectToUnit() {
            // this.isBgClient = false;
            // this.isBgProperty = false;
            // this.isBgRoles = false;
            // this.isBgUsers = false;
            // this.isBgGuests = false;
            // this.isBgUnit = true;
            // this.isBgListManagement = false;
            // this.isBgTax = false;
            // this.isBgledgerAccount = false;
            this.submenuListName = "UnitList";
            this.$router.push("/unitList");
            $("#notification").removeClass("expand");
        },
        redirectToUnitType() {
            // this.isBgClient = false;
            // this.isBgProperty = false;
            // this.isBgRoles = false;
            // this.isBgUsers = false;
            // this.isBgGuests = false;
            // this.isBgUnit = true;
            // this.isBgListManagement = false;
            // this.isBgTax = false;
            // this.isBgledgerAccount = false;
            this.submenuListName = "UnitTypeList";
            this.$router.push("/unitTypeList");
        },

        redirectToRatePlan() {
            this.submenuListName = "ratePlanList";
            this.$router.push("/ratePlanList");
            $("#notification").removeClass("expand");
        },

        redirectToListManagement() {
            // this.isBgClient = false;
            // this.isBgProperty = false;
            // this.isBgRoles = false;
            // this.isBgUsers = false;
            // this.isBgUnit = false;
            // this.isBgGuests = false;
            // this.isBgListManagement = true;
            // this.isBgTax = false;
            // this.isBgledgerAccount = false;
            this.submenuListName = "listManagement";
            this.$router.push("/ListManagement");
            $("#notification").removeClass("expand");
        },

        redirectToNotificationTemplates() {
            this.submenuListName = "templatesList";
            this.$router.push("/templatesList");
            $("#notification").removeClass("expand");
        },
        redirectToBotScreen() {
            this.submenuListName = "BotsList";
            this.$router.push("/BotsList");
            $("#notification").removeClass("expand");
        },

        redirectToTaxPage() {
            // this.isBgClient = false;
            // this.isBgProperty = false;
            // this.isBgRoles = false;
            // this.isBgUsers = false;
            // this.isBgUnit = false;
            // this.isBgGuests = false;
            // this.isBgListManagement = false;
            // this.isBgTax = true;
            // this.isBgledgerAccount = false;
            this.submenuListName = "tax";
            this.$router.push("/tax");
            $("#notification").removeClass("expand");
        },
        setParentAndSubmenuList() {
            console.log("mel_advit", {...this.$router.name});
            let vm = this;
            let routesnew = { ...vm.$route }
            console.log("vmmmmmmmmm", routesnew);
            console.log("vm.$router.name", vm.$route.name);
            let routerName = vm.$route.name; 
            // routerName = "ReservationList";  
            console.log("3333333333333333", routerName)  
            if (
                routerName === "ReservationList" ||
                routerName === "ReservationDetail"
            ) {
                vm.submenuListName = "/";
                vm.parentModuleName = "Reservations";
                vm.submenuListName = "Reservations";
                eventBus.$emit(
                    "setParentAndSubmenuListCalendarIcons",
                    vm.parentModuleName
                );
            }
            // if(routerName === 'ReservationDetail'){
            //   vm.submenuListName ="";
            //   vm.parentModuleName = "ReservationDetail";
            //   eventBus.$emit('setParentAndSubmenuListCalendarIcons', vm.parentModuleName);
            // }

            if (routerName === "PropertyList" || routerName === "PropertyDetail") {
                vm.submenuListName = "PropertyList";
                vm.parentModuleName = "Admin";

                eventBus.$emit(
                    "setParentAndSubmenuListGroupIcons",
                    vm.parentModuleName
                );
            }

            if (routerName === "ClientList" || routerName === "ClientDetail") {
                vm.submenuListName = "ClientList";
                vm.parentModuleName = "Admin";
                eventBus.$emit(
                    "setParentAndSubmenuListGroupIcons",
                    vm.parentModuleName
                );
            }

            // if (routerName === "IntegrationPage" || routerName === "bookingEnginedetail" || routerName === "openApiTokenDetail") {
            //   vm.submenuListName = "IntegrationPage";
            //   vm.parentModuleName = "Admin";

            //   eventBus.$emit(
            //     "setParentAndSubmenuListGroupIcons",
            //     vm.parentModuleName
            //   );
            // }

            if (routerName === "UnitList" || routerName === "UnitDetail") {
                vm.submenuListName = "UnitList";
                vm.parentModuleName = "Admin";

                eventBus.$emit(
                    "setParentAndSubmenuListGroupIcons",
                    vm.parentModuleName
                );
            }
            if (routerName === "UnitTypeList" || routerName === "UnitTypeDetail") {
                vm.submenuListName = "UnitTypeList";
                vm.parentModuleName = "Admin";

                eventBus.$emit(
                    "setParentAndSubmenuListGroupIcons",
                    vm.parentModuleName
                );
            }

            if (routerName === "RoleList" || routerName === "RoleDetail") {
                vm.submenuListName = "RoleList";
                vm.parentModuleName = "Admin";

                eventBus.$emit(
                    "setParentAndSubmenuListGroupIcons",
                    vm.parentModuleName
                );
            }

            if (routerName === "Users" || routerName === "UserDetail") {
                vm.submenuListName = "Users";
                vm.parentModuleName = "Admin";

                eventBus.$emit(
                    "setParentAndSubmenuListGroupIcons",
                    vm.parentModuleName
                );
            }

            if (
                routerName === "GuestProfileList" ||
                routerName === "GuestProfileListDetail"
            ) {
                vm.submenuListName = "GuestProfileList";
                vm.parentModuleName = "Reservations";

                eventBus.$emit(
                    "setParentAndSubmenuListGroupIcons",
                    vm.parentModuleName
                );
            }

            if (routerName === "listManagement") {
                vm.submenuListName = "listManagement";
                vm.parentModuleName = "Admin";

                eventBus.$emit(
                    "setParentAndSubmenuListGroupIcons",
                    vm.parentModuleName
                );
            }

            if (routerName === "templatesList" || routerName === "notificationTemplate") {
                vm.submenuListName = "templatesList";
                vm.parentModuleName = "Admin";
                eventBus.$emit(
                    "setParentAndSubmenuListGroupIcons",
                    vm.parentModuleName
                );
            }
            if (routerName === "BotsList" || routerName === "BotDetail") {
                vm.submenuListName = "BotsList";
                vm.parentModuleName = "Admin";
                eventBus.$emit(
                    "setParentAndSubmenuListGroupIcons",
                    vm.parentModuleName
                );
            }


            if (routerName === "IntegrationPage" || routerName === "bookingEnginedetail" || routerName === "openApiTokenDetail" || routerName === "wheelhouseIntegrationDetail" || routerName === "finalyticIntegrationDetail" || routerName === "slimCdIntegrationDetail") {
                vm.submenuListName = "IntegrationPage";
                vm.parentModuleName = "Admin";

                eventBus.$emit(
                    "setParentAndSubmenuListGroupIcons",
                    vm.parentModuleName
                );
            }
            // if (routerName === "PaymentReports") {
            //   vm.submenuListName = "PaymentReports";
            //   vm.parentModuleName = "Admin";

            //   eventBus.$emit(
            //     "setParentAndSubmenuListGroupIcons",
            //     vm.parentModuleName
            //   );
            // }

            if (routerName === "tax" || routerName === "taxDetail") {
                vm.submenuListName = "tax";
                vm.parentModuleName = "Admin";

                eventBus.$emit(
                    "setParentAndSubmenuListGroupIcons",
                    vm.parentModuleName
                );
            }
            if (
                routerName === "ratePlanList" || routerName === "ratePlanDetail") {
                vm.submenuListName = "ratePlanList";
                vm.parentModuleName = "Admin";

                eventBus.$emit(
                    "setParentAndSubmenuListGroupIcons",
                    vm.parentModuleName
                );
            }
            // if (
            //   routerName === "bookingEngineList" ||
            //   routerName === "bookingEnginedetail"
            // ) {
            //   vm.submenuListName = "bookingEngineList";
            //   vm.parentModuleName = "Admin";

            //   eventBus.$emit(
            //     "setParentAndSubmenuListGroupIcons",
            //     vm.parentModuleName
            //   );
            // }

            if (
                routerName === "RestrictionList" ||
                routerName === "RestrictionDetail"
            ) {
                vm.submenuListName = "RestrictionList";
                vm.parentModuleName = "Admin";

                eventBus.$emit(
                    "setParentAndSubmenuListGroupIcons",
                    vm.parentModuleName
                );
            }
            if (routerName === "HouseKeepingStatus") {
                vm.submenuListName = "HouseKeepingStatus";
                vm.parentModuleName = "Reservations";

                eventBus.$emit(
                    "setParentAndSubmenuListGroupIcons",
                    vm.parentModuleName
                );
            }
            if (routerName === "MessageInbox") {
                vm.submenuListName = "MessageInbox";
                vm.parentModuleName = "Reservations";

                eventBus.$emit(
                    "setParentAndSubmenuListGroupIcons",
                    vm.parentModuleName
                );
            }
            if (routerName === "TempoEmailServiceStatus") {
                vm.submenuListName = "TempoEmailServiceStatus";
                vm.parentModuleName = "Reservations";

                eventBus.$emit(
                    "setParentAndSubmenuListGroupIcons",
                    vm.parentModuleName
                );
            }
            if (routerName === "RatesOverride" || routerName === "RateOverrideList") {
                vm.submenuListName = "RateOverrideList";
                vm.parentModuleName = "Admin";

                eventBus.$emit(
                    "setParentAndSubmenuListGroupIcons",
                    vm.parentModuleName
                );
            }
            if (routerName === "RoomInventoryDetail") {
                vm.submenuListName = "RoomInventoryDetail";
                vm.parentModuleName = "Reservations";

                eventBus.$emit(
                    "setParentAndSubmenuListGroupIcons",
                    vm.parentModuleName
                );
            }
            if (routerName === "CalendarView") {
                vm.submenuListName = "CalendarView";
                vm.parentModuleName = "Reservations";

                eventBus.$emit(
                    "setParentAndSubmenuListGroupIcons",
                    vm.parentModuleName
                );
            }
            if (routerName === "PaymentReports") {
                vm.submenuListName = "PaymentReports";
                vm.parentModuleName = "Reservations";

                eventBus.$emit(
                    "setParentAndSubmenuListGroupIcons",
                    vm.parentModuleName
                );
            }
            if (routerName === "Dashboard") {
                vm.submenuListName = "Dashboard";
                vm.parentModuleName = "Reservations";
                eventBus.$emit(
                    "setParentAndSubmenuListGroupIcons",
                    vm.parentModuleName
                );
            }

            console.log("in setParentAndSubmenuList routerName", routerName);
        },

        redirectToledgerAccount() {
            // this.isBgClient = false;
            // this.isBgProperty = false;
            // this.isBgRoles = false;
            // this.isBgUsers = false;
            // this.isBgUnit = false;
            // this.isBgGuests = false;
            // this.isBgListManagement = false;
            // this.isBgTax = false;
            // this.isBgledgerAccount = true;
            this.submenuListName = "ledgerAccount";
            this.$router.push("/ledgerAccount");
        },
        redirectToHouseKeepingStatus() {
            this.submenuListName = "HouseKeepingStatus";
            this.$router.push("/houseKeepingStatus");
            eventBus.$emit('mailDev', "");
            $("#notification").removeClass("expand");
        },
        redirectToEmailServiceStatus() {
            this.submenuListName = "TempoEmailServiceStatus";
            this.$router.push("/TempoEmailServiceStatus");
            $("#notification").removeClass("expand");
            eventBus.$emit('mailDev', "maildev")

        },
        redirectToMessageInbox() {
            this.submenuListName = "MessageInbox";
            this.$router.push("/messageInbox/-1/-1");
            eventBus.$emit('mailDev', "");
            $("#notification").removeClass("expand");

        },
        redirectToBE() {
            this.submenuListName = "bookingEngineList";
            this.$router.push("/bookingEngineList");
        },
        redirectToRestrictions() {
            this.submenuListName = "RestrictionList";
            this.$router.push("/restrictionList");
        },
        redirectToRatesOverride() {
            this.submenuListName = "RateOverrideList";
            this.$router.push("/rateOverrideList");
        }
    },
    computed: {
        isCurrentUserAdmin() {
            //return this.$store.state.isCurrentUserAdmin;
            return true;
        },
        fncIsMenuAdmin() {
            let vm = this;
            let userEntitlementList = { ...vm.$store };
            console.log("bbbbbbbb1", userEntitlementList)
            if (userEntitlementList.hasOwnProperty("fncMenuAdmin"))
                return userEntitlementList.hasOwnProperty(
                    "fncMenuAdmin"
                );
        },
        fncIsMenuReservations() {
            let vm = this;
            if (
                userEntitlementList.hasOwnProperty(
                    "fncMenuReservations"
                )
            )
                return userEntitlementList.fncMenuReservations;

            return false;
        },
        fncIsUserList() {
            let vm = this;
            if (userEntitlementList.hasOwnProperty("fncUserList")) {
                console.log("fncUserList =>", userEntitlementList);
                let fncUserList = userEntitlementList.fncUserList;
                console.log("fncUserList", fncUserList);
                return fncUserList;
            }
            return null;
        },
        fncIsPropertySelect() {
            let vm = this;
            if (
                userEntitlementList.hasOwnProperty("fncPropertySelect")
            ) {
                // console.log("fncPropertyList =>",userEntitlementList);
                let fncPropertySelect =
                    userEntitlementList.fncPropertySelect;
                // console.log("fncPropertyList", fncPropertyList)
                //return userEntitlementList.hasOwnProperty("fncPropertySave") ? userEntitlementList.fncPropertySave : null;
                return fncPropertySelect;
            }
            return null;
        },

        fncIsUnitSelect() {
            let vm = this;
            if (userEntitlementList.hasOwnProperty("fncUnitSelect")) {
                // console.log("fncPropertyList =>",userEntitlementList);
                let fncUnitSelect = userEntitlementList.fncUnitSelect;
                // console.log("fncPropertyList", fncPropertyList)
                //return userEntitlementList.hasOwnProperty("fncPropertySave") ? userEntitlementList.fncPropertySave : null;
                return fncUnitSelect;
            }
            return null;
        },

        fncIsRoleSelect() {
            let vm = this;
            if (userEntitlementList.hasOwnProperty("fncRoleSelect")) {
                // console.log("fncPropertyList =>",userEntitlementList);
                let fncRoleSelect = userEntitlementList.fncRoleSelect;
                // console.log("fncPropertyList", fncPropertyList)
                //return userEntitlementList.hasOwnProperty("fncPropertySave") ? userEntitlementList.fncPropertySave : null;
                return fncRoleSelect;
            }
            return null;
        },

        fncIsUnitSelect() {
            let vm = this;
            if (userEntitlementList.hasOwnProperty("fncUnitSelect")) {
                // console.log("fncPropertyList =>",userEntitlementList);
                let fncUnitSelect = userEntitlementList.fncUnitSelect;
                // console.log("fncPropertyList", fncPropertyList)
                //return userEntitlementList.hasOwnProperty("fncPropertySave") ? userEntitlementList.fncPropertySave : null;
                return fncUnitSelect;
            }
            return null;
        },
        fncIsUserSelect() {
            let vm = this;
            if (userEntitlementList.hasOwnProperty("fncUserSelect")) {
                // console.log("fncPropertyList =>",userEntitlementList);
                let fncUserSelect = userEntitlementList.fncUserSelect;
                // console.log("fncPropertyList", fncPropertyList)
                //return userEntitlementList.hasOwnProperty("fncPropertySave") ? userEntitlementList.fncPropertySave : null;
                return fncUserSelect;
            }
            return null;
        },
        fncIsListManagementView() {
            let vm = this;
            if (
                userEntitlementList.hasOwnProperty(
                    "fncListManagementView"
                )
            ) {
                // console.log("fncPropertyList =>",userEntitlementList);
                let fncListManagementView =
                    userEntitlementList.fncListManagementView;
                // console.log("fncPropertyList", fncPropertyList)
                //return userEntitlementList.hasOwnProperty("fncPropertySave") ? userEntitlementList.fncPropertySave : null;
                return fncListManagementView;
            }
            return null;
        },
        fncIsTaxItemsView() {
            let vm = this;
            if (
                userEntitlementList.hasOwnProperty("fncTaxItemsView")
            ) {
                // console.log("fncPropertyList =>",userEntitlementList);
                let fncTaxItemsView =
                    userEntitlementList.fncTaxItemsView;
                // console.log("fncPropertyList", fncPropertyList)
                //return userEntitlementList.hasOwnProperty("fncPropertySave") ? userEntitlementList.fncPropertySave : null;
                return fncTaxItemsView;
            }
            return null;
        },
        fncIsReservationSelect() {
            let vm = this;
            let userEntitlementList = { ...vm.$store };
            console.log("bbbbbbb2b", userEntitlementList)
            if (
                userEntitlementList.hasOwnProperty(
                    "fncReservationSelect"
                )
            ) {
                // console.log("fncPropertyList =>",userEntitlementList);
                let fncReservationSelect =
                    userEntitlementList.fncReservationSelect;
                // console.log("fncPropertyList", fncPropertyList)
                //return userEntitlementList.hasOwnProperty("fncPropertySave") ? userEntitlementList.fncPropertySave : null;
                return fncReservationSelect;
            }
            return null;
        },
        fncIsPaymentReport() {
            let vm = this;
            let userEntitlementList = { ...vm.$store.userEntitlementList };
            console.log("*---***************----***", userEntitlementList)
            if (
                userEntitlementList.hasOwnProperty("fncPaymentsReports")
            ) {
                return userEntitlementList.hasOwnProperty(
                    "fncPaymentsReports"
                )
                    ? userEntitlementList.fncPaymentsReports
                    : userEntitlementList.fncPaymentsReports;
            }
            console.log("userEntitlementList---------------=========", userEntitlementList)
        },
        fncIsSalesReport() {
            let vm = this;
            let userEntitlementList = { ...vm.$store.userEntitlementList };
            console.log("bbbbbbbb2", userEntitlementList)
            if (
                userEntitlementList.hasOwnProperty("fncFolioReports")
            ) {
                return userEntitlementList.hasOwnProperty(
                    "fncFolioReports"
                )
                    ? userEntitlementList.fncFolioReports
                    : null;
            }
        },

        // fncIsHousekeepingTaskList(){
        //   let vm = this;
        //   if (
        //     userEntitlementList.hasOwnProperty("fncHousekeepingTaskList")
        //   ) {

        //     let fncHousekeepingTaskList =
        //       userEntitlementList.fncHousekeepingTaskList;

        //     return fncHousekeepingTaskList;
        //   }
        //   return null;
        // },
        // houseKeeperIcon() {
        //   let vm = this;
        //   if (userEntitlementList.hasOwnProperty("fncHousekeepingTaskList") && userEntitlementList.hasOwnProperty("fncInchargeTaskListView")) {
        //   }
        //   if(userEntitlementList.fncHousekeepingTaskList.isAssigned === 1 && userEntitlementList.fncInchargeTaskListView.isAssigned === 1 ){
        //     return true;
        //   }
        //   else{
        //     return false;
        //   }
        // },

        fncIsClientSelect() {
            let vm = this;
            if (
                userEntitlementList.hasOwnProperty("fncClientSelect")
            ) {
                // console.log("fncPropertyList =>",userEntitlementList);
                let fncClientSelect =
                    userEntitlementList.fncClientSelect;
                // console.log("fncPropertyList", fncPropertyList)
                //return userEntitlementList.hasOwnProperty("fncPropertySave") ? userEntitlementList.fncPropertySave : null;
                return fncClientSelect;
            }
            return null;
        },
        fncIsRoleList() {
            let vm = this;
            if (userEntitlementList.hasOwnProperty("fncRoleList")) {
                console.log("fncRoleList =>", userEntitlementList);
                let fncRoleList = userEntitlementList.fncRoleList;
                console.log("fncRoleList", fncRoleList);
                return fncRoleList;
            }
            return null;
        },
        fncIsHousekeepingView() {
            let vm = this;
            let userEntitlementList = { ...vm.$store };
            console.log("bbbbbbbb3", userEntitlementList)
            if (
                userEntitlementList.hasOwnProperty("fncHousekeeper") &&
                userEntitlementList.hasOwnProperty(
                    "fncHousekeepingInspector"
                ) &&
                userEntitlementList.hasOwnProperty(
                    "fncAssignHousekeeper"
                )
            ) {
                if (
                    userEntitlementList.fncHousekeeper.isAssigned == -1 &&
                    userEntitlementList.fncHousekeepingInspector
                        .isAssigned == -1 &&
                    userEntitlementList.fncAssignHousekeeper.isAssigned ==
                    -1
                ) {
                    return false;
                } else if (
                    userEntitlementList.fncHousekeeper.isAssigned == 1
                ) {
                    return true;
                } else if (
                    userEntitlementList.fncHousekeepingInspector
                        .isAssigned == 1
                ) {
                    return true;
                } else if (
                    userEntitlementList.fncAssignHousekeeper.isAssigned ==
                    1
                ) {
                    return true;
                }
            }
        }
    },
    watch: {
        $route: "setParentAndSubmenuList"
    },
    created() {
        let vm = this;
        eventBus.$on("isActiveForCogs", function (selected) {
            if (selected === true) {
                vm.isActiveForReservations = false;
                console.log("this.isActive", vm.isActiveForReservations);
            }
        });
        eventBus.$on("isActiveForUser", function (selected) {
            if (selected === true) {
                vm.isActiveForReservations = false;
                console.log("this.isActive", vm.isActiveForReservations);
            }
        });
        eventBus.$on("IsCalendarIcons", function (selected) {
            console.log("in IsCalendarIcons", selected);
            // submenuListName: "ReservationsList",
            vm.parentModuleName = selected.toString();
            vm.submenuListName = "Reservations";
        });
        eventBus.$on("IsGroupIcons", function (selected) {
            console.log("IsGroupIcons", selected);
            vm.parentModuleName = selected.toString();
            vm.submenuListName = "ClientList";
        });
        eventBus.$on("RefreshParentMenu", function () {
            vm.setParentAndSubmenuList();
        });
    },
    mounted() {
        // const counterStore = useCounterStore();
        // console.log("bhanu1", { ...this.counterStore.dataRequestHandler });
        // convertToPlainObject(this.counterStore);
        // console.log("Apppppppppppppp22222222223333333333", this.counterStore.dataRequestHandler);
            //this.getData();
            // this.$on('loadA', function (selected) {
            //   console.log("loadA => ", selected);
            // });
            isProxy(this.$store) ? 'yup' : 'nope'
            const rawObjectOrArray = toRaw(this.$store)

            // this.$store = convertToPlainObject(this.$store);
        console.log("=========nhjhv==jkuj================", rawObjectOrArray._hmrPayload.actions.dataRequestHandler);

            let vm = this;
        vm.$state = rawObjectOrArray
        
            // console.log("=========nhjhv==================", {vm.$store});
            // vm.GetUserEntitlementsAndDefaultProperty()
            vm.setParentAndSubmenuList();
            vm.getUserProfile();
            eventBus.$on("setParentAndSubmenuListCalendarIcons", function (
                selected
            ) {
                console.log("selected", selected);
                vm.submenuListName = selected.toString();
                console.log("vm.submenuListName", vm.submenuListName);
                // }
            });
            eventBus.$on("cogs", function (selected) {
                console.log("selected", selected);
                vm.submenuListName = selected.toString();
                console.log("vm.submenuListName", vm.submenuListName);
                // }
            });
            eventBus.$on("calendar", function (selected) {
                console.log("selected", selected);
                vm.submenuListName = selected.toString();
                console.log("vm.submenuListName", vm.submenuListName);
                // }
            });
     
    }
};
</script>