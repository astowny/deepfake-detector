var mediaStream = null;
let imagedata = null;

function showResponseModal(responseString, floatValue) {
  var modal = document.getElementById("responseModal");
  var responseMessage = document.getElementById("responseMessage");
  var progressBar = document.getElementById("progressBar");
  var TextMessage = document.getElementById("TextMessage");

  var progressValue = floatValue * 100 - 1; // Multiply by 100 to convert to percentage (never put 100% to protect ourselves)
  progressBar.style.width = progressValue + "%";
  responseMessage.textContent = `Image Type : ${responseString.toUpperCase()}`;
  TextMessage.textContent = `The Image is ${responseString} with Confidence Level of : ${Math.round(
    progressValue
  )}%`;
  modal.style.display = "block";

  // Close the modal when clicking on the close button or outside of the modal
  var closeBtn = document.getElementsByClassName("close")[0];
  window.onclick = function (event) {
    if (event.target == modal || event.target == closeBtn) {
      modal.style.display = "none";
    }
  };
}

function allowDrop(event) {
  event.preventDefault();
}

function drop(event) {
  event.preventDefault();
  var file = event.dataTransfer.files[0];
  imagedata = file;
  previewFile(file);
}

function previewImage(event) {
  var file = event.target.files[0];
  imagedata = file;
  previewFile(file);
}

function previewFile(file) {
  var reader = new FileReader();
  reader.onloadend = function () {
    var img = document.createElement("img");
    img.src = reader.result;
    document.getElementById("imagePreview").innerHTML = "";
    document.getElementById("imagePreview").appendChild(img);
  };
  if (file) {
    reader.readAsDataURL(file);
  }
}

function selectImage() {
  document.getElementById("fileInput").click();
}

function openCamera() {
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then(function (stream) {
      mediaStream = stream;
      var video = document.createElement("video");
      video.srcObject = stream;
      video.play();
      document.getElementById("imagePreview").innerHTML = "";
      document.getElementById("imagePreview").appendChild(video);
      video.onclick = function () {
        var canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas
          .getContext("2d")
          .drawImage(video, 0, 0, canvas.width, canvas.height);
        var img = document.createElement("img");
        img.src = canvas.toDataURL("image/png");
        document.getElementById("imagePreview").innerHTML = "";
        document.getElementById("imagePreview").appendChild(img);
        imagedata = img;
        stopCamera();
      };
    })
    .catch(function (error) {
      console.log("Error accessing the camera: " + error);
    });
}

function showSnackbar() {
  // Get the snackbar DIV
  var x = document.getElementById("snackbar");

  // Add the "show" class to DIV
  x.className = "show";

  // After 3 seconds, remove the show class from DIV
  setTimeout(function () {
    x.className = x.className.replace("show", "");
  }, 3000);
}

function stopCamera() {
  if (mediaStream) {
    mediaStream.getTracks().forEach(function (track) {
      track.stop();
    });
    mediaStream = null;
  }
}

function onSubmit() {
  // Reset the progress animation after the task is completed
  progressBar.style.width = "0%";
  var loader = document.getElementsByClassName("loader-wrapper")[0];
  console.log(loader);
  loader.classList.remove("hidden");
  console.log(loader);

  if (imagedata) {
    const formData = new FormData();
    formData.append("image", imagedata);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/upload", true);
    xhr.onload = function () {
      if (xhr.status === 200) {
        console.log("Image uploaded successfully");
        var prediction = JSON.parse(xhr.response);
        // setTimeout(function () {
        //   // Reset the progress animation after the task is completed
        //   progressBar.style.width = "0%";
        // }, 2000);
        loader.classList.add("hidden");

        showResponseModal(
          prediction.predicted_class,
          prediction.predicted_score
        );
      } else {
        loader.classList.add("hidden");
        setTimeout(function () {
          // Reset the progress animation after the task is completed
          progressBar.style.width = "0%";
        }, 2000);
        console.error("Error uploading image:", xhr.statusText);
        showResponseModal(xhr.response);
      }
    };

    xhr.send(formData);
  } else {
    setTimeout(function () {
      // Reset the progress animation after the task is completed
      progressBar.style.width = "0%";
    }, 2000);
    showResponseModal("No image selected");
  }
}
