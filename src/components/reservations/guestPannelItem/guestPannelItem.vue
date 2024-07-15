<template src="./guestPannelItem.template.html"></template>
<script>
    import moment from "moment-timezone";
    export default {
        // options
        name: "guestPannelItem",
        props: ["id", "guestDetail", "callBack"],
        data() {
            return {
                listType: 'list',
                guestProfileList: [],
                loading: true,
                isGreyOut: false,
                linearProgress: false,
                items: [],
                filterObj: {
                    SortBy: null,
                    SortOrder: null,
                    PageNumber: 1
                },
                headerColumnList: {
                    Actions: { Label: "Actions", IsChecked: true, ColumnName: "Actions", className: 'gp-actions-cell' },
                    GuestName: {
                        Label: "Guest Name",
                        IsChecked: true,
                        ColumnName: "GuestFirstName",
                        class: "filterLoad",
                        isAscOrDesc: null,
                        className: 'gp-name-cell',
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
                            CityName: {
                                ColumnName: "CityName",
                                isSortLoading: false,
                                Label: "City Name",
                                SortOder: '',
                                isActive: "",
                                isSortAscOrDesc: ''
                            },
                            StateName: {
                                ColumnName: "StateName",
                                isSortLoading: false,
                                Label: "State Name",
                                SortOder: '',
                                isActive: "",
                                isSortAscOrDesc: ''
                            },
                            CountryName: {
                                ColumnName: "CountryName",
                                isSortLoading: false,
                                Label: "Country Name",
                                SortOder: '',
                                isActive: "",
                                isSortAscOrDesc: ''
                            },
                        }
                    },
                    Source: {
                        Label: "Source", IsChecked: true, ColumnName: "SourceName", class: "filterLoad", isAscOrDesc: null, className: 'gp-source-cell',
                        sortLabels: {
                            SourceName: {
                                ColumnName: "SourceName",
                                isSortLoading: false,
                                Label: "Source Name",
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
                            },
                            BookedOnDate: {
                                ColumnName: "BookedOnDate",
                                isSortLoading: false,
                                Label: "Date Booked On",
                                SortOder: '',
                                isActive: "",
                                isSortAscOrDesc: ''
                            }
                        }
                    },


                    History: {
                        Label: "History", IsChecked: true, ColumnName: "Revenue", class: "filterLoad", isAscOrDesc: null, className: 'gp-history-cell',
                        sortLabels: {
                            Revenue: {
                                ColumnName: "Revenue",
                                isSortLoading: false,
                                Label: "Revenue",
                                SortOder: '',
                                isActive: "",
                                isSortAscOrDesc: ''
                            },
                            Stays: {
                                ColumnName: "Stays",
                                isSortLoading: false,
                                Label: "Stays",
                                SortOder: '',
                                isActive: "",
                                isSortAscOrDesc: ''
                            }
                        }
                    },



                    LastStay: {
                        Label: "Last Stay", IsChecked: true, ColumnName: "ArrivalDate", class: "filterLoad", className: 'gp-laststay-cell',
                        sortLabels: {
                            ArrivalDate: {
                                ColumnName: "ArrivalDate",
                                isSortLoading: false,
                                Label: "Last Stay",
                                SortOder: '',
                                isActive: "",
                                isSortAscOrDesc: ''
                            },
                            PropertyNickName: {
                                ColumnName: "PropertyNickName",
                                isSortLoading: false,
                                Label: "Property Nick Name",
                                SortOder: '',
                                isActive: "",
                                isSortAscOrDesc: ''
                            },
                            UnitNickName: {
                                ColumnName: "UnitNickName",
                                isSortLoading: false,
                                Label: "Unit Nick Name",
                                SortOder: '',
                                isActive: "",
                                isSortAscOrDesc: ''
                            }

                        }
                    },
                    Status: {
                        Label: "Status", IsChecked: true, ColumnName: "StatusName", class: "filterLoad", isAscOrDesc: null, className: 'gp-status-cell',
                        sortLabels: {
                            StatusName: {
                                ColumnName: "StatusName",
                                isSortLoading: false,
                                Label: "Status Name",
                                SortOder: '',
                                isActive: "",
                                isSortAscOrDesc: ''
                            }
                        }
                    },
                },
                guestProfileListSearch: "",
                propertyList: [],
                statusList: [],
                statusId: 1,
                propertyId: -1
            };
        },
        methods: {
            sendGuestInfoToDetail(inst){
                let vm = this;
                if(inst){
                    vm.callBack(inst);
                }

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
                    this.Get_GuestProfileList();
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
            getPropertyMetaData: function () {
                let vm = this;
                vm.$store.dispatch("dataRequestHandler", {
                    key: "GetPropertiesBySearchText",
                    params: {},
                    callback: function (err, response) {
                        if (err) {
                            return;
                        }
                        if (response) {
                            console.log("GetPropertiesBySearchText==>", response);
                            vm.propertyList.splice(0, vm.propertyList.length, ...response.propertyList);
                            vm.statusList.splice(0, vm.statusList.length, ...response.statusList);
                        }
                    }
                });
            },
            Searchtext() {
                let vm = this;
                clearTimeout(vm.timeout);
                vm.timeout = setTimeout(function () {
                    vm.Get_GuestProfileList();
                }, 1000);
            },
            clearGuestProfileListSearch() {
                let vm = this;
                vm.items = [];
                vm.guestProfileListSearch = "";
                vm.Get_GuestProfileList();
            },
            createReservationWithThisGuest(guestInfo) {
                let vm = this;
                vm.$router.push("/newReservation/" + -1 + '/' + guestInfo.GuestProfileId + '/' + guestInfo.AccountType);


            },
            ascSort(sortBy, sortOrder) {
                let vm = this;
                vm.items = [];
                vm.guestProfileList = [];
                vm.loading = true;
                // vm.filterObj.PageNumber = 1;
                if (sortOrder == '') {
                    sortOrder = 'desc'
                }
                console.log("sortBy", sortBy);
                vm.filterObj.SortBy = sortBy;
                vm.filterObj.SortOrder = sortOrder;
                vm.linearProgress = true;
                vm.isGreyOut = true;
                // vm.viewAttrsChanged = false;
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
                vm.Get_GuestProfileList();
            },
            formatMoney(amount) {
                return this.$store.state.getFormattedAmount("$", amount);
            },
            formatDate(date) {
                let vm = this;
                if (date) {
                    return moment(date).format("DD MMM YYYY");

                }

            },
            split(value) {
                let vm = this;
                if (value) {
                    return value.split(";")

                }


            },
            switchView() {
                if (this.listType == 'list')
                    this.listType = 'card';
                else
                    this.listType = 'list';
            },

        },
        computed: {

        },
        watch: {
            id() {
                // this.filterObj.resid = this.id;
                // this.getReservationsList();
            }

        },
        mounted() {
            let vm = this;
        }
    }

</script>