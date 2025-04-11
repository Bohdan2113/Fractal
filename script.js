class Fractal {
  constructor(
    id,
    type,
    iterations,
    unitCount = baseUnitCount,
    name = null,
    x = 0,
    y = 0,
    length = baseUnitCount,
    color = "#000000",
    angle = 0,
    lineW = 1,
    realC = 0,
    imagC = 0
  ) {
    this.id = id;
    this.type = type;
    this.iterations = iterations;
    this.systemUnitCount = unitCount;
    this.name = name;
    this.x = x;
    this.y = y;
    this.length = length;
    this.color = color;
    this.angle = angle;
    this.lineW = lineW;
    this.realC = realC;
    this.imagC = imagC;
  }

  static copy(other) {
    if (!(other instanceof Fractal)) {
      throw new Error("Expected Fractal instance");
    }
    return new Fractal(
      other.id,
      other.type,
      other.iterations,
      other.systemUnitCount,
      other.name,
      other.x,
      other.y,
      other.length,
      other.color,
      other.angle,
      other.lineW,
      other.realC,
      other.imagC
    );
  }
  init(other) {
    if (!(other instanceof Fractal)) {
      throw new Error("Expected Fractal instance");
    }
    this.id = other.id;
    this.type = other.type;
    this.iterations = other.iterations;
    this.systemUnitCount = other.systemUnitCount;
    this.name = other.name;
    this.x = other.x;
    this.y = other.y;
    this.length = other.length;
    this.color = other.color;
    this.angle = other.angle;
    this.lineW = other.lineW;
    this.realC = other.realC;
    this.imagC = other.imagC;
  }
}
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
class Section {
  constructor(pStart, length, angle) {
    this.pStart = pStart;
    this.length = length;
    this.angle = angle;
  }
}
const FractalType = {
  MINKOVSKOGO: "Minkovskogo",
  ALGEBRAICAL: "Algebraical",
};

const $ = document.querySelector.bind(document);
let fractalList = [];
let currentFractal = null;
let workFractal = null;
let baseUnitCount = 30;
const minUnitCount = 1;
const maxUnitCount = 300;

window.onload = function () {
  fractalList = LoadFractals();
  ShowAllRecents();

  const canvas = $("#myCanvas");
  canvas.height = window.innerHeight - 80;
  canvas.width = window.innerWidth - 400;

  canvas.addEventListener(
    "wheel",
    (event) => {
      if (!event.ctrlKey) return;
      event.preventDefault(); // щоб не прокручувалася сторінка

      const delta = Math.sign(event.deltaY); // 1 — вниз, -1 — вгору
      let step = workFractal.systemUnitCount / 30;
      if (delta > 0)
        workFractal.systemUnitCount = Math.max(
          minUnitCount,
          workFractal.systemUnitCount - step
        );
      else
        workFractal.systemUnitCount = Math.min(
          maxUnitCount,
          workFractal.systemUnitCount + step
        );

      Redraw($("#myCanvas"), workFractal);
    },
    { passive: false }
  );
  $("#lineWidth").addEventListener("input", function () {
    $("#lineWidthValue").innerText = this.value;
  });
  $("#angle").addEventListener("input", function () {
    $("#angleValue").innerText = this.value;
  });

  // Отримуємо всі поля вводу
  const paramFields = Array.from(
    $("#params-form").querySelectorAll("input")
  ).map((field) => ({
    field: field,
    errorId: `#error-message-${field.getAttribute("id")}`,
  }));
  // Обробка введення (коректність і відображення змін)
  paramFields.forEach(({ field, errorId }) => {
    field.addEventListener("input", (event) =>
      hideErrorMessage(event, errorId)
    );
    field.addEventListener("input", (event) => {
      checkInterval(event, errorId);
      ChangeFractal();
    });
  });
  $("#fractal-name").addEventListener("input", (event) => {
    // const fractalName = $("#fractal-name").value;
    workFractal.name = event.target.value;
  });
};

function CreateProjectBut(fractalType) {
  const lastfractalId = fractalList?.length ? fractalList.at(-1).id : -1;

  let iterations = 0;
  if (fractalType === "Minkovskogo") iterations = 4;
  else if (fractalType === "Algebraical") iterations = 100;

  const newFractal = new Fractal(lastfractalId + 1, fractalType, iterations);
  fractalList.push(newFractal);
  CreateProjectInstance(newFractal);
  ToLocalStorage(newFractal);

  OpenProject(`fractal_${newFractal.id}`);
}
function OpenRecentBut(id_str) {
  OpenProject(id_str);
}
function DeleteSavedBut(id_str) {
  event.stopPropagation();
  const project = document.getElementById(id_str);
  const projectId = parseInt(id_str.match(/\d+/)[0], 10);

  const fractalToDelete = fractalList.find((f) => f.id === projectId);
  fractalList = fractalList.filter((f) => f.id !== projectId);
  DeleteFromStorage(fractalToDelete);

  if (project) {
    project.remove();
  }
}
function ToHomeBut() {
  if (workFractal && currentFractal) {
    const isDifferent =
      JSON.stringify(workFractal) !== JSON.stringify(currentFractal);
    if (isDifferent) {
      const saveChanges = confirm(
        "Do you want to save changes before leaving?"
      );
      if (saveChanges) {
        SaveFractalBut();
      }
    }
  }
  ToogleBlocks($("#home"), $("#work"));
  ClearWork();
  currentFractal = null;
  workFractal = null;
}
function SaveAsBut() {
  SaveFractalBut();

  const canvas = $("#myCanvas");
  const link = document.createElement("a");
  link.download = `${currentFractal.name}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click(); // відкриває стандартне вікно збереження
}
function ClearChangesBut() {
  workFractal.init(currentFractal);
  FillFormValues(workFractal);

  Redraw($("#myCanvas"), workFractal);
}
function SaveFractalBut() {
  const index = fractalList.findIndex((f) => f === currentFractal);
  if (index !== -1) fractalList[index] = workFractal;

  currentFractal = workFractal;
  UpdatePreviewCanvas(currentFractal);
  UpdateInLocalStorage(currentFractal);
}
function ChangeFractal() {
  if (!ValidateForm("#params-form")) return;
  ReadFormValues(workFractal);

  Redraw($("#myCanvas"), workFractal);
}

function ToogleBlocks(block1, block2) {
  block1.style.display = "flex";
  block2.style.display = "none";
}
function CreateProjectInstance(fractal) {
  const parent = $("#frecent-collection");
  const newProject = document.createElement("div");
  const projectId = `fractal_${fractal.id}`;

  newProject.id = projectId;
  newProject.className = "recent-block";
  newProject.setAttribute("onclick", `OpenRecentBut('${projectId}')`);
  newProject.innerHTML = `
    <div class="fsaved-header">
      <h3 class="text-edit">${fractal.name}</h3>
      <button class="fdelete-saved" onclick="DeleteSavedBut('${projectId}')">
        <img src="/Images/bin.png" alt="Delete" />
      </button>
    </div>
    <canvas class="fsaved-preview" width="220" height="140"></canvas>
  `;

  parent.appendChild(newProject);
  UpdatePreviewCanvas(fractal);
}
function FillFormValues(fractal) {
  ClearForm("#params-form");

  $("#fractal-type").value = fractal.type;
  $("#fractal-name").value = fractal.name ? fractal.name : "noname";

  $("#startX").value = fractal.x;
  $("#startY").value = fractal.y;
  $("#length").value = fractal.length;
  $("#iterations").value = fractal.iterations;
  $("#color").value = fractal.color;
  $("#angle").value = fractal.angle;
  $("#angleValue").innerText = fractal.angle;
  $("#lineWidth").value = fractal.lineW;
  $("#lineWidthValue").innerText = fractal.lineW;
  $("#lineWidth").value = fractal.realC;
  $("#lineWidth").value = fractal.imagC;
}
function ReadFormValues(fractal) {
  const fractalName = $("#fractal-name").value;
  fractal.name = fractalName;

  fractal.x = parseFloat($("#startX").value);
  fractal.y = parseFloat($("#startY").value);
  fractal.length = parseFloat($("#length").value);
  fractal.iterations = parseInt($("#iterations").value);
  fractal.color = $("#color").value;
  fractal.angle = parseInt($("#angle").value);
  fractal.lineW = parseInt($("#lineWidth").value);
  fractal.realC = parseFloat($("#realC").value);
  fractal.imagC = parseFloat($("#imagC").value);
}
function OpenProject(projectId_str) {
  const savedId = parseInt(projectId_str.match(/\d+/)[0], 10);
  currentFractal = fractalList.find((f) => f.id === savedId);
  workFractal = Fractal.copy(currentFractal);
  FillFormValues(workFractal);
  DisplayFormFields(workFractal.type);

  Redraw($("#myCanvas"), workFractal);
  ToogleBlocks($("#work"), $("#home"));
}
function DisplayFormFields(type) {
  const form = $("#params-form");
  const groups = form.querySelectorAll(".form-group");

  groups.forEach((f) => {
    if (f.classList.contains(type)) f.style.display = "flex";
    else f.style.display = "none";
  });

  SetBoundaries(form, type);
}
function SetBoundaries(form, type) {
  const iterationsField = form["iterations"];
  const lengthField = form["length"];
  const startXField = form["startX"];
  const startYField = form["startY"];

  if (type === "Algebraical") {
    iterationsField.min = 1;
    iterationsField.max = 300;

    lengthField.min = -maxUnitCount;
    lengthField.max = maxUnitCount;
  } else if (type === "Minkovskogo") {
    iterationsField.min = 0;
    iterationsField.max = 5;
  }

  startXField.min = -maxUnitCount;
  startXField.max = maxUnitCount;

  startYField.min = -maxUnitCount / 2 - 23;
  startYField.max = maxUnitCount / 2 + 23;
}

function ClearWork() {
  ClearCanvas($("#myCanvas"));
  ClearForm("#params-form");
}
function ClearCanvas(canvas) {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
function ClearForm(formId_str) {
  const form = $(formId_str);
  form.reset();
  if (form) {
    const paragraphs = form.querySelectorAll("p");
    paragraphs.forEach((p) => {
      p.style.display = "none";
    });

    const inputs = form.querySelectorAll("input");
    inputs.forEach((input) => {
      input.style.borderColor = "#6f6f6f";
    });
  }
}

function ValidateForm(formId_str) {
  const form = $(formId_str);
  if (!form) {
    console.error(`Form with id "${formId_str}" not found.`);
    return false;
  }

  const paramFields = Array.from(form.querySelectorAll("input"));
  let emptyFields = FilterEmptyFields(paramFields);

  if (emptyFields.length !== 0) {
    console.log(emptyFields);
    emptyFields.forEach((f) => {
      f.style.borderColor = "red";
      const message = `Define "${f.getAttribute("name")}" field`;
      showErrorMessage(message, `#error-message-${f.getAttribute("id")}`);
    });

    return false;
  }

  for (let i = 0; i < paramFields.length; i++) {
    const value = parseFloat(paramFields[i].value);
    const min = parseFloat(paramFields[i].min);
    const max = parseFloat(paramFields[i].max);

    if (value > max || value < min) {
      paramFields[i].style.borderColor = "red";
      const message = `${f.getAttribute(
        "name"
      )}=${value} is out of range [${min}, ${max}]`;
      showErrorMessage(
        message,
        `#error-message-${paramFields[i].getAttribute("id")}`
      );
      return false;
    }
  }

  return true;

  function FilterEmptyFields(fields) {
    let emptyFields = [];
    for (let i = 0; i < fields.length; i++)
      if (!fields[i].value.trim()) emptyFields.push(fields[i]);

    return emptyFields;
  }
}
function checkInterval(event, errorId) {
  const value = parseFloat(event.target.value);
  const min = parseFloat(event.target.min);
  const max = parseFloat(event.target.max);

  if (value === "") return;
  if (value < min || value > max) {
    const fieldId_str = errorId.split("-").pop();
    console.log(fieldId_str);
    const f = document.getElementById(fieldId_str);
    showErrorMessage(
      `${f.getAttribute("name")}=${value} is out of range [${min}, ${max}]`,
      errorId
    );
    event.target.style.borderColor = "red";
  }
}
function hideErrorMessage(event, errorId) {
  let errorElement = $(errorId);

  errorElement.style.display = "none";
  event.target.style.borderColor = "#6f6f6f";
}
function showErrorMessage(message, where) {
  let errorElement = $(where);
  errorElement.textContent = message;

  errorElement.style.display = "block"; // Показати повідомлення
}

function Redraw(canvas, fractal, scale = 1) {
  ClearCanvas(canvas);
  DrawCoords(canvas, fractal.systemUnitCount);

  if (fractal.type === "Minkovskogo")
    DrawFractalMinkovskogo(canvas, fractal, scale);
  if (fractal.type === "Algebraical")
    DrawFractalAlgebraical(canvas, fractal, scale);
}
function GetCoordSystemProportions(canvas, unitCount) {
  const leftSizingLuft = canvas.width / 30;
  const bottomSizingLuft = canvas.height / 26;
  const shtrichSize = canvas.width / 120;
  const betweenShrichCount = 3;
  const numberShift = canvas.width / 180;

  const centerX = (canvas.width + leftSizingLuft) / 2;
  const centerY = (canvas.height - bottomSizingLuft) / 2;
  const xLength = canvas.width - leftSizingLuft;
  const yLength = canvas.height - bottomSizingLuft;
  const unitLength = Math.max(xLength, yLength) / (unitCount * 2);

  return {
    leftSizingLuft,
    bottomSizingLuft,
    shtrichSize,
    betweenShrichCount,
    numberShift,

    centerX,
    centerY,
    xLength,
    yLength,
    unitLength,

    top: 0,
    right: canvas.width,
    bottom: canvas.height - bottomSizingLuft,
    left: leftSizingLuft,
  };
}
function DrawCoords(canvas, unitCount) {
  const ctx = canvas.getContext("2d");
  const fontSize = canvas.width / 110;
  let precision = 0;

  const box = GetCoordSystemProportions(canvas, unitCount);
  const leftSizingLuft = box.leftSizingLuft;
  const bottomSizingLuft = box.bottomSizingLuft;
  const shtrichSize = box.shtrichSize;
  const betweenShrichCount = box.betweenShrichCount;
  const numberShift = box.numberShift;

  const centerX = box.centerX;
  const centerY = box.centerY;
  const xLength = box.xLength;
  const yLength = box.yLength;
  const unitLength = box.unitLength;
  const segmentLength = GetSegmentLength(unitCount * 2, unitLength);

  ctx.beginPath(); // Fill with color
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.closePath();

  // coordinate system
  ctx.beginPath();
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#000000";
  ctx.moveTo(leftSizingLuft, 0); // Verrtical line
  ctx.lineTo(leftSizingLuft, canvas.height - bottomSizingLuft);
  ctx.moveTo(leftSizingLuft, canvas.height - bottomSizingLuft); // Horizontal line
  ctx.lineTo(canvas.width, canvas.height - bottomSizingLuft);
  ctx.stroke();
  ctx.closePath();

  ctx.beginPath(); // coord segments
  ctx.font = `${fontSize}px Arial`;
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#000000";
  DrawUnitsY(true);
  DrawUnitsX(true);
  ctx.stroke();
  ctx.closePath();

  function GetSegmentLength(uCount, uLength) {
    const factors = [2, 2.5, 2];
    let index = 0;
    let baseLover = 10;
    let baseUpper = 20;
    let interval = 1;

    if (uCount < baseLover) {
      do {
        baseLover /= factors[index];
        interval /= factors[index++];
        if (index >= factors.length) index = 0;
        if (index === 1) precision++;
      } while (uCount < baseLover);

      return interval * uLength;
    } else if (uCount >= baseUpper) {
      do {
        interval *= factors[index++];
        if (index >= factors.length) index = 0;
        baseUpper *= factors[index];
      } while (uCount >= baseUpper);

      return interval * uLength;
    } else return interval * uLength;
  }
  function DrawUnitsY(isNumerate) {
    const shtrichCount = Math.floor(yLength / segmentLength);
    const startX = leftSizingLuft - shtrichSize;
    const endX = leftSizingLuft;
    let isOutOfCanvas = false;

    for (var i = shtrichCount * -1; i <= shtrichCount; i++) {
      let Y = centerY - i * segmentLength;
      if (Y > canvas.height - bottomSizingLuft) continue;
      if (isOutOfCanvas && Y < 0) break;

      ctx.moveTo(startX, Y);
      ctx.lineTo(endX, Y);

      for (let j = 1; j <= betweenShrichCount; j++) {
        const y = Y + (j * segmentLength) / (betweenShrichCount + 1);
        if (y > canvas.height - bottomSizingLuft) continue;

        ctx.moveTo(startX + shtrichSize / 3, y);
        ctx.lineTo(endX, y);
      }
      if (i === shtrichCount)
        for (let j = 1; j <= betweenShrichCount; j++) {
          const y = Y - (j * segmentLength) / (betweenShrichCount + 1);
          if (y < 0) {
            isOutOfCanvas = true;
            break;
          }

          ctx.moveTo(startX + shtrichSize / 3, y);
          ctx.lineTo(endX, y);
        }

      if (isNumerate) {
        const textX = endX - (numberShift + shtrichSize);
        const textY = Y;
        ctx.fillStyle = "#000000";
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";

        const num =
          Math.round(
            i * (segmentLength / unitLength) * Math.pow(10, precision)
          ) / Math.pow(10, precision);
        ctx.fillText(num, textX, textY);
      }
    }
  }
  function DrawUnitsX(isNumerate) {
    const shtrichCount = Math.floor(xLength / segmentLength);
    const startY = canvas.height - bottomSizingLuft + shtrichSize;
    const endY = canvas.height - bottomSizingLuft;
    let isOutOfCanvas = false;

    for (var i = shtrichCount * -1; i <= shtrichCount; i++) {
      let X = centerX + i * segmentLength;
      if (X < leftSizingLuft) continue;
      if (isOutOfCanvas && X > canvas.width) break;

      ctx.moveTo(X, startY);
      ctx.lineTo(X, endY);

      for (let j = 1; j <= betweenShrichCount; j++) {
        const x = X - (j * segmentLength) / (betweenShrichCount + 1);
        if (x < leftSizingLuft) continue;

        ctx.moveTo(x, startY - shtrichSize / 3);
        ctx.lineTo(x, endY);
      }
      if (i === shtrichCount)
        for (let j = 1; j <= betweenShrichCount; j++) {
          const x = X + (j * segmentLength) / (betweenShrichCount + 1);
          if (x > canvas.width) {
            isOutOfCanvas = true;
            break;
          }

          ctx.moveTo(x, startY - shtrichSize / 3);
          ctx.lineTo(x, endY);
        }

      if (isNumerate) {
        const textX = X;
        const textY = startY + numberShift;
        ctx.fillStyle = "#000000";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";

        const num =
          Math.round(
            i * (segmentLength / unitLength) * Math.pow(10, precision)
          ) / Math.pow(10, precision);
        ctx.fillText(num, textX, textY);
      }
    }
  }
}
function DrawLine(canvas, uCount, pStart, pEnd, width = 1, color = "#000000") {
  const ctx = canvas.getContext("2d");

  const pStartCanvas = ToCanvas(canvas, pStart, uCount);
  const pEndCanvas = ToCanvas(canvas, pEnd, uCount);
  const box = GetCoordSystemProportions(canvas, uCount);

  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  drawClippedLine(ctx, box, pStartCanvas, pEndCanvas);

  function isPointInBox(p, box) {
    return (
      p.x >= box.left && p.x <= box.right && p.y >= box.top && p.y <= box.bottom
    );
  }
  function drawClippedLine(ctx, box, pStartCanvas, pEndCanvas) {
    const insideStart = isPointInBox(pStartCanvas, box);
    const insideEnd = isPointInBox(pEndCanvas, box);

    // обидві точки за межами — нічого не малюємо
    if (!insideStart && !insideEnd) return;

    // Якщо одна з точок за межами — обрізаємо лінію
    let clippedStart = pStartCanvas;
    let clippedEnd = pEndCanvas;
    if (!insideStart || !insideEnd) {
      [clippedStart, clippedEnd] = clipLineToBox(pStartCanvas, pEndCanvas, box);
      if (!clippedStart || !clippedEnd) return;
    }

    // Малюємо лінію
    ctx.beginPath();
    ctx.moveTo(pStartCanvas.x, pStartCanvas.y);
    ctx.lineTo(pEndCanvas.x, pEndCanvas.y);
    ctx.stroke();
  }
  function clipLineToBox(p1, p2, box) {
    let x1 = p1.x,
      y1 = p1.y;
    let x2 = p2.x,
      y2 = p2.y;

    const INSIDE = 0,
      LEFT = 1,
      RIGHT = 2,
      BOTTOM = 4,
      TOP = 8;

    function computeOutCode(x, y) {
      let code = INSIDE;
      if (x < box.left) code |= LEFT;
      else if (x > box.right) code |= RIGHT;
      if (y < box.top) code |= TOP;
      else if (y > box.bottom) code |= BOTTOM;
      return code;
    }

    let outcode1 = computeOutCode(x1, y1);
    let outcode2 = computeOutCode(x2, y2);
    let accept = false;

    while (true) {
      if (!(outcode1 | outcode2)) {
        // Обидві точки всередині
        accept = true;
        break;
      } else if (outcode1 & outcode2) {
        // Обидві точки по одну сторону — повністю поза
        break;
      } else {
        // Є часткове перетинання — обрізаємо
        let outcodeOut = outcode1 ? outcode1 : outcode2;
        let x, y;

        if (outcodeOut & TOP) {
          x = x1 + ((x2 - x1) * (box.top - y1)) / (y2 - y1);
          y = box.top;
        } else if (outcodeOut & BOTTOM) {
          x = x1 + ((x2 - x1) * (box.bottom - y1)) / (y2 - y1);
          y = box.bottom;
        } else if (outcodeOut & RIGHT) {
          y = y1 + ((y2 - y1) * (box.right - x1)) / (x2 - x1);
          x = box.right;
        } else if (outcodeOut & LEFT) {
          y = y1 + ((y2 - y1) * (box.left - x1)) / (x2 - x1);
          x = box.left;
        }

        if (outcodeOut === outcode1) {
          x1 = x;
          y1 = y;
          outcode1 = computeOutCode(x1, y1);
        } else {
          x2 = x;
          y2 = y;
          outcode2 = computeOutCode(x2, y2);
        }
      }
    }

    if (accept) {
      return [
        { x: x1, y: y1 },
        { x: x2, y: y2 },
      ];
    } else {
      return [null, null];
    }
  }
}
function ToCanvas(canvas, point, uCount) {
  const box = GetCoordSystemProportions(canvas, uCount);

  return new Point(
    box.centerX + point.x * box.unitLength,
    box.centerY - point.y * box.unitLength
  );
}

function UpdateInLocalStorage(fractal) {
  const myJSON = JSON.stringify(fractal);
  // Save into storage
  let fractals = JSON.parse(localStorage.getItem("fractals")) || [];
  let index = fractals.findIndex((f) => f.id === fractal.id);
  if (index !== -1) {
    fractals[index] = fractal; // Оновлюємо знайденого студента
    localStorage.setItem("fractals", JSON.stringify(fractals));
  } else {
    console.warn("fractal not found!");
  }
  localStorage.setItem("fractals", JSON.stringify(fractals));
}
function ToLocalStorage(newF) {
  const myJSON = JSON.stringify(newF);
  // Save into storage
  let fractals = JSON.parse(localStorage.getItem("fractals")) || [];
  fractals.push(newF);
  localStorage.setItem("fractals", JSON.stringify(fractals));
}
function DeleteFromStorage(fractalToDel) {
  let fractals = JSON.parse(localStorage.getItem("fractals")) || [];
  fractals = fractals.filter((f) => f.id !== fractalToDel.id);
  localStorage.setItem("fractals", JSON.stringify(fractals));
}
function LoadFractals() {
  return (JSON.parse(localStorage.getItem("fractals")) || []).map(
    (fractal) =>
      new Fractal(
        fractal.id,
        fractal.type,
        fractal.iterations,
        fractal.systemUnitCount,
        fractal.name,
        fractal.x,
        fractal.y,
        fractal.length,
        fractal.color,
        fractal.angle,
        fractal.lineW,
        fractal.realC,
        fractal.imagC
      )
  );
}
function ShowAllRecents() {
  fractalList.forEach((f) => CreateProjectInstance(f));
}
function UpdatePreviewCanvas(fractal) {
  const canvas = $(`#fractal_${fractal.id} canvas`);
  $(`#fractal_${fractal.id} h3`).textContent = fractal.name;

  Redraw(canvas, fractal, 1);
}

function DrawFractalMinkovskogo(canvas, fractal, scale) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const cos = (deg) => Math.cos(toRad(deg));
  const sin = (deg) => Math.sin(toRad(deg));

  const squareSides = [];
  for (let i = 0; i < 4; i++)
    squareSides.push(
      new Section(
        new Point(
          (Math.sqrt(2) / 2) *
            fractal.length *
            cos((fractal.angle + 90 * i + 135) % 360) +
            fractal.x,
          (Math.sqrt(2) / 2) *
            fractal.length *
            sin((fractal.angle + 90 * i + 135) % 360) +
            fractal.y
        ),
        fractal.length,
        (fractal.angle + 90 * i) % 360
      )
    );

  for (let side of squareSides)
    recursive(side, fractal.color, fractal.lineW, fractal.iterations);

  function recursive(section, color, width, depth) {
    if (depth === 0) {
      const pEnd = new Point(
        section.pStart.x + section.length * cos(section.angle),
        section.pStart.y + section.length * sin(section.angle)
      );

      DrawLine(
        canvas,
        fractal.systemUnitCount,
        section.pStart,
        pEnd,
        fractal.lineW,
        fractal.color
      );
      return;
    }

    // Короткий запис змінних для читабельності коду
    const x = section.pStart.x;
    const y = section.pStart.y;
    const _a = section.angle;
    const step = section.length / 4;

    // Ітераційна секція (в наступній ітерації ця секція знову поділиться на 8 відрізків)
    const sections = [
      new Section(new Point(x, y), step, (_a + 0) % 360),
      new Section(
        new Point(x + step * cos(_a), y + step * sin(_a)),
        step,
        (_a + 90) % 360
      ),
      new Section(
        new Point(
          x + step * (cos(_a) - sin(_a)),
          y + step * (sin(_a) + cos(_a))
        ),
        step,
        (_a + 0) % 360
      ),
      new Section(
        new Point(
          x + step * (2 * cos(_a) - sin(_a)),
          y + step * (2 * sin(_a) + cos(_a))
        ),
        step,
        (_a + 270) % 360
      ),
      new Section(
        new Point(x + step * (2 * cos(_a)), y + step * (2 * sin(_a))),
        step,
        (_a + 270) % 360
      ),
      new Section(
        new Point(
          x + step * (2 * cos(_a) + sin(_a)),
          y + step * (2 * sin(_a) - cos(_a))
        ),
        step,
        (_a + 0) % 360
      ),
      new Section(
        new Point(
          x + step * (3 * cos(_a) + sin(_a)),
          y + step * (3 * sin(_a) - cos(_a))
        ),
        step,
        (_a + 90) % 360
      ),
      new Section(
        new Point(x + step * (3 * cos(_a)), y + step * (3 * sin(_a))),
        step,
        (_a + 0) % 360
      ),
    ];
    for (let sect of sections) recursive(sect, color, width, depth - 1);
  }
}
function DrawFractalAlgebraical(canvas, fractal, scale) {}
