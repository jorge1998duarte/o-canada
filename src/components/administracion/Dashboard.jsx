import React, { useContext, useState } from "react";
import sessionContext from "../../context/session/sessionContext";
import SideBar from "./SideBar";
import RevisionDocumentacion from "../regionales/RevisionDocumentacion";

// import AlertError from '../../singles/AlertError';

import MesaAyuda from "../..//components/mesa_ayuda/MesaAyuda";
// import S9 from '../estatales/S9';
import TablaEstatales from "../estatales/TablaEstatales";
import TablaBrigadas from "../brigadas/TablaBrigadas";
import TablaManifiesto from "../manifiesto/TablaManifiesto";
import TablaDisponibilidad from "../disponibilidad/TablaDisponibilidad";
import ExamenPrueba from "../examenes/equipo_aereo/ExamenOSEP";

const Dashboard = ({ userPorfile }) => {
  const [showSection, setShowSection] = useState({
    regionales: false,
    estatales: false,
    mesa_ayuda: false,
    disponibilidad: false,
    brigadas: false,
    manifiesto: false,
    examen_pruebas: true,
  });

  const [toggled, setToggled] = useState(true);

  const handleToggle = () => {
    setToggled(!toggled);
  };

  return (
    <div className={`d-flex ${toggled ? null : "toggled"}`} id="wrapper">
      {/* SIDEBAR */}
      <SideBar
        showSection={showSection}
        setShowSection={setShowSection}
        title={"Secciones"}
        porfileSections={userPorfile}
      />
      {/* CONTENIDO DASHBOARD*/}
      <div id="page-content-wrapper">
        <label className="switch">
          <input type="checkbox" checked={toggled} onChange={handleToggle} />
          <div className="slider"></div>
        </label>
        <div className="container-fluid">
          {showSection.regionales && <RevisionDocumentacion />}
          {showSection.estatales && <TablaEstatales />}
          {showSection.brigadas && <TablaBrigadas />}
          {showSection.disponibilidad && <TablaDisponibilidad />}
          {showSection.manifiesto && <TablaManifiesto />}
          {showSection.mesa_ayuda && <MesaAyuda />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
