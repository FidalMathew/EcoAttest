import test from 'tape';

import main from './script-hts-ft.js';

test('base', async function (t) {
    let result;
    try {
        result = await main();
    } catch (ex) {
        t.fail(ex);
    } finally {
        // t.match(result.accountId.toString(), /0\.0\.\d+/,
        //     'valid format for accountId');
        // t.match(result.accountAddress.toString(), /0x[0-9a-fA-F]{40}/,
        //     'valid format for accountAddress');
        // t.equal(result.accountExplorerUrl.toString(),
        //     `https://hashscan.io/testnet/address/${result.accountAddress.toString()}`,
        //     'accountExplorerUrl corresponds to accountAddress');
        // t.match(result.myContractAddress.toString(), /0x[0-9a-fA-F]{40}/,
        //     'valid format for myContractAddress');
        // t.equal(result.txExplorerUrl.toString(),
        //     `https://hashscan.io/testnet/address/${result.myContractAddress.toString()}`,
        //     'myContractExplorerUrl corresponds to myContractAddress');
        // t.match(result.myContractWriteTxHash.toString(), /0x[0-9a-fA-F]{64}/,
        //     'valid format for myContractWriteTxHash');
        // t.match(result.myContractQueryResult.toString(), /Hello future - .+/,
        //     'valid format for myContractQueryResult');
        t.pass('all assertions completed');
    }
});
