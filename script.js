const clientNameInput = document.getElementById("clientName");
const projectNameInput = document.getElementById("projectName");
const clientDeadlineInput = document.getElementById("clientDeadline");
const internalDeadlineInput = document.getElementById("internalDeadline");
const statusSelect = document.getElementById("status");
const addBtn = document.getElementById("addBtn");
const projectList = document.getElementById("projectList");

const deleteModal = document.getElementById("deleteModal");
const confirmDeleteBtn = document.getElementById("confirmDelete");
const cancelDeleteBtn = document.getElementById("cancelDelete");

let deleteIndex = null;

let projects = JSON.parse(localStorage.getItem("projects")) || [];

function renderProjects() {
  projectList.innerHTML = "";
  const today = new Date();

  projects.forEach((project, index) => {

    const deadlineDate = new Date(project.clientDeadline);
    let cardClass = "";

    if(project.status !== "Completed"){
      if(deadlineDate < today) cardClass="overdue";
      else if((deadlineDate-today)/(1000*60*60*24)<=3) cardClass="upcoming";
    }

    const card = document.createElement("div");
    card.className = `project-card ${cardClass}`;

    if(project.editing){

      card.innerHTML = `
        <div class="project-info">
          <input class="edit-client" value="${project.client}">
          <input class="edit-project" value="${project.project}">
          <label>Client Deadline</label>
          <input type="date" class="edit-client-deadline" value="${project.clientDeadline}">
          <label>Internal Deadline</label>
          <input type="date" class="edit-internal-deadline" value="${project.internalDeadline}">
          <select class="edit-status">
            <option ${project.status==="Pending"?"selected":""}>Pending</option>
            <option ${project.status==="In Progress"?"selected":""}>In Progress</option>
            <option ${project.status==="Completed"?"selected":""}>Completed</option>
          </select>
        </div>
        <div class="project-actions">
          <button class="save" onclick="saveEdit(${index})">Save</button>
          <button class="cancel" onclick="cancelEdit(${index})">Cancel</button>
        </div>
      `;

    } else {

      card.innerHTML = `
        <div class="project-info">
          <span><strong>Client:</strong> ${project.client}</span>
          <span><strong>Project:</strong> ${project.project}</span>
          <span><strong>Client Deadline:</strong> ${project.clientDeadline}</span>
          <span><strong>Internal Deadline:</strong> ${project.internalDeadline}</span>
          <span><strong>Status:</strong> ${project.status}</span>
        </div>
        <div class="project-actions">
          <button class="edit" onclick="editProject(${index})">Edit</button>
          <button class="delete" onclick="openDeleteModal(${index})">Delete</button>
        </div>
      `;
    }

    projectList.appendChild(card);
  });
}

function saveProjects(){
  localStorage.setItem("projects", JSON.stringify(projects));
}

addBtn.addEventListener("click", ()=>{
  const client = clientNameInput.value.trim();
  const project = projectNameInput.value.trim();
  const clientDeadline = clientDeadlineInput.value;
  const internalDeadline = internalDeadlineInput.value;
  const status = statusSelect.value;

  if(!client || !project || !clientDeadline || !internalDeadline){
    alert("Please fill all fields");
    return;
  }

  projects.push({
    client, project,
    clientDeadline,
    internalDeadline,
    status,
    editing:false
  });

  saveProjects();
  renderProjects();

  clientNameInput.value="";
  projectNameInput.value="";
  clientDeadlineInput.value="";
  internalDeadlineInput.value="";
});

function editProject(index){
  projects[index].editing=true;
  renderProjects();
}

function cancelEdit(index){
  projects[index].editing=false;
  renderProjects();
}

function saveEdit(index){
  const card = projectList.children[index];

  projects[index]={
    client:card.querySelector(".edit-client").value,
    project:card.querySelector(".edit-project").value,
    clientDeadline:card.querySelector(".edit-client-deadline").value,
    internalDeadline:card.querySelector(".edit-internal-deadline").value,
    status:card.querySelector(".edit-status").value,
    editing:false
  };

  saveProjects();
  renderProjects();
}

/* Custom delete modal */

function openDeleteModal(index){
  deleteIndex=index;
  deleteModal.style.display="flex";
}

confirmDeleteBtn.onclick=()=>{
  if(deleteIndex!==null){
    projects.splice(deleteIndex,1);
    saveProjects();
    renderProjects();
  }
  deleteModal.style.display="none";
};

cancelDeleteBtn.onclick=()=>{
  deleteModal.style.display="none";
};

renderProjects();

