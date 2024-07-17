import { createStore } from 'vuex';
import router from '../router';
import { auth, db } from '../firebase';
import { 
  signInWithEmailAndPassword,
  signOut 
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export default createStore({
  state: {
    user: null,
    role: null
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    SET_ROLE(state, role) {
      state.role = role;
    },
    CLEAR_USER(state) {
      state.user = null;
      state.role = null;
    }
  },
  actions: {
    async login({ commit }, details) {
      const { email, password } = details;

      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.data();

        if (!userData) {
          throw new Error('Usuário não encontrado no banco de dados.');
        }

        commit('SET_USER', user);
        commit('SET_ROLE', userData.role);

        if (userData.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/empresas');
        }
      } catch (error) {
        switch(error.code) {
          case 'auth/user-not-found':
            alert("Usuário não encontrado");
            break;
          case 'auth/wrong-password':
            alert("Senha Incorreta");
            break;
          default:
            alert("Algo deu errado :(");
        }
        return;
      }
    },

    async logout({ commit }) {
      await signOut(auth);
      commit('CLEAR_USER');
      router.push('/');
    },

    fetchUser({ commit }) {
      auth.onAuthStateChanged(async user => {
        if (user === null) {
          commit('CLEAR_USER');
        } else {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          const userData = userDoc.data();

          commit('SET_USER', user);
          commit('SET_ROLE', userData.role);

          if (router.isReady() && router.currentRoute.value.path === '/login') {
            if (userData.role === 'admin') {
              router.push('/admin');
            } else {
              router.push('/empresas');
            }
          }
        }
      });
    }
  }
});
