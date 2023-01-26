const socket = io();
let prev = 0;

const send = () => {
    // player is not doing anything
    const new_data = document.playerData;
    if (new_data === prev) {
        return;
    }
    socket.emit("player_position", new_data);
    prev = new_data;
};
const receive = (evt) => {
    console.log(`enemy pos: ${evt}`);
    document.otherPlayerData = evt;
};

socket.on("other_player_position", receive);

const ping = setInterval(send, 50);
