import Web3 from 'web3'

import ProviderEngine from "web3-provider-engine"
import FetchSubprovider from "web3-provider-engine/subproviders/fetch"
import TransportU2F from "@ledgerhq/hw-transport-u2f"
import createLedgerSubprovider from "@ledgerhq/web3-subprovider"

const rpcUrl = "https://ropsten.infura.io"
const networkId = 3

export const initLedgerProvider = async (chainUrl) => {

  return new Promise(
    async (resolve, reject) => {
      let myWeb3 = null
      try {
        const engine = new ProviderEngine()
        const getTransport = () => TransportU2F.create()
        const ledger = createLedgerSubprovider(getTransport, {
          networkId,
          accountsLength: 5
        })
        engine.addProvider(ledger)
        engine.addProvider(new FetchSubprovider({ rpcUrl }))
        engine.start()
        myWeb3 = new Web3(engine)
      } catch(err) {
        reject("error initializing hardware wallet")
      }
      
      window.web3 = myWeb3
      resolve(myWeb3)
    }
  )

}

export const initWeb3 = async () => {

  return new Promise(
    async (resolve, reject) => {
      let myWeb3 = null      
      if(window.ethereum) {
        myWeb3 = new Web3(ethereum)
        try {
          await ethereum.enable()
        } catch(err) {          
          reject("User denied access to Metamask")
        }
      } else if(window.web3) {
        myWeb3 = new Web3(window.web3.currentProvider)
      } else {
        reject("no Metamask installation detected")
      }
      window.web3 = myWeb3
      resolve(myWeb3)
    }
  )

}