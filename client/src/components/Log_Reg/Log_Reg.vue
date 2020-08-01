<template>
  <div class="inner">
    <div class="toggle">
      <v-tabs v-model="tab">
        <v-tab>SignUp</v-tab>
        <v-tab>SignIn</v-tab>
      </v-tabs>
    </div>
    <v-tabs-items v-model="tab" class="items">
      <v-tab-item :key="0">
        <Reg />
      </v-tab-item>
      <v-tab-item :key="1">
        <Log />
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import Reg from "./Reg";
import Log from "./Log";

export default {
  name: "Log_Reg",
  components: {
    Log,
    Reg,
  },

  data() {
    return {
      tab: "0",
    };
  },
};
</script>


<style scoped lang="scss">
.inner {
  height: 100vh;
  width: 100vw;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .items {
    margin-top: 25px;
  }
}
</style>
