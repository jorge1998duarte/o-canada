import React, { useState } from 'react'
import SelectSiNo from '../singles/SelectSiNo'
import ExSCI100 from '../components/ExSCI100';
import ExS190 from '../components/ExS190';
import AlertExito from '../singles/AlertExito';
import { Modal, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';

const S4 = (props) => {
    /* TODO: rellenar state y API con esta seccion */
    const [showExam, setShowExam] = useState(false)
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const { state, setState, checkData } = props

    const [preguntas_smi_100, setPreguntas_smi_100] = useState(false)
    const [preguntas_s_190, setPreguntas_s_190] = useState(false)
    const [smi_100Examen, setSmi_100Examen] = useState(false)

    const setInfo = (input) => {
        /* setea al state las variables */
        setState({
            ...state,
            [input.target.name]: input.target.value
        })
    }

    const siguienteExamen = () => {

        // AlertExito('Examen')
        Swal.fire({
            title: 'Esta por iniciar una prueba',
            text: "Asegurece de tener una conexion estable de internet.\n" +
                "Cuenta con 10 minutos para responderla.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Continuar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.value) {
                /* INICIAR EXAMEN */
                handleShow(true)
            }
        })
        // setSmi_100Examen(true)
    }
    return (
        <div className='row body_wrap'>



            <Modal show={show} >
                <Modal.Body>
                    <ExS190 />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleClose}>
                        Terminar
                    </Button>
                </Modal.Footer>
            </Modal>


            {/* SCI/SMI 100 */}
            <div className='col-6'>
                <label className="control-label pt-2">SCI/SMI 100</label>
                <input
                    className="form-control myInput"
                    name='sci_smi_100'
                    type='file'
                    onChange={setInfo}
                    onBlur={() => { setPreguntas_smi_100((state.sci_smi_100 && state.sci_smi_200) ? true : false) }}
                    onMouseLeave={() => { setPreguntas_smi_100((state.sci_smi_100 && state.sci_smi_200) ? true : false) }}
                    placeholder='Ingrese SCI/SMI 100...'
                />
            </div>

            {/* SCI/SMI 200 */}
            <div className='col-6'>
                <label className="control-label pt-2">SCI/SMI 200</label>
                <input
                    className="form-control myInput"
                    name='sci_smi_200'
                    type='file'
                    onChange={setInfo}
                    onBlur={() => { setPreguntas_smi_100((state.sci_smi_100 && state.sci_smi_200) ? true : false) }}
                    onMouseLeave={() => { setPreguntas_smi_100((state.sci_smi_100 && state.sci_smi_200) ? true : false) }}
                    placeholder='Ingrese SCI/SMI 200...'
                />
            </div>

            {
                preguntas_smi_100 && <React.Fragment>
                    {/* ¿El evaluado ha participado en eventos planeados o no...? */}
                    <div className='col-12'>
                        <label className="control-label danger pt-2">¿El evaluado ha participado en eventos planeados o no planeados atendidos bajo el SCI?</label>
                        <SelectSiNo
                            className="form-control myInput"
                            name='eventos_plnaeados_sci'
                            onChange={setInfo}
                        />
                    </div>

                    {/* ¿El evaluado ha participado en eventos planeados o no planeados...? */}
                    <div className='col-12'>
                        <label className="control-label danger pt-2">¿El evaluado ha participado en eventos planeados o no planeados atendidos bajo el SCI fuera de su país?</label>
                        <SelectSiNo
                            className="form-control myInput"
                            name='eventos_plnaeados_sci_fuera'
                            onChange={setInfo}
                        />
                    </div>

                    {/* ¿El evaluado ha ocupado en eventos planeados o no estructura...? */}
                    <div className='col-12'>
                        <label className="control-label danger pt-2">¿El evaluado ha ocupado en eventos planeados o no planeados alguna posición dentro de la estructura del SCI?</label>
                        <SelectSiNo
                            className="form-control myInput"
                            name='eventos_plnaeados_dentro_estructura'
                            onChange={setInfo}
                        />
                    </div>

                    {/* SCI/SMI 200 */}
                    {state.eventos_plnaeados_dentro_estructura === '1' && <React.Fragment>
                        <div className='col-5'>
                            <label className="control-label pt-2">Indique cual</label>
                            <input
                                className="form-control myInput"
                                name='sci_cual'
                                type=''
                                onChange={setInfo}
                                placeholder='Indique cual...'
                            />
                        </div>
                    </React.Fragment>}

                    {/* ¿El evaluado pertenece a algún Equipo de Manejo de Incidentes? */}
                    <div className='col-7'>
                        <label className="control-label danger pt-2">¿El evaluado pertenece a algún Equipo de Manejo de Incidentes?</label>
                        <SelectSiNo
                            className="form-control myInput"
                            name='evaluado_menejo_incidentes'
                            onChange={setInfo}
                        />
                    </div>

                </React.Fragment>
            }

            {/* <h4><br />Examen SCI-100 / SCI-200</h4>

            <SCI100></SCI100>

            <h4><br />Examen S-190 / S-130</h4>

            <S190></S190> */}

            {/* BTN SCI/SMI 100 */}
            <div className='col-12 pt-5 btn-margin'>
                {/* TODO: completar examenes */}
                <button
                    hidden={(state.eventos_plnaeados_sci &&
                        state.eventos_plnaeados_sci_fuera &&
                        state.eventos_plnaeados_dentro_estructura &&
                        state.evaluado_menejo_incidentes && !smi_100Examen) ? false : true}

                    onClick={siguienteExamen}
                    className='btn btn-warning'
                // onClick={checkData}
                >Tomar examen SCI/SMI 100</button>
            </div>


            <div className='col-12 pt-5 btn-margin'>
                <button
                    disabled={!smi_100Examen}
                    className='btn btn-primary'
                    onClick={checkData}
                >Continuar</button>
            </div>
        </div >
    );
}

export default S4;