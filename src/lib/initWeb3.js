import Web3 from 'web3';


/* JAVASCRIPT */
/**
 * @dev function to create a new Web3 object using provider
 * @param provider a provider object
 */
const initWeb3 = (provider) => {
    const web3 = new Web3(provider);

    web3.eth.extend({
        methods: [{
            name: "chainId",
            call: "eth_chainId",
            outputFormatter: web3.utils.hexToNumber
        }]
    });

    return web3;
};



export {
    initWeb3
};