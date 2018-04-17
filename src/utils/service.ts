import { WWW } from './API';
import { UTXOTool } from './UTXOtool';
import { WalletTool } from './wallettool';
import * as TimeHelper from './time';

export class Service {

    static isLoadTXs: boolean = false;
    static isLoadAsset: boolean = true;
    // 交易历史代理
    static txDelegate: Function = null;
    // 资产代理
    static assetDelegate: Function = null;

    static address: string = '';
    static temp_assets: any = {
        'NEO': {
            amount: 0,
            price: 0.00,
            total: 0.00,
            type: 'NEO'
        }, 'GAS': {
            amount: 0.0000,
            price: 0.00,
            total: 0.00,
            type: 'GAS'
        }
    };

    static init(addr: string) {
        this.address = addr;

        // 暂时不加载历史记录
        this.txDelegate = null;
        this.isLoadTXs = false;

        this.temp_assets = {
            'NEO': {
                amount: 0,
                price: 0.00,
                total: 0.00,
                type: 'NEO'
            }, 'GAS': {
                amount: 0.0000,
                price: 0.00,
                total: 0.00,
                type: 'GAS'
            }
        };
    }
    /**
    * 定时触发
    */
    static async OnTimeOut() {
        console.log('onTimeOut');

        Service.OnGetAssets();
        Service.OnGetPrice();

        if (Service.isLoadTXs) {
            Service.OnGetTXs(1);
        }
        Service.OnGetHeight();
    }

    /**
     * 加载区块链高度
     */
    static async OnGetHeight() {
        const height = await WWW.api_getHeight();
        WalletTool.height = height;
    }

    /**
     * 获取账户资产信息 UTXO
     */
    static async OnGetAssets() {
        let that = this;

        for (let key in that.temp_assets) {
            that.temp_assets[key].amount = 0;
        }

        await UTXOTool.GetAssets(Service.address);
        for (let item of UTXOTool.utxo) {
            if (that.temp_assets[item.asset] === undefined)
                that.temp_assets[item.asset] = {
                    amount: 0,
                    price: 0.00,
                    total: 0.00,
                    type: item.asset
                };

            if (item.asset === 'NEO')
                that.temp_assets[item.asset].amount = parseInt(that.temp_assets[item.asset].amount) + parseInt(item.count);
            else {
                that.temp_assets[item.asset].amount = parseFloat(that.temp_assets[item.asset].amount) + parseFloat(item.count);
                that.temp_assets[item.asset].amount = parseFloat(that.temp_assets[item.asset].amount).toFixed(8);
            }

        }
        UTXOTool.balance = that.temp_assets;
        UTXOTool.utxo.reverse();

        // 回调coin资产
        if (Service.assetDelegate !== null)
            Service.assetDelegate(that.temp_assets);
    }

    /**
     * 获取市场价格
     */
    static async OnGetPrice() {
        let that = this;
        for (let key in that.temp_assets) {
            const coin = await WWW.api_getCoinPrice(key);
            try {
                that.temp_assets[key].price = parseFloat(coin[0]['price_cny']).toFixed(2);
                that.temp_assets[key].total =
                    (that.temp_assets[key].amount as number) *
                    (coin[0]['price_cny'] as number);
                that.temp_assets[key].total = (that.temp_assets[key].total as number).toFixed(2);
                if (coin[0]['percent_change_1h'][0] !== '-') that.temp_assets[key].rise = true;
                else that.temp_assets[key].rise = false;
            } catch (err) {
                console.log('NET_ERR');
                console.log(err);

            }
        }
        // 回调法币资产
        if (Service.assetDelegate !== null)
            Service.assetDelegate(that.temp_assets);
    }
    /**
     * 获取历史交易
     */
    static async OnGetTXs(page:number) {
        console.log(Service.address);

        const txs = await WWW.rpc_getAddressTXs(Service.address, 20, page);
        console.log(txs);
        if (txs === undefined) {
            if (Service.txDelegate !== null)
                Service.txDelegate(null);
        }
        for (let index in txs) {
            try {
                const date = txs[index].blocktime['$date'];
                txs[index].blocktime['$date'] = TimeHelper.formatTime(
                    date,
                    'Y/M/D h:m:s'
                );
            } catch (err) {
                console.log('NET_Date_ERR');
                console.log(err);
            }
            txs[index].blockindex =
                (WalletTool.height as number) - (txs[index].blockindex as number) + 1;

        }
        if (Service.txDelegate !== null)
            Service.txDelegate(txs);
    }
}