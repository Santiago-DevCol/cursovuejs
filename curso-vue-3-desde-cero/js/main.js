const API = "https://api.github.com/users/";
const app = Vue.createApp({
    data() {
        return {
            message: 'Hello Vue!',
        };
    },
    methods: {
        async doSearch() {
            let response = await fetch(API + 'Santiago-DevCol')
            const data = await response.json()
            console.log(data);
        }
    }
});

