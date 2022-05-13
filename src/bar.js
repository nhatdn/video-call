import Peer from "peerjs";

const another = document.getElementById("another-peers-id");
const call = document.getElementById("call");

function openStream() {
  const config = { audio: false, video: true };
  return navigator.mediaDevices.getUserMedia(config);
}

function playStream(id, stream) {
  const video = document.getElementById(id);
  video.srcObject = stream;
  video.play();
}

export default function bar() {
  var peer = new Peer();
  peer.on("open", (id) => console.log(id));
  //caller
  call.addEventListener("click", () => {
    const id = another.value;
    openStream().then((stream) => {
      playStream("local", stream);
      const call = peer.call(id, stream);
      call.on("stream", (remoteStream) => playStream("remote", remoteStream));
    });
  });
  // callee
  peer.on("call", (call) => {
    console.log(call);
    openStream().then((stream) => {
      call.answer(stream);
      playStream("local", stream);
      call.on("stream", (remoteStream) => playStream("remote", remoteStream));
    });
  });
}
