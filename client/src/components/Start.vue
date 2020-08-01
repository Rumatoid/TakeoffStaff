<template>
  <v-app>
    <Loader v-if="!isReady" />
    <div v-else>
      <Cabinet v-if="isLogin" />
      <LogReg v-if="!isLogin" />
    </div>
  </v-app>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";

import Cabinet from "./Cabinet/Cabinet";
import LogReg from "./Log_Reg/Log_Reg";
import Loader from "@/components/res/Loader";

export default {
  name: "Start",

  components: {
    Cabinet,
    LogReg,
    Loader,
  },

  data() {
    return {};
  },

  computed: {
    ...mapState(["login", "isLogin", "isReady"]),
  },

  async beforeMount() {
    if (localStorage.login) {
      await this.signin({
        login: localStorage.login,
        password: localStorage.password,
      });
    }
    this.setIsReady(true);
  },

  methods: {
    ...mapActions(["signin"]),
    ...mapMutations(["setIsReady"]),
  },
};
</script>

<style scoped lang="scss">
.main {
  height: 100vh;
  width: 100vw;

  color: #e1e3e6;
}
</style>
