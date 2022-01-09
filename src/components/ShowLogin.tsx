import { useState }  from 'react';
import { apiPath } from '../api/apiPath'
import ModifyPocasiStyle    from './../css/ModifyPocasi.module.scss'
import FormularStyle    from './../css/Formular.module.scss'
import { ShowLoginType } from './TypeDefinition';

export const ShowLogin = ({
    user, setUser,
    password, setPassword,
    setWebToken, 
    //refresh, setRefresh,
    setEditMeteo,
    editMeteo,
    editMeteo : { refresh }
}: ShowLoginType) => {

   let fotoGalleryOwner = '_ubytovani'; 
   
   const [ loginResp, setLoginResp ] = useState('empty');
    
   // get webToken and webAccess from server
    const loginGetToken = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const object = {
            fotoGalleryOwner,
            user,
            password
        }
        let xhr = new XMLHttpRequest();
        xhr.open('POST', `${apiPath}/foto_login.php`, true);
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.onload = function(){
            if (this.readyState === 4 && this.status === 200) {
                const id = JSON.parse(this.responseText);
                const newWebToken = id[0].webToken;
                if ( newWebToken === 'error' ) {
                    setLoginResp('error');
                } else {
                    setEditMeteo( { ...editMeteo, refresh : refresh + 1 } )
                    setLoginResp('loginSuccess');
                    setWebToken(newWebToken);
                }
            }
        }
        xhr.send(JSON.stringify(object));
    }

    return (
        <div className={ ModifyPocasiStyle.container }>
            { loginResp==='error' ? <div> Někde nastala chyba :-(</div> : null }
            <form onSubmit={ (e) => loginGetToken(e) }>
                <div className={ FormularStyle.form_booking }>
                    <div className={ FormularStyle.input_booking}>
                        <label>Uživatel :</label><br />
                        <input name="user" onChange={ (e) => setUser(e.target.value) } value={user} type="text" placeholder="zadejte uživatele" size={10} minLength={5} required />
                    </div>
                    <div className={ FormularStyle.input_booking}>
                        <label>Heslo :</label><br />    
                        <input name="password" onChange={ (e) => setPassword(e.target.value) } value={password} type="password" placeholder="zadejte heslo" autoComplete="off" size={10}  minLength={5} required />
                    </div>
                    <div className={ FormularStyle.submit_booking }>
                        <input type="submit" value="Odeslat" />
                    </div>
                </div>
            </form>
        </div>
    )
}