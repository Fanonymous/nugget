import { prodServers } from './environment.conf';
export const environment = {
    production: true,
    appMedia : prodServers.appMedia,
    appServerUrl: prodServers.appServerUrl,
    fileServerUrl: prodServers.fileServerUrl,
    requestTimeout: prodServers.requestTimeout,
    rsaPublicKey: prodServers.rsaPublicKey
};
