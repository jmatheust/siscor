<template>
  <div id="nav" v-if="$store.state.user">
    <button class="logout-btn" @click="logout" :disabled="estaCarregando">
      <span v-if="estaCarregando" class="carregando"></span>
      <span v-else>Logout</span>
    </button>
  </div>
  <router-view/>
</template>


<script>
import { onBeforeMount, ref } from 'vue';
import { useStore } from 'vuex';

export default {
  
  setup() {
    const store = useStore();
    const estaCarregando = ref(false);

    onBeforeMount(() => {
      store.dispatch('fetchUser');
    });

    const logout = async () => {
      estaCarregando.value = true;
      try {
        await store.dispatch('logout');
      } catch (error) {
        console.error('Erro ao fazer logout:', error);
      } finally {
        estaCarregando.value = false;
      }
    };

    return {
      logout,
      estaCarregando
    };
  }
};
</script>

<style>
.logout-btn {
  position: fixed;
  top: 10px;
  right: 10px;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logout-btn:hover {
  background-color: #0056b3;
}

.logout-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.carregando {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #fff;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

</style>
