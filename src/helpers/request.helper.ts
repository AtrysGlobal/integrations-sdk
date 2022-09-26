import axios from 'axios';
import { SharedData } from './shared_data.helper';
import config from '../config';
import { MitError, ERROR_TYPES } from '../handlers/mit-error';
import endpoints from '../config/endpoints';

export class ClientRequest {
  private sharedData: SharedData;
  private axiosInstance: any;

  /* Creating an axios instance with the baseURL and headers. */
  constructor(env: string) {
    this.sharedData = SharedData.getInstance();

    this.axiosInstance = axios.create({
      baseURL: this.selector(env).url,
      timeout: 1000 * 50,
      responseType: 'json',
      headers: {
        Authorization: 'Bearer ' + this.sdkMode(env),
        Setup: this.sharedData.setup,
        Locale: this.sharedData.locale,
        "Atrys-Product": "SDK"
      },
    });
  }

  /**
   * If the mode is SDK_ADMIN, return the MIT token, otherwise return the token for the selected
   * environment
   * @param {any} env - The environment you want to use.
   * @returns The token for the environment
   */
  private sdkMode(env: any) {
    if (this.sharedData.mode === 'SDK_ADMIN') {
      return this.sharedData.tokens.mit
    }

    return this.selector(env).token
  }

  /**
   * It returns an object with the url and token to be used for the request
   * @param {string} env - The environment you want to call.
   * @returns The url and token for the environment.
   */
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

  /**
   * It makes a POST request to the endpoint with the payload.
   * @param {string} endpoint - The endpoint you want to hit.
   * @param {any} payload - the data you want to send to the server
   * @returns The return value of the catchErrors function.
   */
  public async post(endpoint: string, payload: any): Promise<any> {
    return this.catchErrors(
      endpoint,
      await this.axiosInstance.post(endpoint, payload, { validateStatus: () => true })
    )
  }

  /**
   * It makes a PUT request to the endpoint with the payload.
   * @param {string} endpoint - The endpoint you want to hit.
   * @param {any} payload - The data you want to send to the server.
   * @returns The return value of the catchErrors function.
   */
  public async put(endpoint: string, payload: any): Promise<any> {
    return this.catchErrors(
      endpoint,
      await this.axiosInstance.put(endpoint, payload, { validateStatus: () => true })
    )
  }

  /**
   * It takes an endpoint and params, and returns the result of the axios get request, or an error if
   * the request fails
   * @param {string} endpoint - The endpoint you want to hit.
   * @param {any} params - any = {}
   * @returns The response from the API call.
   */
  public async get(endpoint: string, params: any = {}): Promise<any> {
    return this.catchErrors(
      endpoint,
      await this.axiosInstance.get(endpoint, { params: { ...params }, validateStatus: () => true })
    )
  }

  /**
   * It catches errors and pushes them to the sharedData.errors array
   * @param {string} endpoint - The endpoint you're calling.
   * @param {any} request - The request object returned from the axios call.
   * @returns The request object is being returned.
   */
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
