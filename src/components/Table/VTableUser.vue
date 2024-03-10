<script lang="ts">
import { ref, reactive, watch, computed } from 'vue';
import { fetchData, updateData, sendData, deleteData } from '@/services/api';
import { UserDTO } from '@/dto/UserDTO';

export default {
  props: ['values'],

  setup(props) {
    const dialog = ref<boolean>(false);
    const dialogDelete = ref<boolean>(false);
    const state = reactive<any>({
        value: [],
    });
    const editedIndex = ref<number>(-1);
    const editedItem = reactive<UserDTO>({
        name: '',
        email: '',
        password: '',
    });
    const headers = reactive<any>([
        { title: 'Nome', key: 'name' },
        { title: 'Email', key: 'email' },
        { title: 'Ações', key: 'actions', sortable: false },
    ]);
    const formTitle = ref<string>('');

    const initialize = () => {
        state.value = props.values;
    };

    const editItem = (item) => {
      editedIndex.value = state.value.indexOf(item);
      editedItem.name = item.name;
      editedItem.email = item.email;
      dialog.value = true;
    };

    const deleteItem = (item) => {
      editedIndex.value = state.value.indexOf(item);
      editedItem.name = item.name;
      editedItem.email = item.email;
      dialogDelete.value = true;
    };

    const deleteItemConfirm = async () => {
      await deleteData(`/task/${state.value[editedIndex.value].id}`);
      state.value.splice(editedIndex.value, 1);
      closeDelete();
    };

    const close = () => {
      dialog.value = false;
      editedItem.name = "";
      editedItem.email = "";
      editedItem.password = "";
      editedIndex.value = -1;
    };
    const closeDelete = () => {
      dialogDelete.value = false;
      editedIndex.value = -1;
    };

    const save = async () => {
        const payload: UserDTO = {
            name: editedItem.name,
            email: editedItem.email,
            password: editedItem.password,
        };

        if (editedIndex.value > -1) {
            await updateData(`/user/${state.value[editedIndex.value].id}`, payload);
            Object.assign(state.value[editedIndex.value], editedItem);
        } else {
            sendData(`/user`, payload)
                .then(({ body }) => {
                    state.value.push({
                        name: body.name,
                        email: body.email,
                    });
                })
        }
        close();
    };

    watch(dialog, (val) => {
      val || close();
    });

    watch(dialogDelete, (val) => {
      val || closeDelete();
    });

    watch(editedIndex, () => {
      formTitle.value = editedIndex.value === -1 ? 'Novo Item' : 'Editar Item';
    });

    watch(props, () => {
      initialize();
    });

    initialize();

    return {
      dialog,
      dialogDelete,
      state,
      headers,
      editedIndex,
      editedItem,
      formTitle,
      editItem,
      deleteItem,
      deleteItemConfirm,
      close,
      closeDelete,
      save,
    };
  },
};
</script>

<template>
    <v-data-table
      :headers="headers"
      :items="state.value"
    >
      <template v-slot:top>
        <v-toolbar
          flat
        >
          <v-toolbar-title>Usuários</v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          ></v-divider>
          <v-spacer></v-spacer>
          <v-dialog
            v-model="dialog"
            max-width="500px"
          >
            <template v-slot:activator="{ props }">
              <v-btn
                color="primary"
                dark
                class="mb-2"
                v-bind="props"
              >
                Novo Item
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>
  
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col
                    >
                      <v-text-field
                        v-model="editedItem.name"
                        label="Nome"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col
                    >
                      <v-text-field
                        v-model="editedItem.email"
                        label="Email"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col
                    >
                      <v-text-field
                        v-model="editedItem.password"
                        type="password"
                        label="Senha"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
  
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="blue-darken-1"
                  variant="text"
                  @click="close"
                >
                  Cancel
                </v-btn>
                <v-btn
                  color="blue-darken-1"
                  variant="text"
                  @click="save"
                >
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancel</v-btn>
                <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">OK</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon
          size="small"
          class="me-2"
          @click="editItem(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          size="small"
          @click="deleteItem(item)"
        >
          mdi-delete
        </v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn
          color="primary"
          @click="initialize"
        >
          Reset
        </v-btn>
      </template>
    </v-data-table>
</template>
