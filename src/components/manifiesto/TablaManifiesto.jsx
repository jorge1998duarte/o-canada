import React, { Fragment, useState, useEffect } from "react";
import { Col, Form } from "react-bootstrap";
import { InputGroup } from "react-bootstrap";
import { Button } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { AiOutlineEye, AiOutlineReload } from "react-icons/ai";
import AlertCargando from "../../singles/AlertCargando";
import AlertExito from "../../singles/AlertExito";
import AsignarBrigada from "./AsignarBrigada";
import { useHistory } from "react-router-dom";
import { postBrigadesCandidates } from "../../services/manifest/ManifestService";

const TablaManifiesto = () => {
  const [asignarBrigada, setAsignarBrigada] = useState(false);
  const [candidato, setCandidato] = useState(null);
  const [data, setData] = useState();
  const [reload, setReload] = useState(true);
  const [search, setSearch] = useState();
  const history = useHistory();

  const showAsignarBrigada = (data) => {
    setCandidato(data);
    setAsignarBrigada(true);
  };

  useEffect(() => {

    if (reload) {
      AlertCargando("Cargando información");
      postBrigadesCandidates({ search: search ? search : "" }).then(async ({ data: { data } }) => {
        await setData(data);
        AlertExito(
          "Se han cargado los candidatos disponibles para asignar u asignados"
        );
      });
      setSearch("");
      setReload(false);
    }

    return () => { };
  }, [reload, search]);

  const columns = [
    {
      name: "Acciones",
      wrap: true,
      button: true,
      minWidth: "180px",
      /* asignar candidato a una brigada */
      cell: (row) =>
        row.asignado === "1" || row.asignado === "0" ? (
          <Button
            className="btn btn-block btn-info"
            onClick={() => showAsignarBrigada(row)}
          >
            Editar
          </Button>
        ) : (
          <Button
            className="btn btn-block btn-success"
            onClick={() => showAsignarBrigada(row)}
          >
            Asignar
          </Button>
        ),
    },
    {
      name: "CURP",
      selector: "curp_brigadista",
      wrap: false,
      minWidth: "200px",
      sortable: true,
    },
    {
      name: "Nombre",
      selector: "nombres",
      wrap: false,
      minWidth: "200px",
      sortable: true,
    },
    {
      name: "Puesto",
      selector: "posicion_candidato",
      wrap: false,
      minWidth: "200px",
      sortable: true,
    },
    {
      name: "Estado",
      selector: "nom_ent",
      wrap: false,
      minWidth: "200px",
      sortable: true,
    },
    {
      name: "Brigada Asignada",
      selector: "brigada",
      wrap: false,
      minWidth: "200px",
      sortable: true,
    },
    {
      name: "Estatus",
      selector: "asignado",
      wrap: false,
      minWidth: "200px",
      cell: (row) =>
        row.asignado === "1" ? (
          <label className="p-2  rounded bg-info text-white">Asignado</label>
        ) : row.asignado === "0" ? (
          <label className="p-2  rounded bg-danger text-white">
            No Asignado
          </label>
        ) : (
          <label className="p-2  rounded bg-secondary text-white">
            Por Definir
          </label>
        ),
    },
  ];

  const handleView = () => {
    history.push('/dashboard/ver-reporte');
  }

  return asignarBrigada ? (
    <Fragment>
      <AsignarBrigada
        data={candidato}
        setReload={setReload}
        setShow={setAsignarBrigada}
      />
    </Fragment>
  ) : (
    <Fragment>
      <div style={{ alignContent: "right" }}>
        <h3>Manifiesto: Oficinas Centrales</h3>
      </div>
      <InputGroup className="mb-2 pt-4">
        <Form.Row className="align-items-center">
          <Col xs="auto">
            <Form.Control
              value={search ? search : ""}
              onChange={(input) => setSearch(input.target.value)}
              className="mb-2 px-5"
              placeholder="Buscar..."
            />
          </Col>
          <Col xs="auto">
            <Button className="mb-2" onClick={() => setReload(true)}>
              Buscar
            </Button>
          </Col>
          <Col xs="auto">
            <Button
              className="mb-2"
              variant="info"
              onClick={() => setReload(true)}
            >
              <AiOutlineReload />
            </Button>
          </Col>
          <Col xs="auto">
            <Button
              className="mb-2 float-sm-right"
              variant="success"
              onClick={handleView}
            >
              <AiOutlineEye />
            </Button>
          </Col>
        </Form.Row>
      </InputGroup>
      <DataTable
        title="Candidatos para asignación a brigada"
        columns={columns}
        data={data ? data : []}
        defaultSortField="curp"
        paginationComponentOptions={{
          rowsPerPageText: "Filas por página",
          rangeSeparatorText: "de",
          selectAllRowsItem: true,
          selectAllRowsItemText: "Todos",
        }}
        persistTableHead
        progressPending={false}
        contextMessage={{
          singular: "registro",
          plural: "registros",
          message: "seleccionados",
        }}
        subHeaderAlign={"left"}
        pagination
      />
    </Fragment>
  );
};

export default TablaManifiesto;
