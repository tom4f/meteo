import { useState }          from 'react';
import { apiPath } from '../api/apiPath'
import ModifyPocasiStyle    from './../css/ModifyPocasi.module.scss'
import FormularStyle    from './../css/Formular.module.scss'
import { AddPocasiType } from './TypeDefinition';

export const AddPocasi = ({
        pocasi,
        editMeteo,
        setEditMeteo,
        webToken, user
    }: AddPocasiType) => {

        const { refresh } = editMeteo

    const { hladina, pritok, odtok, voda, vzduch, pocasi : komentar } = pocasi[0];
   
    let fotoGalleryOwner = '_ubytovani'; 

    const today = ( now: Date ) => {
        let day = now.getDate();
        const dayString = day < 10 ? `0${day}` : day; 
        let month = now.getMonth() + 1;
        const monthString = month < 10 ? `0${month}` : month;    
        const year = now.getFullYear();
        return `${year}-${monthString}-${dayString}`;
    }


    const [ newValues, setNewValues ] = useState({
        datum : today( new Date() ),
        hladina,
        pritok,
        odtok,
        voda,
        vzduch,
        pocasi: komentar
    });

    const [ loginResp, setLoginResp ] = useState('empty');
 
    const insert = (e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        // AJAX
        let xhr = new XMLHttpRequest();
        xhr.open('POST', `${apiPath}/pdo_add_pocasi.php`, true);
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.onload = function(){
            if (this.readyState === 4 && this.status === 200) {
                const editResult = JSON.parse(this.responseText);
                console.log(editResult.result);
                if ( editResult.result === 'pocasi_create_ok' ) {
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
        xhr.send(JSON.stringify( { ...newValues, webToken, webUser : user, fotoGalleryOwner }));

    }

    const set = (e: React.ChangeEvent<HTMLInputElement>) =>{
        const param = e.target.name;
        const value = e.target.value;
        setNewValues( { ...newValues, [param]: value });
    }


       // setLoginResp('empty');



    return (
        <>
        <div className={ModifyPocasiStyle.container }>
          <div className={ ModifyPocasiStyle.closeBtn } onClick={ () => setEditMeteo( { ...editMeteo, dispAdd : false } ) } ><span>x</span></div>
          { loginResp==='error' ? <div> Někde nastala chyba :-(</div> : null }
          <h4>Nový záznam  </h4>
          <form onSubmit={ e => insert(e) }  autoComplete="off" id="edit_form_pocasi" name="edit_form_pocasi">
              <div className={ FormularStyle.form_booking} >
                  <div className={ FormularStyle.input_booking}>
                      <label>datum:</label><br />
                      <input type="text" name="datum" value={ newValues.datum } onChange={ (e) => set(e)}  />
                  </div>
                  <div className={ FormularStyle.input_booking}>
                      <label>voda:</label><br />
                      <input type="text" name="voda" value={newValues.voda} onChange={ (e) => set(e) } />
                  </div>
                  <div className={ FormularStyle.input_booking}>
                      <label>vzduch:</label><br />
                      <input type="text" name="vzduch" value={newValues.vzduch} onChange={ (e) => set(e) } />
                  </div>
                  <div className={ FormularStyle.input_booking}>
                      <label>hladina:</label><br />
                      <input type="text" name="hladina" value={newValues.hladina} onChange={ (e) => set(e) } />
                  </div>
                  <div className={ FormularStyle.input_booking}>
                      <label>přítok:</label><br />
                      <input type="text" name="pritok" value={newValues.pritok} onChange={ (e) => set(e) } />
                  </div>
                  <div className={ FormularStyle.input_booking}>
                      <label>odtok:</label><br />
                      <input type="text" name="odtok" value={newValues.odtok} onChange={ (e) => set(e) } />
                  </div>
                  <div className={ FormularStyle.input_booking}>
                      <label>komentář:</label><br />
                      <input type="text" name="pocasi" value={newValues.pocasi} onChange={ (e) => set(e) } />
                  </div>

                  <div className={ FormularStyle.submit_booking}>
                      <input type="submit" name="odesli" value="Odeslat" />
                  </div>
              </div>
          </form>
        </div>
        </>
    )
}