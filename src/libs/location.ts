export const local = ['localhost','127.0.0.1'];
export const localPort = ['3000','4200'];
export const isLocal = () => {
    console.log(`is Local Port: (${window.location.port}) = ${local.indexOf(window.location.port) > -1}`);
    return localPort.indexOf(window.location.port) > -1;
};
// export const routePath = isLocal() === true ? '/' : '/pfm/';
export const routePath = '/';