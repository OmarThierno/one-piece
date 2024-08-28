<script>
import axios from "axios";
import { store } from "../store.js";

export default {
  data() {
    return {
      store,
      headers: {
        "Content-Type": "application/json",
        "OpenAI-Beta": "assistants=v2"
      },
      haveThreadId: false,
      threadId: '',
      mesUser: '',
      mesUserCopy: '',
      mesReturn: '',
      runId: '',
      isCompleted: false,
      isLoading: false,
      mesPrint: [
        {
          figure: 'Chopper',
          messages: "Ciao! Sono qui per parlare di tutto ciò che riguarda One Piece! 🎉 Hai una domanda specifica o un momento preferito della serie di cui vorresti parlare? Oppure possiamo fare un quiz divertente sui personaggi e le loro citazioni! Non vedo l'ora di cominciare! 🏴‍☠️🚢"
        },
        {
          figure: 'user',
          messages: 'Chi è luffy?'
        },
        {
          figure: 'Chopper',
          messages: "Oh, Luffy è uno dei personaggi più straordinari e amati del mondo degli anime e dei manga! 🏴‍☠️ Monkey D. Luffy, il protagonista di \"One Piece,\" è un giovane pirata con il sogno di trovare il leggendario tesoro One Piece e diventare il Re dei Pirati! Ciò che rende Luffy così speciale è il suo incredibile potere derivante dal frutto del diavolo Gom Gom (Gomu Gomu no Mi), che gli dona la capacità di allungare il suo corpo come fosse di gomma. Immagina che figata combattere con braccia e gambe elastiche! Ma non è solo il suo potere a renderlo speciale. Luffy ha un cuore d'oro, un'incredibile determinazione e una lealtà profonda verso i suoi amici e compagni di ciurma, la ciurma di Cappello di Paglia. È sempre pronto a battersi per proteggere chi gli sta a cuore e non si arrende mai, non importa quanto difficili siano le sfide che affronta. Ha anche una sua filosofia molto semplice ma potente: segue il suo cuore e fa quello che ritiene giusto, il che gli ha permesso di stringere amicizie in tutto il mondo e affrontare nemici formidabili! Hai un momento preferito di Luffy che ti ha particolarmente emozionato? 🥳"
        },
        {
          figure: 'user',
          messages: 'Dimmi i membri della sua ciurma'
        },
        {
          figure: 'Chopper',
          messages: "Certo, sarà un piacere! La ciurma di Cappello di Paglia è composta da personaggi fantastici, ognuno con abilità e personalità uniche. Ecco un elenco dei membri principali, con un cenno ad ognuno di loro: 1. **Monkey D. Luffy** - Il capitano e possessore dei poteri del frutto Gom Gom. Il suo sogno è diventare il Re dei Pirati. 2. **Roronoa Zoro** - Il primo membro a unirsi a Luffy. È uno spadaccino formidabile che utilizza la tecnica delle tre spade (Santoryu) e ha il sogno di diventare il miglior spadaccino del mondo. 3. **Nami** - La navigatrice della ciurma, esperta in meteorologia e in cartografia. Sogna di creare una mappa completa del mondo. 4. **Usopp** - Il cecchino e inventore della ciurma, con una grande abilità nell'uso della fionda. Sogna di diventare un coraggioso guerriero del mare. 5. **Sanji** - Il cuoco, sempre elegante e galante, specializzato in molte arti marziali con le gambe. Il suo sogno è trovare l'All Blue, un leggendario mare dove si dice convergano tutte le specie di pesci. 6. **Tony Tony Chopper** - Il dottore della ciurma, un piccolo renna che ha mangiato il frutto Homo Homo (Hito Hito no Mi), permettendogli di trasformarsi in un ibrido umano-animale. Sogna di diventare un medico capace di curare qualsiasi malattia. 7. **Nico Robin** - L'archeologa della ciurma, con l'abilità di creare parti del suo corpo in vari luoghi grazie al frutto Fior Fior (Hana Hana no Mi). Il suo sogno è scoprire la verità sulla Storia Poneglyph e sull'antica storia del mondo. 8. **Franky** - Il carpentiere cyborg della ciurma, maestro nella costruzione e riparazione di navi, nonché nel combattimento con le sue modifiche meccaniche. Il suo sogno è costruire ed esplorare il mondo con la nave più grande che abbia mai creato, la Thousand Sunny. 9. **Brook** - Il musicista e spadaccino scheletrico della ciurma. Ha mangiato il frutto Revive Revive (Yomi Yomi no Mi) che gli ha permesso di tornare in vita. Il suo sogno è riunirsi con la sua vecchia balenottera, Laboon. 10. **Jinbe** - Il timoniere della ciurma, un uomo-pesce di grande forza e onore, praticante dell'arte del karate degli uomini-pesce. Il suo sogno è portare la pace tra uomini e uomini-pesce. Ogni membro della ciurma ha la sua storia affascinante e i suoi obiettivi, che rendono \"One Piece\" una saga così appassionante. Hai un membro preferito tra loro? 😊"
        },
      ]
    }
  },
  created() {
    console.log("prova");
  },
  methods: {
    async getThreadId() {
      const data = {};

      const headers = this.headers;
      headers["Authorization"] = "Bearer " + this.store.api_key;

      try {
        const response = await axios.post("https://api.openai.com/v1/threads", data, {
          headers
        });

        console.log('getThreadID', response)
        this.threadId = response.data.id;
        this.haveThread = true;
      }
      catch (error) {
        console.error('Errore in getThreadId()', error);
      }
    },
    async postMessages() {
      this.isLoading = true
      const data = {
        "role": "user",
        "content": this.mesUserCopy
      };

      const headers = this.headers;
      headers["Authorization"] = "Bearer " + this.store.api_key;

      try {
        const response = await axios.post(`https://api.openai.com/v1/threads/${this.threadId}/messages`, data, {
          headers
        });
        console.log('postMessages', response)
        this.isLoading = false;
      }
      catch (error) {
        console.error('Errore in postMessages()', error);
      }
    },
    async runThread() {
      this.isLoading = true;
      const data = {
        "assistant_id": "asst_G0tA3RRmqPxgQFZPnvNWh2BM",
        "additional_instructions": null,
        "tool_choice": null
      };

      const headers = this.headers;
      headers["Authorization"] = "Bearer " + this.store.api_key;

      try {
        const response = await axios.post(`https://api.openai.com/v1/threads/${this.threadId}/runs`, data, {
          headers
        });
        console.log('runThread', response)
        this.runId = response.data.id;

        await this.pollThreadStatus();
      }
      catch (error) {
        console.error('Errore in runsThread()', error);
      }
    },
    async pollThreadStatus() {
      this.isLoading = true;

      const headers = this.headers;
      headers["Authorization"] = "Bearer " + this.store.api_key;

      const checkStatus = async () => {
        const response = await axios.get(`https://api.openai.com/v1/threads/${this.threadId}/runs/${this.runId}`, {
          headers
        });
        console.log('pollThreadStatus', response);

        // Check if the status indicates that the run is complete
        if (response.data.status === 'completed') {
          this.isLoading = false;
          return this.isCompleted = true;
        } else {
          return this.isCompleted = false;
        }
      };

      const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

      while (!this.isCompleted) {
        this.isCompleted = await checkStatus();
        if (!this.isCompleted) {
          await delay(1000); // Wait for 1 seconds before the next status check
        }
      }
    },
    async getMessages() {
      this.isLoading = true;

      const headers = this.headers;
      headers["Authorization"] = "Bearer " + this.store.api_key;

      try {
        const response = await axios.get(`https://api.openai.com/v1/threads/${this.threadId}/messages`, {
          headers
        });
        console.log('getMessages', response)
        const newMesReceie = {
          figure: 'Chopper',
          messages: response.data.data[0].content[0].text.value,
        }

        this.mesPrint.push(newMesReceie)
        this.isCompleted = false;
        this.isLoading = false;

        // Scroll to the bottom of the chat
        this.scrollToBottom();

      } catch (error) {
        console.error('Errore in getMessages()', error);
      }
    },
    async starWithoutThreadId() {
      await this.postMessages();
      await this.runThread();
      await this.getMessages();
    },
    async startThread() {
      this.getUserMessage();

      if (!this.haveThreadId) {
        try {
          await this.getThreadId();
          this.starWithoutThreadId()
          this.haveThreadId = true;

        } catch (error) {
          console.error('Errore in startThread()', error);
        }
      } else {
        try {
          this.starWithoutThreadId()
        } catch (error) {
          console.error('Errore in startThread()', error);
        }
      }

    },
    getUserMessage() {
      this.mesUserCopy = this.mesUser;
      this.mesUser = '';
      const newMesSend = {
        figure: 'user',
        messages: this.mesUserCopy
      }

      this.mesPrint.push(newMesSend);
      this.scrollToBottom();

    },
    scrollToBottom() {
      this.$nextTick(() => {
        const chatContainer = this.$el.querySelector('.main-body');
        chatContainer.scroll({
          top: chatContainer.scrollHeight,
          behavior: 'smooth'
        });
      });
    }

  }
}
</script>

<template>
  <main class="main">
    <div class="container">
      <header class="d-flex align-items-center gap-3">
        <h3 class="my-4">ChopperChat</h3>
        <div v-if="isLoading">is writing...</div>
      </header>
      <main class="position-relative">
        <div class="main-body">
          <div v-for="message in mesPrint" class="row row-cols-1- row-cols-ms-2 row-cols-md-2 message"
            :class="message.figure === 'user' ? 'justify-content-end' : ''">
            <div class="col">
              <p :class="message.figure === 'Chopper' ? 'received' : 'send'">{{ message.messages }}</p>
            </div>
          </div>
          <div v-if="isLoading" id="fake-writing" class="">
            <div class="ball ball-1">
            </div>
            <div class="ball ball-2">
            </div>
            <div class="ball ball-3">
            </div>
            <div class="ball ball-4">
            </div>
          </div>
        </div>
        <div class="ms_input-mes d-flex align-items-center gap-2">
          <input @keyup.enter="startThread" class="flex-grow-1" type="text" placeholder="Chatta..." v-model="mesUser">
          <i v-if="mesUser === ''" class="fa-regular fa-paper-plane"></i>
          <i v-else @click="startThread" class="fa-solid fa-paper-plane"></i>
        </div>
      </main>
      <!-- <button @click="startThread">Make Sequential Requests</button> -->
    </div>
  </main>

</template>

<style lang="scss" scoped>
main.main {
  margin-top: 80px;
  .main-body {
    height: 76vh;
    background-color: rgb(250, 250, 250);
    padding: 20px;
    padding-bottom: 60px;
    border-radius: 15px;
    box-shadow: 0px 0px 10px 5px rgba(0, 0, 0, 0.15);
    overflow-y: scroll;
    position: relative;

    &::-webkit-scrollbar {
      display: none;
    }
  
    .received {
      background-color: rgb(119, 203, 1);
      padding: 10px;
      border-radius: 10px;
    }
  
    .send {
      background-color: rgb(240, 240, 240);
      padding: 10px;
      padding-left: 20px;
      border-radius: 10px;
    }
  }

  .ms_input-mes {
    position: absolute;
    bottom: 20px;
    right: 20px;
    left: 20px;
    background-color: rgb(212, 212, 212);
    padding: 10px 20px;
    border-radius: 10px;
    color: black;
    cursor: pointer;

    input {
      border: none;
      background-color: rgb(212, 212, 212);
      
      &::placeholder {
        color: black;
      }

      &:focus {
        outline: none
      }
    }
  }
  
  #fake-writing {
      width: 100px;
      height: 40px;
      padding: 5px;
      border-radius: 5px;
      background: rgb(119, 203, 1);
      border-radius: 10px;
      margin-bottom: 20px;
    }
  
    .ball {
      float: left;
      margin-top: 20px;
      margin-left: 10px;
      width: 10px;
      height: 10px;
      border-radius: 10px;
      background: black;
    }
  
    .ball-1 {
      animation: ball1 0.6s ease-in-out infinite;
      animation-delay: 0.2s;
    }
  
    .ball-2 {
      animation: ball1 0.6s ease-in-out infinite;
      animation-delay: 0.3s;
    }
  
    .ball-3 {
      animation: ball1 0.6s ease-in-out infinite;
      animation-delay: 0.4s;
    }
  
    .ball-4 {
      animation: ball1 0.6s ease-in-out infinite;
      animation-delay: 0.5s;
    }
  
    @keyframes ball1 {
      0% {
        transform: translateY(0px);
      }
  
      100% {
        transform: translateY(-10px);
      }
    }
}
</style>
