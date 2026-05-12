let data =
  JSON.parse(localStorage.getItem("rev_data")) || [];

let currentSubject = "All";

// revision schedule
const gaps = [0, 2, 6, 14, 29, 59];

// SAVE
function save(){
  localStorage.setItem(
    "rev_data",
    JSON.stringify(data)
  );
}

// ADD ITEM
function addItem(){

  let subject =
    document.getElementById("subject")
    .value.trim();

  let title =
    document.getElementById("title")
    .value.trim();

  let date =
    document.getElementById("date")
    .value;

  if(!subject || !title || !date){
    alert("Fill all fields");
    return;
  }

  let start = new Date(date);

  // CREATE REVISIONS
  let revisions = gaps.map((gap,index)=>{

    let d = new Date(start);

    d.setDate(start.getDate() + gap);

    return{
      revision:"Revision "+(index+1),
      date:d.toISOString().split("T")[0],
      done:false
    };

  });

  data.push({
    subject,
    title,
    revisions
  });

  save();

  render();

  // CLEAR INPUTS
  document.getElementById("title").value="";
  document.getElementById("date").value="";
}

// TOGGLE CHECKBOX
function toggle(i,j){

  data[i].revisions[j].done =
    !data[i].revisions[j].done;

  save();

  render();
}

// PROGRESS
function getProgress(item){

  let done =
    item.revisions.filter(r=>r.done).length;

  return Math.round(
    (done/item.revisions.length)*100
  );
}

// SUBJECT FILTER
function setSubject(subject){

  currentSubject = subject;

  document.getElementById(
    "currentView"
  ).innerText =
    "📊 "+subject;

  render();
}

// EXPORT CSV
function exportCSV(){

  let csv =
"Subject,Chapter,Revision,Date,Status\n";

  data.forEach(item=>{

    item.revisions.forEach(r=>{

      csv +=
`${item.subject},
${item.title},
${r.revision},
${r.date},
${r.done ? "Done":"Pending"}\n`;

    });

  });

  let blob =
    new Blob([csv],{type:"text/csv"});

  let url =
    URL.createObjectURL(blob);

  let a =
    document.createElement("a");

  a.href = url;

  a.download = "revision_data.csv";

  a.click();
}

// CREATE SUBJECT BUTTONS
function renderTabs(){

  let tabs =
    document.getElementById("subjectTabs");

  tabs.innerHTML = "";

  // ALL BUTTON
  tabs.innerHTML += `
    <button onclick="setSubject('All')">
      All
    </button>
  `;

  // UNIQUE SUBJECTS
  let subjects =
    [...new Set(data.map(item=>item.subject))];

  subjects.forEach(subject=>{

    tabs.innerHTML += `
      <button
        onclick="setSubject('${subject}')"
      >
        ${subject}
      </button>
    `;

  });

}

// RENDER TABLE
function render(){

  renderTabs();

  let table =
    document.getElementById("table");

  table.innerHTML = "";

  let today =
    new Date().toISOString().split("T")[0];

  // HEADER
  table.innerHTML = `
    <tr>
      <th>Chapter Name</th>
      <th>Revision 1</th>
      <th>Revision 2</th>
      <th>Revision 3</th>
      <th>Revision 4</th>
      <th>Revision 5</th>
      <th>Revision 6</th>
      <th>Progress</th>
    </tr>
  `;

  // ROWS
  data.forEach((item,i)=>{

    if(
      currentSubject !== "All" &&
      item.subject !== currentSubject
    ){
      return;
    }

    let row = `<tr>`;

    // CHAPTER
    row += `
      <td class="chapter">
        <b>${item.title}</b>
        <br>
        <small>${item.subject}</small>
      </td>
    `;

    // REVISIONS
    item.revisions.forEach((r,j)=>{

      let cls =
        r.date === today ? "today":"";

      row += `
        <td class="${cls}">

          <div>
            <b>${r.revision}</b>
          </div>

          <label>

            <input
              type="checkbox"
              ${r.done ? "checked":""}
              onchange="toggle(${i},${j})"
            >

            ${r.date}

          </label>

        </td>
      `;
    });

    // PROGRESS
    let progress =
      getProgress(item);

    row += `
      <td>

        ${progress}%

        <div class="progress">
          <div
            style="width:${progress}%">
          </div>
        </div>

      </td>
    `;

    row += `</tr>`;

    table.innerHTML += row;

  });

}

render();
