import Coin from './coin';
import * as Const from './const';
import NNS from './nns';
import * as Random from './random';
import { Context } from './context';
import Tips from './tip';
import Transfer from './transaction';
import Cache from './cache';
import Wallet from './wallet';
import { Asset, WatchOnlyAccount } from './entity';
import Emitter from './Emitter';
import WatchOnlyManager from './watchonly';

export default {
    wallet: Wallet,
    Emitter: Emitter,
    const: Const,
    watchOnly: WatchOnlyManager,
    show: {
        loading: Tips.loading,
        success: Tips.success,
        confirm: Tips.confirm,
        toast: Tips.toast,
        alert: Tips.alert,
        error: Tips.error,
        share: Tips.share
    },
    hide: {
        loading: Tips.loaded
    },
    send: {
        transfer: async (targetaddr: string, asset: string, sendcount: number) => {
            let coin: Asset = Context.Assets[asset] as Asset;
            return await Transfer.contactTransaction(targetaddr, coin, sendcount);
        },
        // invoke: Transfer.nep5Transaction,
        claim: Transfer.claimGas,
    },
    get: {
        random: Random.getSecureRandom,
        cache: Cache.get,
        height: () => { return Context.Height },
        account: () => { return Wallet.account },
        nep2: Wallet.getAccount, //获取用户账户
        assets: () => { return Context.Assets },
        userInfo: async () => { return await Context.getUser() },
        TXs: Context.OnGetTXs,
        prikey: (wif: string): string => { return Wallet.wif2prikey(wif) },
        total: () => { return Context.total },
        claim: () => { return Context.claim },
        sendCoin: () => { return Transfer.coin },
        sendAddr: () => { return Transfer.address },
        addrByDomain: async (domain: string) => { return await NNS.verifyDomain(domain) },
        wif: Wallet.prikey2Wif,
        watchonly: WatchOnlyManager.getAll
    },
    set: {
        cache: Cache.put,
        account: Wallet.setAccount,
        account_json: Wallet.importAccount,
        openid: Context.openid,
        formid: (formid: string) => { Transfer.formId.push(formid); },
        sendCoin: (coin: Asset) => { Transfer.coin = coin },
        setAddr: (addr: WatchOnlyAccount) => { Transfer.address = addr }
    },
    delete: {
        account: Wallet.removeWallet,
        watchonly:WatchOnlyManager.delete
    },

    init: {
        asset: Coin.initAllAsset,
        context: Context.init,
        notity: Context.notity
    },
    service: {
        start: Context.init,
        update: Context.OnTimeOut,
    },
    reg: {
        test: () => {
            // // console.log('[[[[[[[[[[[[[[[[[[[[[[[');

            // // console.log(Helper.hexToBytes(Const.DAPP_CGAS.toString()));

            // // console.log(Const.DAPP_CGAS.toString());
            // // console.log(new Uint8Array(Const.DAPP_CGAS.bits.buffer))
            // // console.log(Const.DAPP_CGAS.toArray());

            // // console.log('[[[[[[[[[[[[[[[[[[[[[[[[');

        }
    }
}