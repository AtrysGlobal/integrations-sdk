import { SharedData } from '../helpers/shared_data.helper';
import { ClientRequest } from '../helpers/request.helper';
import { ERROR_TYPES, MitError } from '../handlers/mit-error';
import endpoints from '../config/endpoints';
import { IAvailability } from '../interfaces/availability.inteface';

const sharedData = SharedData.getInstance();

/**
 * > This function returns a list of objectives
 * @returns A list of objectives
 */
export async function listObjectives(): Promise<object> {
    try {
        const _request = new ClientRequest('ATRYS');
        const _req = await _request.get(endpoints.availability.objetives);
        if (_req.data.message !== 'OK') {
            throw new Error(_req.data.message);
        }

        return _req.data;
    } catch (error: any) {
        throw new MitError(error, ERROR_TYPES.BLOCKS);
    }
}

/**
 * It creates a new availability for a professional
 * @param {IAvailability} availability - IAvailability - This is the availability object that you want
 * to create.
 * @param {string} professionalId - string
 * @returns An object with the following structure:
 * {
 *     message: 'OK',
 *     data: {
 *         id: '5e8d8f8f8f8f8f8f8f8f8f8f',
 *         professionalId: '5e8d8f8f8f8f8f8f8f8f8f8
 */
export async function create(availability: IAvailability, professionalId: string): Promise<object> {
    try {
        const _request = new ClientRequest('ATRYS');
        const _req = await _request.post(`${endpoints.availability.path}?professionalId=${professionalId}`, { ...availability });
        if (_req.data.message !== 'OK') {
            throw new Error(_req.data.message);
        }

        return _req.data;
    } catch (error: any) {
        throw new MitError(error, ERROR_TYPES.BLOCKS);
    }
}

/**
 * It makes a request to the ATRYS API to get the availability of a professional
 * @param {string} professionalId - string
 * @returns A list of availabilities
 */
export async function list(professionalId: string): Promise<object> {
    try {
        const _request = new ClientRequest('ATRYS');
        const _req = await _request.get(endpoints.availability.path, { professionalId });
        if (_req.data.message !== 'OK') {
            throw new Error(_req.data.message);
        }

        return _req.data;
    } catch (error: any) {
        throw new MitError(error, ERROR_TYPES.BLOCKS);
    }
}

/**
 * It updates an availability
 * @param {IAvailability} availability - IAvailability - The availability object to be updated.
 * @param {string} availabilityId - The id of the availability you want to update.
 * @param {string} professionalId - string - The professional's ID
 * @returns a promise that resolves to an object.
 */
export async function update(availability: IAvailability, availabilityId: string, professionalId: string): Promise<object> {
    try {
        const _request = new ClientRequest('ATRYS');
        const _req = await _request.put(`${endpoints.availability.path}/${availabilityId}?professionalId=${professionalId}`, { ...availability });
        if (_req.data.message !== 'OK') {
            throw new Error(_req.data.message);
        }

        return _req.data;
    } catch (error: any) {
        throw new MitError(error, ERROR_TYPES.BLOCKS);
    }
}

/**
 * It toggles the state of an availability
 * @param {string} availabilityId - The id of the availability you want to toggle.
 * @param {boolean} state - boolean - true or false
 * @returns A promise that resolves to an object.
 */
export async function toggle(availabilityId: string, state: boolean): Promise<object> {
    try {
        const _request = new ClientRequest('ATRYS');
        const _req = await _request.put(`${endpoints.availability.path}/${availabilityId}/state`, { isActive: state });
        if (_req.data.message !== 'OK') {
            throw new Error(_req.data.message);
        }

        return _req.data;
    } catch (error: any) {
        throw new MitError(error, ERROR_TYPES.BLOCKS);
    }
}

export default { listObjectives, create, list, update };
