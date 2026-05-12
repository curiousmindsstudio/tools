let data = JSON.parse(localStorage.getItem("rev_data")) || [];

let currentSubject = "All";

// revision pattern
const gaps = [0, 1, 3, 7, 15, 30];

// SAVE
function save(){
  localStorage.setItem("rev_data", JSON.stringify(data));
}

// SUBJECT FILTER
function setSubject(sub){
  currentSubject = sub;
  document.getElementById("currentView").innerText =
    "📊 " + sub + " Chapters";

  render();
}

// ADD ITEM
function addItem(){

  let subject =
    document.getElementById("subject").value.trim();

  let title =
    document.getElementById("title").value.trim();

  let date =
    document.getElementById("date").value;

  if(!subject || !title || !date){
    alert("Please fill all fields");
    return;
  }

  let start = new Date(date);

  // AUTO GENERATE REVISIONS
  let revisions = gaps.map((gap,index)=>{

    let d = new Date(start);

    d.setDate(start.getDate() + gap);

    return{
      revision: "Revision " + (index+1),
      date: d.toISOString().split("T")[0],
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
  document.getElementById("title").value = "";
  document.getElementById("date").value = "";
}

// TOGGLE CHECKBOX
function toggle(i,j){

  data[i].revisions[j].done =
    !data[i].revisions[j].done;

  save();

  render();
}

// PROGRESS %
function getProgress(item){

  let done =
    item.revisions.filter(r=>r.done).length;

  return Math.round(
    (done / item.revisions.length) * 100
  );
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
    new Blob([csv], {type:"text/csv"});

  let url =
    URL.createObjectURL(blob);

  let a =
    document.createElement("a");

  a.href = url;

  a.download = "revision_data.csv";

  a.click();
}

// RENDER TABLE
function render(){

  let table =
    document.getElementById("table");

  table.innerHTML = "";

  let today =
    new Date().toISOString().split("T")[0];

  // TABLE HEADER
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

  // USER DATA ROWS
  data.forEach((item,i)=>{

    if(
      currentSubject !== "All" &&
      item.subject !== currentSubject
    ){
      return;
    }

    let row = `<tr>`;

    // CHAPTER NAME
    row += `
      <td class="chapter">
        <b>${item.title}</b>
        <br>
        <small>${item.subject}</small>
      </td>
    `;

    // REVISIONS
    item.revisions.forEach((r,j)=>{

      let highlight =
        r.date === today ? "today" : "";

      row += `
        <td class="${highlight}">

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

    // PROGRESS BAR
    let progress =
      getProgress(item);

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
