<template src="./guestProfileDetailVue.template.html"></template>
<script>
  import moment from "moment-timezone";
  import accounting from "accounting";
  import folioSettingModal from "./folioSettingModal.vue";
  import foliomodal from '../../reservations/reservationDetailVue/folioRecalculateConfirmationModal.vue';

  const demo = ["IN302", "IK256", "IN302", "IK256"];
  export default {
    // options
    name: "guestProfileDetailComponent",
    props: [],
    data() {
      return {
        searchCity: "",
        cityList: [],
        selectedCityObj: {},
        selectedStateAndCountry: {},
        guestInfo: {
          AccountType: 3,
          GuestFirstName: "",
          GuestLastName: "",
          Address: "",
          Address2: "",
          CityName: "",
          StateName: "",
          CountryName: "",
          PostalCode: "",
          shortAddress: "",
        },
        showPaymentbutton: "",
        showpaymentdetails: false,
        displaySectionValue: "guestinfo",
        isBgColor1: true,
        isBgColor2: false,
        isBgColor3: false,
        isBgColor4: false,
        addressAndZipcodeShow: false,
        guestPaymentCards: [],
        paymentCardInfo: {
          CreditCard: null,
          NameOnCard: null,
          ExpirationMonth: "-1",
          ExpirationYear: "-1",
          PaymentTypeId: null,
          PaymentInfoId: -1,
          CCLast4Digits: null,
          CardType: null,
          CvvCode: null,
          IsDefault: false,
          AddressDetails: null,
          PostalCode: null,
        },
        paymentLedgerAcounts: [],
        stripePlatformAccount: {},
        stripeConnectedAccount: {},
        cardTokenFromStripe: null,
        paymentCardType: null,
        cardToken: {},
        stripecardId: null,
        months: [
          { name: "January", value: "01" },
          { name: "February", value: "02" },
          { name: "March", value: "03" },
          { name: "April", value: "04" },
          { name: "May", value: "05" },
          { name: "June", value: "06" },
          { name: "July", value: "07" },
          { name: "August", value: "08" },
          { name: "September", value: "09" },
          { name: "October", value: "10" },
          { name: "November", value: "11" },
          { name: "December", value: "12" },
        ],
        showPaymentDetails: false,
        // Savetoallfuturereservations: '',
        showPaymentOptions: false,
        showPaymentList: true,
        pendingPaymentDetails: [],
        disabledMultiSave: false,
        additionalEmails: [
          {
            Emailaddress: null,
            ReservationId: null,
          },
        ],
        additionalPhoneNumbers: [
          {
            PhoneNumber: null,
            ReservationId: null,
          },
        ],
        IsDefault: false,
        guestPriorStays: [],
        GuestProfileId: "-1",
        Tagdisable: true,
        guestBookings: {},
        statusList: [],
        guest_Status: {},
        loading: true,
        currResObj: {},
        profileType: 3,
        ledgerDetails: [],
        showFolioDetails: false,
        balanceTransferInvoiceDetails: [],
        showBTInvoice: false,
        RatePlanList: [],
        myValue: null,
        demoListData: demo,
        showFolioDetailsSection: false,
        showFolioList: true,
        balanceTransferInvoiceList: [],
        totalBalanceTransfer: null,
        totalAmountVal: null,
        totalTaxVal: null,
        totalFolioAmount: null,
        showCorpLedgerFolioList: true,
        invoiceList: [],
        showFilteredFolioList: false,
        getFilteredFolioList: [],
        searchText: null,
        selectedInvoiceId: "allFolio",
        showPayments: false,
        paymentDetails: {},
        showAddPaymentDetail: false,
        buttonName: null,
        selectedPaymentCardDetails: null,
        parentPaymentitemObj: {},
        paymentCharges: {},
        isAccountConflict: null,
        isFolioListVisible: true,
        ShowDropdown: false,
        focused: false,
        folioItemsDetails: [],
        selectedLedger: {
          dateEffective: null,
          ledgerAccountId: null,
          defaultAmount: null,
          paymentInfoId: null,
          folioItemId: null,
          TaxAmount: null,
        },
        showPreviewButton: true,
        showRatePlanSave: false,
        folioDateChange: false,
        LedgerAcounts: [],
        displayVoidItems: false,
        showMasterFolio: false,
        selectedVoidItem: false,
        masterFolioList: [],
        folioUpdate: false,
        selectedFolioItemToEdit: null,
        folioItemsToVoid: [],
        selectedItemCount: true,
        checkedItems: [],
        itemToEdit: null,
        isFolioDirty: false,
        selectAllFolio: false,
        previousFolioItemDetails: [],
        folioCharges: {},
        corporateSummaryDetails: [],
        financialSummaryData: {},
        isChecked: true,
        showInvoicePopup: false,
        guestData: {
          SourceName: "Tempo",
          SubSourceName: "",
          SourceId: 1,
        },
        showNextProcessButton: true,
        ledgerAccountID: null,
        guestEmails: [],
        roomInfo: {
          Persons: null,
          NumberOfAdults: null,
          NumberOfChildren: null,
          formattedStartDate: null,
          formattedEndDate: null,
          isActive: false,
          StartDate: null,
          EndDate: null,
        },
        selectedResId: null,
        reservationStatus: null,
        emailList: null,
        voidedItemsCount: 0,
        showCorpLedgerFolio: "",
        paymentProcessMethod: null,
        clientId: null,
        showSettingModal: false,
        modalParams: null,
        ratePlanList: [],
        folioSettingDetails: {
          NextInvoiceDate: moment().add(30, 'days').format("DD MMM YYYY"),
          rateplanid: null,
          TempoConfirmationNumber: null,
          NegotiatedAmount: 0,
          NegotiatedCyclePeriod: 30,
          NegotiatedCyclePeriodType: 'day',
          InvoiceFrequency: 30,
          InvoiceFrequencyType: 'day',
          InvoicePaymentTerms: 30,
          InvoicePaymentTermsType: 'day',
          isDailyEnabled: false,
          PastInvoiceNo: "",
          IsAutoGenerated: true,
          InvoicePriorGenerationPeriod: 0,
          InvoicePriorGenerationPeriodType: "day"
        },
        chargeItem: {
          chargeId: null,
          stripeConnectedAccount: null,
          gatewayId: null,
          GatewayResponse: null,
        },
        corporateFolioId: null,
        isMasterFolioAvailable: null,
        PaymentMode: null,
        paymentProcessList: [],
        isModalVisible: false,
        modalParams: {},
        selectedInvoiceObj: {},
        selectedFolioItemId : '',
        selectAllInvocies: false,
        showBTVoidItems: false
      };
    },
    components: {
      folioSettingModal,
      foliomodal
    },
    methods: {
      selectInvoiceToVoid(invoiceItem,event){
      let vm = this;
      if(invoiceItem && !invoiceItem.isvoided && invoiceItem.Payments == 0){
        invoiceItem.isChecked = event.target.checked ? true : false
        return
      }
      for (let item of vm.balanceTransferInvoiceList) {
        if(!item.isvoided && item.ledgerAccountName != 'Master Folio' && item.Payments == 0){
          item.isChecked = vm.selectAllInvocies;
        }
      }
    },
    
    voidSelectedInvocies(){
      let vm = this;
      vm.$store.dispatch("dataRequestHandler", {
        key: "voidInvoices",
        params: {
          ModuleAction: "voidInvoices",
          balanceTransferDetails: vm.balanceTransferInvoiceList
        },
        callback: function (err, response) {
          if (err) {
            return;
          }
          if (response) {
            vm.getCorporateLedgerSummaryList()
            vm.corporateFinancialSummary()
            vm.selectAllInvocies = false
          }
        },
      });
    },
    cancelInvocieVoid(){
      let vm =this
      vm.selectAllInvocies = false
      for (let item of vm.balanceTransferInvoiceList) {
        item.isChecked = false;
      }
    },
      displayAddress(guestDetail) {
        let displayAddress = [];
        console.log("guestDetail.CountryName = ", guestDetail);
        if (
          guestDetail.CountryName &&
          guestDetail.CountryName.toUpperCase() != "UNITED STATES" &&
          guestDetail.CountryName.toUpperCase() != "US" &&
          guestDetail.CountryName.toUpperCase() != "USA"
        ) {
          if (guestDetail.CityName) {
            displayAddress.push(guestDetail.CityName);
          } else {
            if (guestDetail.StateName) {
              displayAddress.push(guestDetail.StateName);
            }
          }
          if (guestDetail.CountryName) {
            displayAddress.push(guestDetail.CountryName);
          }
        } else if (
          (guestDetail.CountryName &&
            (guestDetail.CountryName.toUpperCase() == "UNITED STATES" ||
              guestDetail.CountryName.toUpperCase() == "US" ||
              guestDetail.CountryName.toUpperCase() == "USA")) ||
          !guestDetail.CountryName
        ) {
          if (guestDetail.CityName) {
            displayAddress.push(guestDetail.CityName);
          }
          if (guestDetail.StateName) {
            displayAddress.push(guestDetail.StateName);
          }
          if (!guestDetail.CityName && !guestDetail.StateName) {
            if (guestDetail.CountryName) {
              displayAddress.push(guestDetail.CountryName);
            }
          }
        }
        console.log("displayAddress.join(", ") = ", displayAddress.join(", "));
        return displayAddress.join(", ");
      },
      panelCallback() {
        let vm = this;
        vm.Get_GuestProfile_Detail();
      },
      showReservationSummaryPanel(resId) {
        let vm = this;
        console.log("resId", resId);
        if (
          vm.$store.state.userEntitlementList.fncReservationList.isAssigned === 1
        ) {
          this.currResObj = { ReservationId: resId };
          // vm.getHouseKeepinglist();
        }
      },
      createReservationWithThisGuest(guestInfo) {
        let vm = this;
        // console.log("guesttt---guestIno----",guestInfo);
        // vm.$store.state.bus.$emit("sendGuestInfoToDetail", {guestInfo: guestInfo});
        vm.$router.push("/newReservation/" + -1 + '/' + vm.GuestProfileId + '/'+ guestInfo.AccountType);
        // if (guestInfo && (guestInfo.SourceId || guestInfo.SourceId === null)) {
        //   vm.$router.push("/newReservation/" + -1 + "/" + vm.GuestProfileId);
        // } else {
        //   vm.$router.push(`/newReservation/${vm.GuestProfileId}`);
        // }
      },
      formatRMoney(amount) {
        return accounting.formatMoney(amount, {
          symbol: "",
          format: {
            pos: "%s %v",
            neg: "%s (%v)",
            zero: "%s  %v",
          },
          thousand: ",",
          precision: 0,
          decimal: ".",
        });
      },
      formatBalanceMoney(amount) {
        return accounting.formatMoney(amount, {
          symbol: "",
          format: {
            pos: "%v",
            neg: "-%v",
            zero: "%v",
          },
          thousand: "",
          precision: 2,
          decimal: ".",
        });
      },
      formatArrivalOnDate(date) {
        let vm = this;
        return moment.utc(date).format("DD-MMM");
      },
      formatYear(date) {
        let vm = this;
        return moment.utc(date).format("YYYY");
      },
      formatArrivalDate(date) {
        let vm = this;
        return moment(date).format("DD MMM YYYY");
      },
      formatPriorStayDate(date) {
        console.log("date====>", date);
        // return moment(date, "YYYY-MM-DD").format("DD MMM");
        let vm = this;
        return moment.utc(date).format("MMM DD");
      },
      getDay(date) {
        let vm = this;
        return moment(date).format("ddd");
      },
      addAdditionalPhoneNumbers() {
        let vm = this;
        //console.log("add phoneNumber", phoneNumber);
        vm.additionalPhoneNumbers.push({ ReservationId: "", PhoneNumber: "" });
        console.log("vm.additionalEmails", vm.additionalPhoneNumbers);
      },

      removeaddAdditionalPhoneNumbers(phoneNumber) {
        let vm = this;
        // console.log(email);
        let additionalPhoneNumberIndex =
          vm.additionalPhoneNumbers.indexOf(phoneNumber);
        vm.additionalPhoneNumbers.splice(additionalPhoneNumberIndex, 1);
      },
      addAdditionalEmail() {
        let vm = this;
        //console.log("add email", email);
        vm.additionalEmails.push({ ReservationId: "", Emailaddress: "" });
        console.log("vm.additionalEmails", vm.additionalEmails);
      },
      removeaddAdditionalEmail(email) {
        let vm = this;
        console.log(email);
        let additionalEmailIndex = vm.additionalEmails.indexOf(email);
        vm.additionalEmails.splice(additionalEmailIndex, 1);
      },
      selectPaymentDetails(cardDetails, type) {
        console.log("cardDetails", cardDetails);
        this.paymentProcessMethod = null;
        if (type == "manual") {
          this.selectedPaymentCardDetails = {
            PaymentInfoId: cardDetails.PaymentMethod,
            ledgerid: cardDetails.ledgerAccountID,
            IsCreditcard: cardDetails.IsCreditcard,
          };
          this.buttonName = "Save";
        } else {
          this.selectedPaymentCardDetails = cardDetails;
          this.buttonName = "Process";
        }
      },
      displaySection(value) {
        let vm = this;
        if (value == "guestinfo") {
          vm.isBgColor1 = true;
          vm.isBgColor2 = false;
          vm.isBgColor3 = false;
          vm.isBgColor4 = false;
          vm.showCorpLedgerFolio = ""
        }
        if (value == "cardinfo") {
          vm.isBgColor1 = false;
          vm.isBgColor2 = false;
          vm.isBgColor3 = true;
          vm.isBgColor4 = false;
          vm.showPaymentList = true;
          vm.showPaymentDetails = false;
          vm.showCorpLedgerFolio = ""
        }
        if (value == "priorStayInfo") {
          vm.isBgColor1 = false;
          vm.isBgColor2 = true;
          vm.isBgColor3 = false;
          vm.isBgColor4 = false;
          vm.showCorpLedgerFolio = ""
        }
        if (value == "corporateLedgerInfo") {
          vm.isBgColor1 = false;
          vm.isBgColor2 = false;
          vm.isBgColor3 = false;
          vm.isBgColor4 = true;
          vm.getCorporateLedgerSummaryList();
          // vm.showledgerSummary = true;
        }

        vm.displaySectionValue = value;
      },
      showAddressAndZipcode() {
        let vm = this;
        vm.addressAndZipcodeShow = !vm.addressAndZipcodeShow;
      },
      addPaymentDetails(fromFolio) {
        let vm = this;
        vm.paymentCardInfo = {
          CreditCard: null,
          NameOnCard: null,
          ExpirationMonth: "-1",
          ExpirationYear: "-1",
          PaymentTypeId: null,
          PaymentInfoId: -1,
          CCLast4Digits: null,
          CardType: null,
          CvvCode: null,
          IsDefault: false,
          AddressDetails: null,
          PostalCode: null,
          DefaultSettingforSyncCardDetails: null,
        };
        if (fromFolio) {
          vm.fromFolio = true;
          vm.displaySection("cardinfo")
        }
        if (
          vm.$store.state.userEntitlementList.fncFolioNew.isAssigned === -1 ||
          vm.$store.state.userEntitlementList.fncFolioNew.isAssigned === "-1"
        ) {
          vm = this;
          vm.showPaymentbutton = false;
        }

        if (vm.cardDetails.length == 0) {
          vm.paymentCardInfo.IsDefault = true;
        } else {
          vm.paymentCardInfo.IsDefault = false;
        }
        setTimeout(function () {
          vm.showPaymentDetails = true;
          vm.showPaymentList = false;
          vm.showPaymentOptions = true;
        }, 5);
      },
      showAllPaymentOptions() {
        this.showPaymentOptions = true;
        this.showPaymentDetails = false;
      },
      cancelPaymentCardInfo() {
        let vm = this;
        vm.showPaymentDetails = false;
        vm.showPaymentList = true;
        vm.disabledMultiSave = false;
        vm.addressAndZipcodeShow = false;
        if (vm.fromFolio) {
          vm.showPaymentOptions = false;
          vm.fromFolio = false;
        }
      },

      GetCardType(number) {
        let vm = this;
        vm.paymentCardType = null;
        // visa
        var re = new RegExp("^4");
        if (number.match(re) != null) {
          vm.paymentCardType = "Visa";
          vm.paymentCardInfo.CardType = "Visa";
          // vm.paymentCardInfo.PaymentTypeId = 8;
          return "Visa";
        }
        // Mastercard
        // Updated for Mastercard 2017 BINs expansion
        // if (/^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/.test(number))
        //     {vm.paymentCardType = "MasterCard"
        //     return {cardType:"Mastercard",paymentTypeId:9};
        //     }
        re = new RegExp(
          "^(5[1-5]\\d{0,2}|22[2-9]\\d{0,1}|2[3-7]\\d{0,2})\\d{0,12}"
        );
        if (number.match(re) != null) {
          vm.paymentCardType = "MasterCard";
          vm.paymentCardInfo.CardType = "MasterCard";
          // vm.paymentCardInfo.PaymentTypeId = 9;
          return "Mastercard";
        }
        // AMEX
        re = new RegExp("^3[47]\\d{0,13}"); //new RegExp("^3[47]");
        if (number.match(re) != null) {
          vm.paymentCardType = "American Express";
          vm.paymentCardInfo.CardType = "American Express";
          // vm.paymentCardInfo.PaymentTypeId = 7;
          return "AMEX";
        }

        // Discover ^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)
        re = new RegExp("(?:6011|65\\d{0,2}|64[4-9]\\d?)\\d{0,12}");
        if (number.match(re) != null) {
          vm.paymentCardType = "Discover";
          vm.paymentCardInfo.CardType = "Discover";
          // vm.paymentCardInfo.PaymentTypeId = 10;
          return "Discover";
        } else {
          vm.paymentCardType = "Other";
          vm.paymentCardInfo.CardType = "Other";
          return "Other";
        }

        return "";
      },

      resetAddress() {
        let vm = this;
        // vm.guestInfo.Address = "";
        // vm.$set(vm.guestInfo, "PostalCode", "");
        // vm.$set(vm.guestInfo, "CityName", "");
        // vm.$set(vm.guestInfo, "StateName", "");
        // vm.$set(vm.guestInfo, "CountryName", "");
      },
      // getAddress(address) {
      //   let vm = this;
      //   console.log("splitdataAddress==>", address);
      //   vm.guestInfo.Address = address;
      //   // vm.$set( vm.guestInfo,'Address', address);
      //   // var add = address.split(",");
      //   // vm.guestInfo.Address = add[0];
      //   // vm.$set( vm.guestInfo,'Address', add[0]);
      //   // console.log("vm.guestInfo.Address", vm.guestInfo.Address);
      // },
      getAddressData: function (addressData, placeResultData, id) {
        console.log("addressData", addressData);
        if (addressData && addressData.street_number && addressData.route) {
          this.guestInfo.Address =
            addressData.street_number + " " + addressData.route;
        } else {
          this.guestInfo.Address = addressData.route;
        }
        if (addressData && addressData.locality) {
          this.$set(this.guestInfo, "CityName", addressData.locality);
        } else if (addressData && addressData.administrative_area_level_2) {
          this.$set(
            this.guestInfo,
            "CityName",
            addressData.administrative_area_level_2
          );
        } else {
          this.$set(this.guestInfo, "CityName", "");
        }
        this.$set(this.guestInfo, "PostalCode", addressData.postal_code);
        this.$set(
          this.guestInfo,
          "StateName",
          addressData.administrative_area_level_1
        );
        this.$set(this.guestInfo, "CountryName", addressData.country);
        this.$set(this.guestInfo, "shortAddress", this.guestInfo.Address);
        // this.$set(this.guestInfo, "Address", this.guestInfo.Address);
        console.log("this.guestInfo.PostalCode", this.guestInfo);
      },

      onChangeCity: function (CityId) {
        let vm = this;
        $(".searchResultsCities").hide();
        console.log("in change method", CityId);
        vm.$store.dispatch("dataRequestHandler", {
          key: "GetCityStateCountryById",
          params: {
            ModuleAction: "GetCityStateCountryById",
            CityId: CityId,
          },
          callback: function (err, response) {
            if (err) {
              return;
            }
            if (response) {
              console.log("response in GetCityStateCountryById", response);
              let selectedoptions = null;
              selectedoptions = response;
              // selectedoptions.CountryId = response.CountryId;
              // selectedoptions.StateId = response.StatusId;
              // selectedoptions.StateName = response.StateName;
              vm.selectedStateAndCountry = selectedoptions;
              vm.searchCity = selectedoptions.CityName;
              console.log(
                "vm.selectedCountryObj.CountryName",
                vm.selectedStateAndCountry.CountryName
              );
              console.log(
                "vm.selectedStateObj.StateName",
                vm.selectedStateAndCountry.StateName
              );
            }
          },
        });
      },
      // addPaymentDetails() {
      //   let vm = this;
      //   vm.showPaymentbutton = true;
      //   vm.addPaymentDetails = true;
      //   console.log("clicked");
      // },
      getCardTokenBY() {
        let vm = this;
        console.log("vm.paymentCardInfo", vm.paymentCardInfo);
        let currentYear = moment().format("YYYY");
        let currentMonth = moment().format("MM");
        if (
          vm.paymentCardInfo.PaymentInfoId == -1 ||
          !vm.paymentCardInfo.CardToken
        ) {
          vm.generateCardToken();
        } else {
          vm.updateCardInfo();
        }
      },
      generateCardToken() {
        let vm = this;
        let currentYear = moment().format("YYYY");
        let currentMonth = moment().format("MM");
        if (vm.stripeConnectedAccount == null) {
          vm.$store.dispatch("toastr", {
            type: "warning",
            header: "Warning!",
            message: "Please connect to stripe account",
          });
        } else if (
          !vm.paymentCardInfo.CreditCard ||
          vm.paymentCardInfo.CreditCard.length < 10
        ) {
          vm.$store.dispatch("toastr", {
            type: "warning",
            header: "Warning!",
            message: "Please enter card number",
          });
        } else if (isNaN(vm.paymentCardInfo.CreditCard)) {
          vm.$store.dispatch("toastr", {
            type: "warning",
            header: "Warning!",
            message: "Please enter valid card number",
          });
        } else if (vm.paymentCardInfo.ExpirationMonth == -1) {
          vm.$store.dispatch("toastr", {
            type: "warning",
            header: "Warning!",
            message: "Please select expiry month",
          });
        } else if (vm.paymentCardInfo.ExpirationYear == -1) {
          vm.$store.dispatch("toastr", {
            type: "warning",
            header: "Warning!",
            message: "Please select expiry year",
          });
        } else if (
          Number(vm.paymentCardInfo.ExpirationMonth) < currentMonth &&
          Number(vm.paymentCardInfo.ExpirationYear) <= currentYear
        ) {
          vm.$store.dispatch("toastr", {
            type: "warning",
            header: "Warning!",
            message: "Please select valid expiry month/year",
          });
        }
        // else if (!vm.paymentCardInfo.CvvCode || vm.paymentCardInfo.CvvCode.length < 3 || vm.paymentCardInfo.CvvCode.length > 4) {
        //   vm.$store.dispatch("toastr", {
        //     type: "warning",
        //     header: "Warning!",
        //     message: "Please enter valid CVV"
        //   });
        // }
        else {
          vm.disabledMultiSave = true;
          vm.$store.dispatch("dataRequestHandler", {
            key: "getCardToken",
            params: {
              cardInfo: vm.paymentCardInfo,
              sk_token: vm.stripePlatformAccount.SecretKey,
              stripeConnectedAccount: vm.stripeConnectedAccount,
              guestInfo: vm.guestInfo,
              email: vm.guestInfo.GuestEmail,

              phone: vm.guestInfo.GuestPhoneNumber,
            },
            callback: function (err, response) {
              if (err) {
                console.log("Error in getCardToken => ", err);
                vm.disabledMultiSave = false;
                return;
              }
              if (response) {
                vm.disabledMultiSave = false;
                console.log("getCardToken", response);
                if (response.message) {
                  console.log("getCardToken@@", response.message);
                  vm.Save_ErrorLogs(response.message);
                  vm.$store.dispatch("toastr", {
                    type: "warning",
                    header: "Warning!",
                    message: "Error in tokenizing the card",
                  });
                } else {
                  let request = vm.paymentCardInfo;
                  request.ExpirationMonth = response.token.card.exp_month
                    ? moment()
                      .month(Math.abs(response.token.card.exp_month - 1))
                      .format("MM")
                    : response.token.card.exp_month;
                  request.ExpirationYear = response.token.card.exp_year;
                  request.CCLast4Digits = response.token.card.last4;
                  request.CardType = response.token.card.brand;
                  request.AddressDetails = response.token.card.address_line1;
                  request.PostalCode = response.token.card.address_zip;
                  request.CreditCard = null;
                  request.CvvCode = null;
                  vm.cardTokenFromStripe = response.customer.id;
                  vm.stripecardId = response.customer.default_source;
                  vm.savePaymentCardInfo();
                }
              }
            },
          });
        }
      },
      Save_ErrorLogs(errorMessage) {
        let vm = this;
        // console.log("errorMessage",errorMessage.raw.message);
        vm.$store.dispatch("dataRequestHandler", {
          key: "Save_ErrorLogs",
          params: {
            PartyId: vm.guestInfo.GuestProfileId,
            PartyTypeId: 3,
            ErrorFrom: "SavePaymentDetails",
            RawResponse: errorMessage,
          },
          callback: function (err, response) {
            if (err) {
              console.log("Error in Save_ErrorLogs => ", err);
              return;
            }
            if (response) {
              console.log(
                "Save_ErrorLogs=========================================>",
                response
              );
            }
          },
        });
      },
      hideChildPaymentItems(payment) {
        let vm = this;
        payment.showChildPaymentDetails = false;
        if (
          (vm.parentPaymentitemObj.PendingchildPaymentitems &&
            vm.parentPaymentitemObj.PendingchildPaymentitems.length > 0) ||
          (vm.pendingPaymentDetails && vm.pendingPaymentDetails.length > 0)
        ) {
          vm.showNextProcessButton = false;
        } else {
          vm.showNextProcessButton = true;
        }
        // vm.parentPaymentitemObj.PendingchildPaymentitems = [];
      },
      getPaymentDetails() {
        let vm = this;
        vm.$store.dispatch("dataRequestHandler", {
          key: "Get_InvoicePaymentDetails",
          params: {
            ModuleAction: "Get_InvoicePaymentDetails",
            GuestProfileId: vm.$route.params.GuestProfileId,
            selectedInvoice: vm.balanceTransferInvoiceList.filter(inv => inv.ItemId == vm.selectedInvoiceId)
          },
          callback: function (err, response) {
            if (err) {
              return;
            }
            if (response) {
              console.log("response.paymentObj==>", response);
              vm.paymentDetails = response.paymentObj;
              vm.paymentCharges = response.recordsets[1][0];
              vm.paymentLedgerAcounts.splice(
                0,
                vm.paymentLedgerAcounts.length,
                ...response.recordsets[2]
              );
              vm.stripePlatformAccount = response.recordsets[3][0];
              vm.stripeConnectedAccount = response.recordsets[9][0];
              vm.commissionAmmount = response.recordsets[5][0];
              vm.paymentProcessList = response.recordsets[6];
              vm.isAccountConflict = response.recordsets[7][0].IsAccountChanged;
              vm.PaymentMode = response.recordsets[8][0].PaymentMode;
              vm.pendingPaymentDetails.splice(0, vm.pendingPaymentDetails.length);
              vm.showNextProcessButton = true;
            }
          },
        });
      },
      addOrUpdate(paymentProcessId) {
        let vm = this;
        if (paymentProcessId == 6 || paymentProcessId == 8) {
          if (
            vm.fncIsPaymentUpdate &&
            (vm.fncIsPaymentUpdate.isAssigned === 1 ||
              (vm.fncIsPaymentUpdate.isAssigned === -1 &&
                vm.fncIsPaymentUpdate.functionState === 2))
          ) {
            return true;
          } else {
            return false;
          }
        } else if (paymentProcessId == 2) {
          if (
            vm.fncIsPaymentAdd &&
            (vm.fncIsPaymentAdd.isAssigned === 1 ||
              (vm.fncIsPaymentAdd.isAssigned === -1 &&
                vm.fncIsPaymentAdd.functionState === 2))
          ) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      },
      disableAddOrUpdate(paymentProcessId) {
        let vm = this;
        if (paymentProcessId == 6 || paymentProcessId == 8) {
          if (
            vm.fncIsPaymentUpdate &&
            vm.fncIsPaymentUpdate.isAssigned === -1 &&
            vm.fncIsPaymentUpdate.functionState === 2
          ) {
            return false;
          } else {
            return true;
          }
        } else if (paymentProcessId == 2) {
          if (
            vm.fncIsPaymentAdd &&
            vm.fncIsPaymentAdd.isAssigned === -1 &&
            vm.fncIsPaymentAdd.functionState === 2
          ) {
            return false;
          } else {
            return true;
          }
        } else {
          return true;
        }
      },

      updateCardInfo() {
        let vm = this;
        if (vm.paymentCardInfo.StatusId != 0) {
          let currentYear = moment().format("YYYY");
          let currentMonth = moment().format("MM");
          if (vm.stripeConnectedAccount == null) {
            vm.$store.dispatch("toastr", {
              type: "warning",
              header: "Warning!",
              message: "Please connect to stripe account",
            });
          } else if (
            Number(vm.paymentCardInfo.ExpirationMonth) < currentMonth &&
            Number(vm.paymentCardInfo.ExpirationYear) <= currentYear
          ) {
            vm.$store.dispatch("toastr", {
              type: "warning",
              header: "Warning!",
              message: "Please select valid expiry month/year",
            });
          } else {
            vm.disabledMultiSave = true;
            vm.$store.dispatch("dataRequestHandler", {
              key: "UpdateCardToken",
              params: {
                cardInfo: vm.paymentCardInfo,
                sk_token: vm.stripePlatformAccount.SecretKey,
                stripeConnectedAccount: vm.stripeConnectedAccount,
                guestInfo: vm.guestInfo,
              },
              callback: function (err, response) {
                if (err) {
                  console.log("Error in UpdateCardToken ==========> ", err);
                  vm.disabledMultiSave = false;
                  return;
                }
                if (response) {
                  vm.disabledMultiSave = false;
                  console.log("getCardToken", response);
                  if (response.message) {
                    console.log("getCardToken d=>", response.message.message);
                    vm.Save_ErrorLogs(response.message.message);

                    vm.$store.dispatch("toastr", {
                      type: "warning",
                      header: "Warning!",
                      message: "Error in updating card",
                    });
                  } else {
                    let request = vm.paymentCardInfo;
                    request.ExpirationMonth = response.exp_month
                      ? moment()
                        .month(Math.abs(response.exp_month - 1))
                        .format("MM")
                      : response.token.exp_month;
                    request.ExpirationYear = response.exp_year;
                    request.CCLast4Digits = response.last4;
                    request.CardType = response.brand;
                    request.AddressDetails = response.address_line1;
                    request.PostalCode = response.address_zip;
                    request.CreditCard = null;
                    request.CvvCode = null;
                    vm.cardTokenFromStripe = response.customer;
                    vm.stripecardId = response.id;
                    vm.savePaymentCardInfo();
                  }
                }
              },
            });
          }
        } else {
          vm.$store.dispatch("toastr", {
            type: "warning",
            header: "Warning!",
            message: "Unable to Save  Inactive card",
          });
        }
      },
      viewCurrentCardDetails(cardInfo) {
        let vm = this;
        vm.showPaymentDetails = true;
        vm.paymentCardType = null;
        vm.paymentCardInfo = JSON.parse(JSON.stringify(cardInfo));
      },
      InActivePaymentCardInfo() {
        let vm = this;
        console.log(
          "vm.paymentCardInfo.paymentTypeId==>",
          vm.paymentCardInfo.PaymentInfoId
        );
        vm.$store.dispatch("dataRequestHandler", {
          key: "UpdateStatus_Carddetails",
          params: {
            PaymentInfoId: vm.paymentCardInfo.PaymentInfoId,
            StatusId: 0,
          },
          callback: function (err, response) {
            console.log("UpdateStatus_Carddetails==>", response);
            if (err) {
              console.log("Error in saving payment details => ", err);
              vm.$store.dispatch("toastr", {
                type: "error",
                header: "Error",
                message: "Error While Saving Card Details!",
              });
              return;
            }
            if (response) {
              vm.$store.dispatch("toastr", {
                type: "success",
                header: "Success!",
                message: "Card Details InActivated Successfully.",
              });

              vm.getPaymentCardDetails();
              vm.cancelPaymentCardInfo();
            }
          },
        });
      },
      savePaymentCardInfo() {
        let vm = this;

        vm.showPaymentDetails = false;
        let request = vm.paymentCardInfo;
        request.partyId = vm.$route.params.GuestProfileId;
        request.partyTypeId = 3;
        for (let ledger of vm.paymentLedgerAcounts) {
          if (vm.paymentCardType === ledger.PaymentMethod) {
            request.PaymentTypeId = ledger.ledgerAccountID;
          }
        }
        vm.$store.dispatch("dataRequestHandler", {
          key: "SavePaymentDetails",
          params: {
            paymentDetails: vm.paymentCardInfo,
            Token: vm.cardTokenFromStripe,
            cardId: vm.stripecardId,
            stripePlatformAccount: vm.stripePlatformAccount,
            stripeConnectedAccount: vm.stripeConnectedAccount,
            // Savetoallfuturereservations: vm.Savetoallfuturereservations
          },
          callback: function (err, response) {
            if (err) {
              console.log("Error in saving payment details => ", err);
              vm.$store.dispatch("toastr", {
                type: "error",
                header: "Error",
                message: "Error While Saving Card Details!",
              });
              return;
            }
            if (response) {
              if (response[0] && response[0][0] && response[0][0].ErrorMessage) {
                vm.$store.dispatch("toastr", {
                  type: "error",
                  header: "Error",
                  message: "Error While Saving Card Details!",
                });
              } else {
                vm.$store.dispatch("toastr", {
                  type: "success",
                  header: "Success!",
                  message: "Card Details Saved Successfully.",
                });
              }
              console.log("response getPaymentCardDetails", response);
              vm.getPaymentCardDetails();
              // vm.showingdetails();
              //   for (var x in vm.guestPaymentCards) {
              //   let ccnumber = vm.guestPaymentCards[x].CreditCard;
              //   vm.guestPaymentCards[x].CreditCard = (ccnumber.replace(/(\d{4}(?!\s))/g, "$1 "));

              // }
            }
            vm.showPaymentList = true;
            if (vm.fromFolio) {
              vm.displaySection("corporateLedgerInfo")
              vm.showPaymentDetails = false;
              vm.showPaymentOptions = false;
              vm.fromFolio = false;
            }
          },
        });
        // }
      },
      getPaymentCardDetails() {
        let vm = this;
        vm.$store.dispatch("dataRequestHandler", {
          key: "Get_PaymentCardDetails",
          params: {
            ModuleAction: "Get_PaymentCardDetails",
            ReservationId: vm.$route.params.GuestProfileId,
            PartyTypeId: 3,
          },
          callback: function (err, response) {
            if (err) {
              return;
            }
            if (response) {
              console.log("response in Get_PaymentCardDetails", response);
              vm.cardDetails = response[0];
              vm.guestPaymentCards.splice(
                0,
                vm.guestPaymentCards.length,
                ...response[0]
              );

              for (var x in vm.guestPaymentCards) {
                if (vm.guestPaymentCards[x].StatusId == 1) {
                  vm.guestPaymentCards[x].csscolor = "black";
                  vm.guestPaymentCards[x].disableSave = false;
                }
                if (vm.guestPaymentCards[x].StatusId == 0) {
                  vm.guestPaymentCards[x].csscolor = "grey";
                  vm.guestPaymentCards[x].disableSave = true;
                }
              }

              // if (vm.guestPaymentCards.length === 1) {
              //   vm.selectedPaymentCardDetails = vm.guestPaymentCards[0];
              //   vm.buttonName = "Process";
              // } else {
              //   let defaultPaymentOption = vm.guestPaymentCards.filter(function(
              //     paymentCard
              //   ) {
              //     return paymentCard.IsDefault;
              //   });

              //   if (defaultPaymentOption && defaultPaymentOption.length > 0) {
              //     vm.selectedPaymentCardDetails = defaultPaymentOption[0];
              //     vm.buttonName = "Process";
              //   } else {
              //     vm.selectedPaymentCardDetails = vm.guestPaymentCards[0];
              //     vm.buttonName = "Process";
              //   }
              // }
              // vm.showingdetails();
              //   for (var x in vm.guestPaymentCards) {
              //   let ccnumber = vm.guestPaymentCards[x].CreditCard;
              //   vm.guestPaymentCards[x].CreditCard = (ccnumber.replace(/(\d{4}(?!\s))/g, "$1 "));

              // }
            }
          },
        });
      },

      saveGuestProfile() {
        let vm = this;
        console.log("vm.guestInfo", vm.guestInfo);
        vm.$validator.validateAll().then((result) => {
          if (result) {
            console.log("resultresultresultresult=>", result);
            vm.$store.dispatch("dataRequestHandler", {
              key: "SaveGuestProfile",
              params: {
                ModuleAction: "SaveGuestProfile",
                GuestProfileId: vm.$route.params.GuestProfileId,
                GuestFirstName: vm.guestInfo.GuestFirstName,
                GuestLastName: vm.guestInfo.GuestLastName,
                PhoneNumber: vm.guestInfo.GuestPhoneNumber,
                EmailAddress: vm.guestInfo.Emailaddress,
                CityId: null,
                StateId: null,
                CountryId: null,
                CountryName: vm.guestInfo.CountryName,
                StateName: vm.guestInfo.StateName,
                CityName: vm.guestInfo.CityName,
                Address1: vm.guestInfo.Address,
                Address2: vm.guestInfo.Address2,
                PostalCode: vm.guestInfo.PostalCode,
                ReservationId: null,
                addmoreEmails: vm.additionalEmails,
                addmorePhones: vm.additionalPhoneNumbers,
                StatusId: vm.guest_Status.StatusId,
                accountType: vm.guestInfo.AccountType,
                // integationData: wheelHouseIntegratedUser,
                // unitId:vm.roomInfo.UnitId
              },
              callback: function (err, response) {
                if (err) {
                  vm.$store.dispatch("toastr", {
                    type: "error",
                    header: "Error!",
                    message: "Error While Saving Guest",
                  });
                  return;
                }
                if (response) {
                  console.log("111111111", response);
                  if (
                    response[1] &&
                    response[1][0] &&
                    response[1][0].GuestProfileId
                  ) {
                    vm.$store.dispatch("toastr", {
                      type: "success",
                      header: "Success!",
                      message: `${vm.guestInfo.AccountType == 3 ? "Guest" : "Company"
                        } Details Saved Successfully!`,
                    });
                    vm.GuestProfileId = response[1][0].GuestProfileId;
                    vm.$router.push(
                      "/guestProfileDetail/" + response[1][0].GuestProfileId
                    );
                  }
                }
              },
            });
          }
        });
      },
      Get_GuestProfile_Detail() {
        let vm = this;
        console.log("Get_GuestProfile_Detail here");
        vm.$store.dispatch("dataRequestHandler", {
          key: "Get_GuestProfile_Detail",
          params: {
            ModuleAction: "Get_GuestProfile_Detail",
            GuestProfileId: vm.$route.params.GuestProfileId,
          },
          callback: function (err, response) {
            if (err) {
              return;
            }
            if (response) {
              console.log("respeons Get_GuestProfile_Detail:::", response);
              vm.getPaymentDetails();
              vm.getPaymentCardDetails();
              vm.getCorporateLedgerSummaryList();
              vm.corporateFinancialSummary();

              if (response[0] && response[0][0]) {
                vm.guestInfo = response[0][0];
              }

              if (response[5] && response[5][0]) {
                // vm.guestInfo = response[0][0];
                vm.additionalEmails = response[5];
              }
              if (response[6] && response[6][0]) {
                // vm.guestInfo = response[0][0];
                vm.additionalPhoneNumbers = response[6];
              }
              if (response[1] && response[1][0]) {
                vm.paymentCardInfo = response[1][0];
              }
              if (response[3]) {
                vm.guestPriorStays = response[3];
              }
              if (response[4] && response[4][0]) {
                vm.guestBookings = response[4][0];
              }
              if (response[7] && response[7][0]) {
                vm.statusList = response[7];
                console.log("vm.statusList==>", vm.statusList);
              }

              //  vm.guest_Status = response[0][0].StatusId === null || response[0][0].StatusId === undefined || response[0][0].StatusId === "" || response[0][0] === "" ? { StatusId: "1", StatusName: "Active" } : { StatusId: response[0][0].StatusId, StatusName: response[0][0].StatusName };
              console.log("response[0].length==>", response[0].length);
              if (response[0] && response[0].length == 0) {
                vm.guest_Status = { StatusId: "1", StatusName: "Active" };
              } else {
                vm.guest_Status = {
                  StatusId: response[0][0].StatusId,
                  StatusName: response[0][0].StatusName,
                };
              }

              vm.loading = false;
            }
          },
        });
      },
      getCorporateLedgerSummaryList(searchText) {
        let vm = this;
        // console.log("searchText--",vm.searchText?.trim());
        vm.$store.dispatch("dataRequestHandler", {
          key: "getBalanceTransferFolioList",
          params: {
            ModuleAction: "GetBalanceTransferFolioList",
            GuestProfileId: vm.$route.params.GuestProfileId,
            reservationId: null,
            searchText: searchText,
          },
          callback: function (err, response) {
            if (err) {
              return;
            }
            if (response) {
              console.log("resppp---", response)
              vm.balanceTransferInvoiceList.splice(0, vm.balanceTransferInvoiceList.length, ...response[0])
              vm.clientId = response[0][0].ClientId
              vm.invoiceList = response[0].filter(val => val.InvoiceNo)
              for (let folioItem of vm.balanceTransferInvoiceList) {
                vm.previousFolioItemDetails.push(Object.assign({}, folioItem));
              }
              // console.log("invoiceList----",vm.invoiceList);
              vm.totalFolioAmount = response[1][0];
              vm.corporateFolioId = response[2].length ? response[2][0].CorporateFolioId : {}
              vm.getRatePlanList()
              vm.getPaymentDetails()
            }
          },
        });
      },
      corporateFinancialSummary() {
        let vm = this;
        // console.log("searchText--",vm.searchText?.trim());
        vm.$store.dispatch("dataRequestHandler", {
          key: "getCorporateFolioSummary",
          params: {
            ModuleAction: "getCorporateFolioSummary",
            GuestProfileId: vm.$route.params.GuestProfileId,
          },
          callback: function (err, response) {
            if (err) {
              return;
            }
            if (response) {
              console.log("summry-resp--", response);
              vm.corporateSummaryDetails = response;
            }
            if(response[1] && response[1][0]){
              vm.financialSummaryData = response[1][0]
            }
            vm.totalFolioAmount = response[1][0];
          },
        });
      },
      getBalananceTransferInvoiceList() {
        let vm = this;
        vm.showFolioList = true;
        vm.showFolioDetails = false;
        vm.showPayments = false;
        vm.showAddPaymentDetail = false;
        vm.parentPaymentitemObj.PendingchildPaymentitems = [];
        vm.pendingPaymentDetails.splice(vm.pendingPaymentDetails.length - 1, 1);
        vm.showNextProcessButton = true;
      },
      getBalananceTransferInvoiceDetails() {
        let vm = this;
        vm.showFolioList = false;
        vm.showFolioDetails = true;
        vm.showPayments = false;
        vm.showAddPaymentDetail = false;
        vm.parentPaymentitemObj.PendingchildPaymentitems = [];
        vm.pendingPaymentDetails.splice(vm.pendingPaymentDetails.length - 1, 1);
        vm.showNextProcessButton = true;
      },
      getPaymentsDetail() {
        let vm = this;
        vm.showPayments = true;
        vm.showFolioList = false;
        vm.showFolioDetails = false;
        // vm.showBTInvoice = false;
      },
      formatDate(date) {
        return moment(date).format("DD MMM YYYY");
      },
      formatUTCDate(date) {
        return moment.utc(date).format("DD MMM YYYY");
      },
      checkDateWithCurrent(date){
        let vm = this;
        let currentDate = moment.utc().format()
        if(moment(date).isBefore(currentDate)){
          return true
        }else{
          return false
        }
      },
      formatMoney(amount) {
        return this.$store.state.getFormattedAmount("$", amount);
      },
      getRatePlanDetailList(SearchText, Tagtext) {
        let vm = this;
        vm.$store.dispatch("dataRequestHandler", {
          key: "GetRateplanList_bysearch",
          params: {
            StatusId: 1,
            SearchText: SearchText,
            Tagtext: Tagtext,
          },
          callback: function (err, response) {
            if (err) {
              console.log("Get_RatePlanList==>", err);
              return;
            }
            if (response) {
              console.log("Get_RatePlanList==>", response);
              vm.RatePlanList = response[1];
            }
          },
        });
      },
      folioSection(data) {
        let vm = this;
        if (data.ledgerAccountName == "Master Folio") {
          vm.showCorpLedgerFolioList = false;
          vm.getMasterFolioSummaryList();
          vm.getFolioSummary();
          vm.showMasterFolio = true;
          vm.selectedInvoiceId = "masterFolio";
          vm.isFolioListVisible = false;
          vm.selectedResId = null
          vm.ratePlanList = []
          vm.showFolioDetails = false;
        }
      },
      getBalancePriority(balanceTransferItem) {
        if (balanceTransferItem.Balance < balanceTransferItem.Amount) {
          return true;
        } else {
          return false;
        }
      },
      getFolioDetails(ledgerType, itemId, isvoided) {
        let vm = this;
        if(isvoided){
          return
        }
        vm.showFolioDetails = true;
        vm.showFolioList = false;
        vm.selectedInvoiceId = itemId;
        vm.getBTFolioSummaryDetails(itemId);
        vm.isFolioListVisible = false;
        vm.emailList = vm.additionalEmails;
        vm.getPaymentDetails();
        vm.selectedFolioItemId = itemId
        // }
        // if((event && event.target.value != -99) || itemId){
        // console.log("evvnntt--",event?.target?.value,itemId);
        // itemId = itemId ? itemId : event.target?.value
        // console.log("after--evvnntt--",itemId);
        // vm.showFolioDetailsSection =  true;

        // if(event?.target?.value){
        //   vm.showFilteredFolioList = true
        //   vm.getFilteredFolioList = vm.balanceTransferInvoiceList.find(val => val.ItemId.toString() === event.target?.value .toString())
        // }
        // }
        // else{
        // vm.showFolioDetails = false
        // vm.showFolioList = true;
        // vm.balanceTransferInvoiceDetails = []
        // vm.showFilteredFolioList = false
        // vm.getFilteredFolioList = []
        // }
      },
      backToFolioList() {
        let vm = this;
        vm.isFolioListVisible = true;
        vm.showFolioList = true;
        vm.showCorpLedgerFolioList = true;
        vm.selectedInvoiceId = "allFolio";
        vm.showMasterFolio = false;
        vm.paymentDetails = {}
        vm.getCorporateLedgerSummaryList();
        vm.showFolioDetails = false
        vm.totalBalanceTransfer = null
        vm.$router.replace({ path: this.$route.path, query: null });
        vm.showCorpLedgerFolio = vm.$route.query.name;
        vm.displaySectionValue = "corporateLedgerInfo";
      },
      getBTFolioSummaryDetails(itemId) {
        let vm = this;
        vm.isMasterFolioAvailable = null
        vm.$store.dispatch("dataRequestHandler", {
          key: "getBalanceTransferFolioDetails",
          params: {
            ModuleAction: "GetBalanceTransferFolioDetails",
            GuestProfileId: vm.$route.params.GuestProfileId,
            itemId: itemId,
          },
          callback: function (err, response) {
            if (err) {
              return;
            }
            if (response) {
              console.log("resppp-detail--", response);
              vm.balanceTransferInvoiceDetails.splice(0, vm.balanceTransferInvoiceDetails.length, ...response[0])
              vm.totalBalanceTransfer = response[1][0];
              vm.totalAmountVal = response[0].reduce((sum, currVal) => sum + currVal.Amount, 0);
              vm.totalTaxVal = response[0].reduce((sum, currVal) => sum + currVal.Tax, 0);
              vm.selectedResId = response[0][0].ReservationId
              // vm.folioId = response[0][0].folioId
              console.log("selectedResId----", vm.selectedResId);
              vm.getReservationDetails(vm.selectedResId)
              vm.isMasterFolioAvailable = response[0].find(val => val.isMaster == 1).isMaster
              console.log("vm.isMasterFolioAvailable---", vm.isMasterFolioAvailable);
            }
          },
        });
      },
      getTotalAmount(amount, tax) {
        return (amount + tax).toFixed(2);
      },
      getFolioList(value) {
        let vm = this;
        if (value == "allFolio") {
          vm.showCorpLedgerFolioList = true;
          vm.getCorporateLedgerSummaryList();
          vm.showMasterFolio = false;
          vm.isFolioListVisible = true;
          vm.showFolioList = true;
          vm.$router.replace({ path: this.$route.path, query: null });
          vm.showCorpLedgerFolio = vm.$route.query.name;
          vm.displaySectionValue = "corporateLedgerInfo";
          vm.showFolioDetails = false
          vm.totalBalanceTransfer = null
        } else if (value == "masterFolio") {
          vm.showCorpLedgerFolioList = false;
          vm.getMasterFolioSummaryList();
          vm.getFolioSummary();
          vm.showMasterFolio = true;
          vm.isFolioListVisible = false;
          vm.selectedResId = null
          vm.ratePlanList = []
          vm.showFolioDetails = false;
          vm.paymentDetails = [],
          vm.totalBalanceTransfer = null
          vm.getRatePlanList()

        } else {
          vm.showCorpLedgerFolioList = true;
          vm.showFolioDetails = true;
          vm.showFolioList = false;
          // vm.selectedInvoiceId = itemId
          vm.getBTFolioSummaryDetails(value);
          vm.isFolioListVisible = false;
          vm.showMasterFolio = false;
          vm.getRatePlanList()
          vm.getPaymentDetails()
          vm.selectedFolioItemId = value
        }
        
      },
      updatePaymentDate(key, dateObj) {
        let scope = this;
        scope.pendingPaymentDetails[0]["dateEffective"] = dateObj
          ? dateObj.format("DD MMM YYYY")
          : null;
      },
      addPayment() {
        let slectedInvoiceval = this.balanceTransferInvoiceList.filter(inv => inv.ItemId == this.selectedInvoiceId)
        let amount = this.formatBalanceMoney(slectedInvoiceval[0].Balance)
        this.pendingPaymentDetails.push(
          JSON.parse(
            JSON.stringify({
              PaymentInfoId: -1,
              PaymentTypeId: null,
              Amount: amount,
              dateEffective: moment().format("YYYY-MM-DD HH:mm:ss"),
            })
          )
        );
        this.showNextProcessButton = false;
        this.buttonName = "Save";
        if (this.guestPaymentCards.length === 1) {
          this.selectedPaymentCardDetails = this.guestPaymentCards[0];
          this.buttonName = "Process";
        } else {
          let defaultPaymentOption = this.guestPaymentCards.filter(function (
            paymentCard
          ) {
            return paymentCard.IsDefault;
          });

          if (defaultPaymentOption && defaultPaymentOption.length > 0) {
            this.selectedPaymentCardDetails = defaultPaymentOption[0];
            this.buttonName = "Process";
          } else {
            this.selectedPaymentCardDetails = this.guestPaymentCards[0];
            this.buttonName = "Process";
          }
        }

        this.showAddPaymentDetail = true;
        this.showPayments = true;
        this.showPaymentDetails = false;
      },
      showChildPaymentItems(payment) {
        let vm = this;
        console.log("showChildPaymentItems", payment);
        payment.showChildPaymentDetails = true;
      },
      addPendingchildPaymentitems(payment, nextProcess, mode, childPayment) {
        let vm = this;
        vm.buttonName = "Process";
        if (nextProcess == "NextPaymentStatus") {
          payment.parentPaymentDetails.NextProcess = true;
          if (childPayment) {
            childPayment.NextProcess = true;
          }
        }
        if (nextProcess == "NextPaymentStatus2") {
          payment.parentPaymentDetails.NextProcess = false;
          if (childPayment) {
            childPayment.NextProcess = false;
          }
        }
        payment.showChildPaymentDetails = true;
        vm.showNextProcessButton = false;
        vm.$set(payment, "PendingchildPaymentitems", []);
        if (mode == "parent") {
          payment.PendingchildPaymentitems.push(
            Object.assign({}, payment.parentPaymentDetails)
          );
          payment.parentPaymentDetails = payment.parentPaymentDetails;
          vm.checkAmount = payment.parentPaymentDetails.Amount;
        } else if (mode == "child") {
          payment.PendingchildPaymentitems.push(Object.assign({}, childPayment));
          payment.parentPaymentDetails.NextPaymentStatusId =
            childPayment.NextPaymentStatusId;
          payment.parentPaymentDetails.NextPaymentStatusId2 =
            childPayment.NextPaymentStatusId2;
          vm.checkAmount = childPayment.Amount;
        }

        vm.parentPaymentitemObj = payment;
        vm.showAddPaymentDetail = true;
        vm.showPayments = true;
        vm.showPaymentDetails = false;
        vm.Cancel(); //Cancelling add folio items
        vm.CancelUpdateFolioItem();
        // if(Amount <= payment.Amount){

        // }else{
        //   vm.$store.dispatch("toastr", {
        //     type: "warning",
        //     header: "warning!",
        //     message: "Amount sholud be equal or less than the charged or authorized amount"
        //   });
        // }
      },
      // showAddPaymentDetail(){
      //   let vm =  this;

      // },
      makeStripePayment(capture, directpayments) {
        const vm = this;
        const reTries = 1;

        vm.isModalVisible = false;

        if (capture == null || capture == undefined) {
          capture = !!(directpayments !== "directpayments");
        }

        if (vm.stripeConnectedAccount) {
          const surchargeLedgerAcountId = vm.LedgerAcounts.find(ledger => ledger.ledgerAccountName === "Payment Processing Fee");

          vm.disableMultiProcess = true;

          const params = {
            ModuleAction: "makeStripePayment",
            paymentDetails: vm.pendingPaymentDetails[0],
            paymentCardDetails: vm.selectedPaymentCardDetails,
            stripePlatformAccount: vm.stripePlatformAccount,
            stripeConnectedAccount: vm.stripeConnectedAccount,
            commissionAmmount: vm.commissionAmmount,
            guestInfo: vm.guestInfo,
            roomInfo: vm.roomInfo,
            captureValue: capture,
            paymentStatusId: vm.paymentProcessMethod,
            dateEffective: moment().format("YYYY-MM-DD HH:mm:ss"),
            email: vm.additionalEmails.length > 0 ? vm.additionalEmails[0].Emailaddress : "",
            phone: vm.additionalPhoneNumbers.length > 0 ? vm.additionalPhoneNumbers[0].PhoneNumber : "",
            surchargeAmount: vm.surchargeAmount,
            surchargeLedgerAcountId: surchargeLedgerAcountId ? surchargeLedgerAcountId.ledgerAccountID : null,
            selectedInvoice: vm.balanceTransferInvoiceList.filter(inv => inv.ItemId == vm.selectedInvoiceId),
            corporateProfileId: vm.$route.params.GuestProfileId,
          };

          vm.$store.dispatch("dataRequestHandler", {
            key: "makeStripePayment",
            params: params,
            callback: function (err, response) {
              if (err) {
                vm.$store.dispatch("toastr", {
                  type: "error",
                  header: "Error!",
                  message: "Failed",
                });
                // vm.save_Notification(3, 28, vm.pendingPaymentDetails[0]["Amount"]);
                vm.showAddPaymentDetail = false;
              } else if (response) {
                vm.disableMultiProcess = false;
                console.log("response in makeStripePayment", response);

                if (response.message) {
                  vm.$store.dispatch("toastr", {
                    type: "error",
                    header: "Error!",
                    message: "Error in Authorized/Charged",
                  });
                  // vm.save_Notification(3, 28, vm.pendingPaymentDetails[0]["Amount"]);
                } else {
                  vm.paymentProcessMethod = vm.paymentStatusId;
                  vm.$store.dispatch("toastr", {
                    type: "success",
                    header: "Success!",
                    message: "Authorized/Charged successfully",
                  });

                  if (capture) {
                    // vm.save_Notification(
                    //   3,
                    //   12,
                    //   Number(vm.pendingPaymentDetails[0]["Amount"]) + Number(vm.surchargeAmount)
                    // );
                  } else {
                    // vm.save_Notification(3, 27, vm.pendingPaymentDetails[0]["Amount"]);
                  }
                }

                vm.showAddPaymentDetail = false;
                vm.disableMultiProcess = false;
                vm.parentPaymentitemObj = {};
                vm.checkAmount = null;
                vm.paymentProcessMethod = null;
                vm.paymentStatusId = null;
                vm.ShowDropdown = false;
                vm.selectedFolioItemToEdit = null;
                // vm.getFolioSummary(true, null);
                vm.corporateFinancialSummary()
                vm.getCorporateLedgerSummaryList()
                setTimeout(() => {
                  vm.getPaymentDetails();
                }, 1000);
              }
            },
          });
        } else {
          vm.disableMultiProcess = false;
          vm.$store.dispatch("toastr", {
            type: "warning",
            header: "Warning!",
            message: "No connected account",
          });
        }
      },
      captureChargeOrRefund() {
        const vm = this;
        const reTries = 1;
        vm.isModalVisible = false;

        let processId;
        if (vm.parentPaymentitemObj.PendingchildPaymentitems[0].NextProcess) {
          processId =
            vm.parentPaymentitemObj.parentPaymentDetails.NextPaymentStatusId;
        } else {
          processId =
            vm.parentPaymentitemObj.parentPaymentDetails.NextPaymentStatusId2;
        }

        if (processId == 6 || processId == 8) {
          vm.FeeCollected = null;
        }

        const balanceAmount = vm.parentPaymentitemObj.PendingchildPaymentitems[0].BalanceAmount;

        if (balanceAmount <= vm.checkAmount && balanceAmount > 0) {
          const surchargeLedgerAcountId = vm.LedgerAcounts.find(ledger => ledger.ledgerAccountName === "Payment Processing Fee");

          vm.disableMultiProcess = true;

          const params = {
            ModuleAction: "captureChargeOrRefund",
            payment: vm.parentPaymentitemObj.parentPaymentDetails,
            paymentDetails: vm.parentPaymentitemObj.PendingchildPaymentitems[0],
            paymentCardDetails: vm.selectedPaymentCardDetails,
            stripePlatformAccount: vm.stripePlatformAccount,
            stripeConnectedAccount: vm.stripeConnectedAccount,
            commissionAmmount: vm.commissionAmmount,
            guestInfo: vm.guestInfo,
            dateEffective: moment().format("YYYY-MM-DD HH:mm:ss"),
            surchargeAmount: vm.surchargeAmount,
            surchargeLedgerAcountId: surchargeLedgerAcountId ? surchargeLedgerAcountId.ledgerAccountID : null,
            selectedInvoice: vm.balanceTransferInvoiceList.filter(inv => inv.ItemId == vm.selectedInvoiceId),
            corporateProfileId: vm.$route.params.GuestProfileId,
          };

          vm.$store.dispatch("dataRequestHandler", {
            key: "captureChargeOrRefund",
            params: params,
            callback: function (err, response) {
              vm.disableMultiProcess = false;

              if (err) {
                vm.$store.dispatch("toastr", {
                  type: "error",
                  header: "Error!",
                  message: "Failed",
                });
                // vm.save_Notification(3, 28, balanceAmount);
                vm.showAddPaymentDetail = false;
              } else if (response) {
                console.log("response in Get_PaymentAccount_Details", response);

                if (response.message) {
                  vm.paymentProcessMethod = 3;
                  vm.$store.dispatch("toastr", {
                    type: "error",
                    header: "Error!",
                    message: "Error in creating refund/release/capture",
                  });
                  // vm.save_Notification(3, 28, balanceAmount);
                } else {
                  if (processId === 6) {
                    vm.paymentProcessMethod = processId;
                    // vm.getLogIdsByEventID(3, 13);
                    // vm.save_Notification(3, 13, balanceAmount);
                  } else if (processId === 8) {
                    vm.paymentProcessMethod = processId;
                    // vm.getLogIdsByEventID(3, 12);
                    // vm.save_Notification(
                    //   3,
                    //   12,
                    //   balanceAmount + Number(vm.surchargeAmount)
                    // );
                  } else {
                    if (response.message) {
                      vm.$store.dispatch("toastr", {
                        type: "error",
                        header: "Error!",
                        message: response.message,
                      });
                    } else {
                      vm.paymentProcessMethod = processId;
                      vm.$store.dispatch("toastr", {
                        type: "success",
                        header: "Success",
                        message: "Operation successful",
                      });
                    }
                  }
                  vm.showAddPaymentDetail = false;
                  vm.parentPaymentitemObj.PendingchildPaymentitems = [];
                  vm.parentPaymentitemObj = {};
                  vm.checkAmount = null;
                  vm.paymentProcessMethod = null;
                  vm.paymentStatusId = null;
                  vm.ShowDropdown = false;
                  vm.selectedFolioItemToEdit = null;
                  // vm.getFolioSummary(true, null);
                  vm.corporateFinancialSummary()
                  vm.getCorporateLedgerSummaryList()
                  setTimeout(() => {
                    vm.getPaymentDetails();
                  }, 1000);

                }
              }
            },
          });
        } else {
          vm.$store.dispatch("toastr", {
            type: "warning",
            header: "Warning!",
            message: "Amount should be equal to or less than the charged or authorized amount",
          });
          vm.disableMultiProcess = false;
        }
      },
      makePaymentOnGateway(typeodPayment, processId) {
        let vm = this;
        let yespaymentOptioncall = null,
          amountval;
        if (typeodPayment == "makeStripePayment") {
          yespaymentOptioncall = vm.makeStripePayment;
          amountval = vm.pendingPaymentDetails[0]["Amount"];
        } else {
          yespaymentOptioncall = vm.captureChargeOrRefund;
          amountval =
            vm.parentPaymentitemObj.PendingchildPaymentitems[0]["BalanceAmount"];
        }
        vm.$store.dispatch("dataRequestHandler", {
          key: "getSurCharges",
          params: {
            stripeConnectedAccount: vm.stripeConnectedAccount,
            amount: amountval,
            paymentCardDetails: vm.selectedPaymentCardDetails,
          },
          callback: function (err, response) {
            if (err) {
              vm.$store.dispatch("toastr", {
                type: "error",
                header: "Error",
                message: err,
              });
              return;
            }
            if (response) {
              vm.surchargeAmount = response.reply.datablock.surcharge;
              vm.isModalVisible = true;
              let popupMessage = `<div class="dTable">
                <div class="dTHead">
                  <div class="dCell" style="text-align: left;padding-top: 0;font-weight: 600;">Item Description</div>
                  <div class="dCell" style="text-align: right;padding-top: 0;font-weight: 600;">Value</div>
                </div>
                <div class="dTBody folioBody" style="font-size: 13px">
                  <div class="dTBodyRow newFolio">
                    <div class="dCell" style="text-align: left;">Amount</div>
                    <div class="dCell" style="text-align: right;">${amountval ? "$" : ""
                } ${amountval}</div>
                  </div>
                  <div class="dTBodyRow newFolio">
                    <div class="dCell" style="text-align: left;"> Payment Processing Fee(#% Surcharge on Credit card)</div>
                    <div class="dCell" style="text-align: right;">${response.reply.datablock.surcharge ? "$" : ""
                } ${response.reply.datablock.surcharge}</div>
                  </div>
                </div>
                <div class="dTBody folioFooter" style="font-size: 14px">
                    <div class="dTBodyRow">
                      <div class="dCell pb-0" style="font-weight: bold; text-align: left;font-weight: 600 !important;font-size: 16px !important;">Total</div>
                      <div class="dCell pb-0" style="text-align: right;font-weight: 600 !important;font-size: 16px !important;">${response.reply.datablock.amount ? "$" : ""
                } ${response.reply.datablock.amount}</div>
                    </div>
                </div>
                </div>`;
              vm.modalParams = {
                popupTitle: "Confirm Payment Account",
                popupMessage: popupMessage,
                displayYesNoButtons: true,
                yesButtontext: "Process",
                noButtonText: "Cancel",
                yesButtonCallback: yespaymentOptioncall,
                noButtonCallback: vm.closepopup,
                cancelbuttonCallback: vm.closepopup,
                isFrom: "resFolio",
                html: true,
              };
            }
          },
        });
      },
      closepopup() {
        let vm = this;
        vm.modalParams = null;
        vm.isModalVisible = false;
      },
      makePayment() {
        const vm = this;
        let capture;

        const isValidPaymentDetails = vm.pendingPaymentDetails && vm.pendingPaymentDetails[0] && vm.pendingPaymentDetails[0]["Amount"] > 0;

        // if (vm.$route.params.ReservationId === -1) {
        //   vm.$store.dispatch("toastr", {
        //     type: "error",
        //     header: "Error",
        //     message: "Please save room info",
        //   });
        //   return;
        // }

        if (!isValidPaymentDetails && vm.selectedPaymentCardDetails && vm.selectedPaymentCardDetails.IsCreditcard) {
          vm.$store.dispatch("toastr", {
            type: "warning",
            header: "Warning",
            message: "Invalid Amount",
          });
          return;
        }

        if (vm.parentPaymentitemObj.PendingchildPaymentitems && vm.parentPaymentitemObj.PendingchildPaymentitems.length > 0) {
          if (vm.stripeConnectedAccount) {
            const processId = vm.parentPaymentitemObj.PendingchildPaymentitems[0].NextProcess
              ? vm.parentPaymentitemObj.parentPaymentDetails.NextPaymentStatusId
              : vm.parentPaymentitemObj.parentPaymentDetails.NextPaymentStatusId2;

            if (vm.stripeConnectedAccount.GatewayId === 2 && processId !== 6 && processId !== 8) {
              vm.makePaymentOnGateway("captureChargeOrRefund", processId);
            } else {
              vm.captureChargeOrRefund();
            }
          } else {
            vm.$store.dispatch("toastr", {
              type: "warning",
              header: "Warning!",
              message: "No connected account",
            });
          }
        } else if (vm.paymentProcessMethod === 1) {
          console.log(vm.pendingPaymentDetails[0]);
          capture = false;
          vm.makeStripePayment(capture);
          vm.paymentStatusId = vm.paymentProcessMethod;
          //  vm.save_Notification(3,27,vm.pendingPaymentDetails[0]["Amount"]);
        } else if (vm.paymentProcessMethod === 7) {
          capture = true;
          if (vm.stripeConnectedAccount.GatewayId === 2) {
            vm.makePaymentOnGateway("makeStripePayment", vm.paymentProcessMethod);
          } else {
            vm.makeStripePayment(capture, "directpayments");
          }
          vm.paymentStatusId = vm.paymentProcessMethod;
          // vm.getLogIdsByEventID(3, 12);
          //  vm.save_Notification(3,12,vm.pendingPaymentDetails[0]["Amount"]);
        } else if (vm.selectedPaymentCardDetails && !vm.selectedPaymentCardDetails.IsCreditcard) {
          vm.disableMultiProcess = true;
          vm.FeeCollected = null;
          vm.chargeItem = {
            chargeId: null,
            stripeConnectedAccount: null,
            gatewayId: null,
            GatewayResponse: null,
          };
          vm.addMasterFolioItem({
            ledgerAccountId: vm.selectedPaymentCardDetails.ledgerid,
            defaultAmount: vm.pendingPaymentDetails[0]["Amount"],
            paymentInfoId: null,
            dateEffective: moment(vm.pendingPaymentDetails[0]["dateEffective"]).format("YYYY-MM-DD HH:mm:ss"),
            fromPayment: true,
            TaxAmount: null,
          }, null);

          const eventID = vm.pendingPaymentDetails[0]["Amount"] > 0 ? 12 : 13;
          // vm.getLogIdsByEventID(3, eventID);
          // vm.save_Notification(3, eventID, vm.pendingPaymentDetails[0]["Amount"]);

          vm.showAddPaymentDetail = false;
          vm.disableMultiProcess = false;
          vm.chargeItem = {};
        } else {
          vm.$store.dispatch("toastr", {
            type: "error",
            header: "Error",
            message: "Please select payment method/Transaction",
          });
        }
      },
      cancelPayment() {
        let vm = this;
        vm.showAddPaymentDetail = false;
        vm.disableMultiProcess = false;
        vm.parentPaymentitemObj.PendingchildPaymentitems = [];
        vm.pendingPaymentDetails.splice(vm.pendingPaymentDetails.length - 1, 1);
        console.log("pendingPaymentDetails---", vm.pendingPaymentDetails);
        vm.showNextProcessButton = true;
      },
      getTodayDate() {
        return moment().format("DD MMM YYYY");
      },
      getMasterFolioSummaryList() {
        let vm = this;
        vm.$store.dispatch("dataRequestHandler", {
          key: "Get_FolioSummary_Account",
          params: {
            ModuleAction: "Get_FolioSummary_Account",
            corporateProfileId: vm.$route.params.GuestProfileId,
          },
          callback: function (err, response) {
            if (err) {
              return;
            }
            if (response) {
              console.log("resppp-detail--", response);
              vm.masterFolioList = response[0];
              vm.folioCharges = response[1][0];
              for (let folioItem of vm.masterFolioList) {
                vm.previousFolioItemDetails.push(Object.assign({}, folioItem));
              }
              // vm.balanceTransferInvoiceDetails =  response[0]
              // vm.totalBalanceTransfer = response[1][0]
              // vm.totalAmountVal = response[0].reduce((sum,currVal) => sum + currVal.Amount,0)
              // vm.totalTaxVal= response[0].reduce((sum,currVal) => sum + currVal.Tax,0)
            }
          },
        });
      },
      getFolioItemsDetail() {
        let vm = this;
        vm.showMasterFolio = true;
        vm.showPayments = false;
        vm.showAddPaymentDetail = false;
        // vm.disableMultiProcess = false;
        // vm.parentPaymentitemObj.PendingchildPaymentitems = [];
        // vm.pendingPaymentDetails.splice(vm.pendingPaymentDetails.length - 1, 1);
        vm.showNextProcessButton = true;
      },
      showItems(name) {
        let vm = this;
        if (name === "displayAddFolioItem") {
          vm.ShowDropdown = true;
          vm.focused = true;
          let selectedDate = vm.folioItemsDetails.filter((folioItem) => {
            return folioItem.Ischecked == true;
          });
          this.selectedLedger = {
            dateEffective:
              selectedDate && selectedDate[0]
                ? moment(selectedDate[0].ActualDateEffective).format(
                  "DD MMM YYYY"
                )
                : moment().format("DD MMM YYYY"),
            ledgerAccountId: null,
            defaultAmount: null,
            paymentInfoId: null,
            folioItemId: null,
          };
          vm.cancelPayment();
        }
        vm.showPreviewButton = true;
        console.log("selectedLedger--", this.selectedLedger);
      },
      editFolioItem() {
        let vm = this;
        if (
          !vm.isFolioDirty &&
          (vm.selectedFolioItemToEdit === null ||
            JSON.stringify(vm.selectedFolioItemToEdit) !=
            JSON.stringify(vm.itemToEdit)) &&
          !vm.itemToEdit.IsVoided
        ) {
          vm.folioUpdate = true;
          vm.selectedFolioItemToEdit = JSON.parse(JSON.stringify(vm.itemToEdit));
          vm.selectedFolioItemActualJson = JSON.parse(
            JSON.stringify(vm.itemToEdit)
          );
          console.log("folioItemfolioItem", vm.itemToEdit.Ischecked);

          if (vm.itemToEdit.Ischecked) {
            if (vm.folioItemsToVoid.includes(vm.itemToEdit.ItemId)) {
              var index = vm.folioItemsToVoid.indexOf(vm.itemToEdit.ItemId);
              if (index > -1) {
                vm.folioItemsToVoid.splice(index, 1);
              }
            }
          } else {
            vm.folioItemsToVoid.push(vm.itemToEdit.ItemId);
          }

          // vm.$set(folioItem, 'editable', true);
          if (vm.selectedLedger) {
            vm.selectedLedger.dateEffective = moment(
              vm.selectedFolioItemToEdit.ActualDateEffective
            ).format("YYYY-MM-DD");
          }
        }
        vm.itemToEdit = null;
      },
      Cancel(cancelEditfolio) {
        let vm = this;
        vm.ShowDropdown = false;
        vm.selectedLedger = null;
        vm.selectedItemCount = true;
        vm.selectedVoidItem = false;
        vm.folioDateChange = false;
        if (cancelEditfolio == "cancelEditfolio") {
          vm.getFolioSummary(false);
        }
        vm.folioItemsToVoid.splice(0);
        for (let folioItem of vm.folioItemsDetails) {
          folioItem.Ischecked = false;
        }
        vm.itemToEdit = null;
        vm.checkedItems = [];
      },
      cancelRatePlanEdit() {
        let vm = this;
      },
      VoidCurrentFolioItem() {
        let vm = this;
        // console.log("selectedFolioItemToEdit--",vm.folioItemsToVoid.join());
        vm.selectedVoidItem = false;
        vm.selectAllFolio = false;
        vm.$store.dispatch("dataRequestHandler", {
          key: "voidCorporateMasterFolio",
          params: {
            folioItemId: vm.folioItemsToVoid.join(),
            note: null,
            userUpdate: null,
          },
          callback: function (err, response) {
            if (err) {
              console.log("err in VoidCurrentFolioItem", err);
              vm.$store.dispatch("toastr", {
                type: "error",
                header: "Error",
                message: "Error while voiding folio item",
              });
              return;
            }
            if (response) {
              vm.$store.dispatch("toastr", {
                type: "success",
                header: "Success!",
                message: "Folio Updated Successfully.",
              });
              vm.selectedFolioItemToEdit = null;
              vm.folioUpdate = false;
              vm.isFolioDirty = false;
              vm.itemToEdit = null;
              vm.checkedItems = [];
              vm.selectedVoidItem = false;
              vm.selectedItemCount = true;
              vm.getMasterFolioSummaryList();
              vm.corporateFinancialSummary();
            }
          },
        });
      },
      CancelUpdateFolioItem() {
        let vm = this;
        if (vm.selectedFolioItemToEdit) {
          console.log("vm.previousFolioItemDetails---", vm.previousFolioItemDetails);
          let previousFolioItemIndex = vm.previousFolioItemDetails
            .map((x) => {
              return x.ItemId;
            })
            .indexOf(vm.selectedFolioItemToEdit.ItemId);
          for (let folioItem of vm.masterFolioList) {
            if (vm.selectedFolioItemToEdit.ItemId == folioItem.ItemId) {
              folioItem.FolioAmount =
                vm.previousFolioItemDetails[previousFolioItemIndex].FolioAmount;
              folioItem.TaxAmount =
                vm.previousFolioItemDetails[previousFolioItemIndex].TaxAmount;
              // folioItem.FolioAmount = vm.selectedFolioItemToEdit.FolioAmount
              // folioItem.TaxAmount = vm.selectedFolioItemToEdit.TaxAmount
            }
          }
        }
        vm.folioDateChange = false;
        vm.selectAllFolio = false;
        vm.selectedItemCount = true;
        vm.selectedVoidItem = false;
        vm.folioItemsToVoid.splice(0);
        vm.selectedFolioItemToEdit = null;
        vm.folioUpdate = false;
        vm.isFolioDirty = false;
        vm.ShowDropdown = false;
        vm.selectedLedger = null;
        for (let folioItem of vm.masterFolioList) {
          folioItem.Ischecked = false;
        }
        vm.itemToEdit = null;
        vm.checkedItems.splice(0);
      },
      scrollToCalender(index, length) {
        console.log("index", index, "+", length);
        let scrollTo = (index - 1) * 55;
        // if(index != 1 && index != 2 && index != 3 && index != 4 && (index != 5 && index <= length) && (index != 6 && index <= length)){
        $(".dTBody.folioBody").scrollTop(scrollTo);
        // }
      },
      UpdateCurrentFolioItem() {
        if (this.selectedFolioItemToEdit) {
          if (this.selectedFolioItemToEdit.ledgerAccountTypeID) {
            if (
              this.selectedFolioItemToEdit.ledgerAccountTypeID == 4 &&
              (!this.selectedFolioItemToEdit.ActualTaxAmount ||
                this.selectedFolioItemToEdit.ActualTaxAmount == 0)
            ) {
              this.$store.dispatch("toastr", {
                type: "warning",
                header: "Warning",
                message: "Please enter amount",
              });
              return;
            }
          } else if (
            !this.selectedFolioItemToEdit.ledgerAccountTypeID &&
            (!this.selectedFolioItemToEdit.ActualFolioAmount ||
              this.selectedFolioItemToEdit.ActualFolioAmount == 0)
          ) {
            this.$store.dispatch("toastr", {
              type: "warning",
              header: "Warning",
              message: "Please enter amount",
            });
            return;
          }
          this.addMasterFolioItem(
            {
              ledgerAccountId: this.selectedFolioItemToEdit.ledgerAccountId,
              defaultAmount:
                this.selectedFolioItemToEdit.ledgerAccountTypeID &&
                  this.selectedFolioItemToEdit.ledgerAccountTypeID == 4
                  ? this.selectedFolioItemToEdit.ActualTaxAmount
                  : this.selectedFolioItemToEdit.ActualFolioAmount,
              paymentInfoId: null,
              // folioItemId: this.selectedFolioItemToEdit.ItemId,
              dateEffective: this.selectedFolioItemToEdit.DateEffective,
              fromPayment: false,
              TaxAmount: this.selectedFolioItemToEdit.ActualTaxAmount,
              itemId: this.selectedFolioItemToEdit.ItemId,
            },
            "folioChange"
          );
          this.isFolioDirty = false;
          this.selectAllFolio = false;
          this.selectedFolioItemToEdit = null;
          this.selectedVoidItem = false;
          this.folioUpdate = false;
        }
      },
      saveFolioItem(ledgerObj) {
        let vm = this;
        console.log("ledgerObj::-------", ledgerObj);
        vm.selectedVoidItem = false;
        if (!ledgerObj.ledgerAccountId) {
          vm.$store.dispatch("toastr", {
            type: "warning",
            header: "Warning",
            message: "Please select ledger",
          });
          return;
        }

        if (ledgerObj.ledgerAccountId) {
          if (ledgerObj.ledgerAccountTypeID) {
            if (
              ledgerObj.ledgerAccountTypeID == 4 &&
              (!ledgerObj.TaxAmount || ledgerObj.TaxAmount == 0)
            ) {
              vm.$store.dispatch("toastr", {
                type: "warning",
                header: "Warning",
                message: "Please enter amount",
              });
              return;
            }
          } else if (
            !ledgerObj.ledgerAccountTypeID &&
            (!ledgerObj.defaultAmount || ledgerObj.defaultAmount == 0)
          ) {
            vm.$store.dispatch("toastr", {
              type: "warning",
              header: "Warning",
              message: "Please enter amount",
            });
            return;
          }
        }
        vm.addMasterFolioItem(
          {
            ledgerAccountId: ledgerObj.ledgerAccountId,
            defaultAmount:
              ledgerObj.ledgerAccountTypeID && ledgerObj.ledgerAccountTypeID == 4
                ? ledgerObj.TaxAmount
                : ledgerObj.defaultAmount,
            paymentInfoId: null,
            // folioItemId: null,
            dateEffective: ledgerObj.ActualDateEffective
              ? ledgerObj.ActualDateEffective
              : moment(ledgerObj.dateEffective).format("YYYY-MM-DD"),
            fromPayment: false,
            TaxAmount: ledgerObj.TaxAmount,
            itemId: null,
          },
          "folioChange"
        );
        vm.selectedLedger = null;
      },
      addMasterFolioItem(object, foliochange) {
        console.log("addMasterFolioItem ===== ", object);
        let vm = this;
        console.log("vm.chargeItem", vm.chargeItem);
        vm.$store.dispatch("dataRequestHandler", {
          key: "addCorporateFolio",
          params: {
            corporateProfileId: vm.$route.params.GuestProfileId,
            DateEffective: object.dateEffective,
            Amount: object.defaultAmount,
            // taxAmount: object.TaxAmount,
            LedgerAccountId: object.ledgerAccountId,
            itemDescription: null,
            createdByUserId: null,
            parentTransactionId: null,
            ItemId: object.itemId,
            selectedInvoice: vm.balanceTransferInvoiceList.filter(inv => inv.ItemId == vm.selectedInvoiceId),
            PaymentInfoId: object.paymentInfoId,
            chargeObj: vm.chargeItem,
            paymentStatusId: vm.paymentProcessMethod,
            commissionAmmount: vm.commissionAmmount,
            FeeCollected: vm.FeeCollected,
            TaxAmount: object.TaxAmount ? object.TaxAmount : null,
            foliochange: foliochange
          },
          callback: function (err, response) {
            if (err) {
              vm.$store.dispatch("toastr", {
                type: "error",
                header: "Error",
                message: "Error While Updating Folio Err!",
              });
              return;
            }
            if (response) {
              if (response[0] && response[0][0] && response[0][0].ErrorMessage) {
                vm.$store.dispatch("toastr", {
                  type: "error",
                  header: "Error",
                  message: "Error While Updating Folio!",
                });
              } else {
                vm.$store.dispatch("toastr", {
                  type: "success",
                  header: "Success!",
                  message: "Folio Updated Successfully.",
                });
              }
            }

            if (vm.selectedInvoiceId == "masterFolio") {
              vm.ShowDropdown = false;
              vm.showMasterFolio = true;
              vm.showRatePlanSave = false;
              vm.getMasterFolioSummaryList();
            }
            vm.corporateFinancialSummary();
            vm.checkedItems = [];

            vm.parentPaymentitemObj = {};
            vm.checkAmount = null;
            vm.paymentProcessMethod = null;
            vm.paymentStatusId = null;
            console.log("result in save_folioItem", response);
            vm.selectedFolioItemToEdit = null;
            vm.getFolioSummary(object.fromPayment, foliochange);
            vm.getCorporateLedgerSummaryList()
            vm.getPaymentDetails();
            vm.folioUpdate = false;
            vm.itemToEdit = null;
            vm.selectedVoidItem = false;
          },
        });
      },
      showTransactionData(data) {
        let vm = this;
        vm.modalParams = {
          popupTitle: "Transaction Details",
          popupMessage: JSON.stringify(JSON.parse(data), null, "\t"),
          yesButtontext: null,
          noButtonText: null,
          yesButtonCallback: null,
          noButtonCallback: null,
          code: true,
          className: "payment-info-modal",
        };
        vm.isModalVisible = true;
      },
      onChangeRatePlan() {
        let vm = this;
      },
      expandPreview() {
        let vm = this;
        if (vm.selectedLedger && !vm.selectedLedger.ledgerAccountId) {
          vm.$store.dispatch("toastr", {
            type: "warning",
            header: "warning",
            message: "select the ledger",
          });
          return;
        }
        if (vm.selectedLedger.ledgerAccountId) {
          if (vm.selectedLedger.ledgerAccountTypeID) {
            if (
              vm.selectedLedger.ledgerAccountTypeID == 4 &&
              (!vm.selectedLedger.TaxAmount || vm.selectedLedger.TaxAmount == 0)
            ) {
              this.$store.dispatch("toastr", {
                type: "warning",
                header: "Warning",
                message: "Please enter amount",
              });
              return;
            }
          } else if (
            !vm.selectedLedger.ledgerAccountTypeID &&
            (!vm.selectedLedger.defaultAmount ||
              vm.selectedLedger.defaultAmount == 0)
          ) {
            this.$store.dispatch("toastr", {
              type: "warning",
              header: "Warning",
              message: "Please enter amount",
            });
            return;
          }
        }
        // vm.getFolioSummary(false);
        vm.showPreviewButton = false;
      },
      scrollDown() {
        $(".dTBody.folioBody").scrollTop(
          ($(".dTBodyRow.newFolio").length +
            $(".dTBodyRow.updatedFolio").length) *
          55
        );
      },
      updateFolioEffectiveDate(key, dateObj, objectPassedToParent) {
        objectPassedToParent.DateEffective = dateObj
          ? dateObj.format("DD MMM YYYY")
          : null;
        console.log("updateFolioEffectiveDateupdateFolioEffectiveDate", dateObj);
        if (objectPassedToParent.hasOwnProperty("ActualDateEffective"))
          objectPassedToParent.ActualDateEffective = dateObj
            ? dateObj.format("YYYY-MM-DD")
            : null;
        else if (objectPassedToParent.hasOwnProperty("dateEffective"))
          objectPassedToParent.ActualDateEffective = dateObj
            ? dateObj.format("YYYY-MM-DD")
            : null;

        if (objectPassedToParent.hasOwnProperty("ItemId")) {
          let folioList = this.folioItemsDetails.map((folioItem) => {
            return folioItem.ItemId;
          });
          let folioIndex = folioList.indexOf(objectPassedToParent["ItemId"]);
          if (folioIndex > -1) {
            console.log(this.folioItemsDetails[folioIndex].DateEffective);
            console.log(this.selectedFolioItemToEdit.DateEffective);
            if (
              moment(this.folioItemsDetails[folioIndex].DateEffective).isSame(
                dateObj.format("YYYY-MM-DD")
              )
            ) {
              this.folioDateChange = false;
            } else {
              this.folioDateChange = true;
            }
          } else {
            this.folioDateChange = false;
          }
        }
      },
      getFolioSummary(fromPayment, foliochangedornot) {
        let vm = this;
        vm.$store.dispatch("dataRequestHandler", {
          key: "Get_FolioSummary",
          params: {
            ModuleAction: "Get_FolioSummary",
            ReservationId: null,
            ledgerAccountId:
              vm.selectedLedger && vm.selectedLedger.ledgerAccountId != null
                ? vm.selectedLedger.ledgerAccountId
                : null,
            Amount:
              vm.selectedLedger && vm.selectedLedger.defaultAmount != null
                ? vm.selectedLedger.defaultAmount
                : vm.selectedLedger && vm.selectedLedger.TaxAmount != null
                  ? vm.selectedLedger.TaxAmount
                  : null,
            DateEffective:
              vm.selectedLedger && vm.selectedLedger.dateEffective != null
                ? moment(vm.selectedLedger.dateEffective).format("YYYY-MM-DD")
                : null,
            IsFolioEdit:
              vm.selectedLedger && vm.selectedLedger.dateEffective != null
                ? 1
                : 0,
          },
          callback: function (err, response) {
            if (err) {
              console.log("Error in getFolioSummary => ", err);
              return;
            }
            if (response) {
              console.log("LedgerAcounts---", response);
              vm.LedgerAcounts = response[3];
            }
          },
        });
      },
      SaveTaxExemptForReservation() {
        let vm = this;
        vm.$store.dispatch("dataRequestHandler", {
          key: "SaveTaxExemptForReservation",
          params: {
            ReservationId: null,
            IsTaxExempt: vm.folioCharges.IsTaxExempt,
          },
          callback: function (err, response) {
            if (err) {
              console.log("Error in SaveTaxExemptForReservation => ", err);
              return;
            }
            if (response) {
              // console.log("response in SaveTaxExemptForReservation => ", response);
              vm.getMasterFolioSummaryList();
            }
          },
        });
      },
      selectFolioitem(e, item) {
        let vm = this;
        // e.stopPropagation();
        if (e.target.checked) {
          item.Ischecked = true;
        } else {
          item.Ischecked = false;
        }
        let selectedFolioItems = vm.masterFolioList.filter((folioitem) => {
          return folioitem.Ischecked;
        });
        console.log("c-selectedFolioItems--", selectedFolioItems);
        let voidFolioItemIds = selectedFolioItems.map((item) => {
          return item.ItemId;
        });
        vm.folioItemsToVoid.splice(
          0,
          vm.folioItemsToVoid.length,
          ...voidFolioItemIds
        );
        if (selectedFolioItems.length == 1) {
          vm.selectedVoidItem = true;
          vm.selectedItemCount = true;
        } else if (selectedFolioItems.length > 1) {
          vm.selectedItemCount = false;
          vm.selectedVoidItem = true;
          // vm.itemToEdit = null
        } else {
          vm.selectedVoidItem = false;
          vm.selectedItemCount = true;
          // vm.itemToEdit = null
        }
        if (item.Ischecked == true) {
          vm.checkedItems.push(item);
        } else if (item.Ischecked == false) {
          var index = vm.checkedItems.indexOf(item);
          if (index > -1) {
            vm.checkedItems.splice(index, 1);
          }
        }

        if (vm.checkedItems.length == 1) {
          vm.itemToEdit = vm.checkedItems[0];
        } else {
          vm.itemToEdit = null;
        }
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
                "response in GetUserEntitlementsAndDefaultProperty::::--",
                response
              );
              vm.userEntitlementList = response.userEntitlementList;
              vm.UserProperties = response.properties;
            }
          },
        });
      },
      selectAllFolioItems(e) {
        let vm = this;
        if (e.target.checked) {
          vm.folioItemsToVoid.splice(0);
          vm.checkedItems.splice(0);
          for (let folioItem of vm.masterFolioList) {
            if (!folioItem.IsVoided) {
              folioItem.Ischecked = true;
              vm.folioItemsToVoid.push(folioItem.ItemId);
              vm.checkedItems.push(folioItem);
            }
          }
          vm.selectedVoidItem = true;
          vm.selectedItemCount = false;
        } else {
          for (let folioItem of vm.masterFolioList) {
            folioItem.Ischecked = false;
          }
          vm.checkedItems.splice(0);
          vm.folioItemsToVoid.splice(0);
          vm.itemToEdit = null;
          vm.selectedVoidItem = false;
          vm.selectedItemCount = true;
        }
      },
      getFolioInvoice(value) {
        let vm = this;
        // document.getElementById("invoiceToBePrinted").style.display = "block";
        // var element = document.getElementById("invoiceToBePrinted");
        // element.className += "in";
        // element.className += "show";
        vm.DetailedOrConsolidated = value;
        vm.$store.dispatch("dataRequestHandler", {
          key: "GetFolioLedgerTransDetails_Invoice",
          params: {
            FunctionId: null,
            ReservationId: vm.$route.params.GuestProfileId,
          },
          callback: function (err, response) {
            if (err) {
              console.log("err in GetFolioLedgerTransDetails_Invoice", err);
              return;
            }
            if (response) {
              console.log(
                "result in GetFolioLedgerTransDetails_Invoice",
                response
              );
              vm.invoiceDetails = response;
              // for (var i in vm.additionalEmails) {
              //   if (!vm.additionalEmails[i].Emailaddress) {
              //     vm.additionalEmails.splice(i, 1);
              //   }
              // }

              // if (vm.additionalEmails.length == 0) {
              //   vm.additionalEmails.push({ ReservationId: "", Emailaddress: "" });
              // }
            }
          },
        });
      },
      showInvoice() {
        this.showInvoicePopup = true
      },
      getReservationDetails(selectedResId) {
        let vm = this;
        vm.$store.dispatch("dataRequestHandler", {
          key: "GetReservationDetailById",
          params: {
            ModuleAction: "GetReservationDetailById",
            ReservationId: vm.selectedResId,
            companyProfileId: vm.$route.params.GuestProfileId
          },
          callback: function (err, response) {
            if (response) {
              console.log("response--:::re--", response);

              vm.guestData = response.guestInfo;
              vm.guestEmails = response.additionalEmails;
              vm.roomInfo = response.roomInfo;
              // vm.emailList = response.additionalEmails?.[0]?.Emailaddress?.split();
              vm.reservationStatus = response.roomInfo,
                vm.selectedInvoiceObj = vm.balanceTransferInvoiceList.filter(inv => inv.ItemId == vm.selectedInvoiceId)
            }

          }
        })
      },
      showFolioSetting() {
        let vm = this;
        let invoiceFolioObj = vm.balanceTransferInvoiceList.filter(inv => inv.ItemId == vm.selectedInvoiceId)
        let invoiceFolioId = invoiceFolioObj.length ? invoiceFolioObj[0].FolioId : null
        vm.$store.dispatch("dataRequestHandler", {
          key: "getFolioSettingDetails",
          params: {
            ModuleAction: "getFolioSettingDetails",
            folioID: invoiceFolioId ? invoiceFolioId :  vm.corporateFolioId,
            resId: vm.selectedResId,
            itemId : vm.selectedFolioItemId
          },
          callback: function (err, response) {
            if (err) {
              console.log("err in get folio setting details---", err);
              return;
            }
            if (response) {
              console.log("response--get--", response[0][0]);
              vm.showSettingModal = true
              if(response[0] && response[0][0] && response[0][0].NextInvoiceDate){
                response[0][0].NextInvoiceDate = moment.utc(response[0][0].NextInvoiceDate).format("DD MMM YYYY")
              }
              vm.folioSettingDetails = response[0] && response[0][0] ? response[0][0] : vm.folioSettingDetails
              console.log("folioSettingDetails--", vm.folioSettingDetails);
              vm.modalParams = {
                popupTitle: `Folio Settings`,
                html: true,
                folioSettingDetails: vm.folioSettingDetails,
                ratePlanList: vm.ratePlanList,  
                resId: vm.selectedResId,
                cancelbuttonCallback: vm.closeSettingPopup,
                yesButtontext: "Save", // vm.showMasterFolio ? "Default Setting" : "Save",
                // primaryButtontext: vm.showMasterFolio ? "All Reservations" : null,
                noButtonText: "Cancel", //vm.showMasterFolio ? "Future Reservations" : "Cancel",
                yesButtonCallback: vm.saveFolioSetting,
                noButtonCallback: vm.closeSettingPopup,
                isMasterFolio: vm.showMasterFolio
              }
            }
          }
        })
      },
      saveFolioSetting(e,folioSavingType,folioSettingDetails) {
        let vm = this;
        console.log("folioSettingDetails====--",folioSavingType, vm.folioSettingDetails);
        let invoiceFolioObj = vm.balanceTransferInvoiceList.filter(inv => inv.ItemId == vm.selectedInvoiceId)
        let invoiceFolioId = invoiceFolioObj.length ? invoiceFolioObj[0].FolioId : null
        vm.$store.dispatch("dataRequestHandler", {
          key: "saveFolioSettings",
          params: {
            ModuleAction: "saveFolioSettings",
            folioID: invoiceFolioId ? invoiceFolioId :  vm.corporateFolioId,
            reservationId: vm.selectedResId,
            folioSettingDetails: folioSettingDetails,
            // amount: vm.folioSettingDetails.rateAmount,
            // cyclePeriod: vm.folioSettingDetails.ratePlanDuration,
            // cyclePeriodType: vm.folioSettingDetails.cyclePeriod,
            // invoiceFrequency: vm.folioSettingDetails.invoiceFrequencyDuration,
            // invoiceFrequencyType: vm.folioSettingDetails.InvoiceFrequencyCycle,
            // nextInvoiceDate: vm.folioSettingDetails.frequencyDate ? moment(vm.folioSettingDetails.frequencyDate).format("YYYY-MM-DD") : null,
            // invoiceTerms: vm.folioSettingDetails.invoiceTermsDuration,
            // invoiceTermsType: vm.folioSettingDetails.InvoiceTermsCycle,
            // ratePlanId: vm.folioSettingDetails.selectedRatePlan,
            folioSaveType: vm.showMasterFolio ? folioSavingType : 0

          },
          callback: function (err, response) {
            if (err) {
              vm.$store.dispatch("toastr", {
                type: "error",
                header: "Error!",
                message: `Error in saving folio setting details`,
              });
              return;
            }
            if (response) {
              console.log("response in get folio details---", response);
              vm.$store.dispatch("toastr", {
                type: "success",
                header: "Success!",
                message: `Folio setting saved successfully`,
              });
              vm.showSettingModal = false
              vm.corporateFinancialSummary()
            }
          }
        })

      },
      closeSettingPopup() {
        let vm = this;
        vm.modalParams = null;
        vm.showSettingModal = false;
      },
      getRatePlanList(searchText) {
        let vm = this;
        console.log("searchText ===", searchText);
        vm.$store.dispatch("dataRequestHandler", {
          key: "getFolioRateplanList",
          params: {
            clientId: null
          },
          callback: function (err, response) {
            if (err) {
              return;
            }
            if (response) {
              console.log("Get_RatePlanList==>", response);
              vm.ratePlanList = response[0]

              // vm.ratePlanList.splice(0, vm.ratePlanList.length, ...response[1]);
            }
          },
        });
      },
    },
    created() {
      let vm = this;
      vm.$store.state.bus.$on("inputChange", function (selected) {
        vm.guestInfo.Address = selected.value;
      });
    },
    computed: {
      checkSelectedInvoices(){
        return this.balanceTransferInvoiceList.some(item => item.isChecked == true)
      },
      userEntitlementList() {
        let entitlementList = this.$store.getters.getUserEntitlements();
        if (entitlementList && Object.keys(entitlementList).length > 0) {
          return entitlementList;
        }
        return {};
      },
      expiryYears() {
        let currYear = new Date().getFullYear();
        let years = [];
        years.push(currYear);
        for (let yIndex = 1; yIndex <= 16; yIndex++) {
          years.push(currYear + yIndex);
        }
        return years;
      },
      defaultPaymentCard() {
        let card = null;
        if (this.guestPaymentCards && this.guestPaymentCards.length > 0) {
          let defaultCard = this.guestPaymentCards.filter(function (pCard) {
            return pCard.IsDefault;
          });
          if (defaultCard && defaultCard.length > 0) {
            return defaultCard[0];
          } else {
            return this.guestPaymentCards[0];
          }
        }
        return card;
      },
      fncIsPaymentAdd() {
        let vm = this;
        if (
          vm.$store.state.userEntitlementList.hasOwnProperty("fncAddPayments")
        ) {
          return vm.$store.state.userEntitlementList.hasOwnProperty(
            "fncAddPayments"
          )
            ? vm.$store.state.userEntitlementList.fncAddPayments
            : null;
        }
      },
      fncIsPaymentUpdate() {
        let vm = this;
        if (
          vm.$store.state.userEntitlementList.hasOwnProperty("fncUpdatePayments")
        ) {
          return vm.$store.state.userEntitlementList.hasOwnProperty(
            "fncUpdatePayments"
          )
            ? vm.$store.state.userEntitlementList.fncUpdatePayments
            : null;
        }
      },
      fncIsPaymentView() {
        let vm = this;
        if (
          vm.$store.state.userEntitlementList.hasOwnProperty("fncViewPayments")
        ) {
          return vm.$store.state.userEntitlementList.hasOwnProperty(
            "fncViewPayments"
          )
            ? vm.$store.state.userEntitlementList.fncViewPayments
            : null;
        }
      },
      fncIsPaymentTransaction() {
        let vm = this;
        if (
          vm.$store.state.userEntitlementList.hasOwnProperty(
            "fncPaymentTransaction"
          )
        ) {
          return vm.$store.state.userEntitlementList.hasOwnProperty(
            "fncPaymentTransaction"
          )
            ? vm.$store.state.userEntitlementList.fncPaymentTransaction
            : null;
        }
      },
      fncIsFolioNew() {
        let vm = this;
        if (vm.$store.state.userEntitlementList.hasOwnProperty("fncFolioNew")) {
          return vm.$store.state.userEntitlementList.hasOwnProperty("fncFolioNew")
            ? vm.$store.state.userEntitlementList.fncFolioNew
            : null;
        }
      },
      fncIsFolioUpdate() {
        let vm = this;
        if (
          vm.$store.state.userEntitlementList.hasOwnProperty("fncFolioUpdate")
        ) {
          return vm.$store.state.userEntitlementList.hasOwnProperty(
            "fncFolioUpdate"
          )
            ? vm.$store.state.userEntitlementList.fncFolioUpdate
            : null;
        }
      },
      fncIsReservationSave() {
        let vm = this;
        if (vm.$route.params.ReservationId === "-1") {
          return vm.$store.state.userEntitlementList.hasOwnProperty(
            "fncReservationSave"
          )
            ? vm.$store.state.userEntitlementList.fncReservationSave
            : null;
        } else if (vm.$route.params.ReservationId > 0) {
          return vm.$store.state.userEntitlementList.hasOwnProperty(
            "fncReservationUpdate"
          )
            ? vm.$store.state.userEntitlementList.fncReservationUpdate
            : null;
        } 
      },
      showDefaultAmount() {
        let vm = this;
        for (let ledger of vm.LedgerAcounts) {
          if (
            vm.selectedLedger &&
            ledger.ledgerAccountID == vm.selectedLedger.ledgerAccountId &&
            ledger.ledgerAccountTypeID == 4
          ) {
            vm.selectedLedger.ledgerAccountTypeID = ledger.ledgerAccountTypeID;
            return true;
          } else if (vm.selectedLedger) {
            vm.selectedLedger.ledgerAccountTypeID = null;
          }
          if (
            vm.selectedFolioItemToEdit &&
            ledger.ledgerAccountID ==
            vm.selectedFolioItemToEdit.ledgerAccountId &&
            ledger.ledgerAccountTypeID == 4
          ) {
            vm.selectedFolioItemToEdit.ledgerAccountTypeID =
              ledger.ledgerAccountTypeID;
            for (let folioItem of vm.folioItemsDetails) {
              if (vm.selectedFolioItemToEdit.ItemId == folioItem.ItemId) {
                folioItem.FolioAmount = null;
              }
            }
            return true;
          }
        }
        if (vm.selectedFolioItemToEdit) {
          for (let folioItem of vm.folioItemsDetails) {
            let previousFolioItemIndex = vm.previousFolioItemDetails
              .map((x) => {
                return x.ItemId;
              })
              .indexOf(folioItem.ItemId);
            if (vm.selectedFolioItemToEdit.ItemId == folioItem.ItemId) {
              folioItem.FolioAmount =
                vm.previousFolioItemDetails[previousFolioItemIndex].FolioAmount;
              folioItem.TaxAmount = null;
              vm.selectedFolioItemToEdit.ledgerAccountTypeID = null;
            } else {
              if (previousFolioItemIndex > -1) {
                folioItem.FolioAmount =
                  vm.previousFolioItemDetails[previousFolioItemIndex].FolioAmount;
                folioItem.TaxAmount =
                  vm.previousFolioItemDetails[previousFolioItemIndex].TaxAmount;
              }
            }
          }
        }
      },
    },
    watch: {
      searchCity(newValue, oldValue) {
        let vm = this;
        console.log("Firing search", newValue.length);
        if (newValue.length > 0) {
          vm.$store.dispatch("dataRequestHandler", {
            key: "GetCitySearch",
            params: {
              ModuleAction: "GetCitySearch",
              CityName: newValue,
            },
            callback: function (err, response) {
              if (err) {
                return;
              }
              if (response) {
                console.log("response in search city", response);
                vm.cityList = response;
              }
            },
          });
        }
      },
      searchText(newValue, oldValue) {
        let vm = this;
        vm.getCorporateLedgerSummaryList(newValue);
      },
    },
    //   created(){
    //     let vm= this;
    //     vm.$store.state.bus.$on("inputChange", function (selected) {
    //       vm.guestInfo.Address = selected.value;
    //     })

    //   },
    //   computed: {
    //     expiryYears() {
    //       let currYear = new Date().getFullYear();
    //       let years = [];
    //       years.push(currYear);
    //       for (let yIndex = 1; yIndex <= 16; yIndex++) {
    //         years.push(currYear + yIndex);
    //       }
    //       return years;
    //     },
    //     defaultPaymentCard() {
    //       let card = null;
    //       if (this.guestPaymentCards && this.guestPaymentCards.length > 0) {
    //         let defaultCard = this.guestPaymentCards.filter(function (pCard) {
    //           return pCard.IsDefault;
    //         });
    //         if (defaultCard && defaultCard.length > 0) {
    //           return defaultCard[0];
    //         } else {
    //           return this.guestPaymentCards[0];
    //         }
    //       }
    //       return card;
    //     },

    //   "guestInfo.AccountType": function () {
    //     if (this.$route.params && this.$route.params.GuestProfileId == -1) {
    //       this.guestInfo.GuestFirstName = "";
    //       this.guestInfo.GuestLastName = "";
    //       this.guestInfo.Address = "";
    //       this.guestInfo.Address2 = "";
    //       this.guestInfo.CityName = "";
    //       this.guestInfo.StateName = "";
    //       this.guestInfo.CountryName = "";
    //       this.guestInfo.PostalCode = "";
    //       this.guestInfo.shortAddress = "";
    //       this.additionalEmails = [
    //         {
    //           ReservationId: null,
    //           Emailaddress: null,
    //         },
    //       ];
    //       this.additionalPhoneNumbers = [
    //         {
    //           ReservationId: null,
    //           PhoneNumber: null,
    //         },
    //       ];
    //     }
    //   },
    // },
    mounted() {
      let vm = this;
      vm.Get_GuestProfile_Detail();
      // vm.GetUserEntitlementsAndDefaultProperty();
      // vm.getBalanceTransferDetails();
      vm.GuestProfileId = vm.$route.params.GuestProfileId;
      vm.guestInfo.AccountType =
        this.$route.params.profileType || vm.guestInfo.AccountType;
      vm.$store.dispatch("GetUserEntitlementsAndDefaultProperty");
      vm.showCorpLedgerFolio = this.$route.query.name;
      if (this.$route.query.name) {
        vm.folioItemId = this.$store.state.selectedFolioId;
        if (vm.folioItemId) {
          vm.getFolioDetails(null, vm.folioItemId);
          vm.getBTFolioSummaryDetails(vm.folioItemId);
        }
      }
      // console.log("vm.$route.params.GuestProfileId---",vm.$route.params,vm.guestInfo,vm.guestInfo.AccountType );
      // vm.getPaymentDetails();
    },
  };
</script>