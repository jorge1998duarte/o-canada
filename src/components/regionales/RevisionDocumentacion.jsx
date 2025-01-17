import React, { useState, useEffect, useMemo, useContext } from "react";

import {
  Nav,
  Modal,
  Button,
  Form,
  Col,
  InputGroup
} from "react-bootstrap";
import AlertError from "../../singles/AlertError";
import DataTable from "react-data-table-component";
import AlertaSiguiente from "../../singles/AlertaSiguiente";
import AlertExito from "../../singles/AlertExito";
import AlertCargando from "../../singles/AlertCargando";
import { AiOutlineReload } from "react-icons/ai";
import sessionContext from "../../context/session/sessionContext";
import { getRegionals, getRegionalsBySearch, postRegionalInformation, postRegionalsApproveCandidate, postRegionalsDisapproveCandidate } from "../../services/regionals/RegionalService";

const RevisionDocumentacion = () => {
  const sessContext = useContext(sessionContext);
  /* TODO:
    -> cambiar a liga de produccion
    -> revision de srvicio activo
    -> cambio a base de datos produccion
    */

  const [, setCandidatos] = useState([]);
  const [datosTabla, setDatosTabla] = useState([]);
  const [searchWord, setSearchWord] = useState("");
  // const [paginasPor, setPaginasPor] = useState(10)
  const [reload, setReload] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [infoObservacionModal, setInfoObservacionModal] = useState({});
  const [toggleCleared, setToggleCleared] = useState(false);
  const [loading, setLoading] = useState(false);
  const [directionValue,] = useState("auto");
  const [nombreRegion, setNombreRegion] = useState("");

  const paginationOptions = {
    rowsPerPageText: "Filas por página",
    rangeSeparatorText: "de",
    selectAllRowsItem: true,
    selectAllRowsItemText: "Todos",
  };

  const getRegionName = () => {
    const { user } = sessContext.login;

    switch (user.user_type) {
      case "1":
        setNombreRegion("Noroeste");
        break;
      case "2":
        setNombreRegion("Norte");
        break;
      case "3":
        setNombreRegion("Noreste");
        break;
      case "4":
        setNombreRegion("Occidente");
        break;
      case "5":
        setNombreRegion("Centro");
        break;
      case "6":
        setNombreRegion("Sureste");
        break;
      default:
        setNombreRegion("OF.Centrales");
        break;
    }
  };

  /* Edicion de la tabla */
  const buscarRegistro = async () => {
    const { user } = sessContext.login;
    AlertCargando("Buscando similitudes...");
    setLoading(true);
    if (searchWord !== "") {
      if (user) {
        await getRegionalsBySearch({
          busqueda: searchWord,
          email: user.email,
          token: user.token,
          user_type: user.user_type,
        }).then((resp) => {
          if (resp.status === 200) {
            setCandidatos(resp.data);
            setDatosTabla(resp.data);
            AlertExito("Se han cargado los registros existentes");
            setLoading(false);
          } else {
            AlertError("Error", resp.data);
          }
        }).catch((error) => {
          AlertError("Error", error.responseJSON);
        })
      }
    } else {
      getCandidatos();
    }
  };

  const getCandidatos = async () => {
    const { user } = sessContext.login;
    AlertCargando("Solicitando registros...");
    setLoading(true);
    await getRegionals(user).then((resp) => {
      if (resp.status === 200) {
        setCandidatos(resp.data);
        setDatosTabla(resp.data);
        AlertExito("Se han cargado los registros");
        setLoading(false);
      } else {
        AlertError("Error", resp.data);
      }
    }).catch((error) => {
      AlertError("Error:", error.responseJSON);
    });

  };

  useEffect(() => {
    getCandidatos();
    getRegionName();
    setReload(false);
    return () => { }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload]);

  const mostrarDocumento = (documento, data) => {
    const url = `${process.env.REACT_APP_BACKEND_FILES}${data.curp}/${documento}`;
    window.open(url, "_blank");
  };

  const getNombreArchivo = (item) => {
    const indiceExtension = item.indexOf(".");
    const archivo = item.substring(0, indiceExtension);
    switch (archivo) {
      case "carta_antecedentes":
        return "Carta de antecentes penales";

      case "cert_intern_ate_emerg_med_file":
        return "Cert. Inter Emergencias";

      case "cert_medico":
        return "Cert. Médico";

      case "cert_toxicologico":
        return "Cert. Toxicologico";

      case "curp_archivo":
        return "CURP";

      case "doc_acred_primeros_auxilios":
        return "Acred. P. Auxilios";

      case "ETA":
        return "VISA/eTA";

      case "VISA":
        return "VISA/eTA";

      case "fotografia":
        return "Fotografía";

      case "licencia_manejo":
        return "Licencia de manejo";

      case "l_280_file":
        return "Cert. L-280";

      case "pasaporte_archivo":
        return "Pasaporte";

      case "sci_smi_100":
        return "SCI 100";

      case "sci_smi_200":
        return "SCI 200";

      case "sci_smi_300":
        return "SCI 300";

      case "toefl":
        return "TOEFL/TOEIC";

      case "toeic":
        return "TOEFL/TOEIC";

      case "s_130":
        return "Cert. S-130";

      case "s_190":
        return "Cert. S-190";

      case "s_290_file":
        return "Cert. S-290";

      case "s_211_file":
        return "Cert. S-211";

      case "sci_cemi":
        return "Cert. CEMI";

      case "cert_intern_incendios_file":
        return "Cert. Intern. Incendios";

      case "visa_estadounidense":
        return "VISA USA";

      case "formato_eval_habilidad_uso_mark_III":
        return "Formato Evalución Mark III";

      case "formato_eval_habilidad_uso_gps":
        return "Formato Evalución GPS";

      case "formato_eval_habilidad_uso_avenza_maps":
        return "Formato Evalución Avenza Maps";

      case "formato_epp":
        return "Formato Equipo Completo";

      case "formato":
        return "Formato Prueba Arduo";

      case "formato_carrera":
        return "Formato Prueba Carrera";

      case "formato_eval_habilidad_uso_motosierra":
        return "Formato Evalución Motosierra";

      case "constancia_curso_s_211":
        return "Constancia Presentada 211";

      case "evaluacion_desempenio_california2020":
        return "Evaluación de Desempeño 2020";

      case "evaluacion_desempenio_canada2021":
        return "Evaluación de Desempeño 2021";

      case "evaluacion_disponibilidad":
        return "Evaluación de Disponibilidad";

      case "certificado_covid":
        return "Cert. Covid-19";

      case "certificado_covid_refuerzo":
        return "Cert. Covid-19 Refuerzo";

      case "constancia_operaciones_aereas":
        return "Cost. Operaciones Aéreas";

      default:
        return "check= " + item;
    }
  };

  const BotonesPDFs = ({ data }) => {
    return (
      <div className="py-5">
        <Nav justify variant="pills" defaultActiveKey="">
          {data.files
            ? data.files.map((item, index) => (
              <Nav.Item key={index}>
                <Nav.Link
                  eventKey={item}
                  onClick={() => mostrarDocumento(item, data)}
                >
                  {getNombreArchivo(item)}
                </Nav.Link>
              </Nav.Item>
            ))
            : null}
        </Nav>
      </div>
    );
  };

  const columns = [
    {
      name: "Estatus",
      selector: "aprobado_regionales",
      conditionalCellStyles: [
        {
          when: (row) => row.aprobado_regionales === "aprobado",
          style: {
            backgroundColor: "#237819",
            // fontSize: '20px',
            color: "#FFFF",
            "&:hover": {
              cursor: "pointer",
            },
          },
        },
        {
          when: (row) => row.aprobado_regionales === "desaprobado",
          style: {
            backgroundColor: "#A01F3F",
            // fontSize: '20px',
            color: "#FFFF",
            "&:hover": {
              cursor: "pointer",
            },
          },
        },
      ],
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      sortable: true,
    },
    {
      name: "Agregar Observacion",
      wrap: true,
      button: true,
      minWidth: "180px",
      cell: (row) => (
        <Button onClick={() => agregarObservacion(row)}>Observacion</Button>
      ),
    },
    {
      name: "CURP",
      selector: "curp",
      wrap: false,
      minWidth: "200px",
      // minHeight: '200px',
      sortable: true,
    },
    {
      name: "Nombres",
      selector: "nombres",
      wrap: true,
      minWidth: "200px",
      sortable: true,
    },
    {
      name: "Estado",
      selector: "nom_ent",
      wrap: true,
      sortable: true,
    },
    {
      name: "Municipio",
      selector: "nom_mun",
      wrap: true,
      sortable: true,
    },
    {
      name: "Fecha Nacimiento",
      selector: "fecha_nacimiento",
      wrap: true,
      sortable: true,
    },
    {
      name: "Grpo. sanguíneo",
      selector: "grupo_sanguineo",
      wrap: true,
      sortable: true,
    },
    {
      name: "RFC",
      selector: "rfc",
      wrap: true,
      minWidth: "200px",
      sortable: true,
    },
    {
      name: "Cart.Ant.Pnls.",
      selector: "antecedentes_fecha",
      wrap: true,
      sortable: true,
    },
    {
      name: "Num. Pasaporte",
      selector: "pasaporte_numero",
      wrap: true,
      sortable: true,
    },
    {
      name: "Fecha cad.Pasaporte",
      selector: "pasaporte_fecha_cad",
      wrap: true,
      sortable: true,
    },
    {
      name: "Doc. Para viajar ",
      selector: "documento_viajar_canada",
      wrap: true,
      sortable: true,
    },
    {
      name: "Num. ETA-VISA",
      selector: "eta_visa_num",
      wrap: true,
      sortable: true,
    },
    {
      name: "Fecha expd.ETA-VISA fecha_exp",
      selector: "eta_visa_fecha_exp",
      wrap: true,
      sortable: true,
    },
    {
      name: "Fecha Cad. ETA-VISA",
      selector: "eta_visa_fecha_cad",
      wrap: true,
      sortable: true,
    },
    {
      name: "lic. Fecha Cad.",
      selector: "licencia_fecha_cad",
      wrap: true,
      sortable: true,
    },
    {
      name: "Fecha cert.Tox.",
      selector: "fecha_cert_toxicologico",
      wrap: true,
      sortable: true,
    },
    {
      name: "Fecha cert.Médico",
      selector: "fecha_cert_medico",
      wrap: true,
      sortable: true,
    },
    {
      name: "Teléfono",
      selector: "numero_telefonico_notificaciones",
      wrap: true,
      sortable: true,
    },
    {
      name: "Email",
      selector: "correo_electronico",
      wrap: true,
      minWidth: "200px",
      sortable: true,
    },
    {
      name: "Posición",
      selector: "posicion_candidato",
      wrap: true,
      sortable: true,
    },
    {
      name: "Dependencia",
      selector: "dependencia",
      minWidth: "200px",
      wrap: true,
      sortable: true,
    },
    {
      name: "Tipo Depend.",
      selector: "tipo_dependencia",
      wrap: true,
      sortable: true,
    },
    {
      name: "Benef.",
      selector: "nombre_beneficiario",
      wrap: true,
      minWidth: "200px",
      sortable: true,
    },
    {
      name: "Tel. Benef.",
      selector: "telefono_beneficiario",
      wrap: true,
      sortable: true,
    },
    {
      name: "Correo Benef.",
      selector: "correo_beneficiario",
      wrap: true,
      minWidth: "200px",
      sortable: true,
    },
    {
      name: "Tip.Licencia",
      selector: "tipo_licencia",
      wrap: true,
      sortable: true,
    },
    {
      name: "Niv. Inglés",
      selector: "nivel_ingles",
      wrap: true,
      sortable: true,
    },
    {
      name: "Calif.TOEFL.",
      selector: "examen_toeic_toefl_punt",
      wrap: true,
      sortable: true,
    },
    {
      name: "Opera gps",
      selector: "opera_autonoma_gps",
      wrap: true,
      sortable: true,
    },
    {
      name: "Opera mark3",
      selector: "opera_autonoma_mark3",
      wrap: true,
      sortable: true,
    },
    {
      name: "Opera motosierra",
      selector: "opera_autonoma_motosierra",
      wrap: true,
      sortable: true,
    },
    {
      name: "Equipo Completo",
      selector: "tiene_epp_completo",
      wrap: true,
      sortable: true,
    },
    {
      name: "Fecha ing. Dependencia",
      selector: "fecha_ingreso_dependencia",
      wrap: true,
      sortable: true,
    },
    {
      name: "Sexo",
      selector: "sexo",
      wrap: true,
      sortable: true,
    },
    {
      name: "Puesto dependencia",
      selector: "puesto_en_dependencia",
      wrap: true,
      minWidth: "200px",
      sortable: true,
    },
    {
      name: "Fun. Dependencia",
      selector: "funciones_dependencia",
      wrap: true,
      sortable: true,
    },
    {
      name: "Nvl.Prim.Aux.",
      selector: "niv_primeros_auxilios",
      wrap: true,
      sortable: true,
    },
    {
      name: "Con.Prim.Aux.",
      selector: "conocimientos_primeros_auxilios",
      wrap: true,
      sortable: true,
    },
    {
      name: "Región",
      selector: "region",
      wrap: true,
      sortable: true,
    },
  ];

  const sendObservacion = async () => {
    /* TOMAR STATE */
    await postRegionalInformation({
      data: infoObservacionModal,
    }).then((resp) => {
      if (resp.status === 200) {
        AlertExito("Éxito", "El registro fue actualizado");
        setReload(true);
      }
    });

    /* ENVIARLO VIA AXIOS */
    /* HACER RELOAD */
  };

  const agregarObservacion = (row) => {
    setInfoObservacionModal(row);
    handleShowModal(true);
  };

  const manejadorCambiosColumnas = (state) => {
    setSelectedRows(state.selectedRows);
  };

  const aprobarRegistros = async () => {

    /* ENVIO DE AXIOS PARA APROBACION DE CANDIDATO POR CADA CURP */
    await postRegionalsApproveCandidate({
      data: selectedRows,
    }).then((resp) => {
      if (resp.status === 200) {
        setSelectedRows([]);
        setToggleCleared(!toggleCleared);
        setReload(true);
        AlertExito("Registros Aprobados");
      }

    }).catch((error) => {
      AlertError("Error", error);
    });


  };
  const desaprobarRegistros = async () => {
    /* ENVIO DE AXIOS PARA DESAPROBACION POR CADA CURP */
    await postRegionalsDisapproveCandidate({
      data: selectedRows,
    }).then((resp) => {
      if (resp.status === 200) {
        setSelectedRows([]);
        setToggleCleared(!toggleCleared);
        setReload(true);
        AlertExito("Registros desaprobados");
      }
    }).catch((error) => {
      AlertError("Error", error.responseJSON);
    });

  };

  const conditionalRowStyles = [
    {
      when: (row) => row.observacion_regional,
      style: {
        backgroundColor: "#b78d86",
        color: "white",
        "&:hover": {
          cursor: "pointer",
        },
      },
    },
  ];

  const contextActions = useMemo(() => {

    const handleAprobar = () => {
      AlertaSiguiente(
        "Se aprobarán los registros seleccionados",
        aprobarRegistros
      );
    };

    const handleDesaprobar = () => {
      AlertaSiguiente(
        "Se desaprobarán los registros seleccionados",
        desaprobarRegistros
      );
    };

    return (
      <>
        <button
          className="btn btn-success"
          key="aprobar"
          onClick={handleAprobar}
        >
          Aprobar
        </button>
        <button
          className="btn btn-danger"
          key="desaprobar"
          onClick={handleDesaprobar}
        >
          Desaprobar
        </button>
      </>
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datosTabla, selectedRows, toggleCleared]);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  return (
    <div>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            Agregar observacion a la curp <b>{infoObservacionModal.curp}</b>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            name="observacion_regional"
            onChange={(input) => {
              setInfoObservacionModal({
                curp: infoObservacionModal.curp,
                observacion_regional: input.target.value,
              });
            }}
            value={infoObservacionModal.observacion_regional}
            as="textarea"
            rows="3"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={sendObservacion}
            onBlur={handleCloseModal}
          >
            Agregar
          </Button>
          <Button variant="danger" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
      <div style={{ alignContent: "right" }}>
        <h3>Region: {nombreRegion}</h3>
      </div>
      {/* BOTONERA */}
      <InputGroup className="mb-2 pt-4">
        <Form.Row className="align-items-center">
          <Col xs="auto">
            <Form.Control
              onChange={(input) => setSearchWord(input.target.value)}
              className="mb-2 px-5"
              value={searchWord}
              placeholder="Buscar..."
            />
          </Col>
          <Col xs="auto">
            <Button className="mb-2" onClick={buscarRegistro}>
              Buscar
            </Button>
          </Col>
          <Col xs="auto">
            <Button
              className="mb-2"
              variant="info"
              onClick={() => {
                setSearchWord("");
                setReload(true);
              }}
            >
              <AiOutlineReload />
            </Button>
          </Col>
        </Form.Row>
      </InputGroup>

      {/* TABLA */}

      <DataTable
        title="Candidatos"
        columns={columns}
        data={datosTabla}
        defaultSortField="curp"
        expandableRows
        expandOnRowClicked
        expandableRowsComponent={<BotonesPDFs />}
        paginationComponentOptions={paginationOptions}
        persistTableHead
        progressPending={loading}
        fixedHeader
        contextActions={contextActions}
        contextMessage={{
          singular: "registro",
          plural: "registros",
          message: "seleccionados",
        }}
        subHeaderAlign={"left"}
        direction={directionValue}
        selectableRows
        selectableRowsHighlight
        clearSelectedRows={toggleCleared}
        onSelectedRowsChange={manejadorCambiosColumnas}
        conditionalRowStyles={conditionalRowStyles}
        pagination
      />
    </div>
  );
};

export default RevisionDocumentacion;
