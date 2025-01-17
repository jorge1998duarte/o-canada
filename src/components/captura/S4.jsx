import React, { useState } from "react";
import SelectSiNo from "../../singles/SelectSiNo";
import AlertaSiguiente from "../../singles/AlertaSiguiente";
import AlertError from "../../singles/AlertError";

/* CONTEXT */
import { validarExtPdf } from "../../helpers/validarExtPDF";
import ExamenSCI100 from "../examenes/examen_sci100/ExamenSCI100";
import SelectEstados from "../../singles/SelectEstados";

const S4 = (props) => {
  const { state, setState, checkData, files, setStateFiles } = props;
  const [isCompleteExam, setIsCompleteExam] = useState(false);
  const [isLoadCourses, setIsLoadCourses] = useState(false);

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

  return (
    <div className="row body_wrap">
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
            setIsLoadCourses(
              files.sci_smi_100_fl &&
                files.sci_smi_200_fl
                ? true
                : false
            );
          }}
          onMouseLeave={() => {
            setIsLoadCourses(
              files.sci_smi_100_fl &&
                files.sci_smi_200_fl
                ? true
                : false
            );
          }}
          placeholder="Ingrese SCI/SMI 100..."
          disabled={isCompleteExam}
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
            setIsLoadCourses(
              files.sci_smi_100_fl &&
                files.sci_smi_200_fl
                ? true
                : false
            );
          }}
          onMouseLeave={() => {
            setIsLoadCourses(
              files.sci_smi_100_fl &&
                files.sci_smi_200_fl
                ? true
                : false
            );
          }}
          placeholder="Ingrese SCI/SMI 200..."
          disabled={isCompleteExam}
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
          onBlur={() => {
            setIsLoadCourses(
              files.sci_smi_100_fl &&
                files.sci_smi_200_fl
                ? true
                : false
            );
          }}
          onMouseLeave={() => {
            setIsLoadCourses(
              files.sci_smi_100_fl &&
                files.sci_smi_200_fl
                ? true
                : false
            );
          }}
          placeholder="Ingrese SCI/SMI 300..."
          disabled={isCompleteExam}
        />
      </div>

      {isLoadCourses && (
        <React.Fragment>
          {/*¿Ha participado en eventos planeados o no planeados atendidos bajo el SCI en el año 2023 (Quema prescrita,  Curso, Capacitación, incendios en su estado, entre otros.)? */}
          <div className="col-12">
            <label className="control-label danger pt-2">
              ¿Ha participado en eventos planeados o no planeados atendidos bajo el SCI en el año 2023 (Quema prescrita,  Curso, Capacitación, incendios en su estado, entre otros.)?
            </label>
            <SelectSiNo
              className="form-control myInput"
              name="eventos_planeados_sci_2023"
              onChange={setInfo}
              value={
                state.eventos_planeados_sci_2023
                  ? state.eventos_planeados_sci_2023
                  : ""
              }
            />
            disabled={isCompleteExam}
          </div>

          {state.eventos_planeados_sci_2023 === "1" && (
            <React.Fragment>
              <div className="col-4">
                <label className="control-label danger pt-2">¿En cuál posición?</label>
                <input
                  className="form-control myInput"
                  name="eventos_planeados_sci_2023_posicion"
                  type="text"
                  onChange={setInfo}
                  placeholder="Indique cual posición..."
                  value={state.eventos_planeados_sci_2023_posicion ? state.eventos_planeados_sci_2023_posicion : ""}
                  disabled={isCompleteExam}
                />
              </div>
              <div className="col-4">
                <label className="control-label danger pt-2">Nombre del Incidente</label>
                <input
                  className="form-control myInput"
                  name="eventos_planeados_sci_2023_incidente"
                  type="text"
                  onChange={setInfo}
                  placeholder="Indique cual posición..."
                  value={state.eventos_planeados_sci_2023_incidente ? state.eventos_planeados_sci_2023_incidente : ""}
                  disabled={isCompleteExam}
                />
              </div>
              <div className="col-4">
                <label className="control-label danger pt-2">¿En qué estado?</label>
                <SelectEstados
                  className="form-control myInput"
                  name="eventos_planeados_sci_2023_estado"
                  onChange={setInfo}
                  value={state.eventos_planeados_sci_2023_estado ? state.eventos_planeados_sci_2023_estado : ""}
                  placeholder="Indique cual posición..."
                  disabled={isCompleteExam}
                />
              </div>
            </React.Fragment>
          )}

          {/* ¿Ha participado en eventos planeados o no planeados atendidos bajo el SCI en el año 2022 (Quema prescrita,  Curso, Capacitación, incendios en su estado, entre otros.)? */}
          <div className="col-12">
            <label className="control-label danger pt-2">
            ¿Ha participado en eventos planeados o no planeados atendidos bajo el SCI en el año 2022 (Quema prescrita,  Curso, Capacitación, incendios en su estado, entre otros.) (Quema prescrita,  Curso, Capacitación, incendios en su estado, entre otros.)?
            </label>
            <SelectSiNo
              className="form-control myInput"
              name="eventos_planeados_sci_2022"
              onChange={setInfo}
              disabled={isCompleteExam}
              value={
                state.eventos_planeados_sci_2022
                  ? state.eventos_planeados_sci_2022
                  : ""
              }
            />
          </div>

          {state.eventos_planeados_sci_2022 === "1" && (
            <React.Fragment>
              <div className="col-4">
                <label className="control-label danger pt-2">¿En cuál posición?</label>
                <input
                  className="form-control myInput"
                  name="eventos_planeados_sci_2022_posicion"
                  type="text"
                  onChange={setInfo}
                  disabled={isCompleteExam}
                  placeholder="Indique cual posición..."
                  value={state.eventos_planeados_sci_2022_posicion ? state.eventos_planeados_sci_2022_posicion : ""}
                />
              </div>
              <div className="col-4">
                <label className="control-label danger pt-2">Nombre del Incidente</label>
                <input
                  className="form-control myInput"
                  name="eventos_planeados_sci_2022_incidente"
                  type="text"
                  onChange={setInfo}
                  placeholder="Indique cual posición..."
                  disabled={isCompleteExam}
                  value={state.eventos_planeados_sci_2022_incidente ? state.eventos_planeados_sci_2022_incidente : ""}
                />
              </div>
              <div className="col-4">
                <label className="control-label danger pt-2">¿En qué estado?</label>
                <SelectEstados
                  className="form-control myInput"
                  name="eventos_planeados_sci_2022_estado"
                  onChange={setInfo}
                  value={state.eventos_planeados_sci_2022_estado ? state.eventos_planeados_sci_2022_estado : ""}
                  placeholder="Indique cual posición..."
                  disabled={isCompleteExam}
                />
              </div>
            </React.Fragment>
          )}

          {/* ¿Ha participado en eventos planeados o no planeados atendidos bajo el SCI en el año 2021 (Quema prescrita,  Curso, Capacitación, incendios en su estado, entre otros.)? */}
          <div className="col-12">
            <label className="control-label danger pt-2">
            ¿Ha participado en eventos planeados o no planeados atendidos bajo el SCI en el año 2021 (Quema prescrita,  Curso, Capacitación, incendios en su estado, entre otros.)?
            </label>
            <SelectSiNo
              className="form-control myInput"
              name="eventos_planeados_sci_2021"
              onChange={setInfo}
              value={
                state.eventos_planeados_sci_2021
                  ? state.eventos_planeados_sci_2021
                  : ""
              }
              disabled={isCompleteExam}
            />
          </div>

          {state.eventos_planeados_sci_2021 === "1" && (
            <React.Fragment>
              <div className="col-4">
                <label className="control-label danger pt-2">¿En cuál posición?</label>
                <input
                  className="form-control myInput"
                  name="eventos_planeados_sci_2021_posicion"
                  type="text"
                  onChange={setInfo}
                  placeholder="Indique cual posición..."
                  value={state.eventos_planeados_sci_2021_posicion ? state.eventos_planeados_sci_2021_posicion : ""}
                  disabled={isCompleteExam}
                />
              </div>
              <div className="col-4">
                <label className="control-label danger pt-2">Nombre del Incidente</label>
                <input
                  className="form-control myInput"
                  name="eventos_planeados_sci_2021_incidente"
                  type="text"
                  onChange={setInfo}
                  placeholder="Indique cual posición..."
                  value={state.eventos_planeados_sci_2021_incidente ? state.eventos_planeados_sci_2021_incidente : ""}
                  disabled={isCompleteExam}
                />
              </div>
              <div className="col-4">
                <label className="control-label danger pt-2">¿En qué estado?</label>
                <SelectEstados
                  className="form-control myInput"
                  name="eventos_planeados_sci_2021_estado"
                  onChange={setInfo}
                  value={state.eventos_planeados_sci_2021_estado ? state.eventos_planeados_sci_2021_estado : ""}
                  placeholder="Indique cual posición..."
                  disabled={isCompleteExam}
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
              value={
                state.evaluado_menejo_incidentes
                  ? state.evaluado_menejo_incidentes
                  : ""
              }
              disabled={isCompleteExam}
            />
          </div>
          {/* Indique cual Posición */}
          {state.evaluado_menejo_incidentes === "1" && (
            <React.Fragment>
              <div className="col-5">
                <label className="control-label pt-2">
                  Indique cual Posición
                </label>
                <input
                  className="form-control myInput"
                  name="manejo_incidentes_posicion"
                  type="text"
                  onChange={setInfo}
                  placeholder="Indique cual posición..."
                  value={state.manejo_incidentes_posicion ? state.manejo_incidentes_posicion : ""}
                />
                 disabled={isCompleteExam}
              </div>
            </React.Fragment>
          )}
        </React.Fragment>
      )}

      {/* BTN SCI/SMI 100 */}
      <div className="col-12 pt-5 btn-margin">
        <ExamenSCI100
          hidden={
            files.sci_smi_100_fl &&
            files.sci_smi_200_fl &&
            state.eventos_planeados_sci_2021 &&
            state.eventos_planeados_sci_2022 &&
            state.eventos_planeados_sci_2023 &&
            state.evaluado_menejo_incidentes &&
            !isCompleteExam
              ? false
              : true
          }
          setIsCompleteExam={setIsCompleteExam}
          state={state}
          setState={setState}
        />
      </div>

      <div className="col-12 pt-5 btn-margin">
        <button
          disabled={!isCompleteExam}
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
