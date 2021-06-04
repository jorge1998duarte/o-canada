import React, { useEffect } from "react";
import AlertaSiguiente from "../../singles/AlertaSiguiente";
import SelectSiNo from "../../singles/SelectSiNo";
import { size } from "lodash";
import { formatDate } from "../../helpers/formatDate";
const S6 = (props) => {
  const { state, setState, checkData, setStateFiles, files } = props;

  const setInfo = (input) => {
    /* setea al state las variables */
    if (input.target.name === "doc_acred_primeros_auxilios") {
      setStateFiles({
        ...files,
        [input.target.name + "_fl"]: input.target.files,
      });
    } else {
      setState({
        ...state,
        [input.target.name]: input.target.value,
      });
    }
  };

  const setAnio = (input) => {
    if (input.target.name === "anio_opero_moto") {
      if (size(input.target.value) < 5) {
        setState({
          ...state,
          [input.target.name]: input.target.value,
        });
      }
    }
  };
  useEffect(() => {
    window.onbeforeunload = false;
  }, []);

  const revisionCompetencias = () => {
    if (
      state.opera_autonoma_gps === "0" ||
      state.opera_autonoma_mark3 === "0"
    ) {
      setState({
        ...state,
        rechazo: true,
        motivo_rechazo: "falta de habilidad o competencia",
        fechaCreacion : formatDate(new Date().toString().toUpperCase(), 0),
      });
    } else {
      setState({
        ...state,
        rechazo: false,
        motivo_rechazo: null,
        fechaCreacion : null,
      });
    }
  };

  return (
    <div className="row body_wrap">
      {/* Opera de manera autónoma GPS */}
      <div className="col-12 col-md-6">
        <label className="control-label pt-2">
          ¿Opera de manera autónoma GPS?
        </label>
        <SelectSiNo
          className="form-control myInput"
          name="opera_autonoma_gps"
          onBlur={revisionCompetencias}
          defaultValue={state.opera_autonoma_gps}
          onChange={setInfo}
        />
      </div>

      {/* Opera de manera autónoma Bomba Mark 3 */}
      <div className="col-12 col-md-6">
        <label className="control-label pt-2">
          ¿Opera de manera autónoma Bomba Mark 3?
        </label>
        <SelectSiNo
          className="form-control myInput"
          name="opera_autonoma_mark3"
          onBlur={revisionCompetencias}
          defaultValue={state.opera_autonoma_mark3}
          onChange={setInfo}
        />
      </div>

      {/* Opera de manera autónoma Motosierra */}
      <div className="col-4 col-md-6">
        <label className="control-label pt-2">
          ¿Opera de manera autónoma la Motosierra?
        </label>
        <SelectSiNo
          className="form-control myInput"
          name="opera_autonoma_motosierra"
          onBlur={revisionCompetencias}
          defaultValue={state.opera_autonoma_motosierra}
          onChange={setInfo}
        />
      </div>

      {/* ¿Ha ocupado la posición de Operador de Motosierra en alguna brigada? */}
      {state.opera_autonoma_motosierra === "1" && (
        <React.Fragment>
          <div className="col-6 col-md-6">
            <label className="control-label pt-2">
              ¿Ha ocupado la posición de Operador de Motosierra en alguna
              brigada?
            </label>
            <SelectSiNo
              className="form-control myInput"
              name="posicion_operador_moto_briga"
              onBlur={revisionCompetencias}
              defaultValue={state.posicion_operador_moto_briga}
              onChange={setInfo}
            />
          </div>
        </React.Fragment>
      )}
      {state.posicion_operador_moto_briga === "1" && (
        <React.Fragment>
          <div className="col-12 col-md-6">
            {/*  ¿En qué país? */}
            <label className="control-label pt-2">
              ¿En qué país?
              <select
                className="form-control myInput"
                name="pais_opero_moto"
                onChange={setInfo}
                onBlur={setInfo}
                value={state.pais_opero_moto ? state.pais_opero_moto : ""}
              >
                <option value="">---Seleccione---</option>
                <option value={0}>México</option>
                <option value={1}>Estados Unidos</option>
              </select>
            </label>
          </div>
          <div className="col-12 col-md-6">
            {/*  ¿En qué año? */}
            <label className="control-label pt-2">
              ¿En qué año?
              <input
                className="form-control myInput"
                name="anio_opero_moto"
                onChange={setAnio}
                onBlur={setAnio}
                type="number"
                value={state.anio_opero_moto ? state.anio_opero_moto : ""}
              />
            </label>
          </div>
        </React.Fragment>
      )}

      {/* ¿Maneja la aplicación Avenza Maps? */}
      <div className="col-4 col-md-6">
        <label className="control-label pt-2">
          ¿Maneja la aplicación Avenza Maps?
        </label>
        <SelectSiNo
          className="form-control myInput"
          name="maneja_app_avenza"
          defaultValue={state.maneja_app_avenza}
          onChange={setInfo}
          onBlur={setInfo}
        />
      </div>

      {/* ¿cuenta con certificado de primeros auxilios? */}
      <div className="col-12 col-md-8">
        <label className="control-label pt-2">
         ¿Cuenta con certificado de primeros auxilios?
        </label>
        <SelectSiNo
          className="form-control myInput"
          name="conocimientos_primeros_auxilios"
          defaultValue={state.conocimientos_primeros_auxilios}
          onChange={setInfo}
        />
      </div>
      {/* Cuenta con conocimientos de primero auxilios */}
      <div className="col-12 col-md-4">
        {state.conocimientos_primeros_auxilios === "1" && (
          <React.Fragment>
            <label className="control-label pt-2">Nivel:</label>
            <select
              className="form-control myInput"
              name="niv_primeros_auxilios"
              value={state.niv_primeros_auxilios}
              onChange={setInfo}
            >
              <option>---Seleccione---</option>
              <option value="basico">Básico</option>
              <option value="intermedio">Intermedio</option>
              <option value="avanzado">Avanzado</option>
            </select>
          </React.Fragment>
        )}
      </div>

      {/* ARCHIVO ACREDITACION */}
      <div className="col-12 col-md-12">
        {state.conocimientos_primeros_auxilios === "1" && (
          <React.Fragment>
            <label className="control-label pt-2">
              Documento de acreditación
            </label>
            <input
              className="form-control myInput"
              type="file"
              accept="application/pdf"
              name="doc_acred_primeros_auxilios"
              onChange={setInfo}
            />
          </React.Fragment>
        )}
      </div>

      {/* BTN Continuar */}
      <div className="col-12 pt-5 btn-margin">
        <button
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

export default S6;
