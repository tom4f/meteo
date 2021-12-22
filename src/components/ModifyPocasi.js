import {useState, useEffect}    from 'react';
import { ShowLogin }        from './ShowLogin';
import { ShowYearTable }    from './ShowYearTable';
import { EditPocasi }       from './EditPocasi';
import { AddPocasi }        from './AddPocasi';
import { DeletePocasi }     from './DeletePocasi';
import { addQuerySelector } from './AddQuerySelector'
import ModifyPocasiStyle    from './../css/ModifyPocasi.module.scss'

import '../css/formular.css';

export const ModifyPocasi = () => {
    // last 30 meteo lines
    const [ pocasi, setPocasi ] = useState([]);
    // login data
    const [ user, setUser ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ webToken, setWebToken ] = useState('error');
    // edit params
    const [ editMeteo, setEditMeteo ] = useState( 
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

    // update table querySelector when 'pocasi' changed
    useEffect( () => addQuerySelector(pocasi, editMeteo, setEditMeteo, webToken), [ pocasi ]);
    
    return (
        <>
            <div className={ ModifyPocasiStyle.editPocasi }>
                { webToken === 'error' ?
                    <ShowLogin
                        user={user} setUser={setUser}
                        password={password} setPassword={setPassword}
                        setWebToken={setWebToken}
                        editMeteo={editMeteo} setEditMeteo={setEditMeteo}
                    /> : null  }

                { editMeteo.dispAdd ?
                    <AddPocasi
                        pocasi={pocasi}
                        editMeteo={editMeteo} setEditMeteo={setEditMeteo}
                        webToken={webToken} user={user}
                    /> : null }

                { editMeteo.dispEdit ?
                    <EditPocasi
                        pocasi={pocasi}
                        editMeteo={editMeteo} setEditMeteo={setEditMeteo}
                        webToken={webToken} user={user}
                    /> : null }

                { editMeteo.dispDelete ?
                    <DeletePocasi
                        editMeteo={editMeteo} setEditMeteo={setEditMeteo}
                        webToken={webToken} user={user}
                    /> : null }
                
                { webToken !== 'error' ?
                    <div className="form_booking">
                        <div className="submit_booking">
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
                editMeteo={editMeteo} setEditMeteo={setEditMeteo}
            />
        </>

    )
}