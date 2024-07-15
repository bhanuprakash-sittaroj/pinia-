<script>
  import moment from 'moment';

  export default {
    name: "folioSettingModal",
    props: ["params"],
    data() {
      return {
        isModalOpen: false,
        IncludeOverridenOrnot: false
      }
    },
    methods: {
      updateStartDate(key, dateObj) {
        // this.params.folioSettingDetails.NextInvoiceDate = dateObj ? moment(dateObj).format("DD MMM YYYY") : null
        return dateObj ? moment(dateObj).format("DD MMM YYYY") : null
      },
      yesButtonCallback(event, params, folioSavingType) {
        console.log("params.folioSettingDetails---", params.folioSettingDetails);
        this.isModalOpen = false
        if (this.params.isMasterFolio && folioSavingType == 4) {
          folioSavingType = this.IncludeOverridenOrnot ? 2 : 1
        }
        this.params.yesButtonCallback(event, folioSavingType, this.params.folioSettingDetails);
        this.IncludeOverridenOrnot = false
      },
      selectRatePlan(ratePlanId) {
        let vm = this;
        vm.params.folioSettingDetails.rateplanid = ratePlanId

      },
      selectDuration(timeSpan) {
        let vm = this;
        let addNumb = vm.params.folioSettingDetails.InvoiceFrequency ? vm.params.folioSettingDetails.InvoiceFrequency : 0
        // addNumb = timeSpan == "day" ? addNumb - 1 : addNumb
        let type = timeSpan == "night" ? 'days' : `${vm.params.folioSettingDetails.InvoiceFrequencyType}s`
        if (!vm.params.isMasterFolio) {
          // vm.params.folioSettingDetails.NextInvoiceDate = vm.params.folioSettingDetails.CheckinDate
          return
        }
        vm.params.folioSettingDetails.NextInvoiceDate = vm.params.folioSettingDetails.CurrentInvoiceDate ? moment.utc(vm.params.folioSettingDetails.CurrentInvoiceDate).add(addNumb, type).format("DD MMM YYYY") : moment().add(addNumb, type).format("DD MMM YYYY");
        // if (type == 'months') {
        //   var inputDate = moment(vm.params.folioSettingDetails.NextInvoiceDate);

        //   // Get the first date of the month
        //   var firstDateOfMonth = inputDate.clone().startOf('month');
        //   vm.params.folioSettingDetails.NextInvoiceDate = firstDateOfMonth.format("DD MMM YYYY")
        // }
      },
      noCallback(event) {
        this.isModalOpen = false
        this.params.noButtonCallback(event, this.params.folioSettingDetails);
        this.IncludeOverridenOrnot = false
      },
      close() {
        let vm = this;
        vm.params.cancelbuttonCallback()
      },

    },
    watch: {
    },
    mounted() {
    }
  }
</script>

<template>
  <transition name="modal-fade">
    <div class="modal-backdrop">

      <div :class="['modal', params.className, params.noCloseButton ? 'botsDiscardPopup' : '']" role="dialog"
        aria-labelledby="modalTitle" aria-describedby="modalDescription" v-if="params && !isModalOpen">
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
          <div class="folioSettings">
            <div class="folioSecttingsRow">
              <div class="referenceInfo">
                <div class="referenceLInfo">Reference Information</div>
                <div class="referenceRInfo"></div>
              </div>
              <div class="referenceDetails" v-if="!params.isMasterFolio">
                <div class="referenceLDetails">Reservation</div>
                <div class="referenceRDetails">{{ params.folioSettingDetails ?
                  params.folioSettingDetails.TempoConfirmationNumber : '' }}</div>
              </div>
              <div class="referenceDetails">
                <div class="referenceLDetails">Invoice</div>
                <div class="referenceRDetails">
                  <input type="text" class="form-control" v-model="params.folioSettingDetails.PastInvoiceNo"
                    style="max-width: 150px;" />
                </div>
              </div>
            </div>

            <div class="folioSecttingsRow">
              <div class="referenceInfo">
                <div class="referenceLInfo">Rate Plan</div>
                <div class="referenceRInfo">
                  <select class="form-control customSelectOpt" @change="selectRatePlan($event.target.value)"
                    v-model="params.folioSettingDetails.rateplanid" style="height: 28px;padding: 2px 7px;"
                    placeholder="Select RatePlan">
                    <option value="-99">Select RatePlan</option>
                    <option v-for="ratePlan in params.ratePlanList" :value="ratePlan.id">{{ ratePlan.RatePlan_Name }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="referenceDetails">
                <div class="referenceLDetails">Negotiated Rate</div>
                <div class="referenceRDetails d-flex">
                  <input type="number" class="form-control mr-2" v-model="params.folioSettingDetails.NegotiatedAmount"
                    style="max-width: 60px; height: 30px;" min="0"
                    :disabled="params.folioSettingDetails.rateplanid != -1" />
                  every
                  <input type="number" class="form-control ml-2 mr-2" min="0"
                    v-model="params.folioSettingDetails.NegotiatedCyclePeriod" style="max-width: 60px; height: 30px;"
                    :disabled="params.folioSettingDetails.rateplanid != -1" />
                  <select class="form-control customSelectOpt"
                    v-model="params.folioSettingDetails.NegotiatedCyclePeriodType"
                    style="height: 28px; padding: 2px 7px;max-width: 80px;"
                    :disabled="params.folioSettingDetails.rateplanid != -1">
                    <option value="day">day(s)</option>
                    <option value="week">week(s)</option>
                    <option value="month">month(s)</option>
                  </select>
                </div>
              </div>
              <div class="folioSecttingsRow mt-3">
                <div class="referenceInfo">
                  <div class="referenceLInfo">Corporate Invoice Settings</div>
                  <div class="referenceRInfo">
                    <div class="d-flex gap-3 align-items-center">
                      <div class="mr-3">
                        Nightly
                      </div>
                      <div>
                        <label class="slideCheck NightlyDaily">
                          <input type="checkbox" v-model="params.folioSettingDetails.isDailyEnabled" />
                          <span></span>
                        </label>
                      </div>
                      <div class="ml-3" style="text-align: left;">
                        Daily
                      </div>
                    </div>
                  </div>
                </div>
                <div class="referenceDetails">
                  <div class="referenceLDetails">
                    Auto Generate
                  </div>
                  <div class="referenceRDetails">
                    <div class="d-flex gap-3 align-items-center">
                      <div>
                        <label class="slideCheck">
                          <input type="checkbox" v-model="params.folioSettingDetails.IsAutoGenerated" />
                          <span></span>
                        </label>
                      </div>
                      <input type="number" class="form-control ml-2 mr-2" min="0"
                        v-model="params.folioSettingDetails.InvoicePriorGenerationPeriod"
                        style="max-width: 60px; height: 30px;" />
                      <select class="form-control customSelectOpt"
                        v-model="params.folioSettingDetails.InvoicePriorGenerationPeriodType"
                        style="height: 28px; padding: 2px 7px;max-width: 80px;">
                        <option value="day">day(s)</option>
                        <option value="week">week(s)</option>
                        <option value="month">month(s)</option>
                      </select>
                      <span style="color: #95a7af;">prior</span>
                    </div>
                  </div>
                </div>
                <div class="referenceDetails">
                  <div class="referenceLDetails">
                    Invoice Period
                  </div>
                  <div class="referenceRDetails">
                    <div class="d-flex align-items-center" style="text-align: left;">
                      Every <input type="number" class="form-control ml-2 mr-2" min="0"
                        v-model="params.folioSettingDetails.InvoiceFrequency" style="max-width: 60px; height: 30px;"
                        @keyup="selectDuration" @change="selectDuration" />
                      <select class="form-control customSelectOpt" @change="selectDuration($event.target.value)"
                        v-model="params.folioSettingDetails.InvoiceFrequencyType"
                        style="height: 28px;padding: 2px 7px;max-width: 80px;">
                        <option value="day">day(s)</option>
                        <option value="night">night(s)</option>
                        <option value="week">week(s)</option>
                        <option value="month">month(s)</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div class="referenceDetails">
                  <div class="referenceLDetails">
                    Next Period
                  </div>
                  <div class="referenceRDetails">
                    <div class="d-flex align-items-center pt-0 nextPeriod" style="text-align: left;max-width: 220px;"
                      disabled>
                      <datePickerComponent :value="params.folioSettingDetails.NextInvoiceDate"
                        :onUpdate="updateStartDate" format="DD MMM YYYY" sourceFormat="'YYYY-MM-DD'"
                        :pickerType="'date'" :objectPassedToParent="params" isDisabled="true">
                      </datePickerComponent>
                      <!-- <button disabled class="form-control">
                          <span>{{updateStartDate(null,params.folioSettingDetails.NextInvoiceDate)}}</span>
                          <span><i class="fas fa-calendar"></i> </span>
                        </button> -->
                    </div>
                  </div>
                </div>
                <div class="referenceDetails">
                  <div class="referenceLDetails">
                    Terms
                  </div>
                  <div class="referenceRDetails">
                    <div class="d-flex align-items-center pt-0" style="text-align: left;">
                      Net <input type="number" class="form-control ml-2 mr-2" min="0"
                        v-model="params.folioSettingDetails.InvoicePaymentTerms"
                        style="max-width: 60px; height: 30px;" />
                      <select class="form-control customSelectOpt"
                        v-model="params.folioSettingDetails.InvoicePaymentTermsType"
                        style="height: 28px; padding: 2px 7px; max-width: 80px;">
                        <option value="day">day(s)</option>
                        <option value="week">week(s)</option>
                        <option value="month">month(s)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="folioSecttingsRow mt-3">
              <div class="referenceInfo">
                <div class="referenceLInfo">
                  <div class="d-flex justify-content-between align-items-center" style="color: #2c3e50;font-size:13px;">
                    <div class="d-flex gap-3 align-items-center">
                      <div>
                        <label class="slideCheck">
                          <input type="checkbox" checked="true" disabled />
                          <span></span>
                        </label>
                      </div>
                      <div class="ml-3" style="text-align: left;">
                        Include All Ledger Accounts
                      </div>
                    </div>
                  </div>
                </div>
                <div class="referenceRInfo"></div>
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
            <button v-if="!params.sendQuoteButton && !params.sendEmailButton" :disabled="params.totalBTAmount <= 0.00"
              type="button" class="btn btn-success btn-sm"
              :class="params.from && params.from == 'Unit' ? 'fromUnitBtn' : ''"
              @click="params.isMasterFolio ? isModalOpen = true : yesButtonCallback($event, params, 0)"
              aria-label="Close modal" style="padding: 5px 14px !important;">
              {{ params.yesButtontext }}
            </button>
            <!-- <button v-if="!params.sendQuoteButton && !params.sendEmailButton && params.isMasterFolio"
              :disabled="params.totalBTAmount <= 0.00" type="button" class="btn btn-primary btn-sm"
              :class="params.from && params.from == 'Unit' ? 'fromUnitBtn' : ''"
              @click="yesButtonCallback($event, params,2)" aria-label="Close modal">
              {{ params.primaryButtontext }}
            </button> -->

          </slot>
        </footer>

      </div>
      <div v-if="isModalOpen && params.isMasterFolio" class="modal" role="dialog" aria-labelledby="modalTitle"
        aria-describedby="modalDescription" style="min-width: 600px;max-width: 600px">
        <header class="modal-header" id="modalTitle">
          <slot name="header">
            <span style="color: #484848;text-align: left;padding: 30px 20px 20px 20px;font-weight: 500;">The Corporate
              Master Folio Settings have been updated. Should these settings cascade to all active bookings
              related to this corporate account?</span>
            <!-- <button type="button" class="btn-close" @click="isModalOpen=false;IncludeOverridenOrnot=false" aria-label="Close modal">
              <i class="far fa-times"></i>
            </button> -->
          </slot>
        </header>
        <section class="modal-body" id="modalDescription">
          <div class="" style="display: grid;grid-template-columns: 20px 1fr;text-align: left;">
            <label class="">
              <input type="checkbox" v-model="IncludeOverridenOrnot" />
              <span></span>
            </label>
            <span style="font-size: 14px; position: relative;top: -2px;">Include bookings in which Folio Settings have
              been manually overridden </span>
          </div>
          <!-- <span>
            <input type="checkbox" v-model="IncludeOverridenOrnot" style="max-width: 60px; height: 30px;" /> <label for=""> Include
              bookings in which Folio Settings
              have been manually overridden </label>
          </span> -->
        </section>
        <footer class="modal-footer" style="padding: 8px 20px;">
          <slot name="footer">
            <button type="button" class="btn btn-blank-danger btn-sm" @click="yesButtonCallback($event, params, 3)"
              aria-label="Close modal">
              No
            </button>
            <button type="button" class="btn btn-success btn-sm" @click="yesButtonCallback($event, params, 4)"
              aria-label="Close modal">
              Yes
            </button>
          </slot>
        </footer>
        <!-- <div class="modal-content">
          <span class="close" @click="isModalOpen=false">&times;</span>
          <h2>Modal Content</h2>
          <input type="checkbox" name="" id="" v-model="IncludeOverridenOrnot">Include bookings in which Folio Settings
          have been manually overridden.
        </div> -->
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