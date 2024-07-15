<template src="./reservationDeclineComponent.template.html"></template>
<script>
import moment from "moment-timezone";

export default {
    name: "reservationDeclineComponent",
    props: ["lastMessageObject", "declineReasonsList"],

    data() {
        return {
            // declineReasonsList: [
            //     {
            //         declineReason: `The dates are unavailable (${moment(this.lastMessageObject.Arrivaldate).format("DD MMM YYYY")} - ${moment(this.lastMessageObject.Departuredate).format("DD MMM YYYY")})`,
            //         declineReasonId: 1
            //     },
            //     {
            //         declineReason: "My listing doesn’t fit the guest’s needs",
            //         declineReasonId: 2
            //     },
            //     {
            //         declineReason: "I want a different price, trip length, or check-in day",
            //         declineReasonId: 3
            //     },
            //     {
            //         declineReason: "I’m uncomfortable with this reservation",
            //         declineReasonId: 4
            //     }
            // ],
            showDeclineReasonText: false,
            selectedDeclineReason: {},
            declineReasonVal: "",
            seconddeclineReasonVal: "",
            selectedSubReason: ""
        };
    },
    methods: {
        formattedText(text) {
            return text.replace(/_/g, ' ').replace(/\b\w/g, function (c) {
                return c.toUpperCase();
            });
        },
        getFormatDate(date) {
            return moment(date).format("DD MMM YYYY")
        },
        selectDeclineReason(declineReason) {
            let vm = this;
            vm.showDeclineReasonText = true
            vm.selectedSubReason = ""
            vm.selectedDeclineReason = declineReason
        },
        AcceptorDecline(acceptorDeclineVal) {
            let vm = this;
            if (vm.declineReasonVal == "") {
                vm.$store.dispatch("toastr", {
                    type: "warning",
                    header: "Warning!",
                    message: "Please enter the decline reason"
                });
                return
            }
            // vm.$store.dispatch("toastr", {
            //     type: "warning",
            //     header: "Warning!",
            //     message: "Please wait for few seconds don't perfome any action",
            // });
            // if((vm.selectedDeclineReason.declineReasonId == 2 || vm.selectedDeclineReason.declineReasonId == 4) && (vm.seconddeclineReasonVal == "" || vm.seconddeclineReasonVal.length < 30)){
            //     vm.$store.dispatch("toastr", {
            //       type: "warning",
            //       header: "Warning!",
            //       message: "Please enter the decline reason min 30 char"
            //     });
            //     return
            // }
            vm.$store.dispatch("dataRequestHandler", {
                key: "AcceptorDecline",
                params: {
                    lastMessageObject: vm.lastMessageObject,
                    acceptorDeclineVal: acceptorDeclineVal,
                    declineReasonVal: vm.declineReasonVal,
                    selectedDeclineReason: vm.selectedDeclineReason,
                    seconddeclineReasonVal: vm.seconddeclineReasonVal,
                    selectedSubReason: vm.selectedSubReason
                },
                callback: function (err, response) {
                    vm.$emit("cancelRequestDeclineActionVal", true)
                }
            })
        },
        cancelRequestDeclineAction() {
            let vm = this;
            vm.$emit("cancelRequestDeclineActionVal", false)
        }
    },
    computed: {
    },
    mounted() {
        let vm = this;
    },
    components: {

    },
    watch: {

    },
    destroyed() { }
};
</script>