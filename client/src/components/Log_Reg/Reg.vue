<template>
  <v-form v-model="valid" ref="form">
    <v-container class="text-center">
      <v-text-field
        v-model="login"
        :rules="loginRules"
        :counter="length"
        label="Login"
        ref="login"
        required
      ></v-text-field>

      <v-text-field
        v-model="password"
        :rules="passwordRules"
        :counter="length"
        label="Password"
        type="password"
        required
      ></v-text-field>

      <div class="error" v-if="logError == 409">Данный логин уже используется</div>
      <v-btn :disabled="!valid" class="mr-4" @click="validate" :loading="loading">SignUp</v-btn>
    </v-container>
  </v-form>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      valid: false,
      login: "",
      password: "",
      length: 20,

      loading: false,

      loginRules: [
        (v) => !!v || "Login is required",
        (v) => v.length <= 20 || "Login must be less than 20 characters",
      ],
      passwordRules: [
        (v) => !!v || "Password is required",
        (v) => v.length <= 20 || "Password must be less than 20 characters",
      ],
    };
  },

  computed: {
    ...mapState(["logError"]),
  },

  beforeMount() {},

  methods: {
    ...mapActions(["signup"]),

    async validate() {
      this.loading = true;

      this.$refs.form.validate();
      if (this.valid) {
        const res = await this.signup({
          login: this.login,
          password: this.password,
        });
        if (res == 409) this.$refs.login.focus();

        this.loading = false;
      }
    },
  },
};
</script>


<style scoped lang='scss'>
.text-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  .error {
    margin-top: 10px;
  }
  button {
    margin-top: 10px;
  }
}
</style>
