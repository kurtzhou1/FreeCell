import {dataJWTut} from '../../libs/common'

export const localStorageService = (dataJWT:dataJWTut) => {
    localStorage.setItem('accessToken',dataJWT.accessToken);
    localStorage.setItem('refreshToken',dataJWT.refreshToken);
    localStorage.setItem('tenant',dataJWT.tenant);
};