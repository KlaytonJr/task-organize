<template>
    <nav>
        <v-snackbar v-model="snackbar" :timeout="4000" top color="success">
            <span>Awesome! You added a new project.</span>
            <v-btn plain color="white" @click="snackbar = false">Close</v-btn>
        </v-snackbar>

        <v-app-bar flat app>
            <v-app-bar-nav-icon class="grey--text" @click="drawer = !drawer"></v-app-bar-nav-icon>
            <v-app-bar-title class="text-uppercase grey--text">
                <span class="font-weight-light">Task</span>
                <span>Organize</span>
            </v-app-bar-title>
            <v-spacer></v-spacer>
        </v-app-bar>

        <v-navigation-drawer v-model="drawer" app class="primary">
            <v-list>
                <v-list-item class="flex" router to='/' prepend-icon="mdi-view-dashboard" title="Dashboard"></v-list-item>
                <h3 class="pa-4 font-weight-medium text-grey-darken-2">Cadastros</h3>
                <v-list-item class="flex" router to='/users' prepend-icon="mdi-view-dashboard" title="Usuários"></v-list-item>
                <v-list-item prepend-icon="mdi-view-list" title="Tasks" @click="showOptions = !showOptions"></v-list-item>
            </v-list>
            <v-list v-if="showOptions">
                <v-list-item v-for="link in secondaryLinks" class="flex" :key="link.text" router :to="link.route" :prepend-icon="link.icon" :title="link.text"></v-list-item>
            </v-list>
        </v-navigation-drawer>
    </nav>
</template>

<script>
export default {
    data() {
        return {
            drawer: false,
            links: [
                { icon: 'mdi-view-dashboard', text: 'Dashboard', route: '/'},
                { icon: 'mdi-account-group', text: 'Usuários', route: '/users'},
            ],
            secondaryLinks: [
                { icon: '', text: 'Minhas', route: '/tasks?filter=0'},
                { icon: '', text: 'Em aberto', route: '/tasks?filter=1'},
                { icon: '', text: 'Finalizadas', route: '/tasks?filter=2'},
                { icon: '', text: 'Todas', route: '/tasks?filter=3'},
            ],
            snackbar: false,
            showOptions: false,
        }
    }
}
</script>