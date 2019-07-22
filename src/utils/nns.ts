import { DomainInfo, RootDomainInfo, DomainStatus, Domainmsg, DataType, NNSResult, ResultItem, DomainState } from './entity';
import { ThinNeo, Helper, Neo } from '../lib/neo-ts/index'
import Https from "./Https";
import Wallet from './wallet';
import Transfer from './transaction';
import { Account } from '../lib/neo-ts/Helper/index';
import Common from './common';
import { DOMAIN_ROOT, DAPP_NNS } from './const';
/**
 * @name NEONameServiceTool
 * @method initRootDomain_初始化根域名信息
 */
export default class NNS {
    /**
     * 域名查询及校验
     * @param domain 二级域名
     */
    static async  verifyDomain(domain: string) {
        return await Https.api_getdomaininfo(domain);
    }
}