import { SharedData } from '../helpers/shared_data.helper';
import { ClientRequest } from '../helpers/request.helper';
import { ERROR_TYPES, MitError } from '../handlers/mit-error';
import endpoints from '../config/endpoints';
import { IAvailability } from '../interfaces/availability.inteface';

const sharedData = SharedData.getInstance();

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
