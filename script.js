let P = 5;
let R = 3;

let maxMatrix = [];
let allocMatrix = [];
let needMatrix = [];
let available = [];

const numProcessesInput = document.getElementById("numProcesses");
const numResourcesInput = document.getElementById("numResources");
const initBtn = document.getElementById("initSystem");
const matricesArea = document.getElementById("matricesArea");
const requestForm = document.getElementById("requestForm");
const requestInputsContainer = document.getElementById("requestInputs");
const reqProcessInput = document.getElementById("reqProcess");
const logEl = document.getElementById("log");

function log(message, type = "info") {
  const div = document.createElement("div");
  div.className = `log-entry ${type}`;
  const time = new Date().toLocaleTimeString();
  div.textContent = `[${time}] ${message}`;
  logEl.prepend(div);
}

function initData() {
  P = parseInt(numProcessesInput.value, 10) || 1;
  R = parseInt(numResourcesInput.value, 10) || 1;

  P = Math.min(Math.max(P, 1), 10);
  R = Math.min(Math.max(R, 1), 5);

  numProcessesInput.value = P;
  numResourcesInput.value = R;

  maxMatrix = Array.from({ length: P }, () => Array(R).fill(0));
  allocMatrix = Array.from({ length: P }, () => Array(R).fill(0));
  needMatrix = Array.from({ length: P }, () => Array(R).fill(0));
  available = Array(R).fill(0);

  if (P >= 5 && R >= 3) {
    const baseMax = [
      [7, 5, 3],
      [3, 2, 2],
      [9, 0, 2],
      [2, 2, 2],
      [4, 3, 3],
    ];
    const baseAlloc = [
      [0, 1, 0],
      [2, 0, 0],
      [3, 0, 2],
      [2, 1, 1],
      [0, 0, 2],
    ];

    for (let i = 0; i < P; i++) {
      for (let j = 0; j < R; j++) {
        if (i < 5 && j < 3) {
          maxMatrix[i][j] = baseMax[i][j];
          allocMatrix[i][j] = baseAlloc[i][j];
        } else {
          maxMatrix[i][j] = 3;
          allocMatrix[i][j] = 0;
        }
      }
    }

    for (let j = 0; j < R; j++) {
      available[j] = j < 3 ? [3, 3, 2][j] : 3;
    }
  } else {
    for (let i = 0; i < P; i++) {
      for (let j = 0; j < R; j++) {
        const maxVal = 3 + ((i + j) % 3);
        maxMatrix[i][j] = maxVal;
        const alloc = Math.floor(maxVal / 2);
        allocMatrix[i][j] = alloc > 0 ? alloc - 1 : 0;
      }
    }
    for (let j = 0; j < R; j++) {
      available[j] = 3;
    }
  }

  recomputeNeed();
  buildTables();
  buildRequestInputs();

  if (isSafeState(available, maxMatrix, allocMatrix)) {
    log("System initialized in a SAFE state.", "safe");
  } else {
    log("Warning: initial state is NOT safe. Adjust Max/Allocation.", "unsafe");
  }
}

function recomputeNeed() {
  needMatrix = maxMatrix.map((row, i) =>
    row.map((val, j) => val - allocMatrix[i][j])
  );
}

function buildRequestInputs() {
  requestInputsContainer.innerHTML = "";
  for (let j = 0; j < R; j++) {
    const input = document.createElement("input");
    input.type = "number";
    input.min = "0";
    input.value = "0";
    input.className = "small-input";
    input.dataset.index = j;
    requestInputsContainer.appendChild(input);
  }
}

function buildTable(title, matrix, includeProcessHeader = true) {
  const wrapper = document.createElement("div");
  wrapper.className = "matrix-wrapper";

  const heading = document.createElement("div");
  heading.className = "matrix-title";
  heading.textContent = title;
  wrapper.appendChild(heading);

  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");

  if (includeProcessHeader) {
    const thProcess = document.createElement("th");
    thProcess.textContent = "P";
    headerRow.appendChild(thProcess);
  }

  for (let j = 0; j < R; j++) {
    const th = document.createElement("th");
    th.textContent = `R${j}`;
    headerRow.appendChild(th);
  }

  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  for (let i = 0; i < P; i++) {
    const tr = document.createElement("tr");
    if (includeProcessHeader) {
      const tdP = document.createElement("td");
      tdP.textContent = `P${i}`;
      tdP.className = "process-cell";
      tr.appendChild(tdP);
    }
    for (let j = 0; j < R; j++) {
      const td = document.createElement("td");
      td.textContent = matrix[i][j];
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
  table.appendChild(tbody);

  wrapper.appendChild(table);
  return wrapper;
}

function buildAvailableTable() {
  const wrapper = document.createElement("div");
  wrapper.className = "matrix-wrapper";

  const heading = document.createElement("div");
  heading.className = "matrix-title";
  heading.textContent = "Available";
  wrapper.appendChild(heading);

  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");

  for (let j = 0; j < R; j++) {
    const th = document.createElement("th");
    th.textContent = `R${j}`;
    headerRow.appendChild(th);
  }
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  const tr = document.createElement("tr");
  tr.className = "available-row";
  for (let j = 0; j < R; j++) {
    const td = document.createElement("td");
    td.textContent = available[j];
    tr.appendChild(td);
  }
  tbody.appendChild(tr);
  table.appendChild(tbody);

  wrapper.appendChild(table);
  return wrapper;
}

function buildTables() {
  matricesArea.innerHTML = "";
  matricesArea.appendChild(buildTable("Max", maxMatrix));
  matricesArea.appendChild(buildTable("Allocation", allocMatrix));
  recomputeNeed();
  matricesArea.appendChild(buildTable("Need", needMatrix));
  matricesArea.appendChild(buildAvailableTable());
}

function isSafeState(avail, maxM, allocM) {
  const work = [...avail];
  const finish = new Array(P).fill(false);
  const needM = maxM.map((row, i) =>
    row.map((val, j) => val - allocM[i][j])
  );

  let count = 0;
  while (count < P) {
    let found = false;
    for (let i = 0; i < P; i++) {
      if (!finish[i]) {
        let canFinish = true;
        for (let j = 0; j < R; j++) {
          if (needM[i][j] > work[j]) {
            canFinish = false;
            break;
          }
        }
        if (canFinish) {
          for (let j = 0; j < R; j++) {
            work[j] += allocM[i][j];
          }
          finish[i] = true;
          count++;
          found = true;
        }
      }
    }
    if (!found) {
      return false;
    }
  }
  return true;
}

function handleRequest(event) {
  event.preventDefault();

  const p = parseInt(reqProcessInput.value, 10);
  if (isNaN(p) || p < 0 || p >= P) {
    log(`Invalid process index: ${reqProcessInput.value}`, "error");
    return;
  }

  const inputs = requestInputsContainer.querySelectorAll("input");
  const request = [];
  for (let i = 0; i < inputs.length; i++) {
    const val = parseInt(inputs[i].value, 10) || 0;
    if (val < 0) {
      log("Request values must be non-negative.", "error");
      return;
    }
    request.push(val);
  }

  const need = needMatrix[p];
  for (let j = 0; j < R; j++) {
    if (request[j] > need[j]) {
      log(
        `Denied: P${p} requested more than its maximum claim on R${j}.`,
        "error"
      );
      return;
    }
  }

  for (let j = 0; j < R; j++) {
    if (request[j] > available[j]) {
      log(
        `Wait: not enough available for P${p}. Needs ${request[j]} of R${j}, only ${available[j]} available.`,
        "unsafe"
      );
      return;
    }
  }

  const availCopy = available.slice();
  const allocCopy = allocMatrix.map((row) => row.slice());

  for (let j = 0; j < R; j++) {
    availCopy[j] -= request[j];
    allocCopy[p][j] += request[j];
  }

  if (isSafeState(availCopy, maxMatrix, allocCopy)) {
    available = availCopy;
    allocMatrix = allocCopy;
    recomputeNeed();
    buildTables();
    log(
      `Request by P${p} granted. System remains in a SAFE state. Request = [${request.join(
        ", "
      )}]`,
      "safe"
    );
  } else {
    log(
      `Denied: granting request by P${p} would make the system UNSAFE. Request = [${request.join(
        ", "
      )}]`,
      "unsafe"
    );
  }
}

initBtn.addEventListener("click", initData);
requestForm.addEventListener("submit", handleRequest);
initData();
