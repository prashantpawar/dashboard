<template>
  <b-modal id="confirm-seed-modal" ref="modalRef" title="Hardware wallet" hide-footer centered no-close-on-backdrop>
    <b-container fluid>
      <b-row class="my-1 align-items-center min-height">
        <loading-spinner v-if="showLoadingSpinner" :showBackdrop="true"></loading-spinner>
        <b-card no-body>
          <b-tabs pills card id="wallet-config-tabs">
            <b-tab title="Path" active>
              <b-form-group>
                <div class="table-container">
                  <table class="table b-table table-striped table-hover">
                    <tbody>
                      <b-form-radio-group v-model="selectedPath"
                                          stacked
                                          name="radiosStacked">
                        <tr v-for="(path, _, index) in paths" :key="index" @click="selectPath(path, index)">
                          <td>{{path.label}}</td>
                          <td><span class="path">{{path.path}}</span></td>
                          <td><b-form-radio :value="index"></b-form-radio></td>
                        </tr>
                      </b-form-radio-group>
                    </tbody>
                  </table>   
                </div>
              </b-form-group>       
            </b-tab>
            <b-tab title="Address" :disabled="addresses.length > 0">
              <b-form-group v-if="addresses">
                <div class="table-container">
                  <table class="table b-table table-striped table-hover">
                    <tbody>
                      <b-form-radio-group v-model="selectedAddress"
                                          stacked
                                          name="radiosStacked">
                        <tr v-for="(address, index) in addresses" :key="index" @click="selectAddress(address, index)">
                          <td>{{address}}</td>
                          <td><b-form-radio :value="index"></b-form-radio></td>
                        </tr>
                      </b-form-radio-group>
                    </tbody>
                  </table>   
                </div>
              </b-form-group>     
            </b-tab>
          </b-tabs>
        </b-card>

        <b-list-group v-if="accounts.length > 0">
          <b-list-group-item v-for="(account, index) in accounts" :key="index">{{account}}</b-list-group-item>
        </b-list-group>
        <div v-else>
          No addresses detected
        </div>
      </b-row>
      <b-row class="my-1 justify-content-between pt-4">
        <span v-if="errorMsg" class="text-error  mt-2" variant="error">{{errorMsg}}</span>
        <b-button class="btn proceed-btn" variant="primary" @click="okHandler">Proceed</b-button>
      </b-row>
    </b-container>
  </b-modal>
</template>

<script>
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import LoadingSpinner from '../LoadingSpinner'

import LedgerWallet from "@/services/ledger/ledgerWallet"
import hdPaths from "@/services/ledger/paths"

@Component({
  components: {
    LoadingSpinner
  }
})

export default class HardwareWalletModal extends Vue {

  errorMsg = null
  accounts = []
  showLoadingSpinner = false
  paths = []
  addresses = []
  

  selectedPath = 0
  selectedAddress = 0

  okHandler() {    
    console.log("creating ledger wallet")
    LedgerWallet()
  }

  mounted() {
    this.paths = hdPaths
  }

  selectPath(path, index) {
    this.selectedPath = index
    this.loadAddresses(path.path)
  }

  selectAddress(address, index) {
    
  }

  loadAddresses(path) {
    console.log("Loading addresses at path: ", path)
  }

  async show(myWeb3) {

    this.showLoadingSpinner = true    

    try {
      // this.accounts = await myWeb3.eth.getAccounts()
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
#wallet-config-tabs {
   width: 100%;
   .card-body {
    padding: 0px;
    max-height: 250px;
    overflow: scroll;    
   }
  .custom-control-label::before {
    position: relative;
  }
  table {
    td {
      white-space: no-wrap;
      padding: 0.5rem;
    }
  }
}

.proceed-btn {
  margin-left: auto;
}

</style>
