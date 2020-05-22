import React from 'react'
import diferenciaFechasAnios from '../helpers/diferenciaFechasAnios'
import diferenciaFechasMeses from '../helpers/diferenciaFechasMeses'

const S2 = (props) => {

    const { state, setState, checkData } = props

    const setInfo = (input) => {
        /* setea al state las variables */
        setState({
            ...state,
            [input.target.name]: input.target.value
        })
    }


    const revisarFormulario = () => {
        const { pasaporte_fecha_cad, eta_visa_fecha_cad, antecedentes_fecha } = state
        console.log();

        /* VALIDACIONES:
            si antecedentes_fecha > 2 meses
            si pasaporte_fecha_cad < 8 meses
            si eta_visa_fecha_exp < 8 meses
        */
        const dif_antecedentes = diferenciaFechasMeses(antecedentes_fecha)
        const dif_pasaporte = diferenciaFechasMeses(pasaporte_fecha_cad)
        const dif_eta_visa = diferenciaFechasMeses(eta_visa_fecha_cad)

        // Carta es menor a 2 meses
        if (dif_antecedentes > 2) {
            setState({
                ...state,
                rechazo: true,
                motivo_rechazo: 'carta de antecedentes mayor a 2 meses'
            })
        } else {
            // Pasaporte vence dentro de 8 meses
            if (dif_pasaporte > -8) {
                console.log('vence pronto');
                setState({
                    ...state,
                    rechazo: true,
                    motivo_rechazo: 'pasaporte vence en menos de 8 meses'
                })
            } else {
                // eta/Visa vence dentro de 8 meses
                if (dif_eta_visa > -8) {
                    console.log('vence pronto');
                    setState({
                        ...state,
                        rechazo: true,
                        motivo_rechazo: 'eta/visa vence en menos de 8 meses'
                    })
                } else {
                    /* Si todo Bien */
                    setState({
                        ...state,
                        rechazo: false,
                        motivo_rechazo: null
                    })
                }
            }
        }
        checkData()
    }

    return (
        <div className='row body_wrap'>
            {/* Carta de no antecedentes penales */}
            <div className='col-6'>
                <label className="control-label pt-2">Carta de no antecedentes penales</label>
                <input
                    className="form-control myInput"
                    name='carta_antecedentes'
                    // value={state.carta_antecedentes}
                    type='file'
                    onChange={setInfo}
                    placeholder='Carta de no antecedentes penales'
                />
            </div>

            {/* Fecha de expedición de la carta de antecedentes no penales */}
            <div className='col-6'>
                <label className="control-label pt-2">Fecha de expedición de la carta de antecedentes no penales</label>
                <input
                    className="form-control myInput"
                    name='antecedentes_fecha'
                    value={state.antecedentes_fecha}
                    type='date'
                    onChange={setInfo}
                    placeholder='Fecha de expedición de la carta de antecedentes no penales'
                />
            </div>

            {/* Pasaporte */}
            <div className='col-4'>
                <label className="control-label pt-2">Pasaporte</label>
                <input
                    className="form-control myInput"
                    name='pasaporte_archivo'
                    // value={state.pasaporte_archivo}
                    type='file'
                    onChange={setInfo}
                    placeholder='Pasaporte'
                />
            </div>

            {/* Pasaporte No. */}
            <div className='col-4'>
                <label className="control-label pt-2">No. de Pasaporte</label>
                <input
                    className="form-control myInput"
                    name='pasaporte_numero'
                    value={state.pasaporte_numero}
                    type=''
                    onChange={setInfo}
                    placeholder='No. de Pasaporte'
                />
            </div>

            {/* Fecha de caducidad del pasaporte */}
            <div className='col-4'>
                <label className="control-label pt-2">Fecha de caducidad del pasaporte</label>
                <input
                    className="form-control myInput"
                    name='pasaporte_fecha_cad'
                    value={state.pasaporte_fecha_cad}
                    type='date'
                    onChange={setInfo}
                    placeholder='Fecha de caducidad del pasaporte'
                />
            </div>

            {/* ETA/Visa */}
            <div className='col-6'>
                <label className="control-label pt-2">ETA/Visa</label>
                <input
                    className="form-control myInput"
                    name='eta_visa_archivo'
                    // value={state.eta_visa_archivo}
                    type='file'
                    onChange={setInfo}
                    placeholder='Ingrese ETA/Visa'
                />
            </div>

            {/* Documento para viajar a Canadá */}
            <div className='col-6'>
                <label className="control-label pt-2">Documento para viajar a Canadá</label>
                <select
                    className="form-control myInput"
                    name='documento_viajar_canada'
                    defaultValue={state.documento_viajar_canada}
                    onChange={setInfo}
                    placeholder='Documento para viajar a Canadá'
                >
                    <option value='' >---Seleccione---</option>
                    <option value='VISA'>VISA</option>
                    <option value='eTA'>eTA</option>
                </select>
            </div>

            {/* ETA/Visa No. */}
            <div className='col-6'>
                <label className="control-label pt-2">ETA/Visa No.</label>
                <input
                    className="form-control myInput"
                    name='eta_visa_num'
                    value={state.eta_visa_num}
                    type=''
                    onChange={setInfo}
                    placeholder='Ingrese ETA/Visa No...'
                />
            </div>

            {/* ETA/Visa F. expedición */}
            <div className='col-3'>
                <label className="control-label pt-2">ETA/Visa Fecha de expedición</label>
                <input
                    className="form-control myInput"
                    name='eta_visa_fecha_exp'
                    value={state.eta_visa_fecha_exp}
                    type='date'
                    onChange={setInfo}
                    placeholder='ETA/Visa Fecha de expedición'
                />
            </div>

            {/* ETA/Visa F. caducidad */}
            <div className='col-3'>
                <label className="control-label pt-2">ETA/Visa Fecha de caducidad</label>
                <input
                    className="form-control myInput"
                    name='eta_visa_fecha_cad'
                    value={state.eta_visa_fecha_cad}
                    type='date'
                    onChange={setInfo}
                    placeholder='Ingrese ETA/Visa F. caducidad...'
                />
            </div>

            {/* Licencia de manejo */}
            <div className='col-6'>
                <label className="control-label pt-2">Licencia de manejo</label>
                <input
                    className="form-control myInput"
                    name='licencia_manejo'
                    // value={state.licencia_manejo}
                    type='file'
                    onChange={setInfo}
                    placeholder='Ingrese Licencia de manejo...'
                />
            </div>

            {/* Tipo de licencia de manejo */}
            <div className='col-6'>
                <label className="control-label pt-2">Tipo de licencia de manejo</label>
                <select
                    className="form-control myInput"
                    name='tipo_licencia'
                    defaultValue={state.tipo_licencia}
                    onChange={setInfo}
                    placeholder='Tipo de licencia de manejo'
                >
                    <option value='' >---Seleccione---</option>
                    <option value='Nacional'>Nacional</option>
                    <option value='Nacional Traducida'>Nacional traducida</option>
                    <option value='Internacional'>Internacional</option>
                </select>
            </div>

            {/* Fecha caducidad licencia */}
            <div className='col-6'>
                <label className="control-label pt-2">Fecha de caducidad de la licencia</label>
                <input
                    className="form-control myInput"
                    name='licencia_fecha_cad'
                    value={state.licencia_fecha_cad}
                    type='date'
                    onChange={setInfo}
                    placeholder='Fecha de caducidad de la licencia'
                />
            </div>

            {/* BTN Continuar */}
            <div className='col-12 pt-5 btn-margin'>
                <button
                    className='btn btn-primary'
                    // onClick={checkData}
                    onClick={revisarFormulario}
                >Continuar</button>
            </div>

        </div>
    );
}

export default S2;