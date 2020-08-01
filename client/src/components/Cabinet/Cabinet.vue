<template>
  <div class="main">
    <v-app-bar>
      <v-tabs v-model="tab" centered>
        <v-tab>Список контактов</v-tab>
      </v-tabs>
      <span>{{login}}</span>
      <v-btn icon @click="logOut">
        <v-icon title="Exit" class="icon">mdi-exit-to-app</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <div class="main-outter">
        <div class="contacts">
          <v-list>
            <v-list-item-group color="primary">
              <v-list-item
                v-for="(contact,index) in contacts"
                :key="contact.name + index"
                class="contact"
                @click="handleClick(contact.phone)"
              >
                <div style="flex-grow:1">{{contact.name}}</div>
                <div style="flex-grow:1">{{contact.phone}}</div>

                <v-btn
                  icon
                  @click.stop.prevent="Delete(contact)"
                  :loading="deletingId == contact._id"
                >
                  <v-icon title="Delete" :size="22" class="icon">mdi-delete</v-icon>
                </v-btn>
                <v-btn
                  icon
                  @click.stop.prevent="Edit(contact,index)"
                  :loading="deletingId == contact._id"
                >
                  <v-icon title="Edit" :size="22" class="icon">mdi-pencil</v-icon>
                </v-btn>
              </v-list-item>
            </v-list-item-group>
          </v-list>

          <v-btn @click="isCreating = true" :loading="deletingId == 0">Add</v-btn>
        </div>
        <Creating v-if="false" />
      </div>

      <v-dialog v-model="copy" hide-overlay persistent width="300">
        <v-card color="primary" dark>
          <v-card-text>Номер телефона скопирован</v-card-text>
        </v-card>
      </v-dialog>

      <v-dialog v-model="contact" persistent max-width="500" v-if="contact">
        <v-card>
          <v-card-title class="headline">
            Вы уверены, что хотите удалить контакт
            <span class="contact-name">{{contact.name}}</span>?
          </v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="contact = null">Cancel</v-btn>
            <v-btn color="red" text @click="handleDeleteContact">OK</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="editingContact" persistent max-width="500" v-if="editingContact">
        <v-card>
          <v-card-title class="headline">Изменение контакта {{editingContact.name}}</v-card-title>
          <v-card-text>
            <v-form v-model="valid" ref="form">
              <v-container class="text-center">
                <v-text-field
                  v-model="name"
                  :rules="nameRules"
                  :counter="length"
                  label="Имя"
                  ref="login"
                  required
                ></v-text-field>

                <v-text-field
                  v-model="phone"
                  :rules="phoneRules"
                  label="Телефон"
                  required
                  v-mask="'8-(###)-###-##-##'"
                ></v-text-field>
              </v-container>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="handleCancel">Отмена</v-btn>
            <v-btn
              color="primary"
              text
              @click="handleEditContact"
              :loading="deletingId == 0"
            >Изменить</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="isCreating" persistent max-width="500" v-if="isCreating">
        <v-card>
          <v-card-title class="headline">Добавление контакта</v-card-title>
          <v-card-text>
            <v-form v-model="valid" ref="form">
              <v-container class="text-center">
                <v-text-field
                  v-model="name"
                  :rules="nameRules"
                  :counter="length"
                  label="Имя"
                  ref="login"
                  required
                ></v-text-field>

                <v-text-field
                  v-model="phone"
                  :rules="phoneRules"
                  label="Телефон"
                  required
                  v-mask="'8-(###)-###-##-##'"
                ></v-text-field>
              </v-container>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="handleCancel">Отмена</v-btn>
            <v-btn
              color="primary"
              text
              @click="handleAddContact"
              :loading="deletingId == 0"
            >Добавить</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-main>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";

import Vue from "vue";

import VueMask from "v-mask";
Vue.use(VueMask);

export default {
  name: "Cabinet",
  data() {
    return {
      tab: "0",
      contact: null,
      isCreating: false,
      copy: false,

      editingContact: false,

      valid: false,
      name: "",
      phone: "",
      length: 20,

      nameRules: [
        (v) => !!v || "Name is required",
        (v) => v.length <= 20 || "Name must be less than 20 characters",
      ],
      phoneRules: [
        (v) => !!v || "Phonenumber is required",
        (v) => v.length != 16 || "Enter valid phonenumber",
      ],
    };
  },

  watch: {
    copy(val) {
      if (!val) return;
      setTimeout(() => (this.copy = false), 1000);
    },
  },

  computed: {
    ...mapState(["login", "contacts", "deletingId"]),
  },

  async beforeMount() {
    this.getContacts();
  },

  methods: {
    ...mapMutations(["logOut"]),

    ...mapActions([
      "getContacts",
      "createContact",
      "deleteContact",
      "editContact",
    ]),

    handleCancel() {
      this.isCreating = false;
      this.editingContact = false;
      this.name = "";
      this.phone = "";
    },

    handleClick(phone) {
      this.copy = true;
      navigator.clipboard.writeText(phone);
    },

    async handleAddContact() {
      this.$refs.form.validate();
      if (this.valid) {
        await this.createContact({
          name: this.name,
          phone: this.phone,
        });
        this.isCreating = false;
        this.name = "";
        this.phone = "";
      }
    },

    async handleEditContact() {
      this.$refs.form.validate();
      if (this.valid) {
        await this.editContact({
          name: this.name,
          phone: this.phone,
          _id: this.editingContact._id,
          index: this.editingContact.index,
        });

        this.editingContact = null;
        this.name = "";
        this.phone = "";
      }
    },

    Delete(contact) {
      this.contact = contact;
    },

    Edit(contact, index) {
      this.editingContact = contact;
      this.name = contact.name;
      this.phone = contact.phone;
      this.editingContact.index = index;
    },

    handleDeleteContact() {
      this.deleteContact({ id: this.contact._id });
      this.contact = null;
    },
  },
};
</script>


<style scoped lang="scss">
.contact-name {
  color: #7f8285;
  text-decoration: underline;
}

.headline {
  word-break: keep-all;
}

.main {
  color: #e1e3e6;

  .main-outter {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    .contacts {
      width: 50%;
      display: flex;
      justify-content: center;
      flex-direction: column;

      .contact {
        display: flex;
      }
    }
  }

  .icon:hover {
    color: #e6457a;
  }
}
</style>
