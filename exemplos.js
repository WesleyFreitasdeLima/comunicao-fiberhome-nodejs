require("dotenv").config();
const FiberHome = require("./src/controllers/fiberhome");
const unm = {
  host: process.env.EMS_HOST,
  port: process.env.EMS_PORT_TL1,
  login: process.env.EMS_LOGIN,
  senha: process.env.EMS_PASSWORD,
};

(async () => {
  try {
    if (process.argv.length < 4)
      return console.error(
        "Parâmetros insuficientes. Por favor informe: OLTID SLOT PON"
      );

    const olt = {
      id: String(process.argv[2]),
      ponId: `NA-NA-${parseInt(process.argv[3])}-${parseInt(process.argv[4])}`,
    };

    const fh = new FiberHome();
    await fh.conectar(unm.host, unm.port);
    await fh.efetuarLogin(unm.login, unm.senha);
    await fh.efetuarHandshake();

    const onusRegistradas = await fh.consultarOnusRegistradas({
      OLTID: "10.0.16.2",
    });
    console.log(onusRegistradas);

    const onusNaoRegistradas = await fh.consultarOnusNaoRegistradas({
      OLTID: "10.0.16.2",
    });
    console.log(onusNaoRegistradas);

    const statusOnu = await fh.consultarStatusOnu({
      OLTID: "10.0.16.2",
      PONID: "NA-NA-7-8",
      AUTHTYPE: "MAC",
      ONUID: "FHTT92878b60",
    });
    console.log(statusOnu);

    const sinalOnu = await fh.consultarSinalOnu({
      OLTID: "10.0.16.2",
      PONID: "NA-NA-7-8",
      AUTHTYPE: "MAC",
      ONUID: "FHTT92878b60",
    });
    console.log(sinalOnu);

    const sinalOnu = await fh.consulta({
      OLTID: "10.0.16.2",
      PONID: "NA-NA-7-8",
      AUTHTYPE: "MAC",
      ONUID: "FHTT92878b60",
    });
    console.log(sinalOnu);

    const infoPortService = await fh.consultarPortServiceInfoOnu({
      OLTID: "10.0.16.2",
      PONID: "NA-NA-7-8",
      AUTHTYPE: "MAC",
      ONUID: "FHTT92878b60",
    });
    console.log(infoPortService);

    const infoLANPortOlt = await fh.consultarLANPortInfoOnuOlt({
      OLTID: "10.0.16.2",
    });
    console.log(infoLANPortOlt);

    const infoLANPortOnu = await fh.consultarLANPortInfoOnuOlt({
      OLTID: "10.0.16.2",
      PONID: "NA-NA-7-8",
      AUTHTYPE: "MAC",
      ONUID: "FHTT92878b60",
    });
    console.log(infoLANPortOnu);

    const wanServiceCfgUportOnu = await fh.consultarWanServiceCfgOnu({
      OLTID: "10.0.16.2",
      PONID: "NA-NA-7-8",
      AUTHTYPE: "MAC",
      ONUID: "FHTT92878b60",
      ONUPORT: "NA-NA-NA-1",
    });
    console.log(wanServiceCfgUportOnu);

    const wanServiceCfgSSIDOnu = await fh.consultarWanServiceCfgOnu({
      OLTID: "10.0.16.2",
      PONID: "NA-NA-7-8",
      AUTHTYPE: "MAC",
      ONUID: "FHTT92878b60",
      ONUPORT: "NA-NA-NA-101",
    });
    console.log(wanServiceCfgSSIDOnu);

    const voipServiceCfgOnu = await fh.consultarVoipServiceCfgOnu({
      OLTID: "10.0.16.2",
      PONID: "NA-NA-7-8",
      AUTHTYPE: "MAC",
      ONUID: "FHTT92878b60",
    });
    console.log(voipServiceCfgOnu);

    const voipPortCfgOnu = await fh.consultarVoipPortCfgOnu({
      OLTID: "10.0.16.2",
      PONID: "NA-NA-7-8",
      AUTHTYPE: "MAC",
      ONUID: "FHTT92878b60",
      ONUPORT: "NA-NA-NA-1",
    });
    console.log(voipPortCfgOnu);

    const removerWanServiceCfg = await fh.removerWanServiceCfgOnu(
      {
        OLTID: "10.0.16.2",
        PONID: "NA-NA-7-8",
        AUTHTYPE: "MAC",
        ONUID: "FHTT92878b60",
      },
      {
        MODE: 2,
        CONNTYPE: 2,
        VLAN: 3000,
        COS: 0,
        UPORT: 1,
      }
    );
    console.log(removerWanServiceCfg);

    const definirWanServiceCfgOnu = await fh.definirWanServiceCfgOnu(
      {
        OLTID: "10.0.16.2",
        PONID: "NA-NA-7-8",
        AUTHTYPE: "MAC",
        ONUID: "FHTT92878b60",
      },
      {
        MODE: 2,
        CONNTYPE: 2,
        VLAN: 3000,
        COS: 0,
        QOS: 2,
        NAT: 1,
        IPMODE: 3,
        PPPOEPROXY: 2,
        PPPOEUSER: `wesleylima64085`,
        PPPOEPASSWD: `d1a20d`,
        PPPOENAME: "",
        PPPOEMODE: 1,
        UPORT: 1,
      }
    );
    console.log(definirWanServiceCfgOnu);

    const ativarVoipPortOnu = await fh.ativarVoipPortOnu({
      OLTID: "10.0.16.2",
      PONID: "NA-NA-7-8",
      AUTHTYPE: "MAC",
      ONUID: "FHTT92878b60",
      ONUPORT: "NA-NA-NA-1",
    });
    console.log(ativarVoipPortOnu);

    const desativarVoipPortOnu = await fh.desativarVoipPortOnu({
      OLTID: "10.0.16.2",
      PONID: "NA-NA-7-8",
      AUTHTYPE: "MAC",
      ONUID: "FHTT92878b60",
      ONUPORT: "NA-NA-NA-1",
    });
    console.log(desativarVoipPortOnu);

    const definirVoipServiceConfigOnu = await fh.definirVoipServiceCfgOnu(
      {
        OLTID: "10.0.16.2",
        PONID: "NA-NA-7-8",
        AUTHTYPE: "MAC",
        ONUID: "FHTT92878b60",
        ONUPORT: "NA-NA-NA-1",
      },
      {
        PHONENUMBER: "1148509729",
        PT: "SIP",
        VOIPVLAN: 1002,
        MGCIP1: "8.8.8.8",
        SIPUSERNAME: "username",
        SIPUSERPWD: "password",
        IPMODE: "DHCP",
      }
    );
    console.log(definirVoipServiceConfigOnu);

    const modificarVoipServiceCodecCfgOnu = await fh.modificarVoipServiceCodecCfgOnu(
      {
        OLTID: "10.0.16.2",
        PONID: "NA-NA-7-8",
        AUTHTYPE: "MAC",
        ONUID: "FHTT92878b60",
        ONUPORT: "NA-NA-NA-1",
      },
      {
        VoiceCodeMode: "G.711A",
        FaxMode: "T.38",
        DTMFMode: "RFC2833",
      }
    );
    console.log(modificarVoipServiceCodecCfgOnu);

    const rebootOnu = await fh.reiniciarOnu(
      {
        OLTID: "10.0.16.2",
        PONID: "NA-NA-7-8",
        AUTHTYPE: "MAC",
        ONUID: "FHTT92878b60",
        PORTID: "NA-NA-NA-1",
      },
      { RESETTYPE: 1 }
    );
    console.log(rebootOnu);

    await fh.efetuarLogout();
    await fh.desconectar();
  } catch (error) {
    console.error(error);
  } finally {
    process.exit(1);
  }
})();
