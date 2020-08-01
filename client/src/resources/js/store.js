import Vue from 'vue';
import Vuex from 'vuex';

import axios from 'axios';

Vue.use(Vuex);

const url = 'http://localhost:5000/api/';

export default new Vuex.Store({
  state: {
    _id: -1,
    logError: 0,
    login: '',
    isLogin: false,
    isReady: false,

    deletingId: -1,
    contacts: [],
  },
  mutations: {
    setLogError(state, error) {
      state.logError = error;
    },
    setLogin(state, { login, id }) {
      state.isLogin = true;
      state.login = login;
      state._id = id;
    },
    logOut(state) {
      state._id = -1;
      state.logError = 0;
      state.login = '';
      state.isLogin = false;

      localStorage.removeItem('login');
      localStorage.removeItem('password');
    },
    //Fun for loader cmp
    setIsReady(state, ready) {
      state.isReady = ready;
    },

    setContacts(state, contacts) {
      state.contacts = contacts;
    },
    addContact(state, contact) {
      state.contacts.push(contact);
    },

    editContact(state, { name, phone, index }) {
      state.contacts.splice(index, 1, { name, phone });
    },

    deleteContact(state, id) {
      var index = state.contacts.findIndex((contact) => contact._id == id);
      state.contacts.splice(index, 1);
    },
  },
  actions: {
    async signup({ commit }, { login, password }) {
      try {
        const res = await axios.post(url + 'auth/signup', {
          login,
          password,
        });

        localStorage.setItem('login', login);
        localStorage.setItem('password', password);

        commit('setLogin', { login: login, id: res.data });
      } catch (err) {
        if (err.response) commit('setLogError', err.response.status);
        return 409;
      }
    },

    async signin({ commit }, { login, password }) {
      try {
        const res = await axios.post(url + 'auth/signin', {
          login,
          password,
        });

        localStorage.setItem('login', login);
        localStorage.setItem('password', password);

        if (res.status == 200) commit('setLogin', { login, id: res.data });
      } catch (err) {
        if (err.response) commit('setLogError', err.response.status);
        return 404;
      }
    },

    async getContacts({ state, commit }) {
      const res = await axios.get(url + `contacts/${state._id}`);
      commit('setContacts', res.data);
    },

    async createContact({ state, commit }, { name, phone }) {
      state.deletingId = 0;
      const res = await axios.post(url + 'contacts/create', {
        _id: state._id,
        name,
        phone,
      });
      state.deletingId = -1;

      commit('addContact', res.data);
    },

    async editContact({ state, commit }, { name, phone, _id, index }) {
      state.deletingId = 0;
      const res = await axios.post(url + `contacts/update/${_id}`, {
        name,
        phone,
      });
      state.deletingId = -1;

      commit('editContact', { name, phone, index });
    },

    async deleteContact({ state, commit }, { id }) {
      state.deletingId = id;
      await axios.delete(url + `contacts/${id}`);
      state.deletingId = -1;

      commit('deleteContact', id);
    },
  },
});
