<template>
  <main class="register">
    <button @click="voltar" class="voltar-btn">Voltar</button>
    <section class="forms">
      <form class="ocorrencia" @submit.prevent="enviaOcorrencia" v-if="empresaSelecionada">
        <h2>Registrar Ocorrência para {{ empresaSelecionada.nome }}</h2>
        <div class="form-group">
          <label for="nome">Seu Nome:</label>
          <input id="nome" type="text" placeholder="Seu Nome" v-model="ocorrencia_form.nome" />
          <p v-if="erroNome" class="erro-mensagem">{{ erroNome }}</p>
        </div>
        <div class="form-group">
          <label for="grupo">Grupo:</label>
          <select id="grupo" v-model="ocorrencia_form.grupo">
            <option value="" disabled selected>Selecione um grupo</option>
            <option v-for="grupo in grupos" :key="grupo.id" :value="grupo.nome">
              {{ grupo.nome }}
            </option>
          </select>
          <p v-if="erroGrupo" class="erro-mensagem">{{ erroGrupo }}</p>
        </div>
        <div class="form-group">
          <label for="descricao">Ocorrência:</label>
          <textarea id="descricao" placeholder="Descrição da Ocorrência" v-model="ocorrencia_form.descricao" rows="6"></textarea>
          <p v-if="erroDescricao" class="erro-mensagem">{{ erroDescricao }}</p>
        </div>
        <div class="form-group">
          <button type="submit" :disabled="estaCarregandoOcorrencia">
            <span v-if="estaCarregandoOcorrencia" class="carregando"></span>
            <span v-else>Registrar Ocorrência</span>
          </button>
        </div>
      </form>
    </section>
  </main>
</template>

<script>
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../firebase"; 

export default {
  name: "Ocorrencias",
  data() {
    return {
      ocorrencia_form: {
        nome: "",
        grupo: "",
        descricao: ""
      },
      grupos: [],
      empresaSelecionada: {
        id: this.$route.params.empresaId,
        nome: this.$route.params.empresaNome
      },
      erroNome: "",
      erroGrupo: "",
      erroDescricao: "",
      estaCarregandoOcorrencia: false,
    };
  },
  methods: {
    async carregarGrupos() {
      try {
        const querySnapshot = await getDocs(collection(db, `empresas/${this.empresaSelecionada.id}/grupo`)); 
        this.grupos = querySnapshot.docs.map(doc => ({ id: doc.id, nome: doc.data().nome }));
      } catch (error) {
        console.error("Erro ao carregar grupos: ", error);
      }
    },
    validaFormulario() {
      this.erroNome = this.ocorrencia_form.nome ? "" : "Nome é obrigatório.";
      this.erroGrupo = this.ocorrencia_form.grupo ? "" : "Grupo é obrigatório.";
      this.erroDescricao = this.ocorrencia_form.descricao ? "" : "Descrição é obrigatória.";
      
      return !this.erroNome && !this.erroGrupo && !this.erroDescricao;
    },
    async enviaOcorrencia() {
      if (!this.validaFormulario()) {
        return;
      }

      this.estaCarregandoOcorrencia = true;
      try {
        const dataHoraAtual = new Date();
        const dataHoraISO = dataHoraAtual.toISOString();
        this.ocorrencia_form.dataHora = dataHoraISO;
        
        await addDoc(collection(db, "ocorrencias"), {
          nome: this.ocorrencia_form.nome,
          grupo: this.ocorrencia_form.grupo,
          empresa: this.empresaSelecionada.nome,
          descricao: this.ocorrencia_form.descricao,
          dataHora: this.ocorrencia_form.dataHora
        });

        this.ocorrencia_form = { nome: "", grupo: "", descricao: "", dataHora: "" };
      } catch (e) {
        console.error("Erro ao registrar ocorrência: ", e);
      } finally {
        this.estaCarregandoOcorrencia = false;
      }
    },
    voltar() {
      this.$router.push({ name: 'Empresas' });
    },
  },
  async mounted() {
    await this.carregarGrupos();
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

.register {
  width: 100%;
  max-width: 800px;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.voltar-btn {
  align-self: flex-start;
  margin-bottom: 20px;
  padding: 10px 20px;
  background-color: #ff6f61;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.voltar-btn:hover {
  background-color: #ff4b3e;
}

.forms {
  width: 100%;
}

.ocorrencia {
  width: 100%;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}

input, select, textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  margin-bottom: 10px;
}

button {
  width: 100%;
  padding: 15px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #0056b3;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.erro-mensagem {
  color: red;
  font-size: 14px;
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
