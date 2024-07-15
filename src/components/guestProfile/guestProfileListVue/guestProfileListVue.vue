<template src="./guestProfileListVue.template.html"></template>
<script>
    import moment from "moment-timezone";
    //     import virtualScroll from '../reservations/reservationListVue/src/component/VirtualScroll'
    //   import 'vue-virtual-infinite-scroll/dist/css/vue-virtual-infinite-scroll.css'

    //   Vue.component('virtual-list', virtualScroll)
    export default {
        // options
        name: "guestProfileListComponent",
        props: ['default', 'sidebar','profileType'],
        data() {
            return {
                reRender: false,
                fromAscSort: false,
                virtual: true,
                searching: false,
                showScroller: true,
                TotalGuests: null,
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
                        Label: "Name",
                        IsChecked: true,
                        ColumnName: "GuestFirstName",
                        class: "filterLoad",
                        isAscOrDesc: null,
                        className: 'gp-name-cell',
                        sortLabels: {
                            GuestFirstName: {
                                ColumnName: "GuestFirstName",
                                isSortLoading: false,
                                Label: "Name",
                                SortOder: '',
                                isActive: "",
                                isSortAscOrDesc: ''
                            },
                            // GuestLastName: {
                            //     ColumnName: "GuestLastName",
                            //     isSortLoading: false,
                            //     Label: "Guest Last Name",
                            //     SortOder: '',
                            //     isActive: "",
                            //     isSortAscOrDesc: ''
                            // },
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
                                Label: "Bookings",
                                SortOder: '',
                                isActive: "",
                                isSortAscOrDesc: ''
                            }
                        }
                    },



                    LastStay: {
                        Label: "Last Stay", IsChecked: true, ColumnName: "LastArrivalDate", class: "filterLoad", className: 'gp-laststay-cell',
                        sortLabels: {
                            LastArrivalDate: {
                                ColumnName: "LastArrivalDate",
                                isSortLoading: false,
                                Label: "Last Stay",
                                SortOder: '',
                                isActive: "",
                                isSortAscOrDesc: ''
                            },
                            LastPropertyNickName: {
                                ColumnName: "LastPropertyNickName",
                                isSortLoading: false,
                                Label: "Property Nick Name",
                                SortOder: '',
                                isActive: "",
                                isSortAscOrDesc: ''
                            },
                            LastUnitNickName: {
                                ColumnName: "LastUnitNickName",
                                isSortLoading: false,
                                Label: "Unit Nick Name",
                                SortOder: '',
                                isActive: "",
                                isSortAscOrDesc: ''
                            }

                        }
                    },
                    NextStay: {
                        Label: "Next Stay", IsChecked: true, ColumnName: "NextArrivalDate", class: "filterLoad", className: 'gp-nextstay-cell',
                        sortLabels: {
                            NextArrivalDate: {
                                ColumnName: "NextArrivalDate",
                                isSortLoading: false,
                                Label: "Next Stay",
                                SortOder: '',
                                isActive: "",
                                isSortAscOrDesc: ''
                            },
                            NextPropertyNickName: {
                                ColumnName: "NextPropertyNickName",
                                isSortLoading: false,
                                Label: "Property Nick Name",
                                SortOder: '',
                                isActive: "",
                                isSortAscOrDesc: ''
                            },
                            NextUnitNickName: {
                                ColumnName: "NextUnitNickName",
                                isSortLoading: false,
                                Label: "Unit Nick Name",
                                SortOder: '',
                                isActive: "",
                                isSortAscOrDesc: ''
                            }

                        }
                    },
                     Amount: {
                        Label: "Amount", IsChecked: true, ColumnName: "TotalAmount", columnClass: "numeriColumn", class: "filterLoad", isAscOrDesc: null, className: 'gp-amount-cell',
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
                propertyId: -1,
                // profileType: 3,
                profileTypeList: [{
                    profileTypeId : 3,
                    profileTypeName: "Guest" 
                },{
                    profileTypeId : 7,
                    profileTypeName: "Company" 
                }],
                selectedProfileType : 3
            };
        },
        methods: {
            getStyle(height) {
                // let height;
                if (!this.variable) {
                    height = 103
                }
                // if (id) {
                //     console.log("hereeeeeeeeee", id)
                // setTimeout(() => {

                // return {
                //     'height': height + 'px',
                //     'line-height': height + 'px'
                // }
                // }, 800)
                // }
                // else {
                //     return {
                //         'height': 103 + 'px',
                //         'line-height': 103 + 'px'
                //     }

                // }
                // if (id && id != null && id != '' && document.getElementById(id) && document.getElementById(id) != null) {

                //     console.log("id", id);
                //     console.log("document.getElementById(id).offsetHeight", document.getElementById(id).clientHeight)

                //     setTimeout(() => {
                //         if (document.getElementById(id) && document.getElementById(id).parentNode && document.getElementById(id).parentNode.parentNode && document.getElementById(id).parentNode.parentNode.previousSibling) {

                //             const style = window.getComputedStyle(document.getElementById(id).parentNode.parentNode.previousSibling)
                //             const matrix = style.transform || style.webkitTransform || style.mozTransform
                //             const matrixType = matrix.includes('3d') ? '3d' : '2d';
                //             const matrixValues = matrix.match(/matrix.*\((.+)\)/)[1].split(', ')
                //             if (matrixType === '2d') {
                //                 var x = matrixValues[4]
                //                 var y = matrixValues[5]
                //             }


                //             const style1 = window.getComputedStyle(document.getElementById(id).parentNode.parentNode)
                //             const matrix1 = style1.transform || style1.webkitTransform || style1.mozTransform

                //             const matrixType1 = matrix1.includes('3d') ? '3d' : '2d';
                //             const matrixValues1 = matrix1.match(/matrix.*\((.+)\)/)[1].split(', ')
                //             if (matrixType1 === '2d') {
                //                 var x1 = matrixValues1[4]
                //                 var y1 = matrixValues1[5]
                //             }
                //             let translateValue = parseInt(document.getElementById(id).parentNode.parentNode.previousSibling.childNodes[0].style.height, 10) + parseInt(y);
                //             document.getElementById(id).parentNode.parentNode.style.transform = 'translate(0px, ' + translateValue + 'px)';

                //             console.log(".closest('li').next('li')",document.getElementById(id).parentNode.style.transform);                       
                //         }
                //     }, 800)



                //     return {
                //         'height': 79 + document.getElementById(id).clientHeight + 'px',
                //         'line-height': 79 + document.getElementById(id).clientHeight + 'px'
                //     }



                // }
                // else {
                //     return {
                //         'height': 103 + 'px',
                //         'line-height': 103 + 'px'
                //     }

                // }

            },
            getMoreData($stateChange) {
                this.searching = false;

                if (this.items.length >= this.TotalGuests) {
                    console.log("toggleVariabletoggleVariabletoggleVariabletoggleVariabletoggleVariabletoggleVariable")
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
                    }, 2100)
                    this.loading = false;
                    this.filterObj.PageNumber++;
                    this.Get_GuestProfileList();
                }
            },
            refreshData($pullStateChange) {
                console.log("iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii")
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
            Searchtext(value) {
                let vm = this;
                // vm.items = [];

                if (((value.which <= 90 && value.which >= 48) || value.which == 8 || value.which == 46) && value.code != "MetaLeft") {
                    clearTimeout(vm.timeout);
                    vm.timeout = setTimeout(function () {
                        console.log("value.which", value)
                        vm.searching = true;
                        vm.reRender = false;
                        vm.loading = true;
                        // vm.isGreyOut = true;
                        // vm.linearProgress = true;
                        vm.Get_GuestProfileList('filter');
                    }, 2000);
                }
            },
            clearGuestProfileListSearch() {
                let vm = this;
                // location.reload() 
                // this.$forceUpdate ();        
                if (vm.guestProfileListSearch != null && vm.guestProfileListSearch != '') {
                    // vm.items = [];
                    vm.guestProfileListSearch = "";
                    vm.searching = true;
                    vm.reRender = false;
                    vm.loading = true;
                    // vm.isGreyOut = true;
                    // vm.linearProgress = true;
                    // vm.Get_GuestProfileList('');
                    // vm.Get_GuestProfileList('');
                    vm.Get_GuestProfileList('filter');
                }

            },
            createReservationWithThisGuest(guestInfo) {
                let vm = this;
                vm.$router.push("/newReservation/" + -1 + '/' + guestInfo.GuestProfileId + '/' + guestInfo.AccountType);


            },
            ascSort(sortBy, sortOrder) {
                let vm = this;
                // vm.items = [];
                // vm.guestProfileList = [];
                vm.searching = true;
                vm.reRender = false;
                vm.loading = true;
                vm.isGreyOut = true;
                vm.linearProgress = true;
                // vm.filterObj.PageNumber = 1;
                if (sortOrder == '') {
                    sortOrder = 'desc'
                }
                console.log("sortBy", sortBy);
                vm.filterObj.SortBy = sortBy;
                vm.filterObj.SortOrder = sortOrder;
                vm.linearProgress = true;
                vm.isGreyOut = true;
                vm.filterObj.PageNumber = 1;
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
                vm.fromAscSort = true;
                vm.Get_GuestProfileList('filter');
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
            createNewInstance(item) {
                console.log("item", item)
                // this.$router.push("/guestProfileDetail/" + (item.GuestProfileId != null || item.GuestProfileId != undefined ? item.GuestProfileId : '-1'));
                this.$router.push({
                          name: 'guestCompanyProfileDetail', 
                          params: {                                 
                                 GuestProfileId: item.GuestProfileId != null || item.GuestProfileId != undefined ? item.GuestProfileId : '-1', 
                                 profileType: this.profileType, 
                                },
                             });
            },
            // /guestProfileDetail/:GuestProfileId
            Get_GuestProfileList(from) {
                let vm = this;
                vm.reRender = false;
                // if (vm.items.length == 0) {
                //     vm.loading = true;
                // }
                // else if (vm.items.length > 0) {
                //     vm.loading = false;
                // }
                console.log("profileType----",vm.profileType);
                if (vm.searching == true || (from && from == 'filter')) {
                    // vm.items = [];
                    vm.searching = true;
                    vm.loading = true;
                    vm.filterObj.PageNumber = 1;
                }
                // vm.loading = true;
                vm.$store.dispatch("dataRequestHandler", {
                    key: "Get_GuestProfileList",
                    params: {
                        SearchText: '',
                        IsFromSearch: 0,
                        SortOrder: vm.filterObj.SortOrder,
                        SortBy: vm.filterObj.SortBy,
                        PageNumber: vm.filterObj.PageNumber,
                        SearchText: vm.guestProfileListSearch,
                        propertyId: vm.propertyId,
                        statusId: vm.statusId,
                        profileType: vm.profileType
                    },
                    callback: function (err, response) {
                        if (err) {
                            console.log("Error in Get_GuestProfileList => ", err);
                            return;
                        }
                        if (response) {
                            console.log("response in Get_GuestProfileList => ", response);

                            if (vm.filterObj.PageNumber == 1) {

                                vm.items.splice(0, vm.items.length, ...response[0]);

                            }
                            else if (vm.filterObj.PageNumber > 1) {
                                vm.items.splice(vm.items.length, 0, ...response[0]);
                            }
                            if (response[1] && response[1][0]) {
                                vm.TotalGuests = response[1][0].TotalGuests;
                            }
                            // for(let i =0; i<= vm.items.length; i++){
                            //     console.log("vm.items[i]", vm.items[i])
                            //     if(vm.items[i]){
                            //         if(vm.items[i].Tag && vm.items[i].Tag != null && vm.items[i].Tag != ''){
                            //         vm.items[i].height = 126;
                            //     }
                            //     else{
                            //         vm.items[i].height = 103;
                            //     }

                            //     }

                            // }
                            vm.guestProfileList = response[0];
                            // if (vm.searching == false) {
                            //     vm.loading = false;
                            //     vm.isGreyOut = false;
                            //     vm.linearProgress = false;

                            // }
                            // vm.loading = false;

                            for (var i in vm.headerColumnList) {
                                if (vm.headerColumnList[i].ColumnName !== "Actions") {
                                    var obj = vm.headerColumnList[i];
                                    for (var j in obj.sortLabels) {
                                        if (vm.filterObj.SortBy === obj.sortLabels[j].ColumnName.toString()) {
                                            console.log("obj.ColumnName", obj.sortLabels[j].ColumnName);
                                            vm.headerColumnList[i].sortLabels[j].isSortLoading = false;
                                            vm.headerColumnList[i].sortLabels[j].isActive = "";
                                            // vm.isGreyOut = false;
                                            // vm.linearProgress = false;
                                            $('ul.dropdown-menu').removeClass('show').addClass('hide');
                                            // }
                                        }
                                    }
                                }
                            }
                            if (vm.searching == false) {
                                vm.loading = false;
                                vm.isGreyOut = false;
                                vm.linearProgress = false;

                            }
                            vm.selectedProfileType = vm.profileType

                        }
                    }
                });
                vm.profileType == 3 ? vm.$router.push({ name: 'GuestProfileList' }) : vm.profileType == 7 ? vm.$router.push({ name: 'CompanyProfileList' }) : vm.$router.push({ name: 'AccountProfileList' });

            }

        },
        computed: {
            reservationsListObj() {

                if (this.items && this.items.length > 0) {
                    return this.items.reduce((acc, guest) => {
                        acc[guest.GuestProfileId] = { guestObj: guest };
                        console.log("this.items", acc)
                        return acc;
                    }, {})
                }
                return {};
            },

        },
        watch: {
            items() {
                console.log("watcheddddddddddddddddddd")
                let vm = this;
                clearTimeout(vm.timeout);
                vm.timeout = setTimeout(function () {
                    if (vm.searching == true) {
                        vm.reRender = false;
                        vm.loading = true;
                        if (vm.fromAscSort == true) {
                            vm.isGreyOut = true;
                            vm.linearProgress = true;

                        }


                        if (vm.items.length > 0 || vm.items.length == 0) {

                            setTimeout(() => {
                                console.log("true")
                                vm.reRender = true;
                                vm.loading = false;
                                vm.isGreyOut = false;
                                vm.linearProgress = false;
                            }, 2000)

                        }
                        // else if(vm.items.length == 0){

                        // }
                        else {
                            vm.reRender = false;
                            vm.loading = true;
                            vm.isGreyOut = true;
                            vm.linearProgress = true;
                        }

                    }
                }, 2000)

            },

        },
        mounted() {
            let vm = this;
            vm.loading = true;
            vm.Get_GuestProfileList();

            vm.getPropertyMetaData();
        }
    }


</script>