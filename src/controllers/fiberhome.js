const TL1 = require("./tl1");
const FiberHomeSchema = require("../schemas/fiberhome");

class FiberHome {
  constructor() {
    this.tl1 = new TL1();
  }

  /**
   * Conecta no servidor de gerência do FiberHome
   * @param {*} emsHost
   * @param {*} emsPortaTL1
   */
  conectar(host, portaTL1) {
    return new Promise(async (resolve, reject) => {
      try {
        await FiberHomeSchema.validarEmsConfig(host, portaTL1);
        await this.tl1.conectar(host, portaTL1);
        return resolve(true);
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Desconecta do servidor
   */
  desconectar() {
    return new Promise(async (resolve, reject) => {
      try {
        await this.tl1.desconectar();
        return resolve(true);
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Efetua o login no servidor do FiberHome
   * @param {*} emsLogin
   * @param {*} emsSenha
   */
  efetuarLogin(login, senha) {
    return new Promise(async (resolve, reject) => {
      try {
        await FiberHomeSchema.validarEmsLogin(login, senha);
        const stringDeComando = await this.tl1.montarStringDeComando(
          "LOGIN",
          "",
          { UN: login, PWD: senha }
        );
        const retornoString = await this.tl1.enviarComando(stringDeComando);
        return resolve(retornoString);
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Efetua o logout
   */
  efetuarLogout() {
    return new Promise(async (resolve, reject) => {
      try {
        const stringDeComando = await this.tl1.montarStringDeComando("LOGOUT");
        const retornoString = await this.tl1.enviarComando(stringDeComando);
        return resolve(retornoString);
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Libera o terminal do servidor para não encerrar a conexão mesmo estando ocioso por mais de 10 minutos
   */
  efetuarHandshake() {
    return new Promise(async (resolve, reject) => {
      try {
        const stringDeComando = await this.tl1.montarStringDeComando(
          "SHAKEHAND"
        );
        const retornoString = await this.tl1.enviarComando(stringDeComando);
        return resolve(retornoString);
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Consulta as ONU's registradas de uma OLT
   *
   * LST-ONUWANSERVICECFG::OLTID=olt_name[,PONID=ponport_location,ONUIDTYPE=id-type,ONUID=onu_index][,ONUPORT=port-id]:CTAG::;
   *
   * @param {*} OLTID
   * @param {*} PONID
   * @param {*} AUTHTYPE
   * @param {*} ONUID
   */
  consultarOnusRegistradas({ ...params }) {
    return new Promise(async (resolve, reject) => {
      try {
        await FiberHomeSchema.validarOnuInfo(params);
        const stringDeComando = await this.tl1.montarStringDeComando(
          "LST-ONU",
          params
        );
        const retornoArray = await this.tl1.enviarComandoConsulta(
          stringDeComando
        );
        return resolve(retornoArray);
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Consulta as ONU's não registradas de uma OLT
   *
   * LST-UNREGONU::OLTID=olt-name,PONID=pon_name:CTAG::;
   *
   * @param {*} OLTID
   * @param {*} PONID
   */
  consultarOnusNaoRegistradas({ ...params }) {
    return new Promise(async (resolve, reject) => {
      try {
        await FiberHomeSchema.validarOnuInfo(params);
        const stringDeComando = await this.tl1.montarStringDeComando(
          "LST-UNREGONU",
          params
        );
        const retornoArray = await this.tl1.enviarComandoConsulta(
          stringDeComando
        );
        return resolve(retornoArray);
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Consulta o status de uma ONU
   *
   * LST-ONUSTATE::OLTID=olt-name,PONID=ponport_location[,ONUIDTYPE=id-type,ONUID=onu-index]:CTAG::;
   *
   * @param {*} OLTID
   * @param {*} PONID
   * @param {*} AUTHTYPE
   * @param {*} ONUID
   */
  consultarStatusOnu({ ...params }) {
    return new Promise(async (resolve, reject) => {
      try {
        await FiberHomeSchema.validarOnuInfo(params);
        const stringDeComando = await this.tl1.montarStringDeComando(
          "LST-ONUSTATE",
          params
        );
        const retornoArray = await this.tl1.enviarComandoConsulta(
          stringDeComando
        );
        return resolve(retornoArray);
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Consulta o sinal de uma ONU
   *
   * LST-OMDDM::ONUIP=OLTID=olt-name[,PONID=ponport_location][,ONUIDTYPE=id-type,ONUID=onu-index][,PORTID=lanport_index][,PEERFLAG=flag]:CTAG::;
   *
   * @param {*} OLTID
   * @param {*} PONID
   * @param {*} AUTHTYPE
   * @param {*} ONUID
   *
   */
  consultarSinalOnu({ ...params }) {
    return new Promise(async (resolve, reject) => {
      try {
        await FiberHomeSchema.validarOnuInfo(params);
        const stringDeComando = await this.tl1.montarStringDeComando(
          "LST-OMDDM",
          params
        );
        const retornoArray = await this.tl1.enviarComandoConsulta(
          stringDeComando
        );
        return resolve(retornoArray);
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Consulta o serviços configurados por VLAN
   *
   * LST-SERVICEPORT::OLTID=olt-name:CTAG::[VLAN=cvlan,][SVLAN=svlan,][PORTTYPE=porttype];;
   *
   * @param {*} OLTID
   * @param {*} PONID
   * @param {*} AUTHTYPE
   * @param {*} ONUID
   * @param {*} VLAN
   * @param {*} SVLAN
   * @param {*} PORTTYPE
   */
  consultarVLANServicePortOnu({ ...params }, { ...CTAG }) {
    return new Promise(async (resolve, reject) => {
      try {
        await FiberHomeSchema.validarOnuInfo(params);
        const stringDeComando = await this.tl1.montarStringDeComando(
          "LST-SERVICEPORT",
          params,
          CTAG
        );
        const retornoArray = await this.tl1.enviarComandoConsulta(
          stringDeComando
        );
        return resolve(retornoArray);
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Consulta as informações de Port Service de uma ONU
   *
   * LST-ONUSERVICESTATUS::ONUIP=OLTID=oltname,PONID=ponport_location,ONUIDTYPE=onuid-type,ONUID=onu-index:CTAG::;
   *
   * @param {*} OLTID
   * @param {*} PONID
   * @param {*} AUTHTYPE
   * @param {*} ONUID
   *
   */
  consultarPortServiceInfoOnu({ ...params }) {
    return new Promise(async (resolve, reject) => {
      try {
        await FiberHomeSchema.validarOnuInfo(params);
        const stringDeComando = await this.tl1.montarStringDeComando(
          "LST-ONUSERVICESTATUS",
          params
        );
        const retornoArray = await this.tl1.enviarComandoConsulta(
          stringDeComando
        );
        return resolve(retornoArray);
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Consulta as informações de LAN Port de uma ONU ou OLT
   *
   * LST-LANPORT::ONUIP=(OLTID=olt-name[,PONID=ponport_location,ONUIDTYPE=onuid-type,ONUID=onu-index])[,PORTID=port_index]:CTAG::;
   *
   * @param {*} OLTID
   * @param {*} PONID
   * @param {*} AUTHTYPE
   * @param {*} ONUID
   * @param {*} ONUPORT
   *
   */
  consultarLANPortInfoOnuOlt({ ...params }) {
    return new Promise(async (resolve, reject) => {
      try {
        await FiberHomeSchema.validarOnuInfo(params);
        const stringDeComando = await this.tl1.montarStringDeComando(
          "LST-LANPORT",
          params
        );
        const retornoArray = await this.tl1.enviarComandoConsulta(
          stringDeComando
        );
        return resolve(retornoArray);
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Consulta as configurações de Wan Service de uma ONU
   *
   * LST-ONUWANSERVICECFG::OLTID=olt_name[,PONID=ponport_location,ONUIDTYPE=id-type,ONUID=onu_index][,ONUPORT=port-id]:CTAG::;
   *
   * @param {*} OLTID
   * @param {*} PONID
   * @param {*} AUTHTYPE
   * @param {*} ONUID
   * @param {*} ONUPORT
   *
   */
  consultarWanServiceCfgOnu({ ...params }) {
    return new Promise(async (resolve, reject) => {
      try {
        await FiberHomeSchema.validarOnuInfo(params);
        const stringDeComando = await this.tl1.montarStringDeComando(
          "LST-ONUWANSERVICECFG",
          params
        );
        const retornoArray = await this.tl1.enviarComandoConsulta(
          stringDeComando
        );
        return resolve(retornoArray);
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Consulta as configurações de Voice Service de uma ONU
   *
   * LST-MG::ONUIP=(OLTID=olt-name,PONID=ponport_location,ONUIDTYPE=idtype,ONUID=onu-index):CTAG::;
   *
   * @param {*} OLTID
   * @param {*} PONID
   * @param {*} AUTHTYPE
   * @param {*} ONUID
   *
   */
  consultarVoipServiceCfgOnu({ ...params }) {
    return new Promise(async (resolve, reject) => {
      try {
        await FiberHomeSchema.validarOnuInfo(params);
        const stringDeComando = await this.tl1.montarStringDeComando(
          "LST-MG",
          params
        );
        const retornoArray = await this.tl1.enviarComandoConsulta(
          stringDeComando
        );
        return resolve(retornoArray);
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Consulta as configurações de Voice Port de uma ONU
   *
   * LST-ONUWANSERVICECFG::OLTID=olt_name[,PONID=ponport_location,ONUIDTYPE=id-type,ONUID=onu_index][,ONUPORT=port-id]:CTAG::;
   * @param {*} OLTID
   * @param {*} PONID
   * @param {*} AUTHTYPE
   * @param {*} ONUID
   * @param {*} ONUPORT
   */
  consultarVoipPortCfgOnu({ ...params }) {
    return new Promise(async (resolve, reject) => {
      try {
        await FiberHomeSchema.validarOnuInfo(params);
        const stringDeComando = await this.tl1.montarStringDeComando(
          "LST-POTS",
          params
        );
        const retornoArray = await this.tl1.enviarComandoConsulta(
          stringDeComando
        );
        return resolve(retornoArray);
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Define as configurações de Wan Service de uma ONU
   * SET-WANSERVICE::ONUIP=onu-name|OLTID=olt-name[,PONID=ponport_location,ONUIDTYPE=onuid-type,ONUID=onu-index]:CTAG::STATUS=1,MODE=mode,CONNTYPE=connecttype[,VLAN=vlan][,COS=cos][,QOS=qos][,NAT=nat[,IPMODE=ipmode][,WANIP=wanip,WANMASK=mask,WANGATEWAY=gateway,MASTERDNS=maskdns,SLAVEDNS=slavedns][[,PPPOEPROXY=proxy],PPPOEUSER=pppoeusername,PPPOEPASSWD=pppoepassword,PPPOENAME=pppoename[,PPPOEMODE=pppoemode]]],[UPORT=uport,SSID=ssidno,WANSVC=1];
   * @param {*} OLTID
   * @param {*} PONID
   * @param {*} AUTHTYPE
   * @param {*} ONUID
   * @param {*} MODE
   * @param {*} CONNTYPE
   * @param {*} VLAN
   * @param {*} COS
   * @param {*} QOS
   * @param {*} NAT
   * @param {*} IPMODE
   * @param {*} WANIP
   * @param {*} WANMASK
   * @param {*} WANGATEWAY
   * @param {*} MASTERDNS
   * @param {*} SLAVEDNS
   * @param {*} PPPOEPROXY
   * @param {*} PPPOEUSER
   * @param {*} PPPOEPASSWD
   * @param {*} PPPOENAME
   * @param {*} PPPOEMODE
   * @param {*} UPORT
   * @param {*} SSID
   */
  definirWanServiceCfgOnu({ ...params }, { ...CTAG }) {
    return new Promise(async (resolve, reject) => {
      try {
        await FiberHomeSchema.validarOnuInfo(params);
        await FiberHomeSchema.validarCTAGWanServiceCfg(CTAG);
        const stringDeComando = await this.tl1.montarStringDeComando(
          "SET-WANSERVICE",
          params,
          Object.assign({ STATUS: 1 }, CTAG)
        );
        const retornoString = await this.tl1.enviarComando(stringDeComando);
        return resolve(retornoString);
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Remove as configurações de Wan Service de uma ONU
   * SET-WANSERVICE::OLTID=olt-name[,PONID=ponport_location,ONUIDTYPE=onuid-type,ONUID=onu-index]:CTAG::STATUS=2,MODE=mode,CONNTYPE=connecttype,VLAN=vlan,COS=cos,UPORT=uport;
   * @param {*} OLTID
   * @param {*} PONID
   * @param {*} AUTHTYPE
   * @param {*} ONUID
   * @param {*} MODE
   * @param {*} CONNTYPE
   * @param {*} VLAN
   * @param {*} COS
   * @param {*} UPORT
   */
  removerWanServiceCfgOnu({ ...params }, { ...CTAG }) {
    return new Promise(async (resolve, reject) => {
      try {
        await FiberHomeSchema.validarOnuInfo(params);
        await FiberHomeSchema.validarCTAGWanServiceCfg(CTAG);
        const stringDeComando = await this.tl1.montarStringDeComando(
          "SET-WANSERVICE",
          params,
          Object.assign({ STATUS: 2 }, CTAG)
        );
        const retornoString = await this.tl1.enviarComando(stringDeComando);
        return resolve(retornoString);
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Ativa uma Voip Port de uma Onu
   *
   * ACT-VOIPPORT::ONUIP=onu-name|[OLTID=olt-name,PONID=ponport_location,ONUIDTYPE=onuid-type,ONUID=onu-index],ONUPORT=onu-port:CTAG::;
   * @param {*} OLTID
   * @param {*} PONID
   * @param {*} AUTHTYPE
   * @param {*} ONUID
   * @param {*} ONUPORT
   */
  ativarVoipPortOnu({ ...params }) {
    return new Promise(async (resolve, reject) => {
      try {
        await FiberHomeSchema.validarOnuInfo(params);
        const stringDeComando = await this.tl1.montarStringDeComando(
          "ACT-VOIPPORT",
          params
        );
        const retornoString = await this.tl1.enviarComando(stringDeComando);
        return resolve(retornoString);
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Desativa uma Voip Port de uma Onu
   *
   * ACT-VOIPPORT::ONUIP=onu-name|[OLTID=olt-name,PONID=ponport_location,ONUIDTYPE=onuid-type,ONUID=onu-index],ONUPORT=onu-port:CTAG::;
   * @param {*} OLTID
   * @param {*} PONID
   * @param {*} AUTHTYPE
   * @param {*} ONUID
   * @param {*} ONUPORT
   */
  desativarVoipPortOnu({ ...params }) {
    return new Promise(async (resolve, reject) => {
      try {
        await FiberHomeSchema.validarOnuInfo(params);
        const stringDeComando = await this.tl1.montarStringDeComando(
          "DACT-VOIPPORT",
          params
        );
        const retornoString = await this.tl1.enviarComando(stringDeComando);
        return resolve(retornoString);
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Define as configurações de Voip Service de uma Onu
   *
   * CFG-VOIPSERVICE::ONUIP=onu-name|[OLTID=olt-name,PONID=ponport_location,ONUIDTYPE=onuid-type,ONUID=onu-index],ONUPORT=onu-port:CTAG::[PHONENUMBER=phonenumber][,PT=protocoltype][,SLVAN=voipoutervlan][,VOIPVLAN=voipinnervlan][,SCOS=outerqos][,CCOS=innerqos][,EID=equipmentid][TID=Terminal-ID][SIPREGDM=sipregisterdomain][,SIPUSERNAME=sipusername][,SIPUSERPWD=sipuserpassword][MGCIP1=activebacip][,MGCIP2=standbybacip][,IPMODE=ipmode][,IP=ipaddress,IPMASK=ipmask,IPGATEWAY=ipgateway][,PPPOEUSER=pppoeuser,PPPOEPWD=pppoepassword]，VOICECODEC=voice;
   * @param {*} OLTID
   * @param {*} PONID
   * @param {*} AUTHTYPE
   * @param {*} ONUID
   * @param {*} ONUPORT
   */
  definirVoipServiceCfgOnu({ ...params }, { ...CTAG }) {
    return new Promise(async (resolve, reject) => {
      try {
        await FiberHomeSchema.validarOnuInfo(params);
        await FiberHomeSchema.validarCTAGVoipServiceCfg(CTAG);
        const stringDeComando = await this.tl1.montarStringDeComando(
          "CFG-VOIPSERVICE",
          params,
          CTAG
        );
        const retornoString = await this.tl1.enviarComando(stringDeComando);
        return resolve(retornoString);
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Modifica as configurações de Voip Service de uma Onu
   * @param {*} OLTID
   * @param {*} PONID
   * @param {*} AUTHTYPE
   * @param {*} ONUID
   * @param {*} ONUPORT
   * @param {*} VoiceCodeMode
   * @param {*} FaxMode
   * @param {*} SlienceSwitch
   * @param {*} EchoCancel
   * @param {*} InputGain
   * @param {*} OutputGain
   * @param {*} DTMFMode
   */
  modificarVoipServiceCodecCfgOnu({ ...params }, { ...CTAG }) {
    return new Promise(async (resolve, reject) => {
      try {
        await FiberHomeSchema.validarOnuInfo(params);
        await FiberHomeSchema.validarCTAGCodecVoipServiceCfg(CTAG);
        const stringDeComando = await this.tl1.montarStringDeComando(
          "MODIFY-ONUVOICESERVICEPARAM",
          params,
          CTAG
        );
        const retornoString = await this.tl1.enviarComando(stringDeComando);
        return resolve(retornoString);
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Remove as configurações de Voip Service de uma Voip Port de uma Onu
   * @param {*} OLTID
   * @param {*} PONID
   * @param {*} AUTHTYPE
   * @param {*} ONUID
   * @param {*} ONUPORT
   */
  removerVoipServiceCfgOnu({ ...params }) {
    return new Promise(async (resolve, reject) => {
      try {
        await FiberHomeSchema.validarOnuInfo(params);
        const stringDeComando = await this.tl1.montarStringDeComando(
          "DEL-VOIPSERVICE",
          params
        );
        const retornoString = await this.tl1.enviarComando(stringDeComando);
        return resolve(retornoString);
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Reinicia a ONU
   *
   * RESET-ONU::OLTID=olt_name[,PONID=ponport_location,ONUIDTYPE=id-type,ONUID=onu_index][,portid=port-id]:CTAG::[RESETTYPE=resettype];
   *
   * @param {*} OLTID
   * @param {*} PONID
   * @param {*} AUTHTYPE
   * @param {*} ONUID
   * @param {*} PORTID
   * @param {*} RESETTYPE
   */
  reiniciarOnu({ ...params }, { ...CTAG }) {
    return new Promise(async (resolve, reject) => {
      try {
        await FiberHomeSchema.validarOnuInfo(params);
        await FiberHomeSchema.validarCTAGReiniciarOnu(CTAG);
        const stringDeComando = await this.tl1.montarStringDeComando(
          "RESET-ONU",
          params,
          CTAG
        );
        const retornoString = await this.tl1.enviarComando(
          stringDeComando,
          90 * 1000
        );
        return resolve(retornoString);
      } catch (error) {
        return reject(error);
      }
    });
  }
}

module.exports = FiberHome;
