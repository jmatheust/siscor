<template>
  <main class="select-company">
    <section class="tabs">
      <div 
        v-for="empresa in empresas" 
        :key="empresa.id" 
        @click="selecionaEmpresa(empresa)" 
        :class="['tab', { active: empresa.id === empresaSelecionada?.id }]"
      >
        <span v-if="empresa.id === empresaSelecionada?.id && estaCarregandoEmpresa" class="carregando"></span>
        <span v-else>{{ empresa.nome }}</span>
      </div>
    </section>
  </main>
</template>

<script>
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase"; 

export default {
  name: "Empresas",
  data() {
    return {
      empresas: [],
      empresaSelecionada: null,
      estaCarregandoEmpresa: false,
    };
  },
  methods: {
    async carregarEmpresas() {
      try {
        const querySnapshot = await getDocs(collection(db, "empresas"));
        this.empresas = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (error) {
        console.error("Erro ao carregar empresas: ", error);
      }
    },
    selecionaEmpresa(empresa) {
      this.empresaSelecionada = empresa;
      this.$router.push({ name: 'Ocorrencias', params: { empresaId: empresa.id, empresaNome: empresa.nome } });
    },
  },
  async mounted() {
    await this.carregarEmpresas();
  }
};
</script>

<style scoped>
body {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
  background-color: #f4f4f4;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.select-company {
  width: 80%;
  max-width: 1000px;
  background-color: #ffffff;
  padding: 60px;
  border-radius: 10px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.tabs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10px;
  width: 100%;
}

.tab {
  padding: 20px 50px;
  cursor: pointer;
  background-color: #007bff;
  color: #fff;
  border-radius: 4px;
  transition: background-color 0.3s, box-shadow 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.tab.active {
  background-color: #0056b3;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

.tab:hover {
  background-color: #0056b3;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
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
</style>
