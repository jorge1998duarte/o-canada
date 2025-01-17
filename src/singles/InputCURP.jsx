import React, { useState, useEffect } from 'react'
import curpValida from '../helpers/curpValida';

const InputCURP = (props) => {

    const {
        curp,
        onKeyPressCapture,
        name,
        defaultValue,
        placeholder,
        className,
        disabled,
        setCorrect,
        onChange
    } = props


    const checkStructure = () => {
        if (typeof curp != 'undefined') {
            if (curp.length > 1) {
                const check = (curpValida(curp)) ? true : false;
                setClaseValido((check) ? '' : 'noValido')
                setCorrect(check)
                setValido(check);
            } else {
                setClaseValido('')
                setValido('');
            }
        }
    }

    useEffect(() => {
        
        if (defaultValue === '') {
            setValido('')
        }

        return () => { };

    }, [defaultValue])

    const [valido, setValido] = useState('')
    const [claseValido, setClaseValido] = useState('')


    return (
        <React.Fragment>
            <input
                className={`${className} ${claseValido}`}
                value={defaultValue ? defaultValue : ''}
                placeholder={placeholder}
                onKeyPressCapture={onKeyPressCapture}
                onChange={onChange}
                onBlur={checkStructure}
                name={name}
                maxLength={18}
                minLength={18}
                type='text'
                disabled={disabled}
            />
            {(valido === false) &&
                <div className="col-12" style={{ backgroundColor: '#FFF3CD' }}>
                    <small className="text-danger">
                        La CURP no es valida.
                    </small>

                </div>
            }
        </React.Fragment>
    );
}

export default InputCURP;