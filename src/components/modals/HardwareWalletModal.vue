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
import { mapGetters, mapState, mapActions, mapMutations, createNamespacedHelpers } from 'vuex'
import LedgerWallet from "@/services/ledger/ledgerWallet"
import hdPaths from "@/services/ledger/paths"

import { initWeb3 } from '../../services/initWeb3'


const MAX_ADDRESSES = 5

@Component({
  components: {
    LoadingSpinner
  },
  methods: {
   ...mapMutations(['setErrorMsg', 'setSuccessMsg'])
  }
})

export default class HardwareWalletModal extends Vue {

  hdWallet = undefined

  errorMsg = null
  accounts = []

  showLoadingSpinner = false
  paths = []
  addresses = []
  
  selectedPath = 0
  selectedAddress = 0

  web3js = null

  okHandler() {    
  }

  mounted() {
    this.paths = hdPaths
  }

  async selectPath(pathObj, index) {
    const {path} = pathObj
    await this.hdWallet.init(path)
    let i = 0
    while (i < MAX_ADDRESSES) {
      try {
        let account = await this.hdWallet.getAccount(i)
        this.accounts.push({
          index: i,
          account: account,
          balance: 'loading'
        })
        i++        
      } catch(err) {
        console.log(err)
      }
    }   
    if(this.accounts.length > 0) this.getBalances()
  }

  selectAddress(address, index) {
    
  }

  loadAddresses(path) {
    console.log("Loading addresses at path: ", path)
  }


  getBalances() {
    this.accounts.forEach(account => {
      this.web3js.eth
        .getBalance(account.account.getChecksumAddressString())
        .then(balance => {
          account.balance = balance
        })
    })
  }


  async show(myWeb3) {
    this.web3js = await initWeb3()
    this.$refs.modalRef.show()
    this.showLoadingSpinner = true
    try {
      this.hdWallet = await LedgerWallet()
    } catch(err) { 
      this.setErrorMsg("Please make sure your hardware wallet is connected")
    }
    this.showLoadingSpinner = false
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
