import React from "react";
import SelectSiNo from "../../singles/SelectSiNo";
import AlertaSiguiente from "../../singles/AlertaSiguiente";
import diferenciaFechasDias from "../../helpers/diferenciaFechaDias";
import { CheckListEquipo } from "../../singles/CheckEquipos";
import { formatDate } from "../../helpers/formatDate";
import AlertError from "../../singles/AlertError";
import { validarExtPdf } from "../../helpers/validarExtPDF";

const S7 = (props) => {
  const { state, setState, checkData, setStateFiles, files } = props;

  const setInfo = (input) => {
    if (input.target.name === "carta_antecedentes") {
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
      setState({
        ...state,
        [input.target.name]: input.target.value,
      });
    }
  };

  const revisarValidaciones = () => {
    const {
      tiene_mochila_linea,
      tiene_duffel_bag,
      tiene_casa_campania,
      tiene_sleeping_bag,
      tiene_sleeping_pad,
      antecedentes_fecha,
    } = state;

    const dif_antecedentes = diferenciaFechasDias(antecedentes_fecha);

    if (dif_antecedentes > 31 * 2) {
      setState({
        ...state,
        rechazo: true,
        motivo_rechazo: "carta de antecedentes mayor a 2 meses",
        fechaCreacion : formatDate(new Date().toString().toUpperCase(), 0),
      });
    } else {
      if (
        tiene_mochila_linea === "0" ||
        tiene_duffel_bag === "0" ||
        tiene_casa_campania === "0" ||
        tiene_sleeping_bag === "0" ||
        tiene_sleeping_pad === "0"
      ) {
        setState({
          ...state,
          rechazo: true,
          motivo_rechazo: "no cuenta con equipo completo",
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
    }
  };
  return (
    <div className="row body_wrap">
      {/* Carta de no antecedentes penales */}
      <div className="col-12 col-md-6">
        <label className="control-label pt-2">
          Carta de no antecedentes penales
        </label>
        <input
          className="form-control myInput"
          name="carta_antecedentes"
          type="file"
          accept="application/pdf"
          onChange={setInfo}
          onBlur={revisarValidaciones}
          placeholder="Carta de no antecedentes penales"
        />
      </div>

      {/* Fecha de expedición de la carta de antecedentes no penales */}
      <div className="col-12 col-md-6">
        <label className="control-label pt-2">
          Fecha de expedición de la carta de antecedentes no penales
        </label>
        <input
          className="form-control myInput"
          name="antecedentes_fecha"
          value={state.antecedentes_fecha}
          type="date"
          onChange={setInfo}
          onBlur={revisarValidaciones}
          placeholder="Fecha de expedición de la carta de antecedentes no penales"
        />
      </div>

      {/* Cuenta con EPP completo */}
      <div className="col-12 col-md-12">
        <label className="control-label pt-2">
          <h5> ¿Cuenta con el siguiente equipo de despliegue completo?</h5>
          <ul>
            <li>
              <b>Casco</b> (Casco especializado para el combate de incendios
              forestales que cumpla la norma internacional NFPA 1977 color
              amarillo con barbiquejo)
            </li>
            <li>
              <b>Protector de nuca</b> (De fibras ignifugas preferentemente
              Aramida o Nomex®‎)
            </li>
            <li>
              <b>Googles</b> (Material resistente con micas transparentes y
              sistema de sujeción al casco)
            </li>
            <li>
              <b>2 Camisolas</b> (Color amarillo de fibras ignifugas
              preferentemente Aramida o Nomex®‎)
            </li>
            <li>
              <b>2 Pantalones</b> (Tipo cargo color verde de fibras ignifugas
              preferentemente Aramida o Nomex®‎)
            </li>
            <li>
              <b>2 pares de Guantes</b> (De piel)
            </li>
            <li>
              <b>2 pares de Botas</b> (Cosidas de piel, caña de mínimo 23 cm de
              altura, suela ignifuga y antiderrapante)
            </li>
            <li>
              <b>Cinturón</b> (Color negro, de piel o material resistente al
              fuego)
            </li>
            <li>
              <b>Sudadera</b> (Color negro con capucha)
            </li>
            <li>
              <b>Chamarra</b> (Color verde, Térmica)
            </li>
            <li>
              <b>Impermeable</b> (Tipo poncho color amarillo)
            </li>
            <li>
              <b>Botiquín individual</b> (Como mínimo deberá contener lo
              siguiente: Antisépticos (Alcohol y/o isodine) se sugiere la
              presentación de toallitas, 4 cubre bocas, gel antibacterial
              (mínimo 100 m)l, repelente para mosquitos, 2 gasas de 10X10, 1
              venda elástica de 10 cm, 1 cinta adhesiva, 1 par de guantes de
              látex, Pastillas para (dolor, vómito, diarrea), 4 cubrebocas negros)
            </li>
            <li>
              <b>Recipientes para agua</b> (De plástico o metal con los cuales
              se pueda transportar mínimo 4 litros de agua)
            </li>
            <li>
              <b>Brújula</b> (Lensática, cartográfica o polivalente)
            </li>
            <li>
              <b>Silbato</b> (De emergencia sin esfera interior)
            </li>
            <li>
              <b>Linterna</b> (Manos libres, ligera, confortable, resistente al
              agua.)
            </li>
            <li>
              <b>Libreta de campo</b> (Sin especificaciones mínimas)
            </li>
            <li>
              <b>Navaja</b> (Sin especificaciones mínimas)
            </li>
            <li>
              <b>Mochila de línea</b> (Especializada para actividades de manejo
              del fuego, resistente, ergonómica, capacidad mínima de 20 litros,
              espacio para portar bolsa de hidratación, preferentemente con las
              siguientes certificaciones: Certificado UL® y NFPA 1977-2016, ,
              500D Y 1000D CORDURA®, o características superiores)
            </li>
            <li>
              <b>Mochila de viaje Duffel Bag</b> (Resistente, Impermeable,
              Capacidad de hasta 130 litros, Tirantes para hombros, Correa para
              hombro y sin ruedas)
            </li>
            <li>
              <b>Casa de campaña</b> (Capacidad de 1-2 personas, Impermeabilidad
              de mínimo 200 mm agua/h/m², Mínimo 3 estaciones)
            </li>
            <li>
              <b>Sleeping bag</b> (Bolsa de dormir con temperatura confort-1°C,
              Ligero, Resistente)
            </li>
            <li>
              <b>Sleeping pad</b> (Tapete para dormir aislante, ligero y
              resistente)
            </li>
          </ul>

          <SelectSiNo
            className="form-control myInput"
            name="tiene_epp_completo"
            onBlur={revisarValidaciones}
            defaultValue={state.tiene_epp_completo}
            onChange={setInfo}
          />
        </label>
      </div>

      <div className="col-12 col-md-12">
        {state.tiene_epp_completo === "0" && (
          <React.Fragment>
            <label className="control-label pt-3">
              <h5> Seleccione el equipo de despliegue con el que cuenta: </h5>
            </label>
            <CheckListEquipo setState={setState} state={state} />
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

export default S7;
