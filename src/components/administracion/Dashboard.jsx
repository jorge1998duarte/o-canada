import React, { useContext, useState } from 'react'
import sessionContext from "../../context/session/sessionContext";
import SideBar from '../SideBar';
import RevisionDocumentacion from '../regionales/RevisionDocumentacion';
import axios from 'axios';
import AlertError from '../../singles/AlertError';
import Revision from '../../rutas/Revision';






const Dashboard = ({ userPorfile}) => {
    const sessContext = useContext(sessionContext)
    const API_REQUEST = process.env.REACT_APP_BACKEN_URL
    

    const [showSection, setShowSection] = useState({
        'regionales': false,
        'estatales': false,
        'mesa_ayuda': false,
        'manifiesto': false,
    })
   
    const [toggled, setToggled] = useState(true)

    const handleToggle = () => {
        setToggled(!toggled)
    }


    return (
        <div class={`d-flex ${(toggled) ? null : 'toggled'}`} id="wrapper">
            {/* SIDEBAR */}
            <SideBar
                showSection={showSection}
                setShowSection={setShowSection}
                title={'Secciones'}
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
                    {/* {showSection.estatales && } */}
                    {showSection.mesa_ayuda && <Revision />}
                    {/* {showSection.manifiesto && } */}

                </div>
            </div>
        </div>
    );
}

export default Dashboard;