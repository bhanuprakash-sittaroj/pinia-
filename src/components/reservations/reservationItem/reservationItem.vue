<template src="./reservationItem.template.html"></template>
<script>  
    import moment from "moment-timezone";
    export default {
        name: "reservationItem",
        props: ["id", "summarycallback", "resDeatil", "changeStatus", "isHostMode"],
        data() {
            return {
                ReservationId: null,
                guestInfo: {},
                // resDeatil: [],
                entitlements: [],
                currResObj: {},
                reservationSummaryInfo: {},
                checkOutbutton: true,

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
                    Sources: [],
                    Units: [],
                    StatusList: [],

                    Columns: [],
                    PageNumber: null,
                    ItemsPerPage: null,
                    resid: null,
                    userDate: moment().format("YYYY-MM-DD"),
                },
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
            };
        },
        methods: {


            // changeStatus(status, ReservationId) {
            //     console.log("changeStatus", ReservationId);
            //     let vm = this;
            //     // vm.items = [];



            //     vm.$store.dispatch("dataRequestHandler", {
            //         key: "UpdateReservationStatus",
            //         params: {
            //             ReservationId: ReservationId,
            //             StatusId: status,
            //             IsFromRU: 0,
            //             userdate: moment().format("YYYY-MM-DD HH:mm:ss")
            //         },
            //         callback: function (err, response) {
            //             if (err) {
            //                 console.log("err in UpdateReservationStatus", err);
            //                 return
            //             }
            //             if (response) {
            //                 console.log("result in UpdateReservationStatus", response);
            //                 vm.getReservationsList();
            //                 vm.reservationSummaryInfo.statusList = response[1];
            //                 console.log("vm.reservationSummaryInfo.statusList", vm.reservationSummaryInfo.statusList);
            //                 vm.$store.dispatch("toastr", {
            //                     type: "success",
            //                     header: "Success!",
            //                     message: response[0][0].GuestReservationMessage
            //                 });
            //             }
            //         }
            //     })
            // },
            panelCallback() {
                let vm = this;
                // vm.items = [];
                // vm.filterObj.PageNumber = 1;
                vm.getReservationsList();
            },
            showReservationSummaryPanel(inst) {
                let vm = this;
                if (inst) {
                    vm.currResObj = { ReservationId: inst.ReservationId };
                    vm.summarycallback(inst);
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

            formatMoney(amount) {
                return this.$store.state.getFormattedAmount("$", amount);
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
                            vm.CheckOutbutton();

                        }
                    }
                });
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
            formatYear(date) {
                let vm = this;
                let diff = moment(date).diff(vm.today, 'months');
                return moment(date, "YYYY-MM-DD").format("YYYY");
            },

            formatDateBooked(date) {
                let vm = this;
                let diff = moment(date).diff(vm.today, 'months');
                // if (Math.abs(diff) >= 6) {
                return moment(date).format("DD MMM ");
                // }
                // else {
                //   return moment(date, "YYYY-MM-DD").format("DD MMM");
                // }

            },

            formatStartDate(date) {
                return moment(date, "YYYY-MM-DD").format("MMM DD");
            },
            formatEndDate(date) {
                return moment(date, "YYYY-MM-DD").format("MMM DD");
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
            // getReservationDetailById() {
            //     let scope = this;


            //     this.$store.dispatch("dataRequestHandler", {
            //         key: "GetReservationDetailById",
            //         params: {
            //             ModuleAction: "GetReservationDetailById",
            //             ReservationId: scope.id,
            //         },
            //         callback: function (err, response) {
            //             if (response) {
            //                 console.log("response in GetReservationDetailById", response);

            //                 scope.guestInfo = response.guestInfo;
            //                 console.log("scope.guestInfoscope.guestInfo==>",scope.guestInfo);

            //             }
            //             if (err) {
            //                 console.log("error in getReservationDetailById", err);
            //                 return;
            //             }
            //         }
            //     });

            // },

            getReservationsList: function () {
                // let vm = this;

                // console.log("today", vm.today)
                // console.log("vm.filterobj", vm.filterObj)
                // console.log("in reservations list view:", vm.filterObj.PropertyId, vm.filterObj.UnitClassId, vm.filterObj.ViewListId);


                // vm.$store.dispatch("dataRequestHandler", {
                //     key: "GetReservationsList",
                //     params: vm.filterObj,


                //     callback: function (err, response) {
                //         if (err) {
                //             console.log("err in GetReservationsList", err);
                //             return
                //         }


                //         if (response && response.ReservationId === vm.resid) {

                //             console.log("resList", response);
                //             vm.resDeatil = response.reservationList[0];
                //             console.log("vm.resDeatil", vm.resDeatil);


                //         }
                //     }
                // })

            },
        },
        computed: {
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
        },

        watch: {
            id() {
                // this.filterObj.resid = this.id;
                // this.getReservationsList();
            }
        },
        created() {
            let vm = this;
            vm.$store.state.bus.$on("headerIsChecked", function (dataobj) {
                for (var i in vm.headerColumnList) {
                    if (vm.headerColumnList[i].Label == dataobj.Label) {
                        if (dataobj.IsChecked == true) {
                            vm.$set(vm.headerColumnList[i], "IsChecked", true);
                        }
                        else {
                            vm.$set(vm.headerColumnList[i], "IsChecked", false);
                        }
                    }
                }
            });
        },

        mounted() {
            let vm = this;
            vm.GetUserEntitlementsAndDefaultProperty();
            // console.log("reservationitem");

            // console.log("reservationitem=>this.id", vm.id);
            // vm.filterObj.resid = vm.id;
            // // console.log(" vm.filterObj.resid", vm.filterObj.resid);
            // vm.getReservationsList();
           


            // vm.$store.state.bus.$on("ResSummaryUpdate", function (resObj) {
            //     console.log("ResSummaryUpdateResSummaryUpdate=>", resObj)
            //     if (vm.id == resObj.ReservationId) {
            //         vm.getReservationsList();
            //     }
            // });
         


        }
    }
</script>