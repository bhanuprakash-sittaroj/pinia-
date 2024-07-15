// stores/dataStore.js
import { defineStore } from "pinia";
import moment from "moment-timezone";
import accounting from 'accounting';
import io from "socket.io-client";
import * as Toastr from 'toastr';
import eventBus from "./eventBus";
import $ from "jquery";

moment.tz.setDefault(moment.tz.guess());

Toastr.options.positionClass = "toast-bottom-right";
Toastr.options.preventDuplicates = true;

let apiIp = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ":1339" : '');

// let socket = io(apiIp);
let socket = io(apiIp, {
    // Additional options can be configured here
});

socket.on('connect', function () {
    console.log("connected...!");
});


socket.on('NotificationReceived', function (response) {
    console.log(response);

    store.dispatch("getNotificationKeys", { "params": {} })
});

socket.on('NotificationToastr', function (response) {
    store.commit('setNotificationCount', response.notificationCount);
    store.commit('setRefreshNotificationPanel', true)
    if (response.headerToastr.trim() != 'Failed Payment' && response.headerToastr.trim() != "Message Unsuccessful") {
        store.dispatch("toastr", {
            type: "success",
            header: ` ${response.headerToastr} `,
            message: ` ${response.messageToastr} `
        });
    } else {
        store.dispatch("toastr", {
            type: "error",
            header: ` ${response.headerToastr} `,
            message: ` ${response.messageToastr} `
        });
    }
});

socket.on('messageNotificationToastr', function (response) {
    store.commit('setConversation', response.dataObject);
    store.commit('setRefreshMessageNotificationPanel', true)
});

socket.on('forFinalyticcount', function (response) {
    console.log('Received data from forFinalyticcount event:', response);
    window.location.reload();
});

const dataRequestHandler = (key, params, callback) => {
    let continueTheCall = (key, params, callback) => {
        console.log("socket call is happening", key);
        console.log("socket call is happening params", params);

        socket.emit(key, params, (err, serverResponse) => {
            if (err) {
                console.error('Socket emit error:', err);
                if (!err.token && err.message === "Session Expired") {
                    console.log("inside socket.emit function error function====================");
                    console.log(err.message);
                    window.location.href = "login";
                }
                callback(err, null);
                return;
            }

            console.log("first");
            console.log("88888888888888888888", params);
            console.log("9999999999999999999", serverResponse.token);

            if (serverResponse.token) {
                console.log("101010101010");
                window.localStorage.setItem('rttoken', serverResponse.token);
            }
            callback(null, serverResponse.response);
            $(".mainBody").css("display", "");
        });
    };

    params.systemParams = {
        token: window.localStorage.getItem('rttoken'),
        Source: "Web",
        SourceId: window.location.hostname,
    };

    continueTheCall(key, params, callback);
};


const apiHttpRequest = function (apiUrl, type, params, successCallback, failureCallback) {
    let url = apiIp + "/" + apiUrl;
    axios.post(url, params)
        .then(function (response) {
            if (successCallback)
                successCallback(response);
        })
        .catch(function (error) {
            if (failureCallback)
                failureCallback(error);
        });
};

const downloadExcelFile = function (fileName, module) {
    const BASE_URL = window.location.protocol + "//" + window.location.hostname + ":1338";
    const url = `${BASE_URL}/Excel`;

    var form = $('<form/>', { action: url, method: 'POST' }).appendTo('body');
    form.append("<input type='hidden' name='fileName' value='" + fileName + "' />");
    form.append("<input type='hidden' name='module' value='" + module + "' />");
    form.append("<input type='hidden' name='token' value='" + window.localStorage.getItem('vwtoken') + "' />");
    form.submit();
};

const getFormattedAmount = function (currency, amount) {
    if (amount != undefined && amount != null && amount != "null" && amount != "undefined") {
        return currency ? accounting.formatMoney(amount,
            {
                symbol: '$', format: {
                    pos: "%s %v",
                    neg: "%s (%v)",
                    zero: "%s  %v"
                }, thousand: ",",
                precision: 2,
                decimal: "."
            }) : accounting.formatMoney(amount, {
                format: "%v",
                thousand: ",",
                precision: 0,
                decimal: "."
            });

        formatColumn()
    }
    else {
        return "";
    }
};

export const useCounterStore = defineStore("counter", {
    state: () => ({
        count: 0,
        isCurrentUserAdmin: false,
        uiPageName: "index.html",
        selectedUserDetail: null,
        notification: {},
        notificationList: {},
        userGroupInstanceId: null,
        selectedMenuId: null,
        menuInstanceId: null,
        parentMenuInstanceId: null,
        defaultSessionCount: -2,
        selectedNotificationDetail: null,
        selectedclientDetail: null,
        dashboardRouterContext: null,
        rowsPerPage: 10,
        sendApiRequest: apiHttpRequest,
        downloadExcelFile: downloadExcelFile,
        reportHttpUrl: window.location.protocol + "//" + window.location.hostname + (window.location.port ? ":3002" : ''),
        selectedPropertyId: null,
        userEntitlementList: {},
        EntityNames: {},
        defaultUserPropertyId: null,
        bus: eventBus,
        getFormattedAmount: getFormattedAmount,
        notificationCount: 0,
        refreshNotificationPanel: false,
        refreshMessageNotificationPanel: false,
        conversation: null,
        pullRUSpecProp: null,
        paymentAccountList: [],
        quickBookUserList: [],
        selectedUnitData: {},
        selectedFolioId: null
    }),
    actions: {
        increment() {
            this.count++;
            dataRequestHandler("GetUserProfile", {}, (err, response) => {
                console.log("babyyyyyyy1")
                if (err) {
                    console.error('Error fetching user profile:', err);
                } else {
                    console.log('User profile:', response);
                    if (response && response[0] && response[0].IsHostMode !== undefined) {
                        this.isHostMode = response[0].IsHostMode;
                    }
                }
            })
            // dataRequestHandler({
            //     key: "GetUserProfile",
            //     params: {},
            //     callback: (err, response) => {
            //         console.log("babyyyyyyy1")
            //         if (err) {
            //             console.error('Error fetching user profile:', err);
            //         } else {
            //             console.log('User profile:', response);
            //             if (response && response[0] && response[0].IsHostMode !== undefined) {
            //                 this.isHostMode = response[0].IsHostMode;
            //             }
            //         }
            //     }
            // });
        },
        async waitAndAdd() {
            setTimeout(() => {
                this.count++;
            }, 2000)
        },
        setFolioItemId(data) {
            this.selectedFolioId = data;
        },
        setIsCurrentUserAdmin(isCurrentUserAdmin) {
            this.isCurrentUserAdmin = isCurrentUserAdmin;
        },
        setNotificationCount(payload) {
            this.notificationCount = payload;
        },
        setpullRUSpecProp(payload) {
            this.pullRUSpecProp = payload;
        },
        setConversation(payload) {
            this.conversation = payload;
        },
        setRefreshNotificationPanel(payload) {
            this.refreshNotificationPanel = payload;
        },
        setRefreshMessageNotificationPanel(payload) {
            this.refreshMessageNotificationPanel = payload;
        },
        setUIPageName(text) {
            this.uiPageName = text;
        },
        setSelectedUserDetail(payload) {
            this.selectedUserDetail = payload;
        },
        setLeaveRouterContext(payload) {
            this.leaveRouterContext = payload;
        },
        setUserGroupInstanceId(payload) {
            this.userGroupInstanceId = payload;
        },
        setMenuInstanceId(payload) {
            this.menuInstanceId = payload;
        },
        setParentMenuInstanceId(payload) {
            this.parentMenuInstanceId = payload;
        },
        setSelectedMenuId(payload) {
            this.selectedMenuId = payload;
        },
        setSelectedNotificationDetail(payload) {
            this.selectedNotificationDetail = payload;
        },
        setDashboardRouterContext(payload) {
            this.dashboardRouterContext = payload;
        },
        setDataByType(payload) {
            this.notification[payload.NotificationIdText] = payload.data;
        },
        setNotifications(payload) {
            this.notificationList["0"] = payload.data;
        },
        setclientDetails(payload) {
            this.selectedclientDetail = payload;
        },
        setUserEntitlementList(payload) {
            console.log("setUserEntitlementList.payload => ", payload);
            this.userEntitlementList = payload;
            if (this.userEntitlementList) {
                eventBus.$emit("userEntitlementList", this.userEntitlementList);
            }
        },
        setUserEntityNames(payload) {
            console.log("setUserEntityNames.payload => ", payload);
            this.EntityNames = payload;
            if (this.EntityNames) {
                this.bus.$emit("entityNames", this.EntityNames);
            }
        },
        setDefaultPropertyId(payload) {
            this.propertyId = payload;
        },
        setUserDefaultPropertyId(payload) {
            console.log("setUserDefaultPropertyId.payload => ", payload);
            this.defaultUserPropertyId = payload;
        },
        setPaymentAccountList(payload) {
            this.paymentAccountList = payload;
        },
        setQuickbookAccountList(payload) {
            this.quickBookUserList = payload;
        },
        selectedUnit(payload) {
            console.log("payload in mutations", payload);
            this.selectedUnitData = payload.data.selectedunit;
        },
        dataRequestHandler(payload) {
            dataRequestHandler(payload.key, payload.params, payload.callback);
        },
        toastr(payload) {
            console.log("payload===>", payload)
            if (payload.type && payload.header && payload.message) {
                Toastr[payload.type](payload.message, payload.header);
            } else if (payload.type && payload.message) {
                Toastr[payload.type](payload.message);
            }
        },
        GetUserEntitlementsAndDefaultProperty(params) {
            console.log("GetUserEntitlementsAndDefaultProperty");

            if (this.hasOwnProperty("userEntitlementList") && Object.keys(this.userEntitlementList).length > 0) {
                return;
            } else {
                dataRequestHandler("GetUserEntitlementsAndDefaultProperty", {}, (error, response) => {
                    if (error) {
                        this.setUserEntitlementList(null);
                        return;
                    }

                    this.setUserEntitlementList(response.userEntitlementList);
                    this.setUserDefaultPropertyId(response.defaultPropertyId);
                    this.setUserEntityNames(response.EntityNames);
                });
            }
        }
    },

    getters: {
        doubleCount: (state) => state.count * 2,
        getNotificationDetail: (state) => (query) => {
            if (state.notification && state.notification.hasOwnProperty(query.params.notificationId)) {
                return state.notification[query.params.notificationId];
            }
            return null;
        },
        getNotificationKeys: (state) => (query) => {
            if (state.notificationList && state.notificationList.hasOwnProperty("0")) {
                return state.notificationList["0"];
            }
            return null;
        },
        getUserEntitlements: (state) => () => {
            return state.userEntitlementList;
        },
        getNotificationCount: (state) => state.notificationCount,
        getpullRUSpecProp: (state) => state.pullRUSpecProp,
        getRefreshNotificationPanel: (state) => {
            return state.refreshNotificationPanel;
        },
        getConversation: (state) => state.conversation,
        getRefreshMessageNotificationPanel: (state) => {
            return state.refreshMessageNotificationPanel;
        },
        getPaymentAccountList: (state) => {
            return state.paymentAccountList;
        },
        getQuickbookAccountList: (state) => state.quickBookUserList,
        getUnitsData: (state) => state.selectedUnitData
    }
});


// dataRequestHandler("GetUserEntitlementsAndDefaultProperty", {}, (error, response) => {
//     console.log("store.error => ", error);
//     console.log("store.response => ", response);

//     store.setUserEntitlementList(response.userEntitlementList);
//     store.setUserDefaultPropertyId(response.defaultPropertyId);
//     store.setUserEntityNames(response.EntityNames);

//     // store.state

// });