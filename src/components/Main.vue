

<template>
  <div class="text-center">
    <div>Select a file to upload</div>
    <b-form-file
      v-model="file"
      :state="Boolean(file)"
      placeholder="Choose a file..."
      drop-placeholder="Drop file here..."
      class="w-25 mt-3"
    ></b-form-file>
    <div class="mt-3">
      <b-button v-if="file" variant="success" @click.prevent="upload">Upload {{ file ? file.name : '' }}</b-button>
      <b-button v-else disabled>Upload</b-button>
    </div>
    <div class="mt-3">
      <b-button @click.prevent="listFiles">List your files</b-button>
    </div>

    <b-alert :show="dismissCountDown" dismissible variant="success" @dismissed="dismissCountDown=0" @dismiss-count-down="countDownChanged">
      <p>File saved correctly</p>
      <b-progress variant="success" :max="dismissSecs" :value="dismissCountDown" height="4px"></b-progress>
    </b-alert>

    <b-alert :show="errorCountDown" dismissible variant="danger" @dismissed="errorCountDown=0" @dismiss-count-down="errorCountChanged">
      <p>{{errorMessage}}</p>
      <b-progress variant="danger" :max="dismissSecs" :value="errorCountDown" height="4px"></b-progress>
    </b-alert>

    <b-table striped hover :fields="fields" :items="listedFiles">
      <template slot="Download" slot-scope="data">
        <b-button @click.prevent="downloadFile(data.item.name)">{{data.item.name}}</b-button>
      </template>
    </b-table>


  </div>
</template>

<script>
import axios from 'axios';
import jwt from 'jwt-simple';

const client = axios.create({
  baseURL: 'http://localhost:3001/',
  json: true
});

export default {
  name: 'main',
  data: () => ({
    file: null,
    password: "aPass",
    dismissSecs: 10,
    dismissCountDown: 0,
    errorCountDown: 0,
    errorMessage: "Unidentified error",
    listedFiles: [],
    fields: [
      {key: "name", label: "File name"},
      "Download"
    ]
  }),
  methods: {
    upload: function() {
      let that = this;
      let token = jwt.encode({username: window.localStorage.getItem("username")}, window.localStorage.getItem("secret"));

      /*

      username: window.localStorage.getItem("username"),
      password: this.password,
      file: new FormData(this.file),
      fileName: "file1.txt"
      */
      var fd = new FormData();
      fd.append('file', this.file);
      fd.append('username', window.localStorage.getItem("username"));
      fd.append('password', this.password);
      fd.append('fileName', "file1.txt");
      client.post("/file", fd, {
        headers: {
          'authorization': token
        }
      }).then((res) => {
        this.file = null;
        this.dismissCountDown = this.dismissSecs;
      }).catch((err) => {
        this.errorCountDown = this.dismissSecs;
        this.errorMessage = "Your file was not saved, try again or contact an admin";
        console.log(err);
      });
    },
    listFiles: function() {
      let token = jwt.encode({username: window.localStorage.getItem("username")}, window.localStorage.getItem("secret"));
      client.get("/files", {
        params: {
          username: window.localStorage.getItem("username")
        },
        headers: {
          'authorization': token
        }
      }).then((res) => {
        let names = res.data.files.map((name) => (
          {name: name}
        ));
        this.listedFiles = names;
      }).catch((err) => {
        this.errorCountDown = this.dismissSecs;
        this.errorMessage = "Cannot list the files right now";
        console.log(err);
      });
    },
    downloadFile: function(fileName) {
      let token = jwt.encode({username: window.localStorage.getItem("username")}, window.localStorage.getItem("secret"));
      client.get("/file", {
        params: {
          username: window.localStorage.getItem("username"),
          password: this.password,
          fileName: fileName
        },
        headers: {
          'authorization': token
        }
      }).then((res) => {
        var byteArray = new Uint8Array(res.data.file.data);
        var blob = new Blob([byteArray]);
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
        console.log(res);
      }).catch((err) => {
        this.errorCountDown = this.dismissSecs;
        this.errorMessage = "Cannot download the file, try again later";
        console.log(err);
      });
    },
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
    errorCountChanged(errorCountDown) {
      this.errorCountDown = errorCountDown
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>



</style>
