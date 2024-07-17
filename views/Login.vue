<template>
	<main class="login">
		<div class="overlay"></div>
		<header>
			<h1>Sistema de Ocorrências</h1>
		</header>
		<section class="forms">
			<form class="login-form" @submit.prevent="login">
				<h2>Login</h2>
				<input 
					type="email" 
					placeholder="Email"
					v-model="login_form.email"
					required />
				<input 
					type="password" 
					placeholder="Senha" 
					v-model="login_form.password"
					required />
				<button type="submit" :disabled="estaCarregando">
					<span v-if="estaCarregando" class="carregando"></span>
					<span v-else>Login</span>
				</button>
			</form>
		</section>
	</main>
</template>

<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'

const login_form = ref({ email: '', password: '' });
const store = useStore();
const estaCarregando = ref(false);

const login = async () => {
	if (!login_form.value.email || !login_form.value.password) {
		alert('Email e senha são campos obrigatórios.');
		return;
	}

	estaCarregando.value = true;

	try {
		await store.dispatch('login', login_form.value);
	} catch (error) {
		alert('Erro ao fazer login. Verifique suas credenciais.');
	} finally {
		estaCarregando.value = false;
	}
}
</script>

<style>
body {
	font-family: 'Arial', sans-serif;
	margin: 0;
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100vh;
	position: relative;
}

.overlay {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: url('https://veja.abril.com.br/wp-content/uploads/2018/02/economia-banco-central-do-brasil-20150617-001.jpg') no-repeat center center fixed;
	background-size: cover;
	z-index: -1;
	filter: blur(2px);
}

header {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	background: linear-gradient(to right, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.7));
	padding: 0.5rem 0; 
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); 
	z-index: 2; 
	text-align: center; 
}

header h1 {
	font-size: 3rem;
	color: #03243d;
	text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
	margin: 0;
}

.forms {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	max-width: 400px;
	padding: 2rem;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	background: rgba(255, 255, 255, 0.9);
	border-radius: 10px;
	z-index: 2;
}

form {
	width: 100%;
	padding: 2rem;
}

form h2 {
	font-size: 2rem;
	text-transform: uppercase;
	margin-bottom: 2rem;
	text-align: center;
	color: #333;
}

input {
	appearance: none;
	border: none;
	outline: none;
	background: none;
	display: block;
	width: 100%;
	font-size: 1rem;
	margin-bottom: 1.5rem;
	padding: 0.75rem 1rem;
	border-radius: 0.5rem;
	box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
	transition: all 0.3s ease;
}

input:not([type="submit"]) {
	background: rgba(0, 0, 0, 0.05);
}

input:focus:not([type="submit"]) {
	background: rgba(0, 0, 0, 0.1);
	box-shadow: 0 0 0 3px rgba(66, 69, 245, 0.2);
}

input::placeholder {
	color: #999;
}

form.login-form input:not([type="submit"]) {
	color: #333;
	border: 1px solid #ddd;
}

form.login-form button[type="submit"] {
	background-color: rgb(66, 69, 245);
	color: #FFF;
	font-weight: 700;
	padding: 1rem 2rem;
	border-radius: 0.5rem;
	cursor: pointer;
	text-transform: uppercase;
	border: none;
	transition: background-color 0.3s ease, transform 0.3s ease;
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
}

form.login-form button[type="submit"]:hover {
	background-color: rgb(45, 47, 178);
	transform: translateY(-2px);
	box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

form.login-form button[type="submit"]:disabled {
	background-color: #ccc;
	cursor: not-allowed;
	transform: none;
	box-shadow: none;
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
