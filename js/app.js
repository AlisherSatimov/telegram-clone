document.addEventListener("DOMContentLoaded", async () => {
  axios.defaults.baseURL = "http://localhost:3000";
  let alerts = document.querySelector(".alerts");

  function createAlert(msg, type = "error") {
    let alertElement = document.createElement("div");
    let color =
      type === "error"
        ? "rose"
        : type === "success"
        ? "green"
        : type === "info"
        ? "blue"
        : "yellow";
    let className = `text-xl ps-8 py-2 pe-4 rounded-lg border border-${color}-900 text-${color}-900 bg-${color}-200`;

    alertElement.classList.add(...className.split(" "));
    alertElement.innerText = msg;
    let closeBtn = document.createElement("button");
    closeBtn.classList.add("ms-4");
    closeBtn.innerText = "X";
    alertElement.append(closeBtn);
    alerts.append(alertElement);
    closeBtn.addEventListener("click", () => alertElement.remove());
    setTimeout(() => alertElement.remove(), 3_000);
  }

  let fullName = document.querySelector("#fullName");
  let phoneNumber = document.querySelector("#phoneNumber");
  let logoutBtn = document.querySelector("#logoutBtn");
  let main = document.querySelector("main");

  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("user-id");
    createAlert("Logged out successfully", "success");
    setTimeout(() => {
      window.location.replace("/pages/login.html");
    }, 3_500);
  });

  let { data: user } = await axios.get(`/users/${userId}`);

  if (!user) {
    localStorage.removeItem("user-id");
    window.location.replace("/pages/login.html");
  }

  fullName.innerText = user.fullName;
  phoneNumber.innerText = "+" + user.phone;

  let { data: chats } = await axios.get(`/chats`);

  chats = chats.filter((chat) => chat.members.includes(user.id));

  if (chats.length === 0) {
    let h2 = document.createElement("h2");
    h2.classList.add("text-4xl", "text-blue-600", "text-center");

    h2.innerText =
      "You haven't started any chat with anyone yet. \nLooks like you are from MOON 😇";

    main.append(h2);
  } else {
    let ul = document.createElement("ul");

    ul.classList.add(
      ..."grid gap-2 [&_li]:border-rose-900 [&_li:not(:first-child)]:border-t [&_li]:pt-2".split(
        " "
      )
    );

    main.append(ul);
    chats.forEach(async (chat) => {
      let friendId = chat.members.find((memberId) => memberId !== user.id);
      let { data: friend } = await axios.get(`/users/${friendId}`);

      let li = document.createElement("li");
      li.classList.add("flex", "items-center", "gap-2", "cursor-pointer");
      li.setAttribute("data-chat-id", chat.id);

      li.innerHTML = `
        <div
          class="w-16 h-16 bg-rose-200 rounded-full grid place-items-center text-rose-900 text-2xl"
        >
          ${friend.fullName[0]}
        </div>
        <h3 class="text-2xl">${friend.fullName}</h3>
      `;

      ul.append(li);

      li.addEventListener("click", () => {
        window.location.replace(`/pages/chat.html?chatId=${chat.id}`);
      });
    });
  }
});
