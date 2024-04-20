import NodeSSO from 'node-sso';

class JWT {
  private nodeSSO: NodeSSO;
  constructor (secret: string) {
    this.nodeSSO = new NodeSSO(secret);
  }

  /**
   * @Author: jamesezhang
   * @Date: 2020-07-10 13:09:59
   * @LastEditors: jamesezhang
   * @Description: 根据用户id生成一个token
   * @param {type} 
   * @return: 
   */
  public createToken(user: string | object): string {
    return this.nodeSSO.generateToken(user);
  }

  /**
   * @Author: jamesezhang
   * @Date: 2020-07-10 13:12:59
   * @LastEditors: jamesezhang
   * @Description: 解析token返回token中的用户信息
   * @param {type} 
   * @return: 
   */
  public decodeToken(token: string): string | null {
    return this.nodeSSO.decryptToken(token);
  }

}

export const jwt = new JWT(process.env.SECRET);