import Peer from "peerjs";

const another = document.getElementById("another-peers-id");
const shareBtn = document.getElementById("share");
const callBtn = document.getElementById("call");
const myID = document.querySelector(".my-id");

const reverseBtn = document.querySelector(".reverse");
const reverseAnotherBtn = document.querySelector(".reverse-another");

console.log({ reverseBtn, reverseAnotherBtn });

reverseBtn.addEventListener("click", () => {
  const video = document.getElementById("local");
  video.classList.toggle("call");
});

reverseAnotherBtn.addEventListener("click", () => {
  const video = document.getElementById("remote");
  video.classList.toggle("call");
});

function openStreamDisplayMedia(
  config = { video: { mediaSource: "screen" }, audio: true }
) {
  return navigator.mediaDevices.getDisplayMedia(config);
}

function openStream(config = { audio: true, video: true }) {
  console.log(config);
  return navigator.mediaDevices.getUserMedia(config);
}

function playStream(id, stream, calling = true) {
  const video = document.getElementById(id);
  if (calling) {
    video.classList.add("call");
  }
  console.log(stream);
  video.srcObject = stream;
  video.play();
}

export default function bar() {
  var peer = new Peer();
  peer.on("open", (id) => {
    myID.innerText = `Your ID: ${id}`;
    console.log(id);
  });

  callBtn.addEventListener("click", () => {
    const id = another.value.trim();
    openStream().then((stream) => {
      playStream("local", stream);
      const call = peer.call(id, stream);
      call.on("stream", (remoteStream) => playStream("remote", remoteStream));
    });
  });

  shareBtn.addEventListener("click", () => {
    const id = another.value.trim();
    openStreamDisplayMedia().then((stream) => {
      playStream("local", stream, false);
      const call = peer.call(id, stream);
      call.on("stream", (remoteStream) => playStream("remote", remoteStream));
    });
  });

  peer.on("call", (call) => {
    const result = confirm(
      "Cảnh báo: Nếu show màn hình nhấn OK, nếu show webcam nhấn cancel"
    );
    if (result) {
      openStreamDisplayMedia().then((stream) => {
        playStream("local", stream, false);
        call.answer(stream);
        call.on("stream", (remoteStream) =>
          playStream("remote", remoteStream, false)
        );
      });
    } else {
      openStream().then((stream) => {
        call.answer(stream);
        playStream("local", stream);
        call.on("stream", (remoteStream) => playStream("remote", remoteStream));
      });
    }
  });
}
