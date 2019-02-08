// PlasmaChain Delegators
import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './store'

import FirstPage from './views/FirstPage.vue'
import MyAccount from './views/MyAccount.vue'
import MyDelegations from './views/MyDelegations.vue'
import ValidatorList from './views/ValidatorList.vue'
import ValidatorDetail from './views/ValidatorDetail.vue'
import CandidateList from './views/CandidateList.vue'
import CandidateDetail from './views/CandidateDetail.vue'
import BlockExplorer from './views/BlockExplorer.vue'
import Rewards from './views/Rewards.vue'
import Help from './views/Help.vue'

import { initWeb3, initLedgerProvider } from './services/initWeb3'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'firstPage',
      component: FirstPage
    },
    {
      path: '/account',
      name: 'account',
      component: MyAccount,
      meta: {
        requireLogIn: true,
        requireDeps: true
      }
    },
    {
      path: '/delegations',
      name: 'delegations',
      component: MyDelegations,
      meta: {
        requireLogIn: true,
        requireDeps: true
      }      
    },
    {
      path: '/rewards',
      name: 'rewards',
      component: Rewards,
      meta: {
        requireLogIn: true
      }   
    },    
    {
      path: '/help',
      name: 'help',
      component: Help,  
    }, 
    {
      path: '/validators',
      name: 'validators',
      component: ValidatorList,
      meta: {
        requireDeps: true
      }
    },
    {
      path: '/validator',
      name: 'validatorDetail',
      component: ValidatorDetail,
      meta: {
        requireDeps: true
      }
    },
    {
      path: '/candidates',
      name: 'candidates',
      component: CandidateList
    },
    {
      path: '/candidate',
      name: 'candidateDetail',
      component: CandidateDetail
    },
    {
      path: '/blockexplorer',
      name: 'BlockExplorer',
      component: BlockExplorer
    },
    {
      path: '/',
      redirect: '/account'
    }
  ],
  scrollBehavior() {
    return {
      x: 0,
      y: 0
    }
  }
})

const checkDeps = async (next) => {
  
  if(store.state.DPOS.web3 && store.state.DappChain.dposUser) {
    next()
    return
  }

  console.log("The RPC url", store.getters.currentRPCUrl)

  try {
    let web3js = await initWeb3()
    store.commit("DPOS/setConnectedToMetamask", true)
    store.commit("DPOS/setWeb3", web3js)    
    let accounts = await web3js.eth.getAccounts()
    let metamaskAccount = accounts[0]    
    store.commit("DPOS/setCurrentMetmaskAddress", metamaskAccount)
    await store.dispatch("DappChain/init")
    await store.dispatch("DappChain/registerWeb3", {web3: web3js})
    await store.dispatch("DappChain/initDposUser")
    await store.dispatch("DappChain/ensureIdentityMappingExists")    
    next()
  } catch(err) {
    console.log("Error initializing dependencies", err)
    if(err === "no Metamask installation detected") {
      store.commit("DPOS/setMetamaskDisabled", true)
    }
  }  

}

const checkLedgerDeps = async (next) => {
  try {
    let web3js = await initLedgerProvider()
    store.commit("DPOS/setConnectedToMetamask", true)
    store.commit("DPOS/setWeb3", web3js)
    store.commit("DPOS/setCurrentMetmaskAddress", store.state.HDWallet.selectedAccount)
    await store.dispatch("DappChain/init")
    await store.dispatch("DappChain/registerWeb3", {web3: web3js})
    await store.dispatch("DappChain/initDposUser") 
    await store.dispatch("DappChain/ensureIdentityMappingExists", { currentAddress: store.state.HDWallet.selectedAccount } )
    next()
  } catch(err) {
    console.log("Error initializing dependencies", err)
  }

}


router.beforeEach(async (to, from, next) => {

  // TODO: Rewrite login guards
  // if(to.meta.requireLogIn && !localStorage.getItem('privatekey')) 
  // {
  //   // If using hardware wallet neglect storing private keys  
  //   if(store.state.DPOS.isLoggedIn && store.state.DPOS.walletType === "ledger") {
  //     next()
  //   }

  //   if(to.name !== 'account') {
  //     store.dispatch('setError', "Login required")
  //     return
  //   }

  //   next('/login')
  //   return
  // }

  if(to.name === 'validatorDetail' && !to.params.info) {
    next('/validators')
    return
  }

  if(to.name === 'account' || to.name === 'delegations' || to.name === "rewards" || to.name === "validators" && store.state.userIsLoggedIn) {
    store.commit('DPOS/setShowSidebar', true)
  } else {
    store.commit('DPOS/setShowSidebar', false)
  }

  if(to.meta.requireDeps && store.state.userIsLoggedIn) {
    switch(store.state.DPOS.walletType) {
      case "ledger":
        checkLedgerDeps(next)
      case "treznor":
        break
      default: 
        await checkDeps(next)
    }

  } else {
    next()
  }
  

})

// router.afterEach((to, from, next) => {
// })

export default router
