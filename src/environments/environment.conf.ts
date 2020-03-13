// environment example file
// You should copy this file and rename to `environment.conf.ts` (do NOT add to version control)
// place your own config to that file
// const devBase = 'http://219.145.118.23:88/'

// const prodBase = 'http://219.145.118.23:88/'

// const devBase = 'http://119.3.228.197/'

// const prodBase = 'http://119.3.228.197/'

const devBase = 'http://192.168.1.46:8080/'

const prodBase = 'http://192.168.1.46:8080/'


const devServers = {
    appMedia : devBase,
    appServerUrl: devBase + 'iConductor-media/',
    fileServerUrl: devBase + 'iConductor-media/file/common/getFile?fileName=',
    requestTimeout: 6000 * 3,
    rsaPublicKey: 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCPzCRijQTW+fxen+IgGddcA+lQLQ9c3LdwKfR7CHK+LWQ1oMfkN69xoWOTs2Sk77vJ' +
        '86i/bn7jOmn6lQAqNndET80vhqFBV2r/0n0cZVke3vFZTVLd/hEfotIsRo4HbCPwK0UwA1LuuEsr7fqgHG1RKnK/SFLYBmgg85IE6PP8gwIDAQAB'
}

const prodServers = {
    appMedia : prodBase,
    appServerUrl : prodBase + 'iConductor-media/',
    fileServerUrl : prodBase + 'iConductor-media/file/common/getFile?fileName=',
    requestTimeout : 6000 * 3,
    rsaPublicKey: 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCPzCRijQTW+fxen+IgGddcA+lQLQ9c3LdwKfR7CHK+LWQ1oMfkN69xoWOTs2Sk77vJ' +
        '86i/bn7jOmn6lQAqNndET80vhqFBV2r/0n0cZVke3vFZTVLd/hEfotIsRo4HbCPwK0UwA1LuuEsr7fqgHG1RKnK/SFLYBmgg85IE6PP8gwIDAQAB'
};

export { devServers, prodServers }
