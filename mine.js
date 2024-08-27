const config = require('./config.js');
const ethers = require('ethers');
const provider = new ethers.JsonRpcProvider(config.RPC);
const miner = new ethers.Wallet(config.PRIVATE_KEY, provider);
const PUMPAC_ADDRESS = '0xf97e8686b7be52C020c156E22C15eca93d978c21';
const PUMPAC_ABI = require('./abi.json')
const pumpac = new ethers.Contract(PUMPAC_ADDRESS, PUMPAC_ABI, miner);


async function mine (_nonce) {
    try {
        const tx = await pumpac.connect(miner).mine('0x', { nonce: _nonce, gasLimit: 19930000 })
        console.log('Mine transaction sent with the nonce', _nonce)
        tx.wait().then(result => {
            console.log('Mine transaction confirmed with the nonce', _nonce)
        })
    } catch (e) {
        console.error('An error occurred while executing the transaction with the nonce', _nonce, e)
    }
}

provider.getTransactionCount(miner.address).then(nonce => {
    mine(nonce)

    setInterval(() => {
        mine(++nonce)
    }, 60000 / config.MINE_TX_PER_MINUTE)
})

