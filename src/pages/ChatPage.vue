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
        }
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

    }

  }
}
</script>

<template>
  <main>
    <header class="container">
      <div class="d-flex align-items-center gap-3">
        <h1 class="my-4">ChopperChat</h1>
        <div v-if="isLoading">is writing...</div>
      </div>
      <main class="main-body">
        <div v-for="message in mesPrint" class="row row-cols-1- row-cols-ms-2 row-cols-md-2 message"
          :class="message.figure === 'user' ? 'justify-content-end' : ''">
          <div class="col">
            <p :class="message.figure === 'Chopper' ? 'received' : 'send'">{{ message.messages }}</p>
          </div>
        </div>
        <div class="d-flex align-items-center gap-2 pt-4">
          <input  @keyup.enter="startThread" class="flex-grow-1" type="text" placeholder="Chatta" v-model="mesUser">
          <i v-if="mesUser === ''" class="fa-regular fa-paper-plane"></i>
          <i v-else @click="startThread" class="fa-solid fa-paper-plane"></i>
        </div>
      </main>
      <!-- <button @click="startThread">Make Sequential Requests</button> -->
    </header>
  </main>

</template>

<style lang="scss" scoped>
.main-body {
  background-color: rgb(250, 250, 250);
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0px 0px 10px 5px rgba(0, 0, 0, 0.15);

  .received {
    background-color: rgb(119, 203, 1);
    padding: 10px;
  }

  .send {
    background-color: rgb(240, 240, 240);
    padding: 10px;
  }
}
</style>
