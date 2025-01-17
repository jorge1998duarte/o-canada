import React, { useContext, useEffect, useState } from "react";
import InputNumber from "../../singles/InputNumber";
import calculoIMC from "../../helpers/calculoIMC";
import ToMayus from "../../helpers/ToMayus";
import moment from "moment";
import { InputGroup } from "react-bootstrap";
import AlertError from "../../singles/AlertError";
import pruebasFisicasContext from "../../context/pruebas_fisicas/pruebasFisicasContext";
import SelectSiNo from "../../singles/SelectSiNo";
import AlertExito from "../../singles/AlertExito";
import AlertaSiguiente from "../../singles/AlertaSiguiente";
import { size, isEmpty } from "lodash";
import { validarExtPdf } from "../../helpers/validarExtPDF";
import { postUploadFile } from "../../services/files/FilesService";
import { postStatesEvaluation } from "../../services/states/StatesService";
const S9_S10 = (props) => {

  const regex =
    /((^[0-9]{0}$)|(^[0-9]{1}$)|(^[0-9]{2}$)|(^[0-9]{2}\.[0-9]$)|(^[0-9]{3}$)|(^[0-9]{3}\.[0-9]$))/gm;

  const pruebasContext = useContext(pruebasFisicasContext);

  const [archivos, setArchivos] = useState({
    formato: null,
    formato_carrera: null,
    formato_epp: null,
    formato_eval_habilidad_uso_mark_III: null,
    formato_eval_habilidad_uso_gps: null,
    formato_eval_habilidad_uso_avenza_maps: null,
    formato_eval_habilidad_uso_motosierra: null,
    constancia_curso_s_211: null,
  });

  /* SECCIONES */
  const [sectionGPSMark, setSectionGPSMark] = useState(
    props.enable ? true : false
  );
  const [sectionEPP, setSectionEPP] = useState(props.enable ? true : false);
  const [sectionPruebaFisica, setSectionPruebaFisica] = useState(
    props.enable ? true : false
  );
  const [sePresento, setSePresento] = useState(0);

  const [evaluaciones, setEvaluaciones] = useState({
    curp: props.infoCandidato.curp,
    nombre_evaluador: props.infoCandidato.nombre_evaluador
      ? props.infoCandidato.nombre_evaluador
      : "",
    peso_verificado: props.infoCandidato.peso_verificado
      ? props.infoCandidato.peso_verificado
      : "",
    altura_verificada: props.infoCandidato.altura_verificada
      ? props.infoCandidato.altura_verificada
      : "",
    imc_verificado: props.infoCandidato.imc_verificado
      ? props.infoCandidato.imc_verificado
      : "",
    altura_sobre_niv_mar: props.infoCandidato.altura_sobre_niv_mar
      ? props.infoCandidato.altura_sobre_niv_mar
      : "",
    tiempo_max_correccion_altitud: props.infoCandidato
      .tiempo_max_correccion_altitud
      ? props.infoCandidato.tiempo_max_correccion_altitud
      : "",
    minutos_prueba_trabajo_arduo: props.infoCandidato
      .minutos_prueba_trabajo_arduo
      ? props.infoCandidato.minutos_prueba_trabajo_arduo
      : "",
    segundos_prueba_trabajo_arduo: props.infoCandidato
      .segundos_prueba_trabajo_arduo
      ? props.infoCandidato.segundos_prueba_trabajo_arduo
      : "",
    puntuacion_estimada: props.infoCandidato.puntuacion_estimada
      ? props.infoCandidato.puntuacion_estimada
      : "",
    prueba: props.infoCandidato.prueba ? props.infoCandidato.prueba : "",
    nombre_evaluador_carrera: props.infoCandidato.nombre_evaluador_carrera
      ? props.infoCandidato.nombre_evaluador_carrera
      : "",
    minutos_prueba_trabajo_carrera: props.infoCandidato
      .minutos_prueba_trabajo_carrera
      ? props.infoCandidato.minutos_prueba_trabajo_carrera
      : "",
    segundos_prueba_trabajo_carrera: props.infoCandidato
      .segundos_prueba_trabajo_carrera
      ? props.infoCandidato.segundos_prueba_trabajo_carrera
      : "",
    puntuacion_estimada_prueba_carrera: props.infoCandidato
      .puntuacion_estimada_prueba_carrera
      ? props.infoCandidato.puntuacion_estimada_prueba_carrera
      : "",
    nombre_evaluador_prueba_gps: props.infoCandidato.nombre_evaluador_prueba_gps
      ? props.infoCandidato.nombre_evaluador_prueba_gps
      : "",
    resultado_eval_presencial_gps: props.infoCandidato
      .resultado_eval_presencial_gps
      ? props.infoCandidato.resultado_eval_presencial_gps
      : "",
    nombre_evaluador_prueba_avenza_maps: props.infoCandidato
      .nombre_evaluador_prueba_avenza_maps
      ? props.infoCandidato.nombre_evaluador_prueba_avenza_maps
      : "",
    resultado_eval_presencial_avenza_maps: props.infoCandidato
      .resultado_eval_presencial_avenza_maps
      ? props.infoCandidato.resultado_eval_presencial_avenza_maps
      : "",
    nombre_evaluador_prueba_mark_III: props.infoCandidato
      .nombre_evaluador_prueba_mark_III
      ? props.infoCandidato.nombre_evaluador_prueba_mark_III
      : "",
    resultado_eval_presencial_mark_III: props.infoCandidato
      .resultado_eval_presencial_mark_III
      ? props.infoCandidato.resultado_eval_presencial_mark_III
      : "",
    presento_equipo: props.infoCandidato.presento_equipo
      ? props.infoCandidato.presento_equipo
      : "",
    rechazo: props.infoCandidato.rechazo ? props.infoCandidato.rechazo : "",
  });

  const setInfo = (input) => {
    if (
      input.target.name === "formato" ||
      input.target.name === "formato_carrera" ||
      input.target.name === "formato_eval_habilidad_uso_mark_III" ||
      input.target.name === "formato_eval_habilidad_uso_motosierra" ||
      input.target.name === "constancia_curso_s_211" ||
      input.target.name === "formato_epp" ||
      input.target.name === "formato_eval_habilidad_uso_gps" ||
      input.target.name === "formato_eval_habilidad_uso_avenza_maps"
    ) {
      if (input.target.files.length === 1) {
        setArchivos({
          ...archivos,
          [input.target.name]: validarExtPdf(
            input.target.files[0].name,
            input.target.accept
          )
            ? input.target.files
            : AlertError(
              "Error:",
              `El archivo con la extensión no esta permitido .${input.target.files[0].name
                .split(".")
                .pop()}`
            ),
        });
      } else {
        setArchivos({
          ...archivos,
          [input.target.name]: null,
        });
      }
    } else {
      if (input.target.name === "altura_verificada") {
        input.target.value = Math.floor(input.target.value);
      }
      setEvaluaciones({
        ...evaluaciones,
        [input.target.name]: input.target.value,
      });
    }
  };

  const setNumericoRango = (input) => {
    if (
      parseInt(input.target.min) === 0 &&
      typeof input.target.max === "undefined"
    ) {
      setEvaluaciones({
        ...evaluaciones,
        [input.target.name]: input.target.value,
      });
    } else if (parseInt(input.target.value) <= input.target.max) {
      setEvaluaciones({
        ...evaluaciones,
        [input.target.name]: input.target.value,
      });
    } else if (isEmpty(input.target.value)) {
      setEvaluaciones({
        ...evaluaciones,
        [input.target.name]: "",
      });
    }
  };

  const calculoTiempoMax = (asnm) => {
    /* asnm => Altura sobre el nivel del mar */
    if (asnm) {
      if (asnm < 1200) {
        setEvaluaciones({
          ...evaluaciones,
          tiempo_req_max_min: 45,
          tiempo_req_mas_seg: "00",
        });
      }

      if (asnm >= 1200 && asnm <= 1500) {
        setEvaluaciones({
          ...evaluaciones,
          tiempo_req_max_min: 45,
          tiempo_req_mas_seg: 30,
        });
      }

      if (asnm > 1500 && asnm <= 1800) {
        setEvaluaciones({
          ...evaluaciones,
          tiempo_req_max_min: 45,
          tiempo_req_mas_seg: 45,
        });
      }

      if (asnm > 1800 && asnm <= 2100) {
        setEvaluaciones({
          ...evaluaciones,
          tiempo_req_max_min: 46,
          tiempo_req_mas_seg: "00",
        });
      }

      if (asnm > 2100 && asnm <= 2400) {
        setEvaluaciones({
          ...evaluaciones,
          tiempo_req_max_min: 46,
          tiempo_req_mas_seg: 15,
        });
      }

      if (asnm > 2400) {
        setEvaluaciones({
          ...evaluaciones,
          tiempo_req_max_min: 46,
          tiempo_req_mas_seg: 30,
        });
      }
    } else {
      setEvaluaciones({
        ...evaluaciones,
        tiempo_req_max_min: "",
        tiempo_req_mas_seg: "",
      });
    }
  };

  const handleEPP = (input) => {
    const presento_equipo = input.target.value;
    // const { presento_equipo } = evaluaciones
    if (presento_equipo === "1") {
      setSectionGPSMark(true);
      setEvaluaciones({
        ...evaluaciones,
        rechazo: null,
      });
    } else {
      setEvaluaciones({
        ...evaluaciones,
        rechazo: "no presento equipo completo",
      });
      setSectionGPSMark(false);
    }
  };

  const handlePresento = (input) => {
    const auxiliar = input.target.value;
    setSePresento(auxiliar);

    if (auxiliar === "0") {
      setEvaluaciones({
        ...evaluaciones,
        rechazo: "no se presento el candidato",
      });
    } else {
      setEvaluaciones({
        ...evaluaciones,
        rechazo: null,
      });
    }
  };

  const handleASNM = () => {
    const { altura_sobre_niv_mar } = evaluaciones;
    calculoTiempoMax(altura_sobre_niv_mar);
  };

  const handleIMC = () => {
    const { altura_verificada, peso_verificado } = evaluaciones;
    if (altura_verificada && peso_verificado) {
      const imc = calculoIMC(altura_verificada, peso_verificado);
      if (imc <= 29.99) {
        setSectionPruebaFisica(true);
        setEvaluaciones({
          ...evaluaciones,
          imc_verificado: imc.toString().slice(0, 5),
          rechazo: null,
        });
      } else {
        /* SET RECHAZO POR IMC */
        setEvaluaciones({
          ...evaluaciones,
          imc_verificado: imc.toString().slice(0, 5),
          rechazo: "imc verificado mayor a 29.99",
        });
        setSectionPruebaFisica(false);
        setSectionEPP(false);
        setSectionGPSMark(false);
      }
    }
  };

  const calcResultados = () => {
    const { minutos_prueba_trabajo_arduo, segundos_prueba_trabajo_arduo } =
      evaluaciones;

    if (minutos_prueba_trabajo_arduo && segundos_prueba_trabajo_arduo) {
      const auxPrueba = calificacionPrueba(
        minutos_prueba_trabajo_arduo,
        segundos_prueba_trabajo_arduo
      );
      const rechazo =
        auxPrueba === "SUPERADA" ? null : "prueba fisica no superada";

      /* SI NO ES RECHAZADO SE ABRE SECCION DE EQUIPO DE PROTECCION */
      if (rechazo) {
        setSectionEPP(false);
        setSectionGPSMark(false);
      } else {
        setSectionEPP(true);
      }
      setEvaluaciones({
        ...evaluaciones,
        puntuacion_estimada: puntajePrueba(
          minutos_prueba_trabajo_arduo,
          segundos_prueba_trabajo_arduo
        ),
        prueba: calificacionPrueba(
          minutos_prueba_trabajo_arduo,
          segundos_prueba_trabajo_arduo
        ),
        rechazo: rechazo,
      });
    } else {
      setEvaluaciones({
        ...evaluaciones,
        puntuacion_estimada: "",
        prueba: "",
      });
    }
  };

  const puntajePrueba = (minutos, segundos) => {
    const tiempo = moment(`${minutos}:${segundos}`, "mm:ss");
    const primerCaso = moment(`35:00`, "mm:ss");
    const segundoCaso = moment(`40:00`, "mm:ss");
    const tercerCaso = moment(`46:30`, "mm:ss");

    if (calificacionPrueba(minutos, segundos) === "SUPERADA") {
      if (tiempo <= primerCaso) {
        return "100";
      }
      if (tiempo > primerCaso && tiempo <= segundoCaso) {
        return "95";
      }
      if (tiempo > segundoCaso && tiempo <= tercerCaso) {
        return "90";
      }
    } else {
      return "0";
    }
  };

  const calificacionPrueba = (minutos, segundos) => {
    const { tiempo_req_max_min, tiempo_req_mas_seg } = evaluaciones;

    const tiempo = moment(`${minutos}:${segundos}`, "mm:ss");
    // const primerCaso = moment(`35:00`, 'mm:ss')
    // const segundoCaso = moment(`40:00`, 'mm:ss')
    // const tercerCaso = moment(`46:30`, 'mm:ss')

    const tiempoMaxRequerido = moment(
      `${tiempo_req_max_min}:${tiempo_req_mas_seg}`,
      "mm:ss"
    );

    return tiempo <= tiempoMaxRequerido ? "SUPERADA" : "NO SUPERADA";
  };

  const handlePuntuacion = () => {
    const { minutos_prueba_trabajo_carrera, segundos_prueba_trabajo_carrera } =
      evaluaciones;
    const time = parseInt(
      `${minutos_prueba_trabajo_carrera}${segundos_prueba_trabajo_carrera}`
    );

    if (minutos_prueba_trabajo_carrera && segundos_prueba_trabajo_carrera) {
      if (time <= 1035) {
        setEvaluaciones({
          ...evaluaciones,
          puntuacion_estimada_prueba_carrera: 10,
        });
      } else if (time >= 1036 && time <= 1130) {
        setEvaluaciones({
          ...evaluaciones,
          puntuacion_estimada_prueba_carrera: 9,
        });
      } else if (time >= 1131 && time <= 1300) {
        setEvaluaciones({
          ...evaluaciones,
          puntuacion_estimada_prueba_carrera: 7,
        });
      } else if (time >= 1301 && time <= 1500) {
        setEvaluaciones({
          ...evaluaciones,
          puntuacion_estimada_prueba_carrera: 6,
        });
      } else if (time >= 1501) {
        setEvaluaciones({
          ...evaluaciones,
          puntuacion_estimada_prueba_carrera: 2,
        });
      }
    } else {
      setEvaluaciones({
        ...evaluaciones,
        puntuacion_estimada_prueba_carrera: "",
      });
    }
  };

  const setNumerico = (input) => {
    if (input.target.name === "altura_verificada") {
      if (size(input.target.value) < 4) {
        setEvaluaciones({
          ...evaluaciones,
          [input.target.name]: parseInt(
            input.target.value
          ) /* TRANSFORMACION A ENTERO */,
        });
      }
    }

    if (input.target.name === "peso_verificado") {
      const result = input.target.value.match(regex);

      if (result) {
        setEvaluaciones({
          ...evaluaciones,
          [input.target.name]: parseFloat(
            input.target.value
          ) /* TRANSFORMACION A FLOTANTE */,
        });
      }
    }
  };
  const revisarInformacion = () => {
    const {
      nombre_evaluador,
      peso_verificado,
      altura_verificada,
      imc_verificado,
      altura_sobre_niv_mar,
      minutos_prueba_trabajo_arduo,
      segundos_prueba_trabajo_arduo,
      nombre_evaluador_prueba_gps,
      resultado_eval_presencial_gps,
      nombre_evaluador_prueba_avenza_maps,
      resultado_eval_presencial_avenza_maps,
      nombre_evaluador_prueba_mark_III,
      resultado_eval_presencial_mark_III,
      presento_equipo,
      porcentaje_gps,
      porcentaje_avenza_maps,
      porcentaje_mark_III,
      nombre_evaluador_carrera,
      minutos_prueba_trabajo_carrera,
      segundos_prueba_trabajo_carrera,
      resultado_eval_presencial_motosierra,
      nombre_evaluador_prueba_motosierra,
      porcentaje_motosierra,
      rechazo,
    } = evaluaciones;

    if(rechazo){
      AlertaSiguiente(
        `El candidato será rechazado: ${rechazo}`,
        sendData()
      );
      return;
    }

    const {
      formato,
      formato_eval_habilidad_uso_gps,
      formato_eval_habilidad_uso_avenza_maps,
      formato_eval_habilidad_uso_mark_III,
      formato_epp,
      formato_eval_habilidad_uso_motosierra,
    } = archivos;

    if (!sePresento) {
      AlertError("Omisión de campo", "Debe de seleccionar SI o No");
      return;
    } else {
      if (!nombre_evaluador) {
        AlertError(
          "Omisión de campo",
          "El campo NOMBRE DEL EVALUADOR debe ser completado"
        );
        return;
      }

      if (!peso_verificado) {
        AlertError(
          "Omisión de campo",
          "El campo PESO VERIFICADO debe ser completado"
        );
        return;
      }

      if (!altura_verificada) {
        AlertError(
          "Omisión de campo",
          "El campo ALTURA VERIFICADA debe ser completado"
        );
        return;
      }

      if (!imc_verificado) {
        AlertError(
          "Omisión de campo",
          "El campo IMC VERIFICADO debe ser completado"
        );
        return;
      }

      if (sectionPruebaFisica) {
        if (!altura_sobre_niv_mar) {
          AlertError(
            "Omisión de campo",
            "El campo ALTURA SOBRE NIVEL DEL MAR debe ser completado"
          );
          return;
        }
        if (!minutos_prueba_trabajo_arduo) {
          AlertError(
            "Omisión de campo",
            "El campo MINUTOS PRUEBA TRABAJO ARDUO debe ser completado"
          );
          return;
        }
        if (!segundos_prueba_trabajo_arduo) {
          AlertError(
            "Omisión de campo",
            "El campo SEGUNDOS PRUEBA TRABAJO ARDUO debe ser completado"
          );
          return;
        }

        if (!formato) {
          AlertError(
            "Omisión de campo",
            "El archivo FORMATO debe ser completado"
          );
          return;
        }

        if (
          calificacionPrueba(
            minutos_prueba_trabajo_arduo,
            segundos_prueba_trabajo_arduo
          ) === "SUPERADA"
        ) {
          if (!nombre_evaluador_carrera) {
            AlertError(
              "Omisión de campo",
              "El campo NOMBRE DEL EVALUADOR CARRERA debe ser completado"
            );
            return;
          }

          if (!minutos_prueba_trabajo_carrera) {
            AlertError(
              "Omisión de campo",
              "El campo MINUTOS PRUEBA TRABAJO CARRERA debe ser completado"
            );
            return;
          }
          if (!segundos_prueba_trabajo_carrera) {
            AlertError(
              "Omisión de campo",
              "El campo SEGUNDOS PRUEBA TRABAJO CARRERA debe ser completado"
            );
            return;
          }
        }
      }
      if (sectionEPP) {
        if (!presento_equipo) {
          AlertError(
            "ERROR",
            "El campo PRESENTO EQUIPO DE DESPLIEGUE debe ser completado "
          );
          return;
        }
        if (!formato_epp) {
          AlertError(
            "ERROR",
            "El formato de EQUIPO DE DESPLIEGUE debe ser completado "
          );
          return;
        }
      }
      if (sectionGPSMark) {
        if (!nombre_evaluador_prueba_gps) {
          AlertError(
            "ERROR",
            "El campo NOMBRE EVALUADOR PRUEBA GPS debe ser completado "
          );
          return;
        }
        if (!resultado_eval_presencial_gps) {
          AlertError(
            "ERROR",
            "El campo RESULTADO EVAL PRESENCIAL GPS debe ser completado "
          );
          return;
        }
        if (!nombre_evaluador_prueba_avenza_maps) {
          AlertError(
            "ERROR",
            "El campo NOMBRE EVALUADOR PRUEBA AVENZA MAPS debe ser completado "
          );
          return;
        }
        if (!resultado_eval_presencial_avenza_maps) {
          AlertError(
            "ERROR",
            "El campo RESULTADO EVAL PRESENCIAL GPS debe ser completado "
          );
          return;
        }
        if (!resultado_eval_presencial_motosierra) {
          AlertError(
            "ERROR",
            "El campo RESULTADO EVAL PRESENCIAL MOTOSIERRA debe ser completado "
          );
          return;
        }
        if (!formato_eval_habilidad_uso_gps) {
          AlertError(
            "ERROR",
            "El campo FORMATO EVAL HABILIDAD USO GPS debe ser completado "
          );
          return;
        }

        if (!formato_eval_habilidad_uso_avenza_maps) {
          AlertError(
            "ERROR",
            "El campo FORMATO EVAL HABILIDAD USO AVENZA MAPS debe ser completado "
          );
          return;
        }

        if (!nombre_evaluador_prueba_mark_III) {
          AlertError(
            "ERROR",
            "El campo NOMBRE EVALUADOR PRUEBA MARK III debe ser completado "
          );
          return;
        }
        if (!nombre_evaluador_prueba_motosierra) {
          AlertError(
            "ERROR",
            "El campo NOMBRE EVALUADOR PRUEBA MOTOSIERRA debe ser completado "
          );
          return;
        }

        if (!porcentaje_gps) {
          AlertError(
            "ERROR",
            "El campo % EVAL PRESENCIAL GPS debe ser completado "
          );
          return;
        }

        if (!porcentaje_avenza_maps) {
          AlertError(
            "ERROR",
            "El campo % EVAL PRESENCIAL AVENZA MAPS debe ser completado "
          );
          return;
        }

        if (!porcentaje_mark_III) {
          AlertError(
            "ERROR",
            "El campo % EVAL PRESENCIAL MARK III debe ser completado "
          );
          return;
        }
        if (!porcentaje_motosierra) {
          AlertError(
            "ERROR",
            "El campo % EVAL PRESENCIAL MOTOSIERRA debe ser completado "
          );
          return;
        }
        if (!resultado_eval_presencial_mark_III) {
          AlertError(
            "ERROR",
            "El campo RESULTADO EVAL PRESENCIAL MARK III debe ser completado "
          );
          return;
        }
        if (!formato_eval_habilidad_uso_mark_III) {
          AlertError(
            "ERROR",
            "El formato HABILIDAD USO MARK III debe ser completado "
          );
          return;
        }
        if (!formato_eval_habilidad_uso_motosierra) {
          AlertError(
            "ERROR",
            "El formato HABILIDAD USO MOTOSIERRA debe ser completado "
          );
          return;
        }
      }
    }

    sendData();
  };

  const revisionGPS = () => {
    if (
      evaluaciones.resultado_eval_presencial_gps > 8 ||
      evaluaciones.resultado_eval_presencial_gps < 0
    ) {
      setEvaluaciones({
        ...evaluaciones,
        porcentaje_gps: null,
      });
      AlertError("El puntaje maximo es de 8 y minimo 0");
    } else {
      const resultado = (evaluaciones.resultado_eval_presencial_gps * 100) / 8;
      setEvaluaciones({
        ...evaluaciones,
        porcentaje_gps: resultado.toString().slice(0, 5),
      });
    }
  };

  const revisionAvenzaMaps = () => {
    if (
      evaluaciones.resultado_eval_presencial_avenza_maps > 9 ||
      evaluaciones.resultado_eval_presencial_avenza_maps < 0
    ) {
      setEvaluaciones({
        ...evaluaciones,
        porcentaje_avenza_maps: null,
      });

      AlertError("El puntaje maximo es de 9 y minimo 0");
    } else {
      const resultado =
        (evaluaciones.resultado_eval_presencial_avenza_maps * 100) / 9;
      setEvaluaciones({
        ...evaluaciones,
        porcentaje_avenza_maps: resultado.toString().slice(0, 5),
      });
    }
  };

  const revisionMarkIII = () => {
    if (
      evaluaciones.resultado_eval_presencial_mark_III > 18 ||
      evaluaciones.resultado_eval_presencial_mark_III < 0
    ) {
      setEvaluaciones({
        ...evaluaciones,
        porcentaje_mark_III: null,
      });
      AlertError("El puntaje maximo es de 18 y minimo 0");
    } else {
      const resultado =
        (evaluaciones.resultado_eval_presencial_mark_III * 100) / 18;
      setEvaluaciones({
        ...evaluaciones,
        porcentaje_mark_III: resultado.toString().slice(0, 5),
      });
    }
  };

  const revisionMotosierra = () => {
    if (
      evaluaciones.resultado_eval_presencial_motosierra > 11 ||
      evaluaciones.resultado_eval_presencial_motosierra < 0
    ) {
      setEvaluaciones({
        ...evaluaciones,
        porcentaje_motosierra: null,
      });
      AlertError("El puntaje maximo es de 11 y minimo 0");
    } else {
      const resultado =
        (evaluaciones.resultado_eval_presencial_motosierra * 100) / 11;
      setEvaluaciones({
        ...evaluaciones,
        porcentaje_motosierra: resultado.toString().slice(0, 5),
      });
    }
  };

  const sendData = async () => {

    /* ARCHIVOS ADJUNTOS */
    const formData_formato = new FormData();
    const formData_formato_carrera = new FormData();
    const formData_formato_epp = new FormData();
    const formData_formato_eval_habilidad_uso_mark_III = new FormData();
    const formato_eval_habilidad_uso_gps = new FormData();
    const formato_eval_habilidad_uso_avenza_maps = new FormData();
    const formato_eval_habilidad_uso_motosierra = new FormData();
    if(!evaluaciones.rechazo){
      if (sePresento === "1" && archivos.formato) {
        formData_formato.append("file", archivos.formato[0]);
        formData_formato.append("curp", evaluaciones.curp);
        formData_formato.append("name", "formato");

        await postUploadFile(formData_formato).then((resp) => {

          if (resp.status === 200) {
            AlertExito("Se cargo formato con exito!");
          } else {
            AlertError("Error al cargar formato");
            return;
          }

        }).catch((error) => {
          AlertError("Error", error.responseJSON);
          return;
        });


        if (archivos.formato_carrera) {
          formData_formato_carrera.append("file", archivos.formato_carrera[0]);
          formData_formato_carrera.append("curp", evaluaciones.curp);
          formData_formato_carrera.append("name", "formato_carrera");

          await postUploadFile(formData_formato_carrera).then((resp) => {
            if (resp.status === 200) {
              AlertExito("Se cargo formato de carrera con exito!");
            } else {
              AlertError("Error al cargar formato");
              return;
            }
          }).catch((error) => {
            AlertError("Error", error.responseJSON);
            return;
          });

        }

        if (sectionEPP && archivos.formato_epp) {
          formData_formato_epp.append("file", archivos.formato_epp[0]);
          formData_formato_epp.append("curp", evaluaciones.curp);
          formData_formato_epp.append("name", "formato_epp");

          await postUploadFile(
            formData_formato_epp
          ).then((resp) => {
            if (resp.status === 200) {
              AlertExito("Se cargo archivo_formato_epp con exito!");
            } else {
              AlertError("Error al cargar archivo_formato_epp");
              return;
            }
          }).catch((error) => {
            AlertError("Error", error.responseJSON);
            return;
          });

        }

        if (
          sectionGPSMark &&
          archivos.formato_eval_habilidad_uso_gps &&
          archivos.formato_eval_habilidad_uso_avenza_maps &&
          archivos.formato_eval_habilidad_uso_mark_III &&
          archivos.formato_eval_habilidad_uso_motosierra
        ) {

          formData_formato_eval_habilidad_uso_mark_III.append(
            "file",
            archivos.formato_eval_habilidad_uso_mark_III[0]
          );
          formData_formato_eval_habilidad_uso_mark_III.append(
            "curp",
            evaluaciones.curp
          );
          formData_formato_eval_habilidad_uso_mark_III.append(
            "name",
            "formato_eval_habilidad_uso_mark_III"
          );

          await postUploadFile(formData_formato_eval_habilidad_uso_mark_III).then(async (resp) => {
            if (resp.status === 200) {
              AlertExito(
                "Se cargo archivos MARK III con exito!"
              );

              formato_eval_habilidad_uso_gps.append(
                "file",
                archivos.formato_eval_habilidad_uso_gps[0]
              );
              formato_eval_habilidad_uso_gps.append("curp", evaluaciones.curp);
              formato_eval_habilidad_uso_gps.append(
                "name",
                "formato_eval_habilidad_uso_gps"
              );
              await postUploadFile(formato_eval_habilidad_uso_gps).then(async (resp) => {

                if (resp.status === 200) {

                  AlertExito(
                    "Se cargo archivos GPS con exito!"
                  );

                  formato_eval_habilidad_uso_avenza_maps.append(
                    "file",
                    archivos.formato_eval_habilidad_uso_avenza_maps[0]
                  );
                  formato_eval_habilidad_uso_avenza_maps.append(
                    "curp",
                    evaluaciones.curp
                  );
                  formato_eval_habilidad_uso_avenza_maps.append(
                    "name",
                    "formato_eval_habilidad_uso_avenza_maps"
                  );

                  await postUploadFile(formato_eval_habilidad_uso_avenza_maps).then(async (resp) => {

                    if (resp.status === 200) {

                      AlertExito(
                        "Se cargo archivos Avenza Maps con exito!"
                      );

                      formato_eval_habilidad_uso_motosierra.append(
                        "file",
                        archivos.formato_eval_habilidad_uso_motosierra[0]
                      );
                      formato_eval_habilidad_uso_motosierra.append("curp", evaluaciones.curp);
                      formato_eval_habilidad_uso_motosierra.append(
                        "name",
                        "formato_eval_habilidad_uso_motosierra"
                      );
                      await postUploadFile(formato_eval_habilidad_uso_motosierra).then(async (resp) => {

                        if (resp.status === 200) {

                          AlertExito(
                            "Se cargo archivos de Uso de Motoriserra con exito!"
                          );

                          await postStatesEvaluation(evaluaciones).then((resp) => {
                            if (resp.status === 200) {
                              AlertExito("Se cargo correctamente la información de la evaluación");
                              props.setVolver(false);
                            }
                          }).catch((error) => {
                            AlertError("Error", error.responseJSON);
                          })
                        }
                      }).catch((error) => {

                        AlertError(
                          "Error", error.responseJSON
                        );

                        return;

                      });
                    }
                  }).catch((error) => {

                    AlertError(
                      "Error", error.responseJSON
                    );

                    return;
                  });

                }
              }).catch((error) => {

                AlertError("Error", error.responseJSON);

                return;
              });
            }
          }).catch((error) => {

            AlertError("Error", error.responseJSON);

            return;
          });

        }
      }
    } else {
      await postStatesEvaluation(evaluaciones).then((resp) => {
        if (resp.status === 200) {
          AlertError(
            "El candidato fue rechazado",
            evaluaciones.rechazo
          );
          props.setVolver(false);
        }
      }).catch((error) => {
        AlertError("Error", error.responseJSON);
      })
    }
  };

  useEffect(() => {
    /* se agrega al conext global el estate */
    pruebasContext.cand.agregarPruebas({
      ...pruebasContext.cand,
      pruebasCandidato: evaluaciones,
    });
    return () => { };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [evaluaciones]);

  return (
    <div className="row body_wrap">
      {/* DATOS DEL CANDIDATO */}
      {/* ENCABEZADO */}
      <div className="col-12 col-md-12 center-text">
        <h2>Prueba de la Mochila Nivel Aurduo</h2>
      </div>
      {/* SE PRESENTO EL CANDIDATO */}
      <div className="col-12 col-md-12">
        <label className="control-label pt-2">
          ¿El candidato se presento a las pruebas?
        </label>
        <select className="form-control" onChange={handlePresento}>
          <option value="">---Seleccione---</option>
          <option value={1}>SI</option>
          <option value={0}>NO</option>
        </select>
      </div>
      {sePresento === "1" && (
        <React.Fragment>
          {/* NOMBRE DEL EVALUADOR */}
          <div className="col-12 col-md-12">
            <label className="control-label pt-2">
              Nombre del evaluador de la prueba de mochila
            </label>
            <input
              className={`form-control ${evaluaciones.nombre_evaluador ? null : "myInput"
                }`}
              name="nombre_evaluador"
              value={evaluaciones.nombre_evaluador}
              type="text"
              // accept="image/png,image/jpeg"
              onChange={setInfo}
              onChangeCapture={ToMayus}
              placeholder="Ingrese Nombre completo..."
            />
          </div>
          {/* PESO VERIFICADO */}
          <div className="col-12 col-md-4">
            <label className="control-label pt-2">Peso comprobado</label>
            <input
              className={`form-control ${evaluaciones.peso_verificado ? null : "myInput"
                }`}
              name="peso_verificado"
              type="number"
              step="0.0"
              max={3}
              value={
                evaluaciones.peso_verificado ? evaluaciones.peso_verificado : ""
              }
              // accept="image/png,image/jpeg"
              onChange={setNumerico}
              onBlur={handleIMC}
              placeholder="Ingrese Peso verificado..."
            />
            <label className="control-label pt-2">Peso (Libras)</label>
            <input
              className="form-control myInput"
              value={
                evaluaciones.peso_verificado
                  ? Math.round(evaluaciones.peso_verificado * 2.2046 * 10) / 10
                  : ""
              }
              type="number"
              disabled={true}
              min={0}
              placeholder="Ingrese Peso verificado (lb)..."
            />
          </div>
          {/* Altura VERIFICADO */}
          <div className="col-12 col-md-4">
            <label className="control-label pt-2">Altura (cm.)</label>
            <InputNumber
              className={`form-control ${evaluaciones.altura_verificada ? null : "myInput"
                }`}
              name="altura_verificada"
              limitLength={3}
              min={0}
              type="number"
              value={evaluaciones.altura_verificada}
              // accept="image/png,image/jpeg"
              onChange={setNumerico}
              onBlur={handleIMC}
              placeholder="Ingrese Altura verificada..."
            />
            <label className="control-label pt-2">Altura (Pies)</label>
            <input
              className="form-control myInput"
              value={
                evaluaciones.altura_verificada
                  ? Math.round(
                    evaluaciones.altura_verificada * 0.0328084 * 10
                  ) / 10
                  : ""
              }
              type="number"
              step="0"
              disabled={true}
              min={0}
              placeholder="Ingrese Altura verificada (ft)..."
            />
          </div>
          {/* IMC VERIFICADO */}
          <div className="col-12 col-md-4">
            <label className="control-label pt-2">IMC verificado</label>
            <input
              disabled
              className={`form-control ${evaluaciones.imc_verificado ? null : "myInput"
                }`}
              min={0}
              name="imc_verificado"
              type="text"
              value={evaluaciones.imc_verificado}
              // accept="image/png,image/jpeg"
              onChange={setInfo}
              placeholder="Calculo de IMC..."
            />
          </div>
          {/* SECCION PRUEBAS FISICAS*/}
          {sectionPruebaFisica && (
            <React.Fragment>
              {/* Altura SOBRE NIVEL DEL MAR */}
              <div className="col-12 col-md-6">
                <label className="control-label pt-2">
                  Altura sobre el nivel del mar del lugar donde se realizó la
                  prueba.
                </label>
                <InputNumber
                  className={`form-control ${evaluaciones.altura_sobre_niv_mar ? null : "myInput"
                    }`}
                  name="altura_sobre_niv_mar"
                  limitLength={4}
                  min={0}
                  type="number"
                  value={evaluaciones.altura_sobre_niv_mar}
                  // accept="image/png,image/jpeg"
                  onChange={setInfo}
                  onBlur={handleASNM}
                  placeholder="Ingrese Altura sobre el nivel del mar..."
                />
              </div>
              {/* TIEMPO MÁXIMO REQUERIDO CON CORRECCIÓN POR ALTITUD */}
              <div className="col-12 col-md-6">
                <label className="control-label pt-2">
                  Tiempo máximo requerido con corrección por altitud.
                </label>
                <input
                  disabled
                  className={`form-control ${evaluaciones.tiempo_max_correccion_altitud
                    ? null
                    : "myInput"
                    }`}
                  name="tiempo_max_correccion_altitud"
                  type="text"
                  value={
                    evaluaciones.tiempo_req_max_min &&
                      evaluaciones.tiempo_req_mas_seg
                      ? `${evaluaciones.tiempo_req_max_min}' ${evaluaciones.tiempo_req_mas_seg}''`
                      : null
                  }
                  onChange={setInfo}
                  placeholder="Ingrese Altura sobre el nivel del mar..."
                />
              </div>
              {/* TIEMPO REALIZADO EN LA PRUEBA DE TRABAJO ARDUO */}
              <div className="col-12 col-md-3">
                <label className="control-label pt-2">
                  Tiempo realizado en la prueba de trabajo arduo.
                </label>
                <InputGroup className="mb-2">
                  <InputNumber
                    className={`form-control ${evaluaciones.minutos_prueba_trabajo_arduo
                      ? null
                      : "myInput"
                      }`}
                    placeholder="Minutos..."
                    limitLength={2}
                    min={0}
                    value={evaluaciones.minutos_prueba_trabajo_arduo}
                    name="minutos_prueba_trabajo_arduo"
                    onChange={setInfo}
                    onBlur={calcResultados}
                  />
                  <InputGroup.Prepend>
                    <InputGroup.Text>'</InputGroup.Text>
                  </InputGroup.Prepend>
                  <InputNumber
                    className={`form-control ${evaluaciones.segundos_prueba_trabajo_arduo
                      ? null
                      : "myInput"
                      }`}
                    placeholder="Segundos..."
                    limitLength={2}
                    min={0}
                    max={59}
                    value={evaluaciones.segundos_prueba_trabajo_arduo}
                    name="segundos_prueba_trabajo_arduo"
                    onChange={setNumericoRango}
                    onBlur={calcResultados}
                  />
                  <InputGroup.Prepend>
                    <InputGroup.Text>''</InputGroup.Text>
                  </InputGroup.Prepend>
                </InputGroup>
              </div>
              {/* Puntuacion estimada*/}
              <div className="col-12 col-md-4">
                <label className="control-label pt-2">
                  Puntuación estimada.
                </label>
                <InputNumber
                  disabled
                  className={`form-control ${evaluaciones.puntuacion_estimada ? null : "myInput"
                    }`}
                  name="puntuacion_estimada"
                  value={evaluaciones.puntuacion_estimada}
                  // onChange={setInfo}
                  placeholder="Ingrese Minutos y Segundos de la prueba..."
                />
              </div>
              {/* PRUEBA */}
              <div className="col-12 col-md-5">
                <label className="control-label pt-2">Prueba:</label>
                <input
                  disabled
                  className={`form-control ${evaluaciones.prueba ? null : "myInput"
                    }`}
                  name="prueba"
                  // onChange={setInfo}
                  value={evaluaciones.prueba}
                  placeholder="Resultados de la prueba..."
                />
              </div>
              {/* FORMATO APTITUD FISICA */}
              <div className="col-12 col-md-12">
                <label className="control-label pt-2">
                  Formato de aptitud física prueba de la mochila:
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  className={`form-control ${archivos.formato ? null : "myInput"
                    }`}
                  name="formato"
                  onChange={setInfo}
                />
              </div>
              {calificacionPrueba(
                evaluaciones.minutos_prueba_trabajo_arduo,
                evaluaciones.segundos_prueba_trabajo_arduo
              ) === "SUPERADA" &&
                archivos.formato && (
                  <React.Fragment>
                    {/* ENCABEZADO */}
                    <div className="col-12 pt-5 col-md-12 center-text">
                      <h2>Prueba de la Carrera</h2>
                    </div>
                    <div className="col-12 col-md-12">
                      <label className="control-label pt-2">
                        Nombre del evaluador de la prueba de la carrera
                      </label>
                      <input
                        className={`form-control ${evaluaciones.nombre_evaluador_carrera
                          ? null
                          : "myInput"
                          }`}
                        name="nombre_evaluador_carrera"
                        value={evaluaciones.nombre_evaluador_carrera}
                        type="text"
                        onChange={setInfo}
                        onChangeCapture={ToMayus}
                        placeholder="Ingrese Nombre completo..."
                      />
                    </div>
                    {/* TIEMPO REALIZADO EN LA PRUEBA DE TRABAJO CARRERA */}
                    <div className="col-12 col-md-6">
                      <label className="control-label pt-2">
                        Tiempo realizado en la prueba de trabajo de la carrera.
                      </label>
                      <InputGroup className="mb-2">
                        <InputNumber
                          className={`form-control ${evaluaciones.minutos_prueba_trabajo_carrera
                            ? null
                            : "myInput"
                            }`}
                          placeholder="Minutos..."
                          limitLength={2}
                          min={0}
                          value={evaluaciones.minutos_prueba_trabajo_carrera}
                          name="minutos_prueba_trabajo_carrera"
                          onChange={setInfo}
                          onBlur={calcResultados}
                        />
                        <InputGroup.Prepend>
                          <InputGroup.Text>'</InputGroup.Text>
                        </InputGroup.Prepend>
                        <InputNumber
                          className={`form-control ${evaluaciones.segundos_prueba_trabajo_carrera
                            ? null
                            : "myInput"
                            }`}
                          placeholder="Segundos..."
                          limitLength={2}
                          min={0}
                          max={59}
                          value={evaluaciones.segundos_prueba_trabajo_carrera}
                          name="segundos_prueba_trabajo_carrera"
                          onChange={setNumericoRango}
                          onBlur={handlePuntuacion}
                        />
                        <InputGroup.Prepend>
                          <InputGroup.Text>''</InputGroup.Text>
                        </InputGroup.Prepend>
                      </InputGroup>
                    </div>
                    {/* PUNTUACIÓN ESTIMADA CARRERA*/}
                    <div className="col-12 col-md-4">
                      <label className="control-label pt-2">
                        Puntuación estimada.
                      </label>
                      <InputNumber
                        disabled
                        className={`form-control ${evaluaciones.puntuacion_estimada_prueba_carrera
                          ? null
                          : "myInput"
                          }`}
                        name="puntuacion_estimada_prueba_carrera"
                        value={evaluaciones.puntuacion_estimada_prueba_carrera}
                        placeholder="Ingrese Minutos y Segundos de la prueba..."
                      />
                    </div>
                    {/* FORMATO APTITUD FISICA PRUEBA CARRERA*/}
                    <div className="col-12 col-md-12">
                      <label className="control-label pt-2">
                        Formato de aptitud física prueba de la carrera:
                      </label>
                      <input
                        type="file"
                        accept="application/pdf"
                        className={`form-control ${archivos.formato_carrera ? null : "myInput"
                          }`}
                        name="formato_carrera"
                        onChange={setInfo}
                      />
                    </div>
                  </React.Fragment>
                )}
            </React.Fragment>
          )}
          {/* SECCION EQUIPO DE PROTECCION */}
          {sectionEPP &&
            archivos.formato &&
            evaluaciones.segundos_prueba_trabajo_carrera && (
              <React.Fragment>
                <div className="col-12 col-md-12 center-text pt-5">
                  <h2>Equipo de despliegue</h2>
                </div>
                <div className="col-12 col-md-12">
                  <label className="control-label pt-2">
                    Formato de equipo de despliegue completo
                  </label>
                  <input
                    className={`form-control ${evaluaciones.formato_epp ? null : "myInput"
                      }`}
                    name="formato_epp"
                    type="file"
                    accept="application/pdf"
                    onChange={setInfo}
                    onBlur={handleASNM}
                  />
                </div>
                <div className="col-12 col-md-12">
                  <label className="control-label pt-2">
                    ¿El candidato presentó el equipo de despliegue completo?
                  </label>
                  <SelectSiNo
                    className={`form-control ${evaluaciones.presento_equipo ? null : "myInput"
                      }`}
                    name="presento_equipo"
                    defaultValue={evaluaciones.presento_equipo}
                    onChange={setInfo}
                    onBlur={handleEPP}
                  />
                </div>
              </React.Fragment>
            )}
          {/* SECCION GPS, Avenza Maps Motobomba MARK III y Motosierra*/}
          {sectionGPSMark && (
            <React.Fragment>
              {/* ENCABEZADO */}
              <div className="col-12 col-md-12 center-text pt-5">
                <h2>GPS, Avenza Maps Motobomba MARK III y Motosierra</h2>
              </div>
              {/* Nombre del evaluador prueba GPS */}
              <div className="col-12 col-md-12">
                <label className="control-label pt-2">
                  Nombre del evaluador prueba GPS
                </label>
                <input
                  className={`form-control ${evaluaciones.nombre_evaluador_prueba_gps ? null : "myInput"
                    }`}
                  type="text"
                  value={evaluaciones.nombre_evaluador_prueba_gps}
                  name="nombre_evaluador_prueba_gps"
                  onChange={setInfo}
                  onChangeCapture={ToMayus}
                  placeholder="Ingrese Nombre del evaluador prueba GPS..."
                />
              </div>
              {/* Formato de evaluación habilidad y competencia en el uso de GPS */}
              <div className="col-12 col-md-12">
                <label className="control-label pt-2">
                  Formato de evaluación habilidad y competencia en el uso de GPS
                </label>
                <input
                  className={`form-control ${evaluaciones.formato_eval_habilidad_uso_gps
                    ? null
                    : "myInput"
                    }`}
                  type="file"
                  name="formato_eval_habilidad_uso_gps"
                  onChange={setInfo}
                  placeholder="Ingrese Formato de evaluación habilidad y competencia en el uso de GPS..."
                  accept="application/pdf"
                />
              </div>
              {/* Resultado de la evaluación presencial de GPS */}
              <div className="col-12 col-md-6">
                <label className="control-label pt-2">
                  Resultado de la evaluación presencial de GPS
                </label>
                <InputNumber
                  className={`form-control ${evaluaciones.resultado_eval_presencial_gps
                    ? null
                    : "myInput"
                    }`}
                  limitLength={1}
                  min={0}
                  max={8}
                  value={evaluaciones.resultado_eval_presencial_gps}
                  name="resultado_eval_presencial_gps"
                  onChange={setInfo}
                  onBlur={revisionGPS}
                  placeholder="Ingrese Resultado de la evaluación presencial de GPS..."
                />
              </div>
              {/* porcentaje GPS*/}
              <div className="col-12 col-md-6">
                <label className="control-label pt-2">
                  % la evaluación presencial de GPS
                </label>
                <input
                  disabled
                  className={`form-control ${evaluaciones.porcentaje_gps ? null : "myInput"
                    }`}
                  value={evaluaciones.porcentaje_gps}
                  name="porcentaje_gps"
                  // onChange={setInfo}
                  placeholder="calculo porcentaje de la evaluación presencial de GPS..."
                />
              </div>
              {/*Nombre del evaluador prueba Avenza Maps */}
              <div className="col-12 col-md-12">
                <label className="control-label pt-2">
                  Nombre del evaluador prueba Avenza Maps
                </label>
                <input
                  className={`form-control ${evaluaciones.nombre_evaluador_prueba_avenza_maps
                    ? null
                    : "myInput"
                    }`}
                  type="text"
                  value={evaluaciones.nombre_evaluador_prueba_avenza_maps}
                  name="nombre_evaluador_prueba_avenza_maps"
                  onChange={setInfo}
                  onChangeCapture={ToMayus}
                  placeholder="Ingrese Nombre del evaluador prueba Avenza Maps..."
                />
              </div>
              {/* Formato de evaluación habilidad y competencia en el uso de Avenza Maps */}
              <div className="col-12 col-md-12">
                <label className="control-label pt-2">
                  Formato de evaluación habilidad y competencia en el uso de
                  Avenza Maps
                </label>
                <input
                  className={`form-control ${evaluaciones.formato_eval_habilidad_uso_avenza_maps
                    ? null
                    : "myInput"
                    }`}
                  type="file"
                  name="formato_eval_habilidad_uso_avenza_maps"
                  onChange={setInfo}
                  placeholder="Ingrese Formato de evaluación habilidad y competencia en el uso de Avenza Maps..."
                  accept="application/pdf"
                />
              </div>
              {/* Resultado de la evaluación presencial de Avenza Maps*/}
              <div className="col-12 col-md-6">
                <label className="control-label pt-2">
                  Resultado de la evaluación presencial de Avenza Maps
                </label>
                <InputNumber
                  className={`form-control ${evaluaciones.resultado_eval_presencial_avenza_maps
                    ? null
                    : "myInput"
                    }`}
                  limitLength={1}
                  min={0}
                  max={9}
                  value={evaluaciones.resultado_eval_presencial_avenza_maps}
                  name="resultado_eval_presencial_avenza_maps"
                  onChange={setInfo}
                  onBlur={revisionAvenzaMaps}
                  placeholder="Ingrese Resultado de la evaluación presencial de Avenza Maps..."
                />
              </div>
              {/* porcentaje Avenza*/}
              <div className="col-12 col-md-6">
                <label className="control-label pt-2">
                  % la evaluación presencial de Avenza Maps
                </label>
                <input
                  disabled
                  className={`form-control ${evaluaciones.porcentaje_avenza_maps ? null : "myInput"
                    }`}
                  value={evaluaciones.porcentaje_avenza_maps}
                  name="porcentaje_avenza_maps"
                  placeholder="calculo porcentaje de la evaluación presencial de Avenza Maps..."
                />
              </div>
              {/* Nombre del evaluador prueba Mark III */}
              <div className="col-12 col-md-12">
                <label className="control-label pt-2">
                  Nombre del evaluador prueba Mark III
                </label>
                <input
                  className={`form-control ${evaluaciones.nombre_evaluador_prueba_mark_III
                    ? null
                    : "myInput"
                    }`}
                  type="text"
                  onChangeCapture={ToMayus}
                  value={evaluaciones.nombre_evaluador_prueba_mark_III}
                  name="nombre_evaluador_prueba_mark_III"
                  onChange={setInfo}
                  placeholder="Ingrese Nombre del evaluador prueba Mark III..."
                />
              </div>
              {/* Formato de evaluación habilidad y competencia en el uso de Mark III */}
              <div className="col-12 col-md-12">
                <label className="control-label pt-2">
                  Formato de evaluación habilidad y competencia en el uso de
                  Mark III
                </label>
                <input
                  className={`form-control ${evaluaciones.formato_eval_habilidad_uso_mark_III
                    ? null
                    : "myInput"
                    }`}
                  type="file"
                  name="formato_eval_habilidad_uso_mark_III"
                  onChange={setInfo}
                  value={evaluaciones.formato_eval_habilidad_uso_mark_III}
                  placeholder="Ingrese Formato de evaluación habilidad y competencia en el uso de Mark III..."
                  accept="application/pdf"
                />
              </div>
              {/* Resultado de la evaluación presencial de Mark III */}
              <div className="col-12 col-md-6">
                <label className="control-label pt-2">
                  Resultado de la evaluación presencial de Mark III
                </label>
                <InputNumber
                  className={`form-control ${evaluaciones.resultado_eval_presencial_mark_III
                    ? null
                    : "myInput"
                    }`}
                  limitLength={2}
                  min={0}
                  max={18}
                  value={evaluaciones.resultado_eval_presencial_mark_III}
                  name="resultado_eval_presencial_mark_III"
                  onChange={setInfo}
                  onBlur={revisionMarkIII}
                  placeholder="Ingrese Resultado de la evaluación presencial de Mark III..."
                />
              </div>
              {/* porcentaje GPS*/}
              <div className="col-12 col-md-6">
                <label className="control-label pt-2">
                  % la evaluación presencial de Mark III
                </label>
                <input
                  disabled
                  className={`form-control ${evaluaciones.porcentaje_mark_III ? null : "myInput"
                    }`}
                  value={evaluaciones.porcentaje_mark_III}
                  name="porcentaje_mark_III"
                  onChange={setInfo}
                  placeholder="calculo porcentaje de la evaluación presencial de mark_III..."
                />
              </div>

              {/* Nombre del evaluador prueba Motosierra */}
              <div className="col-12 col-md-12">
                <label className="control-label pt-2">
                  Nombre del evaluador prueba Motosierra
                </label>
                <input
                  className={`form-control ${evaluaciones.nombre_evaluador_prueba_motosierra
                    ? null
                    : "myInput"
                    }`}
                  type="text"
                  onChangeCapture={ToMayus}
                  value={evaluaciones.nombre_evaluador_prueba_motosierra}
                  name="nombre_evaluador_prueba_motosierra"
                  onChange={setInfo}
                  placeholder="Ingrese Nombre del evaluador prueba Motosierra..."
                />
              </div>
              {/* Formato de evaluación habilidad y competencia en el uso de Motosierra */}
              <div className="col-12 col-md-12">
                <label className="control-label pt-2">
                  Formato de evaluación habilidad y competencia en el uso de
                  Motosierra
                </label>
                <input
                  className={`form-control ${evaluaciones.formato_eval_habilidad_uso_motosierra
                    ? null
                    : "myInput"
                    }`}
                  type="file"
                  name="formato_eval_habilidad_uso_motosierra"
                  onChange={setInfo}
                  value={evaluaciones.formato_eval_habilidad_uso_motosierra}
                  placeholder="Ingrese Formato de evaluación habilidad y competencia en el uso de Motosierra..."
                  accept="application/pdf"
                />
              </div>
              {/* Resultado de la evaluación presencial de Motosierra */}
              <div className="col-12 col-md-6">
                <label className="control-label pt-2">
                  Resultado de la evaluación presencial de Motosierra
                </label>
                <InputNumber
                  className={`form-control ${evaluaciones.resultado_eval_presencial_motosierra
                    ? null
                    : "myInput"
                    }`}
                  min={0}
                  max={11}
                  limitLength={2}
                  value={evaluaciones.resultado_eval_presencial_motosierra}
                  name="resultado_eval_presencial_motosierra"
                  onChange={setInfo}
                  onBlur={revisionMotosierra}
                  placeholder="Ingrese Resultado de la evaluación presencial de Motosierra..."
                />
              </div>
              {/* porcentaje Motosierra*/}
              <div className="col-12 col-md-6">
                <label className="control-label pt-2">
                  % la evaluación presencial de Motosierra
                </label>
                <input
                  disabled
                  className={`form-control ${evaluaciones.porcentaje_motosierra ? null : "myInput"
                    }`}
                  value={evaluaciones.porcentaje_motosierra}
                  name="porcentaje_motosierra"
                  onChange={setInfo}
                  placeholder="calculo porcentaje de la evaluación presencial de Motosierra..."
                />
              </div>
            </React.Fragment>
          )}
        </React.Fragment>
      )}
      <div className="text-center py-3 col-md-12">
        <button className="btn btn-primary px-4" onClick={revisarInformacion}>
          Registrar
        </button>
      </div>
    </div>
  );
};

export default S9_S10;
