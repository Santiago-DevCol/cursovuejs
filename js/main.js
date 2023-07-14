const API = "https://api.github.com/users/";
const requestMaxTime = 3000
const app = Vue.createApp({
    data() {
        return {
            search: null,
            result: null,
            error: null,
            favorites: new Map()
        };
    },
    created(){
        const savedFavorites = JSON.parse( window.localStorage.getItem('favorites'))
        if (savedFavorites?.length) {
            const favorites = new Map(savedFavorites.map(favorite => [favorite.login, favorite]))
            this.favorites = favorites
        }
    },
    computed:{
        isFavorite(){
            return this.favorites.has(this.result.login)
        },
        allFavorites(){
            return Array.from(this.favorites.values())
        }
    },
    methods: {
        async doSearch() {

            this.result = this.error = null
            const foubdInFavorites = this.favorites.get(this.search)
            console.log(foubdInFavorites);

            const shouldrequestAgain = (() => {
                if (!!foubdInFavorites) {
                    const { lastRequestTime } = foubdInFavorites
                    const now =Date.now()
                    return (now - lastRequestTime) > requestMaxTime
                }
                return false
            })()//esto es un iife

            if (!!foubdInFavorites && !shouldrequestAgain) {
                console.log("buscado con la cahe");
                return this.result = foubdInFavorites
            }

            try {
                console.log("no encontrado o cache es antigua");
                let response = await fetch(API + this.search)
                if (!response.ok) throw new Error("Usuario no encontrado")
                const data = await response.json()
                console.log(data);
                this.result=data
                //foubdInFavorites.lastRequestTime = Date.now()
            } catch (error) {
                console.log(this.error= error);
            } finally{
                this.search= null
            }
        },
        addFavorite() {
            this.result.lastRequestTime = Date.now()
            this.favorites.set(this.result.login, this.result)
            this.updateStorage()
        },
        removeFavorite() {
            this.favorites.delete(this.result.login)
            this.updateStorage()
        },
        showFavorite(favorite){
            this.result = favorite
        },
        checkFavorite(id){
            return this.result?.login === id
        },
        updateStorage(){
            window.localStorage.setItem('favorites',JSON.stringify(this.allFavorites))
        }
    }
});

