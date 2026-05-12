let data = JSON.parse(localStorage.getItem("rev_data")) || [];

let currentSubject = "All";

const gaps = [0, 1, 3, 7, 15, 30];

// SAVE
function save(){
  localStorage.setItem("rev_data", JSON.stringify(data));
}

// SET SUBJECT FILTER
function setSubject(sub){
  currentSubject = sub;
  document.getElementById("currentView").innerText =
    "📊 " + sub + " Chapters";
  render();
}

// ADD ITEM
function addItem(){

  let subject = document.getElementById("subject").value || "General";
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
    subject,
    title,
    revisions
  });

  save();
  render();
}

// TOGGLE
function toggle(i,j){
  data[i].revisions[j].done =
  !data[i].revisions[j].done;

  save();
  render();
}

// PROGRESS CALC
function getProgress(item){
  let done = item.revisions.filter(r=>r.done).length;
  return Math.round((done / item.revisions.length) * 100);
}

// EXPORT CSV
function exportCSV(){

  let csv = "Subject,Chapter,Revision,Date,Status\n";

  data.forEach(item=>{
    item.revisions.forEach(r=>{
      csv += `${item.subject},${item.title},,${r.date},${r.done?"Done":"Pending"}\n`;
    });
  });

  let blob = new Blob([csv], {type:"text/csv"});
  let url = URL.createObjectURL(blob);

  let a = document.createElement("a");
  a.href = url;
  a.download = "revision_data.csv";
  a.click();
}

// RENDER
function render(){

  let table = document.getElementById("table");
  table.innerHTML = "";

  let today = new Date().toISOString().split("T")[0];

  // HEADER
  let header = `
    <tr>
      <th>Chapter</th>
      <th>Rev 1</th>
      <th>Rev 2</th>
      <th>Rev 3</th>
      <th>Rev 4</th>
      <th>Rev 5</th>
      <th>Progress</th>
    </tr>
  `;

  table.innerHTML += header;

  data.forEach((item,i)=>{

    if(currentSubject !== "All" && item.subject !== currentSubject) return;

    let row = `<tr>`;

    row += `<td class="chapter">${item.title}<br><small>${item.subject}</small></td>`;

    item.revisions.forEach((r,j)=>{

      let cls = r.date === today ? "today" : "";

      row += `
        <td class="${cls}">
          <input type="checkbox"
          ${r.done ? "checked":""}
          onchange="toggle(${i},${j})">
          <br>${r.date}
        </td>
      `;
    });

    let progress = getProgress(item);

    row += `
      <td>
        ${progress}%
        <div class="progress">
          <div style="width:${progress}%"></div>
        </div>
      </td>
    `;

    row += `</tr>`;

    table.innerHTML += row;
  });
}

render();
