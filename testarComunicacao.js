require('dotenv').config();
const FiberHome = require('./src/controllers/fiberhome');
const unm = {
    host: process.env.EMS_HOST,
    port: process.env.EMS_PORT_TL1,
    login: process.env.EMS_LOGIN,
    senha: process.env.EMS_PASSWORD
};

(async () => {
    try {
        if (process.argv.length < 4)
            return console.error('Parâmetros insuficientes. Por favor informe: OLTID SLOT PON');

        const olt = {
            id: String(process.argv[2]),
            ponId: `NA-NA-${parseInt(process.argv[3])}-${parseInt(process.argv[4])}`
        }

        const fh = new FiberHome();
        await fh.conectar(unm.host, unm.port);
        await fh.efetuarLogin(unm.login, unm.senha);
        await fh.efetuarHandshake();

        olt.onusRegistradas = await fh.consultarOnusRegistradas({
            OLTID: olt.id,
            PONID: olt.ponId
        });

        let onusProcessadas = 0;
        loopOnus: for await (const onuRegistrada of olt.onusRegistradas) {
            if (onusProcessadas <= 5) {
                const onu = {
                    num: onuRegistrada['ONUNO'],
                    nome: onuRegistrada['NAME'],
                    mac: onuRegistrada['MAC'],
                    modelo: onuRegistrada['ONUTYPE'],
                    authType: onuRegistrada['AUTHTYPE']
                };

                await fh.consultarStatusOnu({
                    OLTID: olt.id,
                    PONID: olt.ponId,
                    AUTHTYPE: onu.authType,
                    ONUID: onu.mac
                });

                onusProcessadas += 1;

            } else {
                break loopOnus;
            }
        }

        await fh.efetuarLogout();
        await fh.desconectar();

    } catch (error) {
        console.error(error);

    } finally {
        process.exit(1);
    }
})();