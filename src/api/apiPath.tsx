const dev = process.env.NODE_ENV !== 'production'

export const commonPathMeteoFromFile = dev ? './../../..' : './../../..'
export const commonPath = dev ? 'https://www.frymburk.com' : './../../..'

export const apiPath = `${commonPath}/rekreace/api`

class urlParams {
    static get getSearchObj() {
        const search = window.location.search.substring(1)
        const searchObj: { [key: string]: string } = {}
        const searchArr = search.split('&')
        !!searchArr[0] && searchArr.forEach((ittem) => {
            const [key, value] = ittem.split('=')
            searchObj[key] = value
        })
        return {
            fotoGalleryOwner: searchObj.fotoGalleryOwner || '_ubytovani',
            editStatus: searchObj.edit === 'yes' ? true : false,
            category: searchObj.category === 'yes' ? true : false
        }
    }
}

export const { fotoGalleryOwner, editStatus, category } = urlParams.getSearchObj