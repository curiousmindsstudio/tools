let data = JSON.parse(localStorage.getItem("rev_data")) || [];

// revision gaps
const gaps = [0, 1, 3, 7, 15, 30];

function save(){
  localStorage.setItem("rev_data", JSON.stringify(data));
}

// ADD ITEM
function addItem(){

  let title = document.getElementById("title").value;
  let date = document.getElementById("date").value;

  if(!title || !date) return;

  let start = new Date(date);

  let revisions = gaps.map((gap)=>{
    let d = new Date(start);
    d.setDate(start.getDate() + gap);

    return {
      date: d.toISOString().split("T")[0],
      done: false
    };
  });

  data.push({
    title,
    startDate: date,
    revisions
  });

  save();
  render();

  document.getElementById("title").value = "";
}

// TOGGLE CHECKBOX
function toggle(i,j){
  data[i].revisions[j].done =
  !data[i].revisions[j].done;

  save();
  render();
}

// RENDER UI
function render(){

  let list = document.getElementById("list");
  let todayBox = document.getElementById("today");

  list.innerHTML = "";
  todayBox.innerHTML = "";

  let today = new Date().toISOString().split("T")[0];

  data.forEach((item,i)=>{

    let card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `<h3>${item.title}</h3>`;

    item.revisions.forEach((r,j)=>{

      card.innerHTML += `
        <label>
          <input type="checkbox"
          ${r.done ? "checked":""}
          onchange="toggle(${i},${j})">
          ${r.date}
        </label><br>
      `;

      if(r.date === today){
        todayBox.innerHTML += `
          <div class="card">
            ${item.title} → Revision due today
          </div>
        `;
      }

    });

    list.appendChild(card);
  });
}

render();
