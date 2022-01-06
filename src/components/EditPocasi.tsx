import { useState } from 'react';
import { apiPath } from '../api/apiPath'
import ModifyPocasiStyle    from './../css/ModifyPocasi.module.scss'
import FormularStyle    from './../css/Formular.module.scss'
import { ModifyPocasiType, FDobjectType } from './TypeDefinition';

export const EditPocasi = ({ 
        editMeteo,
        setEditMeteo,
        webToken, user
    }: ModifyPocasiType) => {

    const { editDate, editKey, editValue, refresh } = editMeteo

    let fotoGalleryOwner = '_ubytovani';
    const [ loginResp, setLoginResp ] = useState('empty');

    const updateMySQL = (e: React.FormEvent<HTMLFormElement>) => {
        // disable page reload-clear after submit
        e.preventDefault();
        // all form data to special object
        const form = document.querySelector('#edit_form_pocasi') as HTMLFormElement;
        const FD = new FormData(form);
        FD.append('fotoGalleryOwner', fotoGalleryOwner);
        FD.append('webToken', webToken);
        FD.append('webUser', user);
        // real object
        let FDobject: FDobjectType = {};
        // fill form data ojbect
        FD.forEach( (value, key) => FDobject[ key ] = value );
        // AJAX
        {
            let xhr = new XMLHttpRequest();
            xhr.open('POST', `${apiPath}/pdo_update_pocasi.php`, true);
            xhr.setRequestHeader('Content-type', 'applic ation/json');
            xhr.onload = function(){
                if (this.readyState === 4 && this.status === 200) {
                    const editResult = JSON.parse(this.responseText);
                    console.log(editResult);
                    if ( editResult.result === 'pocasi_update_ok' ) {
                         setEditMeteo( 
                            { 
                                ...editMeteo,
                                dispAdd : false,
                                dispEdit: false,
                                dispDelete : false,
                                refresh : refresh + 1
                             });
                    } else {
                        setLoginResp('error');
                    }
                } 
            }
            xhr.onerror = function () {
                setLoginResp('error');
            }
            xhr.send(JSON.stringify(FDobject));
        }
    }


    return (
        <div className={ ModifyPocasiStyle.container }>
          <div className={ ModifyPocasiStyle.closeBtn } onClick={ () => setEditMeteo( { ...editMeteo, dispEdit : false } ) }><span>x</span></div>
          { loginResp==='error' ? <div> Někde nastala chyba :-(</div> : null }
          <h4>Upravujete datum {editDate} </h4>
          <form onSubmit={ (e) => updateMySQL(e) } autoComplete="off" id="edit_form_pocasi" name="edit_form_pocasi">
              <div className={ FormularStyle.form_booking }>
                  <input type="hidden" name="datum" value={editDate} />
                  <div className={ FormularStyle.input_booking }>
                      <label>{editKey} :</label><br />
                      <input type="hidden" name="key" value={editKey} />
                      <input type="text" name="value" onChange={ (e) => setEditMeteo( { ...editMeteo, editDate, editKey, editValue : e.target.value } ) } value={editValue} />
                  </div>
                  <div className={ FormularStyle.submit_booking }>
                      <input type="submit" name="odesli" value="Odeslat" />
                  </div>
              </div>
          </form>
        </div>
    )
}