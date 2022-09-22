import axios from 'axios';
import { SharedData } from './shared_data.helper';
import config from '../config';
import { MitError, ERROR_TYPES } from '../handlers/mit-error';
import endpoints from '../config/endpoints';

export class ClientRequest {
  private sharedData: SharedData;
  private axiosInstance: any;

  constructor(env: string) {
    this.sharedData = SharedData.getInstance();

    this.axiosInstance = axios.create({
      baseURL: this.selector(env).url,
      timeout: 1000 * 50,
      responseType: 'json',
      headers: {
        Authorization: 'Bearer ' + this.sdkMode(env),
        Setup: this.sharedData.setup,
        "Atrys-Product": "SDK"
      },
    });
  }

  private sdkMode(env: any) {
    if (this.sharedData.mode === 'SDK_ADMIN') {
      return this.sharedData.tokens.mit
    }

    return this.selector(env).token
  }

  private selector(env: string): any {
    switch (env) {
      case 'ATRYS':
        return {
          url: this.sharedData.environment.backend = config('').backend[this.sharedData.stage],
          token: this.sharedData.tokens.accessToken,
        };
      case 'MIT_SESSION':
        return {
          url: endpoints.MIT_SESSION_SERVICE,
          token: this.sharedData.tokens.mit,
        };
      case 'MIT_RULE_ENGINE':
        return {
          url: endpoints.MIT_RULE_ENGINE_SERVICE,
          token: this.sharedData.tokens.mit,
        };
      case 'SDK':
        return {
          url: this.sharedData.environment.backend,
          token: this.sharedData.tokens.mit,
        };
      default:
        return '';
    }
  }

  public async post(endpoint: string, payload: any): Promise<any> {
    return this.catchErrors(
      endpoint,
      await this.axiosInstance.post(endpoint, payload, { validateStatus: () => true })
    )
  }

  public async put(endpoint: string, payload: any): Promise<any> {
    return this.catchErrors(
      endpoint,
      await this.axiosInstance.put(endpoint, payload, { validateStatus: () => true })
    )
  }

  public async get(endpoint: string, params: any = {}): Promise<any> {
    return this.catchErrors(
      endpoint,
      await this.axiosInstance.get(endpoint, { params: { ...params }, validateStatus: () => true })
    )
  }

  private catchErrors(endpoint: string, request: any): Promise<any> {
    const allowedStatusCodes = [200, 201, 422]

    if (allowedStatusCodes.indexOf(request.status) === -1) {
      const requestError = request.data.message || request.data.error
      this.sharedData.errors.push({
        endpoint,
        message: requestError
      })

      throw new MitError(request.data.message, ERROR_TYPES.BAD_REQUEST, request?.data?.internalCode ?? request?.data?.internalcode);
    }

    return request;
  }
}
