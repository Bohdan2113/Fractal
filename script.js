class Fractal {
  constructor(id, type, unitCount = baseUnitCount, name = null) {
    this.id = id;
    this.type = type;
    this.systemUnitCount = unitCount;
    this.name = name ? name : `Fractal-${this.id}`;
  }
  Clear() {
    this.systemUnitCount = baseUnitCount;
  }
}
const FractalType = {
  MINKOVSKOGO: "Minkovskogo",
  ALGEBRAICAL: "Algebraical",
};

const $ = document.querySelector.bind(document);
let fractalList = [];
let currentFractal = null;
let baseUnitCount = 50;
const minUnitCount = 1;
const maxUnitCount = 1000;

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
      let step = currentFractal.systemUnitCount / 30;
      if (delta > 0)
        currentFractal.systemUnitCount = Math.max(
          minUnitCount,
          currentFractal.systemUnitCount - step
        );
      else
        currentFractal.systemUnitCount = Math.min(
          maxUnitCount,
          currentFractal.systemUnitCount + step
        );

      Redraw($("#myCanvas"), currentFractal);
    },
    { passive: false }
  );

  // const unitsCountField = $("#unit-count");
  // const xField = $("#x-field");
  // const yField = $("#y-field");
  // const diapasonYStartField = $("#diapasonY-start");
  // const diapasonYEndField = $("#diapasonY-end");
  // const diapasonYStepField = $("#diapasonY-step");
  // const diapasonIStartField = $("#diapasonI-start");
  // const diapasonIEndField = $("#diapasonI-end");
  // const diapasonTStartField = $("#diapasonT-start");
  // const diapasonTEndField = $("#diapasonT-end");

  // unitsCountField.min = 1;
  // unitsCountField.max = canvas.height / 2 - coordSystemMargin;

  // const fields = [
  //   { field: xField, errorId: "#error-message-point" },
  //   { field: yField, errorId: "#error-message-point" },
  //   { field: diapasonYStartField, errorId: "#error-message-optionY" },
  //   { field: diapasonYEndField, errorId: "#error-message-optionY" },
  //   { field: diapasonYStepField, errorId: "#error-message-optionY" },
  //   { field: diapasonIStartField, errorId: "#error-message-optionPolinom" },
  //   { field: diapasonIEndField, errorId: "#error-message-optionPolinom" },
  //   { field: diapasonTStartField, errorId: "#error-message-optionPolinom" },
  //   { field: diapasonTEndField, errorId: "#error-message-optionPolinom" },
  //   { field: unitsCountField, errorId: "#error-message-unit" },
  // ];

  // // Обробка неправильного введення
  // fields.forEach(({ field, errorId }) => {
  //   field.addEventListener("input", (event) =>
  //     hideErrorMessage(event, errorId)
  //   );
  //   field.addEventListener("input", (event) => checkInterval(event, errorId));
  // });

  // // Подія зміни методу
  // const paramMethod = document.getElementById("params-method");
  // const recursiveMethod = document.getElementById("recursive-method");
  // paramMethod.addEventListener("change", MethodChange);
  // recursiveMethod.addEventListener("change", MethodChange);

  // // Створення точок подвійним кліком
  // canvas.addEventListener("dblclick", function (event) {
  //   const { x, y } = ClickToCoord(event.clientX, event.clientY);
  //   CreatePointDoubleClick(x, y);
  // });

  // // Перетягнення точок
  // canvas.addEventListener("mousedown", (event) => {
  //   ToogleBlocks($(".points-container"), $("#addpoint-container"));
  //   const hoverP = ClickToCoord(event.clientX, event.clientY);
  //   draggedPoint = FindClosestPoint(hoverP, 0.2);
  // });
  // canvas.addEventListener("mousemove", (event) => {
  //   if (!draggedPoint) return;

  //   // Оновлюємо координати точки
  //   const { x, y } = ClickToCoord(event.clientX, event.clientY);
  //   draggedPoint.x = x;
  //   draggedPoint.y = y;
  //   const draggedLiText = $(`#point-${draggedPoint.id} h3`);
  //   if (draggedLiText) {
  //     draggedLiText.textContent = draggedPoint.coords;
  //   }

  //   Redraw(); // Перемальовуємо
  // });
  // canvas.addEventListener("mouseup", () => {
  //   draggedPoint = null; // Відпускаємо точку
  // });

  // // Видалення точок
  // canvas.addEventListener("contextmenu", (event) => {
  //   event.preventDefault(); // Відміна стандартного контекстного меню

  //   const hoverP = ClickToCoord(event.clientX, event.clientY);
  //   const closestPoint = FindClosestPoint(hoverP, 0.2);

  //   DeletePoint(closestPoint.id);
  // });

  // // Перегляд інформації про точку
  // canvas.addEventListener("mousemove", (event) => {
  //   const hoverP = ClickToCoord(event.clientX, event.clientY);
  //   const closePoint = FindClosestPoint(hoverP, 0.2);

  //   if (closePoint) {
  //     const infoPanel = $("#point-info-panel");
  //     const { clientX, clientY } = event; // Отримуємо координати курсора
  //     infoPanel.style.display = "block";
  //     infoPanel.style.position = "absolute";
  //     infoPanel.style.left = `${clientX + 10}px`; // Відступ від курсора
  //     infoPanel.style.top = `${clientY + 10}px`; // Відступ від курсора
  //     infoPanel.innerHTML = `
  //     <p>${closePoint.coords}</p>
  //     `;
  //   } else {
  //     const infoPanel = $("#point-info-panel");
  //     infoPanel.style.display = "none";
  //     infoPanel.innerHTML = "";
  //   }
  // });

  // // Зміна кольору кривої
  // $("#curve-color").addEventListener("change", (event) => Redraw());
};

// function SealOptions(stan) {
//   const optionsData = $(".options-data");
//   if (stan !== undefined) optionsData.style.display = stan;
//   else
//     optionsData.style.display = optionsData.style.display === "" ? "block" : "";
// }
// function MethodChange(event) {
//   const paramMethod = document.getElementById("params-method");
//   const recursiveMethod = document.getElementById("recursive-method");

//   if (event.target === paramMethod) {
//     if (pointList.length > maxPointsForParams) {
//       paramMethod.checked = false;
//       alert(
//         `Maximum points for Params method is 20 delete some points to change method for this.`
//       );
//       return;
//     }
//     paramMethod.checked = true;
//     recursiveMethod.checked = false;
//   } else {
//     if (pointList.length > maxPointsForRecursive) {
//       recursiveMethod.checked = false;
//       alert(
//         `Maximum points for Recursive method is 20 delete some points to change method for this.`
//       );
//       return;
//     }
//     recursiveMethod.checked = true;
//     paramMethod.checked = false;
//   }

//   if (paramMethod.checked) {
//     BezierCurveMethod = ParamMethod;
//     maxPointPossible = maxPointsForParams;
//   } else if (recursiveMethod.checked) {
//     BezierCurveMethod = RecursiveMethod;
//     maxPointPossible = maxPointsForRecursive;
//   }

//   Redraw();
// }

// function FindClosestPoint(clickP, radius) {
//   return pointList.find(
//     (point) => Math.hypot(point.x - clickP.x, point.y - clickP.y) < radius
//   );
// }
// function SetRestrictionsForInput() {
//   const xField = $("#x-field");
//   const yField = $("#y-field");
//   const diapasonYStartField = $("#diapasonY-start");
//   const diapasonYEndField = $("#diapasonY-end");
//   const diapasonIStartField = $("#diapasonI-start");
//   const diapasonIEndField = $("#diapasonI-end");
//   const diapasonTStartField = $("#diapasonT-start");
//   const diapasonTEndField = $("#diapasonT-end");
//   const diapasonYStep = $("#diapasonY-step");

//   Point.minX = -1 * unitCount;
//   Point.maxX = unitCount;
//   Point.minY = -1 * unitCount;
//   Point.maxY = unitCount;

//   xField.min = -1 * unitCount;
//   xField.max = unitCount;
//   yField.min = -1 * unitCount;
//   yField.max = unitCount;

//   diapasonYStartField.min = -1 * unitCount;
//   diapasonYStartField.max = unitCount;
//   diapasonYEndField.min = -1 * unitCount;
//   diapasonYEndField.max = unitCount;
//   diapasonYStep.min = 0;
//   diapasonYStep.max = 1 / deltaT + 1;

//   diapasonIStartField.min = 0;
//   diapasonIStartField.max = 0;
//   diapasonIEndField.min = 0;
//   diapasonIEndField.max = 0;

//   diapasonTStartField.min = 0;
//   diapasonTStartField.max = 1;
//   diapasonTEndField.min = 0;
//   diapasonTEndField.max = 1;
// }
// function ToCanvas(x, y) {
//   const canvas = $("#myCanvas");
//   const centerX = canvas.width / 2;
//   const centerY = canvas.height / 2;
//   const sideLength = canvas.height / 2 - coordSystemMargin;
//   const unitSize = sideLength / (unitCount + 1);

//   return {
//     x: x * unitSize + centerX,
//     y: centerY - y * unitSize,
//   };
// }
// function ClickToCoord(x, y) {
//   const canvas = $("#myCanvas");
//   const rect = canvas.getBoundingClientRect();
//   const sideLength = canvas.height / 2 - coordSystemMargin;
//   const unitSize = sideLength / (unitCount + 1);

//   return {
//     x: (x - rect.left - canvas.width / 2) / unitSize,
//     y: (canvas.height / 2 - (y - rect.top)) / unitSize,
//   };
// }
// function CanvasToCoord(x, y) {
//   const canvas = $("#myCanvas");
//   const sideLength = canvas.height / 2 - coordSystemMargin;
//   const unitSize = sideLength / (unitCount + 1);

//   return {
//     x: (x - canvas.width / 2) / unitSize,
//     y: (canvas.height / 2 - y) / unitSize,
//   };
// }

function CreateProjectBut(fractalType) {
  const lastfractalId = fractalList?.length ? fractalList.at(-1).id : -1;

  const newFractal = new Fractal(lastfractalId + 1, fractalType);
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
  UpdatePreviewCanvas(currentFractal);
  UpdateInLocalStorage(currentFractal);

  ToogleBlocks($("#home"), $("#work"));
  ClearWork();
  currentFractal = null;
}
function SaveAsBut() {
  UpdatePreviewCanvas(currentFractal);
  UpdateInLocalStorage(currentFractal);

  const canvas = $("#myCanvas");
  const link = document.createElement("a");
  link.download = `Fractal_${currentFractal.id}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}
function ClearFractalBut() {
  currentFractal.Clear();
  FillFormValues(currentFractal);

  Redraw($("#myCanvas"), currentFractal);
  UpdatePreviewCanvas(currentFractal);
  UpdateInLocalStorage(currentFractal);
}
function CreateFractalBut() {
  ReadFormValues(currentFractal);

  Redraw($("#myCanvas"), currentFractal);
  UpdatePreviewCanvas(currentFractal);
  UpdateInLocalStorage(currentFractal);
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
    <canvas class="fsaved-preview" width="200" height="140"></canvas>
  `;

  parent.appendChild(newProject);
  UpdatePreviewCanvas(fractal);
}
function FillFormValues(fractal) {
  $("#fractal-type").value = fractal.type;
  $("#fractal-name").value = fractal.name;
}
function ReadFormValues(fractal) {
  const fractalName = $("#fractal-name").value;
  if (fractalName === "") fractalName = fractalName.value = "noname";
  fractal.name = fractalName;
}
function OpenProject(projectId_str) {
  const savedId = parseInt(projectId_str.match(/\d+/)[0], 10);
  currentFractal = fractalList.find((f) => f.id === savedId);
  FillFormValues(currentFractal);

  Redraw($("#myCanvas"), currentFractal);
  ToogleBlocks($("#work"), $("#home"));
}
// function SeeCurveBut() {
//   const seeCanvas = $("#seeCanvas");
//   DrawCurve(seeCanvas, pointList, BezierCurveMethod);

//   $(".modal-overlay-canvas").classList.add("show");
//   $(".curve-output").classList.add("show");
// }
// function OutputCanvasClose() {
//   $(".modal-overlay-canvas").classList.remove("show");
//   $(".curve-output").classList.remove("show");

//   ClearCanvas($("#seeCanvas"));
// }

function ClearWork() {
  ClearCanvas($("#myCanvas"));
  ClearForm();
}
function ClearCanvas(canvas) {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
function ClearForm() {
  $("#fractal-type").value = "";
  $("#fractal-name").value = "";
}
// function ClearmethodChoose() {
//   const paramMethod = document.getElementById("params-method");
//   const recursiveMethod = document.getElementById("recursive-method");

//   recursiveMethod.checked = false;
//   paramMethod.checked = true;
// }
// function ClearPointsList() {
//   pointList.forEach((p) => {
//     RemovePointFromList(p.id);
//   });
// }
// function ClearCurveFields() {
//   $("#curve-color").value = "#000000";
// }
// function ClearPointFields() {
//   const xField = $("#x-field");
//   xField.value = "";
//   xField.dispatchEvent(new Event("input"));

//   const yField = $("#y-field");
//   yField.value = "";
//   yField.dispatchEvent(new Event("input"));

//   $("#point-color").value = "#000000";

//   let confirmButton = $(".create-point-but");
//   confirmButton.removeEventListener("click", saveEditListener);
//   confirmButton.removeEventListener("click", CreatePointBut);
// }
// function ClearOptionYFields() {
//   const diapasonYStart = $("#diapasonY-start");
//   diapasonYStart.value = "";
//   diapasonYStart.dispatchEvent(new Event("input"));

//   const diapasonYEnd = $("#diapasonY-end");
//   diapasonYEnd.value = "";
//   diapasonYEnd.dispatchEvent(new Event("input"));

//   const diapasonYCount = $("#diapasonY-step");
//   diapasonYCount.value = "";
//   diapasonYCount.dispatchEvent(new Event("input"));
// }
// function ClearOptionsPolinomsFields() {
//   const diapasonIStart = $("#diapasonI-start");
//   diapasonIStart.value = "";
//   diapasonIStart.dispatchEvent(new Event("input"));

//   const diapasonIEnd = $("#diapasonI-end");
//   diapasonIEnd.value = "";
//   diapasonIEnd.dispatchEvent(new Event("input"));

//   const diapasonTStart = $("#diapasonT-start");
//   diapasonTStart.value = "";
//   diapasonTStart.dispatchEvent(new Event("input"));

//   const diapasonTEnd = $("#diapasonT-end");
//   diapasonTEnd.value = "";
//   diapasonTEnd.dispatchEvent(new Event("input"));
// }
// function ClearOptionOutput() {
//   $(".modal-overlay h3").textContent = "";

//   const outputList = $("#output-list");
//   while (outputList.firstChild) {
//     outputList.removeChild(outputList.firstChild);
//   }
// }

// function CheckUnitCount() {
//   const unitCountField = $("#unit-count");
//   if (unitCountField.value === "") {
//     showErrorMessage("Enter units count", "#error-message-unit");
//     unitCountField.style.border = "1px solid red";
//     return false;
//   }

//   const value = parseInt(unitCountField.value);
//   const min = parseInt(unitCountField.min);
//   const max = parseInt(unitCountField.max);

//   if (value > max || value < min) {
//     showErrorMessage(
//       value + " is out of range [" + min + ", " + max + "]",
//       "#error-message-unit"
//     );
//     unitCountField.style.border = "1px solid red";

//     return false;
//   }

//   return true;
// }

// function AddNewBut() {
//   $(".addpoint-header h3").textContent = "Add point";
//   let confirmButton = $(".create-point-but");
//   confirmButton.textContent = "Create";
//   confirmButton.addEventListener("click", CreatePointBut);

//   ToogleBlocks($("#addpoint-container"), $(".points-container"));
// }
// let saveEditListener;
// function EditPoint(id) {
//   const point = pointList.find((p) => p.id === id);
//   $("#x-field").value = point.x;
//   $("#y-field").value = point.y;
//   $("#point-color").value = point.color;

//   $(".addpoint-header h3").textContent = "Edit";
//   let confirmButton = $(".create-point-but");
//   confirmButton.textContent = "Save";
//   saveEditListener = () => {
//     SavePointBut(point);
//   };
//   confirmButton.addEventListener("click", saveEditListener);

//   ToogleBlocks($("#addpoint-container"), $(".points-container"));
// }
// function DeletePoint(id) {
//   RemovePointFromList(id);
//   Redraw();
// }
// function CloseAddPointBut() {
//   ToogleBlocks($(".points-container"), $("#addpoint-container"));
//   ClearPointFields();
// }

// function CreateNewPoint_Base(x, y, color) {
//   if (pointList.length === maxPointPossible) {
//     alert(
//       `You can't add more points. Maximum is ${maxPointPossible}. Try to delete some points or use other method of creation.`
//     );
//     return;
//   }

//   let newPoint = new Point(x, y, color);
//   const ul = $(".points-list");
//   pointList.push(newPoint);
//   AddToListUL(newPoint, ul);
//   return true;
// }
// function CreatePointBut() {
//   if (!ValidateForm("point")) return;

//   const pointValues = {
//     x: parseFloat($("#x-field").value),
//     y: parseFloat($("#y-field").value),
//     color: $("#point-color").value,
//   };
//   if (!CreateNewPoint_Base(pointValues.x, pointValues.y, pointValues.color))
//     return;

//   Redraw();
//   ToogleBlocks($(".points-container"), $("#addpoint-container"));
//   ClearPointFields();
// }
// function CreatePointDoubleClick(x, y) {
//   const canvas = $("#myCanvas");

//   if (x > Point.maxX) x = Point.maxX;
//   if (y > Point.maxY) y = Point.maxY;
//   if (x < Point.minX) x = Point.minX;
//   if (y < Point.minY) y = Point.minY;

//   if (!CreateNewPoint_Base(x, y, "#000")) return;

//   Redraw();
//   ToogleBlocks($(".points-container"), $("#addpoint-container"));
// }
// function SavePointBut(point) {
//   if (!ValidateForm("point")) return;
//   const pointValues = {
//     x: parseFloat($("#x-field").value),
//     y: parseFloat($("#y-field").value),
//     color: $("#point-color").value,
//   };
//   let isChanged = false;

//   if (point.x !== pointValues.x) {
//     point.x = pointValues.x;
//     isChanged = true;
//   }
//   if (point.y !== pointValues.y) {
//     point.y = pointValues.y;
//     isChanged = true;
//   }
//   if (point.color !== pointValues.color) {
//     point.color = pointValues.color;
//     isChanged = true;
//   }
//   if (isChanged) {
//     document.getElementById(`${point.id}-info`).textContent = `${point.coords}`;
//     document.getElementById(
//       `${point.id}-color`
//     ).style.backgroundColor = `${point.color}`;
//     Redraw();
//   }

//   ToogleBlocks($(".points-container"), $("#addpoint-container"));
//   ClearPointFields();
// }

// function AddToListUL(newPoint, ul) {
//   const li = document.createElement("li");
//   li.id = `point-${newPoint.id}`;
//   li.draggable = true; // Додаємо можливість перетягування
//   li.innerHTML = `
//         <div>
//           <span id="${newPoint.id}-color" class="point-color" style="background-color: ${newPoint.color};"></span>
//           <h3 id="${newPoint.id}-info">${newPoint.coords}</h3>
//         </div>
//         <div>
//           <button class="button-edit" onclick="EditPoint(${newPoint.id})">
//             <img src="/Images/pencil.png">
//           </button>
//           <button class="button-delete" onclick="DeletePoint(${newPoint.id})">
//             <img src="/Images/bin.png">
//           </button>
//         </div>
//   `;

//   // Додаємо обробники подій для перетягування
//   li.addEventListener("dragstart", handleDragStart);
//   li.addEventListener("dragover", handleDragOver);
//   li.addEventListener("dragleave", handleDragLeave);
//   li.addEventListener("drop", handleDrop);

//   ul.appendChild(li);

//   $(".points-header h3").textContent = `Points: ${pointList.length}`;
// }
// function RemovePointFromList(id) {
//   const li = document.getElementById(`point-${id}`);
//   if (li) {
//     li.remove();
//   }
//   pointList = pointList.filter((p) => p.id !== id);

//   $(".points-header h3").textContent = `Points: ${pointList.length}`;
// }

// function ShowPointsYBut() {
//   if (!ValidateForm("optionY")) return;

//   const startField = $("#diapasonY-start");
//   const endField = $("#diapasonY-end");
//   const startValue = parseInt(startField.value);
//   const endValue = parseInt(endField.value);
//   /*Validate diapasons*/ {
//     if (startValue > endValue) {
//       showErrorMessage(
//         "Diapason start must be less than end.",
//         "#error-message-optionY"
//       );
//       startField.style.border = "1px solid red";
//       endField.style.border = "1px solid red";
//       return;
//     } else {
//       startField.style.border = "1px solid black";
//       endField.style.border = "1px solid black";
//     }
//   }

//   $(
//     ".modal-overlay h3"
//   ).textContent = `Points in diapason Y:[${startValue};${endValue}]`;

//   const outputList = $("#output-list");
//   const filteredPoints = curvePoints.filter(
//     (point) => point.y >= startValue && point.y <= endValue
//   );

//   let countYLeft = parseFloat($("#diapasonY-step").value);
//   let step = 1;
//   const length = filteredPoints.length;
//   let lengthLeft = length;
//   if (lengthLeft === 0)
//     CreateMassageOutput(
//       "There is no points of Bezier's curve in given diapason."
//     );
//   else if (countYLeft === 1)
//     CreatePointOutput(filteredPoints[parseInt(lengthLeft / 2)]);
//   else {
//     for (let i = 1; i <= length && countYLeft > 0; i += step) {
//       CreatePointOutput(filteredPoints[i - 1]);
//       lengthLeft -= step;
//       countYLeft--;

//       step = parseInt(lengthLeft / countYLeft);
//       if (step === 0) {
//         CreateMassageOutput(`There is only ${length} points in this dispason`);
//         break;
//       }
//     }
//   }

//   document.querySelector(".modal-overlay").classList.add("show");
//   document.querySelector(".options-output").classList.add("show");

//   function CreatePointOutput(point) {
//     const li = document.createElement("li");
//     const colorCircle = document.createElement("span");
//     colorCircle.style.display = "inline-block";
//     colorCircle.style.width = "10px";
//     colorCircle.style.height = "10px";
//     colorCircle.style.borderRadius = "50%";
//     colorCircle.style.backgroundColor = "black";
//     colorCircle.style.marginRight = "10px";

//     li.appendChild(colorCircle);
//     li.appendChild(
//       document.createTextNode(
//         `Point: (X: ${point.x.toFixed(5)}, ` + `Y: ${point.y.toFixed(5)})`
//       )
//     );
//     outputList.appendChild(li);
//   }
//   function CreateMassageOutput(message) {
//     const p = document.createElement("p");
//     p.appendChild(document.createTextNode(message));
//     outputList.appendChild(p);
//   }
// }
// function CalculatePolinomsBut() {
//   const iStartField = $("#diapasonI-start");
//   const iEndField = $("#diapasonI-end");
//   const iStartValue = parseInt(iStartField.value);
//   const iEndValue = parseInt(iEndField.value);
//   iStartField.max = pointList.length - 1 > 0 ? pointList.length - 1 : 0;
//   iEndField.max = pointList.length - 1 > 0 ? pointList.length - 1 : 0;

//   if (!ValidateForm("optionPolinom")) return;

//   const tStartField = $("#diapasonT-start");
//   const tEndField = $("#diapasonT-end");
//   const tStartValue = parseFloat(tStartField.value);
//   const tEndValue = parseFloat(tEndField.value);
//   /*Validate diapasons*/ {
//     let isWrong = false;
//     if (iStartValue > iEndValue) {
//       showErrorMessage(
//         "Diapason start must be less than end.",
//         "#error-message-optionPolinom"
//       );
//       iStartField.style.border = "1px solid red";
//       iEndField.style.border = "1px solid red";
//       isWrong = true;
//     } else {
//       iStartField.style.border = "1px solid black";
//       iEndField.style.border = "1px solid black";
//     }

//     if (tStartValue > tEndValue) {
//       showErrorMessage(
//         "Diapason start must be less than end.",
//         "#error-message-optionPolinom"
//       );
//       tStartField.style.border = "1px solid red";
//       tEndField.style.border = "1px solid red";
//       isWrong = true;
//     } else {
//       tStartField.style.border = "1px solid black";
//       tEndField.style.border = "1px solid black";
//     }
//     if (isWrong) return;
//   }

//   const outputList = $("#output-list");
//   const n = pointList.length - 1;
//   if (n < 0) {
//     showErrorMessage(
//       "There is no points. Add some points at the curve",
//       "#error-message-optionPolinom"
//     );
//     return;
//   } else iStartField.dispatchEvent(new Event("input"));

//   const tD = 0.1;
//   $(".modal-overlay h3").innerHTML =
//     "Polynoms b<sub>in</sub>(t) in diapason " +
//     `i:[${iStartValue};${iEndValue}], t:[${tStartValue};${tEndValue}], tD=${tD}`;

//   let tCur = tStartValue;
//   while (tCur <= tEndValue) {
//     for (let i = iStartValue; i <= iEndValue; i++) {
//       const li = document.createElement("li");
//       li.innerHTML =
//         `Polynom b<sub>${i},${n}</sub>(${Math.round(tCur * 10) / 10}): ` +
//         Math.round(PolynomBernshteina(i, n, tCur) * Math.pow(10, 5)) /
//           Math.pow(10, 5);
//       outputList.appendChild(li);
//     }
//     tCur += tD;
//   }

//   document.querySelector(".modal-overlay").classList.add("show");
//   document.querySelector(".options-output").classList.add("show");
// }
// function OutputClose() {
//   $(".modal-overlay").classList.remove("show");
//   $(".options-output").classList.remove("show");

//   ClearOptionOutput();
// }

// function ValidateForm(formId) {
//   const form = document.getElementById(formId);
//   if (!form) {
//     console.error(`Form with id "${formId}" not found.`);
//     return false;
//   }

//   const coordFields = Array.from(form.querySelectorAll("input"));
//   let emptyFields = FilterEmptyFields(coordFields);

//   if (emptyFields.length !== 0) {
//     console.log(emptyFields);
//     emptyFields.forEach((f) => (f.style.border = "1px solid red"));

//     let message = "All fields must be defined";
//     showErrorMessage(message, `#error-message-${formId}`);
//     return false;
//   }

//   for (let i = 0; i < coordFields.length; i++) {
//     const value = parseFloat(coordFields[i].value);
//     const min = parseFloat(coordFields[i].min);
//     const max = parseFloat(coordFields[i].max);

//     if (value > max || value < min) {
//       coordFields[i].style.border = "1px solid red";
//       showErrorMessage(
//         `${value} is out of range [${min}, ${max}]`,
//         `#error-message-${formId}`
//       );
//       return false;
//     }
//   }

//   return true;

//   function FilterEmptyFields(fields) {
//     let emptyFields = [];
//     for (let i = 0; i < fields.length; i++)
//       if (!fields[i].value.trim()) emptyFields.push(fields[i]);

//     return emptyFields;
//   }
// }

// function checkInterval(event, errorId) {
//   const diapasonIStartField = $("#diapasonI-start");
//   const diapasonIEndField = $("#diapasonI-end");
//   diapasonIStartField.max = pointList.length - 1 > 0 ? pointList.length - 1 : 0;
//   diapasonIEndField.max = pointList.length - 1 > 0 ? pointList.length - 1 : 0;

//   const value = parseFloat(event.target.value);
//   const min = parseFloat(event.target.min);
//   const max = parseFloat(event.target.max);

//   if (value === "") return;
//   if (value < min || value > max) {
//     showErrorMessage(
//       value + " is out of range [" + min + ", " + max + "]",
//       errorId
//     );
//     event.target.style.border = "1px solid red";
//   }
// }
// function hideErrorMessage(event, errorId) {
//   let errorElement = $(errorId);

//   errorElement.style.display = "none";
//   event.target.style.border = "1px solid black";
// }
// function showErrorMessage(message, where) {
//   let errorElement = $(where);
//   errorElement.textContent = message;

//   errorElement.style.display = "block"; // Показати повідомлення
// }

function Redraw(canvas, fractal, scale = 1) {
  ClearCanvas(canvas);
  DrawCoords(canvas, fractal.systemUnitCount, scale);
}
function DrawCoords(canvas, unitCount, scale) {
  const ctx = canvas.getContext("2d");
  ctx.scale(scale, scale);

  const leftSizingLuft = canvas.width / 24;
  const bottomSizingLuft = canvas.height / 18;
  const shtrichSize = canvas.width / 60;
  const betweenShrichCount = 3;
  const numberShift = canvas.width / 180;
  fontSize = canvas.width / 90;
  let precision = 0;

  const centerX = leftSizingLuft;
  const centerY = canvas.height - bottomSizingLuft;
  const xLength = canvas.width - leftSizingLuft;
  const yLength = centerY;
  const unitLength = Math.max(xLength, yLength) / unitCount;
  const segmentLength = GetSegmentLength(unitCount, unitLength);

  ctx.beginPath(); // Fill with color
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.closePath();

  ctx.beginPath(); // coordinate system
  ctx.lineWidth = 1;
  ctx.strokeStyle = "black";
  ctx.moveTo(centerX, 0);
  ctx.lineTo(centerX, canvas.height);
  ctx.moveTo(0, centerY);
  ctx.lineTo(canvas.width, centerY);
  ctx.stroke();
  ctx.closePath();

  ctx.beginPath(); // coord segments
  ctx.font = `${fontSize}px Arial`;
  ctx.lineWidth = 1;
  ctx.strokeStyle = "black";
  DrawUnitsY(true);
  DrawUnitsX(true);
  ctx.stroke();
  ctx.closePath();

  ctx.beginPath(); // Намалювати сітку на підписаних координатах
  ctx.lineWidth = 0.2;
  ctx.strokeStyle = "black";
  DrawGrid(segmentLength);
  ctx.stroke();
  ctx.closePath();

  ctx.beginPath(); // Намалювати сітку на малих координатах
  ctx.lineWidth = 0.1;
  ctx.strokeStyle = "black";
  DrawGrid(segmentLength / (betweenShrichCount + 1));
  ctx.stroke();
  ctx.closePath();

  function GetSegmentLength() {
    const factors = [2, 2.5, 2];
    let index = 0;
    let baseLover = 10;
    let baseUpper = 20;
    let interval = 1;

    if (unitCount < baseLover) {
      do {
        baseLover /= factors[index];
        interval /= factors[index++];
        if (index >= factors.length) index = 0;
        if (index === 1) precision++;
      } while (unitCount < baseLover);

      return interval * unitLength;
    } else if (unitCount >= baseUpper) {
      do {
        interval *= factors[index++];
        if (index >= factors.length) index = 0;
        baseUpper *= factors[index];
      } while (unitCount >= baseUpper);

      return interval * unitLength;
    } else return interval * unitLength;
  }
  function DrawUnitsY(isNumerate) {
    const shtrichCount = Math.floor(yLength / segmentLength);
    const startX = centerX - shtrichSize;
    const endX = centerX;

    for (var i = 1; i <= shtrichCount; i++) {
      let Y = centerY - i * segmentLength;

      ctx.moveTo(startX, Y);
      ctx.lineTo(endX, Y);

      for (let j = 1; j <= betweenShrichCount; j++) {
        ctx.moveTo(startX, Y + (j * segmentLength) / (betweenShrichCount + 1));
        ctx.lineTo(
          endX - 10,
          Y + (j * segmentLength) / (betweenShrichCount + 1)
        );
      }

      if (isNumerate) {
        const textX = endX - (numberShift + shtrichSize);
        const textY = Y;
        ctx.fillStyle = "black";
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
    const startY = centerY + shtrichSize;
    const endY = centerY;
    const startNum = 0;

    for (var i = startNum + 1; i <= shtrichCount; i++) {
      let X = centerX + i * segmentLength;

      ctx.moveTo(X, startY);
      ctx.lineTo(X, endY);

      for (let j = 1; j <= betweenShrichCount; j++) {
        ctx.moveTo(X - (j * segmentLength) / (betweenShrichCount + 1), startY);
        ctx.lineTo(
          X - (j * segmentLength) / (betweenShrichCount + 1),
          endY + 10
        );
      }

      if (isNumerate) {
        const textX = X;
        const textY = startY + numberShift;
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";

        const num =
          Math.round(
            i * (segmentLength / unitLength) * Math.pow(10, precision)
          ) / Math.pow(10, precision);
        ctx.fillText(num, textX, textY);
      }
    }
    if (isNumerate) {
      const textX = centerX - numberShift * 2;
      const textY = centerY + numberShift * 2;
      ctx.fillStyle = "black";
      ctx.textAlign = "right";
      ctx.textBaseline = "top";

      const num = startNum;
      ctx.fillText(num, textX, textY);
    }
  }
  function DrawGrid(gap) {
    const lineHCount = canvas.height / (gap + 1);
    const lineWCount = canvas.width / (gap + 1);
    for (let i = 0; i <= lineHCount; i++) {
      let _Y = centerY - i * gap;

      ctx.moveTo(centerX, _Y);
      ctx.lineTo(canvas.width, _Y);
    }
    for (let i = 0; i <= lineWCount; i++) {
      let X = centerX + i * gap;
      ctx.moveTo(X, 0);
      ctx.lineTo(X, centerY);
    }
  }
}
// function DrawPoints(canvas, points, r = 4) {
//   // Get canvas context
//   const ctx = canvas.getContext("2d");

//   points.forEach((p) => {
//     const { x, y } = ToCanvas(p.x, p.y);

//     // Draw point
//     ctx.beginPath();
//     ctx.strokeStyle = p.color;
//     ctx.fillStyle = p.color;
//     ctx.arc(x, y, r, 0, 2 * Math.PI, (anticlockwise = false));
//     ctx.stroke();
//     ctx.fill();
//   });
// }
// function DrawLine(canvas, pStart, pEnd, width, color) {
//   const ctx = canvas.getContext("2d");

//   ctx.beginPath();
//   ctx.strokeStyle = color;
//   ctx.lineWidth = width;
//   ctx.moveTo(pStart.x, pStart.y);
//   ctx.lineTo(pEnd.x, pEnd.y);
//   ctx.stroke();
// }

// function Factorial(n) {
//   if (n < 0) return undefined; // Для від'ємних чисел факторіал не існує
//   let result = 1;
//   for (let i = 1; i <= n; i++) {
//     result *= i;
//   }
//   return result;
// }

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
        fractal.systemUnitCount,
        fractal.name
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
