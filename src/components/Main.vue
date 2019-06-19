

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
      <b-button v-if="file" variant="success" @click.prevent="showModal">Upload {{ file ? file.name : '' }}</b-button>
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
        <b-button @click.prevent="selectDownloadFile(data.item.name)">{{data.item.name}}</b-button>
      </template>
    </b-table>

    <b-modal id="modal-prevent-closing" ref="modal" title="Add password protection to your file" @ok="upload" v-model="modalShow">
      <form ref="form" @submit.stop.prevent="upload">
        <!-- <b-form-group:state="nameState" label="Name" label-for="name-input" invalid-feedback="Name is required"> -->
          <b-form-input v-model="password">
          </b-form-input>
        <!-- </b-form-group> -->
      </form>
    </b-modal>

    <b-modal ref="modal2" title="Type the password used for this file" @ok="downloadFile" v-model="downloadShow">
      <form ref="form" @submit.stop.prevent="downloadFile">
        <!-- <b-form-group:state="nameState" label="Name" label-for="name-input" invalid-feedback="Name is required"> -->
          <b-form-input v-model="password">
          </b-form-input>
          <b-badge variant="warning">If you use a wrong password, downloaded file will be corrupted</b-badge>
        <!-- </b-form-group> -->
      </form>
    </b-modal>


  </div>
</template>

<script>
import axios from 'axios';
import jwt from 'jwt-simple';
import sha256 from 'crypto-js/sha256';

const client = axios.create({
  baseURL: 'http://localhost:3001/',
  json: true
});

export default {
  name: 'main',
  data: () => ({
    file: null,
    password: "",
    dismissSecs: 10,
    dismissCountDown: 0,
    errorCountDown: 0,
    errorMessage: "Unidentified error",
    listedFiles: [],
    fields: [
      {key: "name", label: "File name"},
      "Download"
    ],
    modalShow: false,
    downloadShow: false,
    selectedFile: null
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
      fd.append('password', sha256(this.password).toString());
      fd.append('fileName', "file1.txt");
      client.post("/file", fd, {
        headers: {
          'authorization': token
        }
      }).then((res) => {
        this.file = null;
        this.password = "";
        this.dismissCountDown = this.dismissSecs;
        this.showModal = false;
      }).catch((err) => {
        this.errorCountDown = this.dismissSecs;
        this.errorMessage = "Your file was not saved, try again or contact an admin";
        this.showModal = false;
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
      });
    },
    downloadFile: function() {
      let fileName = this.selectedFile;
      let token = jwt.encode({username: window.localStorage.getItem("username")}, window.localStorage.getItem("secret"));
      client.get("/file", {
        params: {
          username: window.localStorage.getItem("username"),
          password: sha256(this.password).toString(),
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
        this.downloadShow = false;
      }).catch((err) => {
        this.errorCountDown = this.dismissSecs;
        this.errorMessage = "Cannot download the file, you may used a wrong password, if not, try again later";
        this.downloadShow = false;
      });
    },
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
    errorCountChanged(errorCountDown) {
      this.errorCountDown = errorCountDown
    },
    showModal() {
      this.modalShow = true;
      this.password = "";
    },
    selectDownloadFile(fileName) {
      this.selectedFile = fileName;
      this.password = "";
      this.downloadShow = true;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.modal {
  top: 25%;
}


</style>
