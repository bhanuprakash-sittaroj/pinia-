<script type="text/javascript">
export default {
  name: 'foliomodal',
  props: ["params", "saveCallback"],
  data() {
    return {
      value: "",
      emailList: [],
      list: [],
      selectAll: false
    };
  },
  methods: {
    close(event) {
      this.emailList = [];
      this.params.listValues = [];
      if (this.params.isFrom && this.params.isFrom == 'resFolio') {
        this.params.cancelbuttonCallback();

      }

      if (this.params.isRUPopup) {
        this.params.noButtonCallback(event);
      }

      this.$emit('close');
    },
    noCallback(event) {
      this.params.noButtonCallback(event);
    },
    yesButtonCallback(event) {
      this.params.yesButtonCallback(event);
    },
    sendQuoteCallback() {
      this.params.sendQuoteCallback(this.value);
    },
    sendEmailCallback() {
      console.log("this.emailListthis.emailList", this.emailList)
      this.params.sendEmailCallback(this.emailList);
      this.emailList = [];
      this.params.listValues = [];
      this.selectAll = false;
    },
    checkedValues(item, e) {
      // console.log("e", e.target.checked)
      //   console.log("itemitemitem", item)
      //   if(e.target.checked == true){
      //     this.emailList.push(item);
      //     this.list.push(item);
      //   }
      //   else{
      //     for(var i = 0; i <= this.emailList.length; i++){
      //       console.log("this.emailList[i]", this.list , this.list[i])
      //       if(this.list[i].Emailaddress == item.Emailaddress){
      //         console.log("i",i)
      //         this.emailList.splice(i,1)
      //         console.log("this.emailListthis.emailListthis.emailList", this.emailList)

      //       }
      //     }
      //   }

    },
    // save() {
    //   console.log(this.viewObj);
    //   let self = this;
    //   self.$store.dispatch("dataRequestHandler", {
    //     key: "SaveCustomView",
    //     params: self.viewObj,
    //     callback: function (err, response) {
    //       if (err) {
    //         return
    //       }
    //       if (response) {
    //         console.log("response in SaveCustomView =>", response)
    //         self.$store.dispatch("toastr", {
    //           type: "success",
    //           header: "Success!",
    //           message: "View saved successfully"
    //         });
    //         self.$emit('close');
    //         self.saveCallback();
    //       }
    //     }
    //   });
    // }
  },
  watch: {
    selectAll() {
      let vm = this;
      if (vm.selectAll == true) {
        vm.emailList = [];
        for (var i = 0; i < vm.params.listValues.length; i++) {
          console.log("vm.params.listValues[i]", vm.params.listValues[i])
          vm.emailList.push(vm.params.listValues[i].Emailaddress)
        }
      }
      else if (vm.selectAll == false && vm.emailList.length == vm.params.listValues.length) {
        vm.emailList = []
      }
      console.log("vm.emailList in selectAll", vm.emailList)
    },
    emailList() {
      let vm = this;
      console.log('vm.emailList', vm.emailList)
      if (vm.emailList.length > 0 && (vm.emailList.length == vm.params.listValues.length)) {
        vm.selectAll = true;
      }
      else {
        vm.selectAll = false;
      }
    }

  },
  mounted() {
    console.log(this.params);
    this.selectAll = false;
  },
};
</script>
<template>
  <transition name="modal-fade">
    <div class="modal-backdrop" :class="[params.sendEmailButton ? 'invoceModal' : '']">
      <div :class="['modal', params.className, params.noCloseButton ? 'botsDiscardPopup' : '']" role="dialog"
        aria-labelledby="modalTitle" aria-describedby="modalDescription" v-if="params">
        <header class="modal-header" id="modalTitle">
          <slot name="header">
            <label class="checkLabel emails-check-all">
              <input type="checkbox" v-if="params.sendEmailButton" v-model="selectAll" />
              <h4 v-if="params.popupTitle">{{ params.popupTitle }}</h4>
            </label>
            <button v-show="!params.noCloseButton" type="button" class="btn-close" @click="close($event)"
              aria-label="Close modal"><i class="far fa-times"></i></button>
          </slot>
        </header>
        <section class="modal-body" id="modalDescription">
          <slot v-if="params.sendQuoteButton">
            <select class="form-control" v-model="value">
              <option value="">Select Booking Engine</option>
              <option v-for="list in params.listValues" :value="list.BE_Id">{{ list.BE_Name }}</option>
            </select>
          </slot>
          <slot v-if="params.sendEmailButton">
            <ul class="aminitiesList">
              <li v-for="list in params.listValues" :title="list.Emailaddress">
                <label class="checkLabel">
                  <input type="checkbox" :value="list.Emailaddress" v-model="emailList" />
                  <span>{{ list.Emailaddress }}</span>
                </label>
              </li>
            </ul>
            <!-- <select class="form-control" v-model="value">
                <option value="">Select Email</option>
                <option v-for="list in params.listValues" :value="list.Emailaddress">{{list.Emailaddress}}</option>
              </select> -->
          </slot>
          <slot name="body">
            <span v-if="!params.code && !params.html">{{ params.popupMessage }}</span>
            <pre class="tran-details" v-if="params.code">{{ params.popupMessage }}</pre>
          </slot>
          <slot name="htmlBody" v-if="params.html">
            <div v-html="params.popupMessage"></div>
          </slot>
        </section>
        <footer class="modal-footer" v-if="params.footer == undefined || params.footer">
          <slot name="footer">
            <button v-if="params.sendEmailButton" type="button" class="btn btn-primary btn-sm"
              :disabled="emailList.length == 0" @click="sendEmailCallback">Send</button>
            <button v-if="params.sendQuoteButton && !params.sendEmailButton" type="button"
              class="btn btn-primary btn-sm" @click="sendQuoteCallback">Send Quote</button>
            <button v-if="!params.sendQuoteButton && !params.sendEmailButton" type="button"
              class="btn btn-blank-danger btn-sm" @click="noCallback($event)"
              :class="params.from && params.from == 'Unit' ? 'fromUnitBtn' : ''" aria-label="Close modal">
              {{ params.noButtonText }}
            </button>
            <button v-if="!params.sendQuoteButton && !params.sendEmailButton" :disabled="params.UnitId" type="button"
              class="btn btn-success btn-sm" :class="params.from && params.from == 'Unit' ? 'fromUnitBtn' : ''"
              @click="yesButtonCallback($event)" aria-label="Close modal">
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
  background-color: rgba(0, 0, 0, 0.3) !important;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: #FFFFFF;
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
  color: #4AAE9B;
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
  color: #FB4540;
  background: transparent;
}

.btn-green {
  color: white;
  background: #4AAE9B;
  border: 1px solid #4AAE9B;
  border-radius: 2px;
}
</style>