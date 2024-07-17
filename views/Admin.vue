<template>
  <div class="admin">
    <h1>Ocorrências Cadastradas</h1>
  
    <table>
      <thead>
        <tr>
          <th>Nome do Colaborador</th>
          
          <th>Empresa</th>
          <th>Grupo</th>
          <th>Descrição</th>
          <th>Data e Hora do Registro</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="ocorrencia in ocorrencias" :key="ocorrencia.id">
          <td>{{ ocorrencia.nome }}</td>
          <td>{{ ocorrencia.empresa }}</td>
          <td>{{ ocorrencia.grupo }}</td>
          <td>{{ ocorrencia.descricao }}</td>
          <td>{{ formatarDataISO(ocorrencia.dataHora) }}</td>

        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../firebase';

const ocorrencias = ref([]);

const carregarOcorrencias = async () => {
  const querySnapshot = await getDocs(collection(db, "ocorrencias"));
  querySnapshot.forEach((doc) => {
    ocorrencias.value.push({ id: doc.id, ...doc.data() });
  });
};

const formatarDataISO = (dataISO) => {
  const data = new Date(dataISO);
  return data.toLocaleString();
};

onMounted(() => {
  carregarOcorrencias();
});
</script>

<style>

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

th, td {
  border: 1px solid #000000;
  padding: 10px;
}
</style>

