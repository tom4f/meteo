import {useState, useEffect, useRef}    from 'react';
import { ShowLogin }        from './ShowLogin';
import { ShowYearTable }    from './ShowYearTable';
import { EditPocasi }       from './EditPocasi';
import { AddPocasi }        from './AddPocasi';
import { DeletePocasi }     from './DeletePocasi';
import { addQuerySelector } from './AddQuerySelector'
import ModifyPocasiStyle    from './../css/ModifyPocasi.module.scss'
import FormularStyle        from './../css/Formular.module.scss'
import { editMeteoType, pocasiType } from './TypeDefinition';

//import '../css/formular.css';

export const ModifyPocasi = () => {
    // last 30 meteo lines
    const [ pocasi, setPocasi ] = useState<pocasiType[]>();
    // login data
    const [ user, setUser ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ webToken, setWebToken ] = useState('error');
    // edit params
    const [ editMeteo, setEditMeteo ] = useState<editMeteoType>( 
        {
         // values to be edited
         editDate : '',
         editKey : '',
         editValue : '',
         // show/hide forms
         dispEdit : false,
         dispDelete : false,
         dispAdd : false,
         // trigger for table reload
         refresh : 0
        }
     );

     const editMeteoRef = useRef( editMeteo )

    // update table querySelector when 'pocasi' changed
    useEffect( () => {
            if ( !pocasi ) return
            addQuerySelector(pocasi, editMeteoRef.current, setEditMeteo, webToken)
        }, [ pocasi, webToken ]
    );
    
    return (
        <>
            <div className={ ModifyPocasiStyle.editPocasi }>
                { 
                    webToken === 'error'
                        ? <ShowLogin
                            user={user} setUser={setUser}
                            password={password} setPassword={setPassword}
                            setWebToken={setWebToken}
                            editMeteo={editMeteo} setEditMeteo={setEditMeteo} />
                        : null
                }
                {
                    editMeteo.dispAdd && pocasi
                        ? <AddPocasi
                            pocasi={pocasi}
                            editMeteo={editMeteo} setEditMeteo={setEditMeteo}
                            webToken={webToken} user={user} />
                        : null
                }

                { editMeteo.dispEdit && pocasi ?
                    <EditPocasi
                        editMeteo={editMeteo} setEditMeteo={setEditMeteo}
                        webToken={webToken} user={user}
                    /> : null }

                { editMeteo.dispDelete ?
                    <DeletePocasi
                        editMeteo={editMeteo} setEditMeteo={setEditMeteo}
                        webToken={webToken} user={user}
                    /> : null }
                
                { webToken !== 'error' ?
                    <div className={ FormularStyle.form_booking}>
                        <div className={ FormularStyle.submit_booking}>
                            <input type="submit" onClick={ () => setEditMeteo( 
                                { 
                                    ...editMeteo,
                                    dispEdit: false,
                                    dispDelete : false,
                                    dispAdd : true
                                }) } value="+ Vytvřit nový záznam" />
                        </div>
                    </div>
                : null }            
            </div>

            <ShowYearTable
                pocasi={pocasi} setPocasi={setPocasi}
                user={user} webToken={webToken}
                editMeteo={editMeteo} 
            />
        </>

    )
}