<script>
import moment from 'moment';

export default {
  name: "balanceTransferModal",
  props: ["params", "getFolioSummaryCallback"],
  data() {
    return {
      value: "",
      emailList: [],
      list: [],
      selectAll: false,
      showDateRange: false,
      opens: "left",
      minDate: null,
      maxDate: null,
      singleDatePicker: false,
      show_ranges: true,
      dateControll: null,
      linkedCalendars: true,
    };
  },
  methods: {
    checkOpen(open, togglePicker) {
      console.log("event: open", open, togglePicker);
      this.dateControll = open;
    },
    checkDateControl() {
      let vm = this;
      if (this.dateControll == true) {
        this.dateControll = false;
        vm.$store.state.bus.$emit("dateControll", false);
      }
    },
    updateValues(values) {
      let dateRange = {}
      dateRange.startDate = moment(values.startDate).format("DD MMM YYYY");
      dateRange.endDate = moment(values.endDate).format("DD MMM YYYY");
      console.log("event: update", values);
      // this.params.startDate = values.startDate;
      // this.params.endDate = values.endDate;
      if (this.getFolioSummaryCallback)
        this.getFolioSummaryCallback(this.params.startDate, this.params.endDate, this.showDateRange, dateRange)
      // this.dateType = values.dateType;
      // alert(this.dateType);
    },
    updateStartDate(key, dateObj, objectPassedToParent) {
      let startDate = dateObj ? moment(dateObj).format("YYYY-MM-DD") : null
      if (this.getFolioSummaryCallback)
        this.getFolioSummaryCallback(startDate, this.params.endDate, this.showDateRange, this.params.dateRange)
    },
    updateEndDate(key, dateObj, objectPassedToParent) {
      let endDate = dateObj ? moment(dateObj).format("YYYY-MM-DD") : null
      if (this.getFolioSummaryCallback)
        this.getFolioSummaryCallback(this.params.startDate, endDate, this.showDateRange, this.params.dateRange)
    },
    close(event) {
      this.emailList = [];
      this.params.listValues = [];
      //   if (this.params.isFrom && this.params.isFrom == "resFolio") {
      this.params.cancelbuttonCallback();
      this.showDateRange = false
      //   }

      //   if (this.params.isRUPopup) {
      //     this.params.noButtonCallback(event);
      //   }

      this.$emit("close");
    },
    noCallback(event) {
      this.params.noButtonCallback(event);
      this.showDateRange = false
    },
    yesButtonCallback(event, popupContent, startDate, endDate, dateRange, params) {
      this.params.yesButtonCallback(event, popupContent, startDate, endDate, dateRange, this.showDateRange,this.params.includeBalanceTransfer, this.params);
      this.showDateRange = false
    },
    getSelectedDateData() {
      if (this.getFolioSummaryCallback)
        this.getFolioSummaryCallback(this.params.startDate, this.params.endDate, this.showDateRange, this.params.dateRange)
    },

    checkedValues(item, e) {
    },
    updateTotalAmount() {
      // let invoiceItemList = this.params.popupContent.filter((item) => {
      //   if (item.isFolioItemInclude) {
      //     return item
      //   }
      // })
      // this.params.totalBTAmount = invoiceItemList.reduce(
      //   (sum, currentVal) => sum + currentVal.FinalAmount,
      //   0
      // );
      this.params.totalBTAmount = this.params.popupContent.reduce((sum, currentVal) => {
        if (currentVal.isFolioItemInclude === true) {
          return sum + currentVal.FinalAmount;
        } else {
          return sum;
        }
      }, 0);

      console.log("this.params.totalBTAmount = ", this.params.totalBTAmount)
    },
    AddincludeMasterFolioBalanceTransferToTotal(){
      this.params.showMasterPendingItems = !this.params.showMasterPendingItems
      // if(this.params.includeMasterFolioBalanceTransfer){
      // this.params.totalBTAmount = this.params.totalBTAmount + this.params.MasterFolioAmount
      // }else{
      //   this.params.totalBTAmount = this.params.totalBTAmount - this.params.MasterFolioAmount
      // }
    },
    includeBalanceTransferAmount() {
      this.params.popupContent.map((item) => {
        if (item.FinalAmount == 0 && !this.params.includeBalanceTransfer) {
          item.isFolioItemInclude = true
        } else if (item.FinalAmount == 0 && this.params.includeBalanceTransfer) {
          item.isFolioItemInclude = false
        }
      })
      // let invoiceItemList = this.params.popupContent.filter((item) => {
      //   if (item.isFolioItemInclude) {
      //     return item
      //   }
      // })
      // this.params.totalBTAmount = invoiceItemList.reduce(
      //   (sum, currentVal) => sum + currentVal.Amount,
      //   0
      // );
      console.log("this.params.popupContent---",this.params.popupContent);
      this.params.totalBTAmount = this.params.popupContent.reduce((sum, currentVal) => {
        if (currentVal.isFolioItemInclude === true && !this.params.includeBalanceTransfer) {
          return sum + currentVal.Amount;
        }
        else if (currentVal.isFolioItemInclude === true && this.params.includeBalanceTransfer) {
          return sum + currentVal.FinalAmount;
        }
         else {
          return sum;
        }
      }, 0);
      console.log("this.params.totalBTAmount = ", this.params.totalBTAmount)
    },
    formatMoney(amount) {
      return this.$store.state.getFormattedAmount("$", amount);
    },   

  },
  watch: {
    selectAll() {
      let vm = this;
      if (vm.selectAll == true) {
        vm.emailList = [];
        for (var i = 0; i < vm.params.listValues.length; i++) {
          console.log("vm.params.listValues[i]", vm.params.listValues[i]);
          vm.emailList.push(vm.params.listValues[i].Emailaddress);
        }
      } else if (
        vm.selectAll == false &&
        vm.emailList.length == vm.params.listValues.length
      ) {
        vm.emailList = [];
      }
      console.log("vm.emailList in selectAll", vm.emailList);
    },

  },
  mounted() {
    console.log(this.params);
    this.selectAll = false;
  },
};
</script>
<template>
  <transition name="modal-fade">
    <div class="modal-backdrop">


      <div :class="[
        'modal',
        params.className,
        params.noCloseButton ? 'botsDiscardPopup' : '',
      ]" role="dialog" aria-labelledby="modalTitle" aria-describedby="modalDescription" v-if="params">
        <header class="modal-header" id="modalTitle">
          <slot name="header">
            <label class="checkLabel emails-check-all">
              <h4 v-if="params.popupTitle">{{ params.popupTitle }}</h4>
            </label>
            <button v-show="!params.noCloseButton" type="button" class="btn-close" @click="close($event)"
              aria-label="Close modal">
              <i class="far fa-times"></i>
            </button>
          </slot>
        </header>
        <section class="modal-body" id="modalDescription">
          <div class="row">
            <div class="col-md-6 d-flex flex-column pr-2 left">
              <div class="form-group mb-0">
                <label>Transfer On</label>
              </div>
              <datePickerComponent :value="params.startDate" :onUpdate="updateStartDate" format="DD MMM YYYY"
                sourceFormat="'YYYY-MM-DD'" :pickerType="'date'" :objectPassedToParent="params">
              </datePickerComponent>
            </div>
            <div class="col-md-6 d-flex flex-column pl-2 right">
              <div class="d-flex justify-content-between" style="width:100%">
                <div class="form-group mb-0">
                  <label>Date Range</label>
                </div>
                <label class="slideCheck balance-transfer" style="min-width: unset; margin: 7px 15px 0px 0;">
                  <input type="checkbox" :checked="showDateRange" v-model="showDateRange" @change="getSelectedDateData" />
                  <span></span>
                </label>
                <div class="form-group mb-0">
                  <label>Balance as of</label>
                </div>
              </div>
              <div v-if="showDateRange" class="">
                <datePickerComponent :value="params.endDate" :onUpdate="updateEndDate" format="DD MMM YYYY"
                  sourceFormat="'YYYY-MM-DD'" :pickerType="'date'" :objectPassedToParent="params">
                </datePickerComponent>
              </div>
              <div v-if="!showDateRange" class="input-group BTdaterange">
                <date-range-picker ref="picker" :opens="opens" :locale-data="{ firstDay: 1, format: 'DD MMM YYYY' }"
                  :minDate="minDate" :maxDate="maxDate" :singleDatePicker="singleDatePicker" :timePicker="false"
                  :timePicker24Hour="false" :showWeekNumbers="false" :showDropdowns="false" :autoApply="true"
                  v-model="params.dateRange" :ranges=false @update="updateValues" @toggle="checkOpen"
                  :linkedCalendars="linkedCalendars" :open="dateControll" :reportType=null>
                </date-range-picker>
              </div>
            </div>
          </div>

          <div class="editFolioContiner">
            <div>
              <div class="row">                
                <div class="col-md-7 pt-0">
                <div class="pt-2 pb-3 d-flex justify-content-between align-items-center" style="color: #2c3e50;font-size:13px;">
                  <div class="d-flex gap-3 align-items-center">
                    <div>
                      <label class="slideCheck">
                        <input type="checkbox" :disabled="params.MasterFolioAmount == 0 || params.MasterFolioAmount == null" checked="true"
                          v-model="params.includeMasterFolioBalanceTransfer" @change="AddincludeMasterFolioBalanceTransferToTotal" />
                        <span></span>
                      </label>
                    </div>
                    <div class="ml-3" style="text-align: left;">
                      Include {{ formatMoney(params.MasterFolioAmount) }} pending items from Corporate Master
                    </div>
                  </div>
                  <!-- <div style="padding-right: 37px;">
                    {{ formatMoney(params.pendingItemsAmount) }}
                  </div> -->
                </div>
                </div>
                <div class="col-md-5 pt-0">
                <div class="pt-2 pb-3 d-flex justify-content-end align-items-center" style="color: #2c3e50;font-size:13px;">
                  <div class="d-flex gap-3 align-items-center">
                    <div>
                      <label class="slideCheck">
                        <input type="checkbox" :disabled="params.BalanceTransferAmount == 0 || params.BalanceTransferAmount == null" checked="true"
                          v-model="params.includeBalanceTransfer" @change="includeBalanceTransferAmount" />
                        <span></span>
                      </label>
                    </div>
                    <div class="ml-3" style="text-align: left;">
                      Include {{ formatMoney(params.BalanceTransferAmount) }} prior transfers
                    </div>
                  </div>

                </div>
                </div>
              </div>
            <div class="dTable noMinW bTransfer">
              <div class="dTHead">
                <div class="dCell">Include</div>
                <div class="dCell" style="padding-right: 2px;">Item</div>
                <div class="dCell">Qty</div>
                <div class="dCell" style="text-align: right;">Avg</div>
                <div class="dCell" style="text-align: right;">Amount</div>
              </div>
              <div class="dTBody folioBody">  
                <div class="dTBodyRow newFolio" v-if="!val.isPending" v-for="val in params.popupContent">
                  <div class="dCell">
                    <label class="slideCheck">
                      <input type="checkbox" checked="true" v-model="val.isFolioItemInclude" @change="updateTotalAmount"
                        :disabled="val.ItemDescription == 'Balance Transfer'" />
                      <span></span>
                    </label>
                  </div>
                  <div class="dCell btItem">{{ val.ItemDescription }} </div>
                  <!-- <span>{{ val.Items == 1 ? `(${val.Items} Item)` :  `(${val.Items} Items)` }}</span> -->
                  <div class="dCell">
                    {{`${params.includeBalanceTransfer ? val.FinalItems : val.Items}`}}
                  </div>
                  <div class="dCell" style="text-align: right;">{{`${params.includeBalanceTransfer ? formatMoney(val.AvgAmountToggOn): formatMoney(val.AvgAmountTogOff) }`}}</div>
                    

                  <div class="dCell" v-if="params.includeBalanceTransfer">{{
                    formatMoney(val.FinalAmount) }}</div>
                  <div class="dCell" v-if="!params.includeBalanceTransfer">{{
                    formatMoney(val.Amount) }}</div>
                </div>



                <!-- <div class="dTBodyRow newFolio" v-for="val in params.popupContent" v-if="params.showMasterPendingItems">
                  <div class="dCell">
                    <label class="slideCheck">
                      <input type="checkbox" checked="true" v-model="val.isFolioItemInclude" @change="updateTotalAmount"
                        :disabled="val.ItemDescription == 'Balance Transfer'" />
                      <span></span>
                    </label>
                  </div>
                  <div class="dCell btItem">{{ val.ItemDescription }} </div>
                  <div class="dCell">
                    {{`${params.includeBalanceTransfer ? val.FinalItems : val.Items}`}}
                  </div>
                  <div class="dCell" style="text-align: right;">{{`${params.includeBalanceTransfer ? formatMoney(val.AvgAmountToggOn): formatMoney(val.AvgAmountTogOff) }`}}</div>
                    

                  <div class="dCell" v-if="params.includeBalanceTransfer">{{
                    formatMoney(val.FinalAmount) }}</div>
                  <div class="dCell" v-if="!params.includeBalanceTransfer">{{
                    formatMoney(val.Amount) }}</div>
                </div>                 -->
              
              </div>
              <div class="dTBody folioFooter" style="overflow: visible">
                <div class="dTBodyRow">
                  <div class="dCell" style="font-weight: bolder;"></div>
                  <div class="dCell" style="font-weight: bolder;padding-right: 4px;">Total Balance Transfer</div>
                  <div class="dCell" style="font-weight: bolder;text-align: right;">{{ formatMoney(params.totalBTAmount) }}
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>

        </section>
        <footer class="modal-footer" v-if="params.footer == undefined || params.footer">
          <slot name="footer">
            <button v-if="!params.sendQuoteButton && !params.sendEmailButton" type="button"
              class="btn btn-blank-danger btn-sm" @click="noCallback($event)"
              :class="params.from && params.from == 'Unit' ? 'fromUnitBtn' : ''" aria-label="Close modal">
              {{ params.noButtonText }}
            </button>
            <button v-if="!params.sendQuoteButton && !params.sendEmailButton" :disabled="params.totalBTAmount == 0.00"
              type="button" class="btn btn-success btn-sm"
              :class="params.from && params.from == 'Unit' ? 'fromUnitBtn' : ''"
              @click="yesButtonCallback($event, params.popupContent, params.startDate, params.endDate, params.dateRange, params)"
              aria-label="Close modal">
              {{ params.yesButtontext }}
            </button>
          </slot>
        </footer>
      </div>
    </div>
  </transition>
</template>
<style>
.modal-backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: #ffffff;
  box-shadow: 2px 2px 20px 1px;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
}

.modal-header,
.modal-footer {
  padding: 15px;
  display: flex;
}

.modal-header {
  border-bottom: 1px solid #eeeeee;
  color: #4aae9b;
  justify-content: space-between;
}

.modal-footer {
  border-top: 1px solid #eeeeee;
  justify-content: flex-end;
}

.modal-body {
  position: relative;
  padding: 20px 10px;
}

.btn-close {
  border: none;
  font-size: 20px;
  padding: 20px;
  cursor: pointer;
  font-weight: bold;
  /* color: #4AAE9B; */
  color: #fb4540;
  background: transparent;
}

.btn-green {
  color: white;
  background: #4aae9b;
  border: 1px solid #4aae9b;
  border-radius: 2px;
}
</style>
                                 
