<script>
  export default {
    name: 'modal',
    props: ["viewObj", "saveCallback"],
    methods: {
      close() {
        this.$emit('close');
      },
      save() {
        console.log(this.viewObj);
        let self = this;
        self.$store.dispatch("dataRequestHandler", {
          key: "SaveCustomView",
          params: self.viewObj,
          callback: function (err, response) {
            if (err) {
              return
            }
            if (response) {
              console.log("response in SaveCustomView =>", response)
              self.$store.dispatch("toastr", {
                type: "success",
                header: "Success!",
                message: "View saved successfully"
              });
              self.$emit('close');
              self.saveCallback();
            }
          }
        });
      }
    },
    mounted() {
      console.log(this.viewObj);
    },
  };
</script>
<template>
  <transition name="modal-fade">
    <div class="modal-backdrop">
      <div class="modal" role="dialog" aria-labelledby="modalTitle" aria-describedby="modalDescription">
        <header class="modal-header" id="modalTitle">
          <slot name="header">
            View

            <button type="button" class="btn-close" @click="close" aria-label="Close modal">
              x
            </button>
          </slot>
        </header>
        <section class="modal-body" id="modalDescription">
          <slot name="body">
            <input type="text" placeholder="View Name" class="form-control" v-model="viewObj.name" />
          </slot>
        </section>
        <footer class="modal-footer">
          <slot name="footer">
            <button type="button" class="btn btn-default btn-warning" @click="close" aria-label="Close modal">
              Cancel
            </button>
            <button type="button" class="btn btn-default btn-success" @click="save" aria-label="Close modal">
              Save
            </button>
          </slot>
        </footer>
      </div>
    </div>
  </transition>
</template>
<style>
  /* .modal-backdrop {
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
    color: #4AAE9B;
    background: transparent;
  }

  .btn-green {
    color: white;
    background: #4AAE9B;
    border: 1px solid #4AAE9B;
    border-radius: 2px;
  } */
</style>