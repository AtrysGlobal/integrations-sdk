import axios from 'axios';
import { SharedData } from './shared_data.helper';
import config from '../config';

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
        'User-Agent': 'Atrys/SDK',
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
    const _req = await this.axiosInstance.post(endpoint, payload, { validateStatus: () => true });
    return _req;
  }

  async get(endpoint: string, params: any = {}): Promise<any> {
    const _req = await this.axiosInstance.get(endpoint, { params: { ...params }, validateStatus: () => true });
    return _req;
  }
}
