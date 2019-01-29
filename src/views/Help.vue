<template>
  <div class="faucet-with-navbar">
    <div class="faucet-content">
      <div>
        <h1 class="page-header">Help</h1>
      </div>
      <div class="help-block">
        <h3 class="question">What is a gateway?</h3>
        <p>Gateways are smart contracts on Ethereum and Loom's PlasmaChain which are used to facilitate cross chain transactions. You deposit your mainnet funds to the gateway, and after a short delay will be credited with the same amount of tokens on PlasmaChain. If you want to withdraw your funds back to the mainnet, you can use the "Withdraw" button, which will call a function that unlocks your funds, by providing a signature by the PlasmaChain validators. You can check your balance in the Account Details page in the My Account tab, or in the "DAppChain" field in the top right of the page. </p>
      </div>
      <div class="help-block">
        <h3 class="question">How do I stake to earn rewards?</h3>
        <p>After having funds on the PlasmaChain, you can stake them by Delegating them to a validator. When delegating, you can pick a lockup period of 2 weeks, 3 months, 6 months or a year. You earn more rewards the longer you lockup your tokens for. You are able to Delegate only once per election cycle, and you need to wait after elections to start earning rewards. Elections happen every 2 weeks. </p>
      </div>
      <div class="help-block">
        <h3 class="question">How do I claim my rewards?</h3>
        <p>You can view your expected rewards in the Rewards tab. Withdraw your rewards to your PlasmaChain balance by clicking the Claim Rewards button. You can then withdraw your rewards to mainnet via the gateway as explained above.</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import '~@/assets/scss/_mixin.scss';
@import '~@/assets/scss/_variables.scss';

.page-header {
  margin-top: 24px;
  margin-bottom: 32px;
}

.question {
  color: gray
}

.help-block{
  margin: 10px 0px 10px 0px;
  padding: 2px;
}

</style>

