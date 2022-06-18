import React, { useState, useEffect, useContext } from "react";
import SelectSiNo from "../../singles/SelectSiNo";
import ExSCI100 from "./ExSCI100";
import AlertaSiguiente from "../../singles/AlertaSiguiente";
import { Modal, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import axios from "axios";
import AlertError from "../../singles/AlertError";
import moment from "moment";
/* CONTEXT */
import candidatoContext from "../../context/candidato/candidatoContext";
import { formatDate } from "../../helpers/formatDate";
import { validarExtPdf } from "../../helpers/validarExtPDF";
import ExamenSCI100 from "../examenes/examen_sci100/ExamenSCI100";

const S4 = (props) => {
  const candidatos = useContext(candidatoContext);
  const { curp } = candidatos.candidatos.infoBrigadista;

  const { state, setState, checkData, files, setStateFiles } = props;

  const [showExam, setShowExam] = useState(false);

  const [preguntas_smi_100, setPreguntas_smi_100] = useState(false);
  const [examResp, setExamResp] = useState({
    curp: curp,
    "1_asegurar_comunicacion": "x",
    "2_implementando_actividades": "x",
    "3_actividades_principales": "x",
    "4_primera_tarea_personal": "x",
    "5_instalacion_incidente": "x",
    "6_equipo_intervencion": "x",
    "7_incidente_complejo": "x",
    "8_retirarse_incidente": "x",
    "9_alcance_control": "x",
    "10_entidades_organizacionales": "x",
    "11_sistema_comando": "x",
    "12_contiene_informacion": "x",
    "13_recursos_areas": "x",
    "14_reunion_informativa": "x",
    "15_documento_proporciona": "x",
    "16_formato_encuentran": "x",
    "17_formato_hospitales": "x",
    "18_formato_trabajo": "x",
    "19_plan_accion": "x",
    "20_asignado_incidente": "x",
  });
  const [smi_100Examen, setSmi_100Examen] = useState(false);

  /* TIMER */

  // initialize timeLeft with the seconds prop
  const [timeLeft, setTimeLeft] = useState(1500000000000);

  const refreshPage = async (e) => {
    // Cancel the event as stated by the standard.
    e.preventDefault();
    terminarExamen();
    // Chrome requires returnValue to be set.
    e.returnValue = "";
  };

  useEffect(() => {
    // exit early when we reach 0
    if (!timeLeft) {
      terminarExamen();
    }
    // save intervalId to clear the interval when the
    // component re-renders
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    // clear interval on re-render to avoid memory leaks
    return () => clearInterval(intervalId);
    // add timeLeft as a dependency to re-rerun the effect
    // when we update it
  }, [timeLeft]);

  const handleShow = () => {
    setTimeLeft(900);
    window.onbeforeunload = refreshPage;
    setShowExam(true);
  };

  const terminarExamen = async () => {
    try {
      const respuesta = await axios.post(
        process.env.REACT_APP_BACKEND_URL + "smi100_exam",
        examResp
      );
      // console.log('TERMINANDO EXAMEN');

      if (respuesta.status === 200) {
        if (respuesta.data.calificacion === "reprobado") {
          setState({
            ...state,
            rechazo: true,
            motivo_rechazo: "no aprobo examen smi_100",
            examen_smi_100: respuesta.data.calificacion,
            fechaCreacion: formatDate(new Date().toString().toUpperCase(), 0),
          });
        } else {
          setState({
            ...state,
            rechazo: false,
            motivo_rechazo: null,
            examen_smi_100: respuesta.data.calificacion,
            fechaCreacion: null,
          });
        }
        setShowExam(false);
        setSmi_100Examen(true);
      }
    } catch (error) {
      AlertError("Error", error);
    }
    // console.log('envio de resultados');
  };

  const handleClose = () => {
    Swal.fire({
      title: "Esta seguro que desea terminar la prueba?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Continuar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.value) {
        terminarExamen(examResp);
      }
    });
  };

  const setInfo = (input) => {

    if (input.target.type === "file") {
      setStateFiles({
        ...files,
        [input.target.name + "_fl"]: validarExtPdf(
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
        [input.target.name]: input.target.value,
      });
    } else {
      /* setea al state las variables */
      setState({
        ...state,
        [input.target.name]: input.target.value,
      });
    }
  };

  const siguienteExamen = () => {
    Swal.fire({
      title: "Esta por iniciar una prueba",
      text:
        "Asegurese de tener una conexion estable de internet.\n" +
        "EL EXAMEN NO PODRA VOLVERSE A PRESENTAR SI SE SALE O REFRESCA LA PAGINA.\n" +
        "Cuenta con 15 minutos para responderla.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Continuar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.value) {
        /* INICIAR EXAMEN */
        handleShow(true);
      }
    });
    // setSmi_100Examen(true)
  };

  return (
    <div className="row body_wrap">
      <Modal show={showExam} animation={false} dialogClassName="modal-90w">
        <Modal.Header>
          <Modal.Title>SCI/SMI 100-200</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tiempo Restante
          <h2>
            {moment
              .utc(moment.duration(timeLeft, "seconds").asMilliseconds())
              .format("m:ss ")}
          </h2>
          {/* <ExS190 /> */}
          <ExSCI100 state={examResp} setState={setExamResp} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Terminar
          </Button>
        </Modal.Footer>
      </Modal>
      <ExamenSCI100
        state={state}
        setState={setState}
      />

      {/* Cargar constancia del Curso SCI/SMI 100 */}
      <div className="col-12 col-md-4">
        <label className="control-label pt-2">
          Cargar constancia del Curso SCI/SMI 100
        </label>
        <input
          className="form-control myInput"
          name="sci_smi_100"
          type="file"
          accept="application/pdf"
          onChange={setInfo}
          onBlur={() => {
            setPreguntas_smi_100(
              files.sci_smi_100_fl && files.sci_smi_200_fl ? true : false
            );
          }}
          onMouseLeave={() => {
            setPreguntas_smi_100(
              files.sci_smi_100_fl && files.sci_smi_200_fl ? true : false
            );
          }}
          placeholder="Ingrese SCI/SMI 100..."
        />
      </div>

      {/* Cargar constancia del Curso SCI/SMI 200 */}
      <div className="col-12 col-md-4">
        <label className="control-label pt-2">
          Cargar constancia del Curso SCI/SMI 200
        </label>
        <input
          className="form-control myInput"
          name="sci_smi_200"
          type="file"
          accept="application/pdf"
          onChange={setInfo}
          onBlur={() => {
            setPreguntas_smi_100(
              files.sci_smi_100_fl && files.sci_smi_200_fl ? true : false
            );
          }}
          onMouseLeave={() => {
            setPreguntas_smi_100(
              files.sci_smi_100_fl && files.sci_smi_200_fl ? true : false
            );
          }}
          placeholder="Ingrese SCI/SMI 200..."
        />
      </div>

      {/* Cargar constancia del Curso SCI/SMI 300 */}
      <div className="col-12 col-md-4">
        <label className="control-label pt-2">
          Cargar constancia del Curso SCI/SMI 300
        </label>
        <input
          className="form-control myInput"
          name="sci_smi_300"
          type="file"
          accept="application/pdf"
          onChange={setInfo}
          placeholder="Ingrese SCI/SMI 300..."
        />
      </div>

      {preguntas_smi_100 && (
        <React.Fragment>
          {/* ¿El evaluado ha participado en eventos planeados o no...? */}
          <div className="col-12">
            <label className="control-label danger pt-2">
              ¿El evaluado ha participado en eventos planeados o no planeados
              atendidos bajo el SCI?
            </label>
            <SelectSiNo
              className="form-control myInput"
              name="eventos_plnaeados_sci"
              onChange={setInfo}
              value={state.eventos_plnaeados_sci ? state.eventos_plnaeados_sci : ""}
            />
          </div>

          {/* ¿El evaluado ha participado en eventos planeados o no planeados...? */}
          <div className="col-12">
            <label className="control-label danger pt-2">
              ¿El evaluado ha participado en eventos planeados o no planeados
              atendidos bajo el SCI fuera de su país?
            </label>
            <SelectSiNo
              className="form-control myInput"
              name="eventos_plnaeados_sci_fuera"
              onChange={setInfo}
              value={state.eventos_plnaeados_sci_fuera ? state.eventos_plnaeados_sci_fuera : ""}
            />
          </div>

          {/* ¿El evaluado ha ocupado en eventos planeados o no estructura...? */}
          <div className="col-12">
            <label className="control-label danger pt-2">
              ¿El evaluado ha ocupado en eventos planeados o no planeados alguna
              posición dentro de la estructura del SCI?
            </label>
            <SelectSiNo
              className="form-control myInput"
              name="eventos_plnaeados_dentro_estructura"
              onChange={setInfo}
              value={state.eventos_plnaeados_dentro_estructura ? state.eventos_plnaeados_dentro_estructura : ""}
            />
          </div>

          {/* Indique cual Posición */}
          {state.eventos_plnaeados_dentro_estructura === "1" && (
            <React.Fragment>
              <div className="col-5">
                <label className="control-label pt-2">
                  Indique cual Posición
                </label>
                <input
                  className="form-control myInput"
                  name="sci_cual"
                  type="text"
                  onChange={setInfo}
                  placeholder="Indique cual posición..."
                  value={state.sci_cual ? state.sci_cual : ""}
                />
              </div>
            </React.Fragment>
          )}

          {/* ¿El evaluado pertenece a algún Equipo de Manejo de Incidentes? */}
          <div className="col-7">
            <label className="control-label danger pt-2">
              ¿El evaluado pertenece a algún Equipo de Manejo de Incidentes?
            </label>
            <SelectSiNo
              className="form-control myInput"
              name="evaluado_menejo_incidentes"
              onChange={setInfo}
              value={state.evaluado_menejo_incidentes ? state.evaluado_menejo_incidentes : ""}
            />
          </div>
        </React.Fragment>
      )}

      {/* BTN SCI/SMI 100 */}
      <div className="col-12 pt-5 btn-margin">
        <button
          hidden={
            files.sci_smi_100_fl &&
              files.sci_smi_200_fl &&
              state.eventos_plnaeados_sci &&
              state.eventos_plnaeados_sci_fuera &&
              state.eventos_plnaeados_dentro_estructura &&
              state.evaluado_menejo_incidentes &&
              !smi_100Examen
              ? false
              : true
          }
          onClick={siguienteExamen}
          className="btn btn-warning"
        //  onClick={() =>AlertaSiguiente("Si continúa, no será posible volver a esta seccion",checkData)}
        >
          Tomar examen SCI/SMI 100-200
        </button>
      </div>

      <div className="col-12 pt-5 btn-margin">
        <button
          disabled={!smi_100Examen}
          className="btn btn-primary"
          onClick={() =>
            AlertaSiguiente(
              "Si continúa, no será posible volver a esta seccion",
              checkData
            )
          }
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

export default S4;
