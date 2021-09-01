import * as jsonwebtoken from 'jsonwebtoken';
import { ConfigService } from '@jimizai/config';
import { Inject, Injectable } from '@jimizai/injectable';

export interface JwtConfigs {
  jwt: JwtOpitons;
}

export interface JwtOpitons {
  sign?: any;
  verify?: any;
  secret: string;
  extras?: {
    ttl: number; // hour
  };
}

@Injectable()
export class JWTService<T extends JwtConfigs> {
  @Inject()
  protected configService: ConfigService<T>;

  public get jwtConfigs() {
    return this.configService.get('jwt');
  }

  public get secret() {
    return this.jwtConfigs.secret;
  }

  get ttl() {
    return (this.jwtConfigs.extras?.ttl || 7 * 24) * 60 * 60;
  }

  private jwtSign(
    payload: any,
    secret: string,
    options?: any,
    callback?: () => any
  ): string | void {
    if (typeof secret !== 'string') {
      callback = options;
      options = secret || {};
      secret = this.secret;
    } else if (typeof options === 'function') {
      callback = options;
      options = {};
    }

    return jsonwebtoken.sign(
      payload,
      secret,
      Object.assign({}, this.jwtConfigs.sign || {}, options),
      callback
    );
  }

  private jwtVerify(
    token: any,
    secret: string,
    options?: any,
    callback?: () => any
  ): string | void {
    if (typeof secret !== 'string') {
      callback = options;
      options = secret || {};
      secret = this.jwtConfigs.secret;
    } else if (typeof options === 'function') {
      callback = options;
      options = {};
    }

    return jsonwebtoken.verify(
      token,
      secret,
      Object.assign({}, this.jwtConfigs.verify || {}, options),
      callback
    );
  }

  async verify(token: string) {
    const result = await this.jwtVerify(token, this.secret, {
      clockTolerance: 30, // 检查 nbf (token 最早可用时间) 和 exp (token 过期时间) 声明时容忍的秒数，以处理不同服务器之间的小时钟差异
    });

    return result;
  }

  async create(data: any): Promise<string> {
    return this.jwtSign({ customClaims: data }, this.secret, {
      expiresIn: this.ttl, // token 过期时间, 单位: 小时
    }) as string;
  }

  async getCustomClaims(token: string) {
    const jwtData: any = await this.verify(token);

    return jwtData.customClaims;
  }
}
