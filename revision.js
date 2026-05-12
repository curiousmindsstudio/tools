let data = JSON.parse(localStorage.getItem("rev_data")) || [];

// revision pattern
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

// RENDER TABLE
function render(){

  let table = document.getElementById("table");

  table.innerHTML = "";

  // HEADER ROW
  let header = `
    <tr>
      <th>Chapter Name</th>
      <th>Revision 1</th>
      <th>Revision 2</th>
      <th>Revision 3</th>
      <th>Revision 4</th>
      <th>Revision 5</th>
      <th>Revision 6</th>
    </tr>
  `;

  table.innerHTML += header;

  // DATA ROWS
  data.forEach((item,i)=>{

    let row = `<tr>`;

    // chapter name
    row += `<td class="chapter">${item.title}</td>`;

    item.revisions.forEach((r,j)=>{

      row += `
        <td>
          <label>
            <input type="checkbox"
            ${r.done ? "checked":""}
            onchange="toggle(${i},${j})">
            ${r.date}
          </label>
        </td>
      `;

    });

    row += `</tr>`;

    table.innerHTML += row;
  });
}

render();
