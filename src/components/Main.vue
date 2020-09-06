<template>
      <div class="columns is-flex is-vcentered is-centered" id="fields">
        <div class="column is-two-thirds-desktop is-full-mobile">
          <b-message title="SpeedyWallet" has-icon type="is-info" aria-close-label="Close message">
            For better security, when using this tool : please turn off internet access and use it fully offline.
            SpeedyWallet is a fully client-side tool and doesn't collect any sensitive data nor usage infos.
          </b-message>

          <b-tabs position="is-centered">
            <b-tab-item label="ADDRESS GENERATION" icon="toolbox">
              <AddressGeneration/>
            </b-tab-item>

            <b-tab-item label="N-M MULTI-SIG" icon="tools">
              <MultiSigCreation/>
            </b-tab-item>

          </b-tabs>
        </div>
        </div>

</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import AddressGeneration from "@/components/AddressGeneration.vue";
import MultiSigCreation from "@/components/MultiSigCreation.vue";

@Component({
  components: {
    AddressGeneration,
    MultiSigCreation,
  },
})

export default class Main extends Vue {
  isWelcomeModalActive: boolean = true;
}

</script>

<style>
#fields {
  margin-top: 20px;
  padding: 10px;
}

#qr-code {
  margin: 20px;
}
</style>