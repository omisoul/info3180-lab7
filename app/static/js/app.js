/* Add your Application JavaScript */
// Instantiate our main Vue Instance
const app = Vue.createApp({
    data() {
        return {

        }
    }
});

app.component('app-header', {
    name: 'AppHeader',
    template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
      <a class="navbar-brand" href="#">Lab 7</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
    
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <router-link class="nav-link" to="/">Home <span class="sr-only">(current)</span></router-link>
          </li>
          <li class="nav-item active">
            <router-link class="nav-link" to="/upload">Upload </router-link>
          </li>
        </ul>
      </div>
    </nav>
    `
});

app.component('app-footer', {
    name: 'AppFooter',
    template: `
    <footer>
        <div class="container">
            <p>Copyright &copy; {{ year }} Flask Inc.</p>
        </div>
    </footer>
    `,
    data() {
        return {
            year: (new Date).getFullYear()
        }
    }
});



const UploadForm = {
    name: 'UploadForm',
    template: `
    <div>
        <h1>Upload Form</h1>
        <ul :class="type">
            <li v-for='message in messages' :key="message">
                {{ message }}
            </li>
        </ul>
        <form @submit.prevent="uploadPhoto" id="uploadForm" enctype="multipart/form-data">
            <label htmlFor="description">Description:</label>
            <br/>
            <textarea name="description" cols="30" rows="10" class="form-control"></textarea>
            <br/>
            <label htmlFor="photo">Photo:</label>
            <br/>
            <input type="file" name="photo"/>
            <br/>
            <input type="submit" value="Submit" class="my-4 btn btn-primary" />
        </form>
    </div>
    
    `,

    methods: {
        uploadPhoto(){
            let self = this
            let uploadForm = document.getElementById('uploadForm');
            let form_data = new FormData(uploadForm);
            fetch("/api/upload", {
                method: 'POST',
                body: form_data,
                headers: {
                    'X-CSRFToken': token
                     },
                     credentials: 'same-origin'
               })
                .then(function (response) {
                return response.json();
                })
                .then(function (jsonResponse) {
                // display a success message
                console.log(jsonResponse);
                if(jsonResponse.errors){
                    self.type = 'alert alert-danger';
                    self.messages = [];
                    for (i of jsonResponse.errors){
                        console.log(i.error);
                        self.messages= [...self.messages, i.error]
                    }
                }else{
                    self.type = 'alert alert-success'
                    self.messages = [jsonResponse.message]
                }
                console.log(self.type);
                console.log(self.messages)
                })
                .catch(function (error) {
                console.log(error);
            });
        }
    },
    data() {
        return {
            messages: [],
            type: ''
        }
    }
}

const Home = {
    name: 'Home',
    template: `
    <div class="jumbotron">
        <h1>Lab 7</h1>
        <p class="lead">In this lab we will demonstrate VueJS working with Forms and Form Validation from Flask-WTF.</p>
    </div>
    `,
    data() {
        return {}
    }
};

const NotFound = {
    name: 'NotFound',
    template: `
    <div>
        <h1>404 - Not Found</h1>
    </div>
    `,
    data() {
        return {}
    }
};

// Define Routes
const routes = [
    { path: "/", component: Home },
    // Put other routes here
    {path:'/upload', component: UploadForm},

    // This is a catch all route in case none of the above matches
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound }
];

const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes, // short for `routes: routes`
});

app.use(router);

app.mount('#app');