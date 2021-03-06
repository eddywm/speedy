<template>
  <div>
    <div>

      <div class="field">
        <b-switch v-model="isPhraseHidden">
          {{ isPhraseHidden ? 'Reveal seed phrase' : 'Hide seed phrase' }}
        </b-switch>
      </div>

      <b-field label="Seed Phrase">
        <b-input type="textarea" placeholder="Enter the seed phrase 12 or 24 words"
                 v-model="isPhraseHidden ? hiddenPhrase : seedPhrase"
                 validation-message="The seed phrase is required"
                 required>

        </b-input>
      </b-field>

      <b-field label="Derivation Path">
        <b-input v-model="derivationPath"
                 placeholder="m/84'/0'/0'/0/0"
                 validation-message="The derivation path is required"
                 required>

        </b-input>
      </b-field>
    </div>

    <div>
      <button class="button is-primary" id="generate-btn" v-on:click="onGenerate">
        <b-icon icon="plus"></b-icon>
        <span>Generate Address</span>
      </button>
    </div>

    <div id="address-generated-info" v-if="generatedAddress.length > 0 && isAddressBannerActive">
      <b-message title="Success" type="is-success" v-model="isAddressBannerActive"
                 aria-close-label="Close message">
        The Segwit address was generated: <strong>{{ generatedAddress }}</strong>
      </b-message>
      <qr-code :text="generatedAddress" id="qr-code" class="columns is-flex is-vcentered is-centered"></qr-code>

    </div>
  </div>
</template>

<script lang="ts">
import {Component, Vue, Watch} from 'vue-property-decorator';
import * as bitcoin from 'bitcoinjs-lib'
import * as bip32 from 'bip32';
import * as bip39 from 'bip39';

@Component
export default class AddressGeneration extends Vue {
  generatedAddress: string = ""
  seedPhrase: string = ""
  hiddenPhrase: string = ""

  derivationPath: string = ""
  isAddressBannerActive: boolean = false
  isPhraseHidden: boolean = false;

  @Watch('seedPhrase')
  onSeedPhraseChanged(value: string, oldValue: string) {
    this.hiddenPhrase = this.seedPhrase.replace(/\S/gi, '*');
  }

  public derive(seedPhrase: string, derivationPath: string): string {
    const seed = bip39.mnemonicToSeedSync(seedPhrase, "");
    const root = bip32.fromSeed(seed, bitcoin.networks.bitcoin);

    const account = root.derivePath(derivationPath);
    let publicKey = account.publicKey;
    return bitcoin.payments.p2wpkh({pubkey: publicKey}).address ?? "";
  }

  warn(message: string) {
    this.$buefy.toast.open({
      message: message,
      type: "is-danger"
    })
  }

  validateInputs(): boolean {
    let words = this.seedPhrase.trim().split(" ");
    // Mnemonic phrases can be from 3 words to 24 words but the most used interval is 12-24
    if (words.length >= 12 && words.length <= 24) {
      return true
    }
    this.warn("Seed phrase is expected to be between 12 and 24 words")
    return false;

  }

  onGenerate() {
    if (!this.validateInputs()) {
      return
    }

    try {
      this.generatedAddress = this.derive(this.seedPhrase, this.derivationPath);
      this.$buefy.toast.open({
        message: 'Address was generated successfully !',
        type: 'is-success'
      })

      this.isAddressBannerActive = true;
    } catch (e) {
      this.warn("There was an issue generating the address, check inputs again !")

    }
  }

}

</script>

<style scoped>
#generate-btn, #address-generated-info {
  margin-top: 20px;
}
</style>