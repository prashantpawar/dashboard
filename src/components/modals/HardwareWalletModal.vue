<template>
  <b-modal id="confirm-seed-modal" ref="modalRef" title="Create Account" hide-footer centered no-close-on-backdrop>
    <b-container fluid>
      <b-row class="my-1 align-items-center min-height">
        <loading-spinner v-if="showLoadingSpinner" :showBackdrop="true"></loading-spinner>            
        <b-list-group v-if="accounts.length > 0">
          <b-list-group-item v-for="(account, index) in accounts" :key="index">{{account}}</b-list-group-item>
        </b-list-group>
        <div v-else>
          No addresses detected
        </div>
      </b-row>
      <b-row class="my-1 justify-content-between pt-4">
        <span v-if="errorMsg" class="text-error  mt-2" variant="error">{{errorMsg}}</span>
        <b-button class="btn" variant="primary" @click="okHandler">Proceed</b-button>
      </b-row>
    </b-container>
  </b-modal>
</template>

<script>
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import LoadingSpinner from '../LoadingSpinner'

@Component({
  components: {
    LoadingSpinner
  }
})

export default class HardwareWalletModal extends Vue {

  errorMsg = null
  accounts = []
  showLoadingSpinner = false

  okHandler() {    
  }

  async show(myWeb3) {

    this.showLoadingSpinner = true    

    try {
      this.accounts = await myWeb3.eth.getAccounts()
    } catch(err) {
      // You are not logged in
      console.log("Error: " + err)
      this.errorMsg = "Please make sure your hardware wallet is connected"
      return
    }

    this.showLoadingSpinner = false
    this.$refs.modalRef.show()
  }

}
</script>
<style lang="scss">
label {
  color: gray;
}
#confirm-seed-modal .modal-dialog {
  width: 500px;
  max-width: 500px;
  .modal-header {
    margin-left: 10px;
    margin-right: 10px;
    padding-left: 5px;
    padding-right: 5px;
    h5 {
      color: gray;
    }
  }
  .modal-body {
    .col-sm-3, .col-sm-9 {
      padding: 0;
    }
    .text-error {
      color: red;
    }
    .btn {
      width: 150px;
    }
  }
}
.min-height {
  min-height: 200px;
}
</style>
