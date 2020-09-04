<template>
  <div class="container">
    <h5 class="tile">Specify M of N parameters for the MULTI-SIG</h5>
    <br>
    <div class="columns">

      <div class="column">
        <b-field label="Input M">
          <b-field>
            <b-numberinput min="1" max="10" v-model="mValue" controls-rounded></b-numberinput>
          </b-field>
        </b-field>
      </div>

      <div class="column">
        <b-field label="Input N">
          <b-field>
            <b-numberinput min="2" max="10" v-model="nValue" controls-rounded></b-numberinput>
          </b-field>
        </b-field>
      </div>

    </div>
    <section>
      <div class="container" id="generate-multisig-btn">
        <button class="button is-primary" v-on:click="getMultiSig">
          <b-icon icon="plus"></b-icon>
          <span>Generate {{ mValue + ' of ' + nValue }}</span>
        </button>
      </div>

      <div id="address-generated-info" v-if="generatedMultiSigAddress.length > 0">
        <b-message title="Success" type="is-success" v-model="isAddressBannerActive"
                   aria-close-label="Close message">
          The generated multi-sig address : <strong>{{ generatedMultiSigAddress }}</strong>
        </b-message>
      </div>

      <div v-for="(field, index) in publicKeysFields" :key="field">
        <b-field :label="'Public Key - Position: '+index" id="pb-key-field">
          <b-input placeholder="031daf6d5f08f18baf43f9499dd48020dede412db2892ad33d2d906432c090a718" v-model="publicKeys[index]"
                   validation-message="The public key data required"
                   required></b-input>
        </b-field>
      </div>
    </section>


  </div>
</template>

<script lang="ts">
import {Component, Vue, Watch} from 'vue-property-decorator';
import * as bitcoin from 'bitcoinjs-lib'
import * as bip32 from 'bip32';
import * as bip39 from 'bip39';

@Component
export default class MultiSigCreation extends Vue {
  mValue: number = 2
  nValue: number = 3

  publicKeysFields: Array<string> = new Array<string>(this.nValue);
  publicKeys: Array<string> = new Array<string>(this.nValue);

  isAddressBannerActive: boolean = false
  generatedMultiSigAddress: string = "";


  @Watch('nValue')
  onNValueChange(value: number, oldValue: number) {
    // In multi-sig setup m value can't be bigger than n value
    if (value <= this.mValue) {
      this.mValue = value - 1;
    }
    this.publicKeysFields = new Array<string>(value)
  }

  @Watch('mValue')
  onMValueChange(value: number, oldValue: number) {
    // In multi-sig setup n value can't be bigger than m value
    if (value >= this.nValue) {
      this.nValue = value + 1
    }
  }

  public generateP2SHMultiSig(_publicKeys: Array<string>): string | null {
    try {
      let pubkeys: Buffer[] = _publicKeys
          .filter(pk => pk.length > 0)
          .map(hex => Buffer.from(hex, 'hex'));

      if (pubkeys.length == 0) {
        console.log("Input public keys for calculating multi-sig")
        return null
      }

      const {address} = bitcoin.payments.p2sh({
        redeem: bitcoin.payments.p2ms({m: this.mValue, pubkeys}),
      })
      return address ?? ""

    } catch (e) {
      this.$buefy.toast.open({
        message: "Failed to generate multi-sig address : Invalid inputs",
        type: "is-danger"
      })
      return null
    }

  }

  getMultiSig() {
    let address = this.generateP2SHMultiSig(this.publicKeys);
    console.log(`Generated address: ${address}`)

    this.generatedMultiSigAddress = address ?? ""
    this.isAddressBannerActive = true;
  }
}

</script>

<style scoped>
#fields {
  margin-top: 60px;
}

#pb-key-field, #generate-multisig-btn {
  padding-top: 10px;
  padding-bottom: 10px;
}


#generate-btn, #address-generated-info {
  margin-top: 20px;
}
</style>