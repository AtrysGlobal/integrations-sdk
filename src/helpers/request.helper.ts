import axios from 'axios';
import { SharedData } from './shared_data.helper';
import config from '../config';
import { MitError, ERROR_TYPES } from '../handlers/mit-error';

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
        Authorization: 'Bearer ' + this.selector(env).token,
      },
    });
  }

  environments(setup: string, layer: string): string {
    switch (layer) {
      case 'frontend':
        this.sharedData.environment.frontend = config.frontend[setup];
        return this.sharedData.environment.frontend;

      case 'backend':
        this.sharedData.environment.backend = config.backend[setup];
        return this.sharedData.environment.backend;

      default:
        return '';
    }
  }

  selector(env: string): any {
    switch (env) {
      case 'ATRYS':
        return {
          url: this.sharedData.environment.backend,
          token: this.sharedData.tokens.atrysBackend,
        };
      case 'MIT_SESSION':
        return {
          url: config.MIT_SESSION_SERVICE,
          token: this.sharedData.tokens.mit,
        };
      case 'MIT_RULE_ENGINE':
        return {
          url: config.MIT_RULE_ENGINE_SERVICE,
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

  async post(endpoint: string, payload: any): Promise<any> {
    return this.catchErrors(
      endpoint,
      await this.axiosInstance.post(endpoint, payload, { validateStatus: () => true })
    )
  }

  async get(endpoint: string, params: any = {}): Promise<any> {
    return this.catchErrors(
      endpoint,
      await this.axiosInstance.get(endpoint, { params: { ...params }, validateStatus: () => true })
    )
  }

  private catchErrors(endpoint: string, request: any): Promise<any> {
    const allowedStatusCodes = [200, 422]

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
