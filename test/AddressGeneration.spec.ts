import 'jest';
declare var require: any;
let AddressGeneration = require("../src/components/AddressGeneration.vue").default;

describe('Segwit AddressGeneration', () => {
    const generation = new AddressGeneration()

    test('test-gen-0', () => {

        let seedPhrase = "lizard century nut catch figure build swift call pledge toe cereal truck recipe faint clerk"
        let derivationPath = "m/84'/0'/0'/0/0"

        let generatedAddress = generation.derive(seedPhrase, derivationPath);

        expect(generatedAddress).toMatch("bc1q0j5dewvk89ss00l68a9hf8lah4c66wmahddmdv")
    })

    test('test-gen-1', () => {

        let seedPhrase = "aspect step draft sick acid oval sure super pumpkin night element thank deer myself grass"
        let derivationPath = "m/84'/0'/0'/0/0"

        let generatedAddress = generation.derive(seedPhrase, derivationPath);

        expect(generatedAddress).toMatch("bc1q85md6p5wq3g0sfvzhg0qt3wax45l0t5n3pazz3")
    })
})
