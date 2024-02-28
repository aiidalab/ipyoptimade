import _ from 'https://cdn.jsdelivr.net/npm/underscore@1.13.6/+esm'

// List of lists of elements, used to render the periodic table
// Only values accepted:
// - strings (should be valid elements, not checked);
// - empty strings (empty space, nothing rendered);
// - '*' character (printed as a disabled element).
// These assumptions are used both in the generation of the elementList
// and in the template.
const elementTable = [
  ["H", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "He"],
  [
    "Li",
    "Be",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "B",
    "C",
    "N",
    "O",
    "F",
    "Ne"
  ],
  [
    "Na",
    "Mg",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "Al",
    "Si",
    "P",
    "S",
    "Cl",
    "Ar"
  ],
  [
    "K",
    "Ca",
    "Sc",
    "Ti",
    "V",
    "Cr",
    "Mn",
    "Fe",
    "Co",
    "Ni",
    "Cu",
    "Zn",
    "Ga",
    "Ge",
    "As",
    "Se",
    "Br",
    "Kr"
  ],
  [
    "Rb",
    "Sr",
    "Y",
    "Zr",
    "Nb",
    "Mo",
    "Tc",
    "Ru",
    "Rh",
    "Pd",
    "Ag",
    "Cd",
    "In",
    "Sn",
    "Sb",
    "Te",
    "I",
    "Xe"
  ],
  [
    "Cs",
    "Ba",
    "*",
    "Hf",
    "Ta",
    "W",
    "Re",
    "Os",
    "Ir",
    "Pt",
    "Au",
    "Hg",
    "Tl",
    "Pb",
    "Bi",
    "Po",
    "At",
    "Rn"
  ],
  [
    "Fr",
    "Ra",
    "#",
    "Rf",
    "Db",
    "Sg",
    "Bh",
    "Hs",
    "Mt",
    "Ds",
    "Rg",
    "Cn",
    "Nh",
    "Fi",
    "Mc",
    "Lv",
    "Ts",
    "Og"
  ],
  ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  [
    "",
    "",
    "*",
    "La",
    "Ce",
    "Pr",
    "Nd",
    "Pm",
    "Sm",
    "Eu",
    "Gd",
    "Tb",
    "Dy",
    "Ho",
    "Er",
    "Tm",
    "Yb",
    "Lu"
  ],
  [
    "",
    "",
    "#",
    "Ac",
    "Th",
    "Pa",
    "U",
    "Np",
    "Pu",
    "Am",
    "Cm",
    "Bk",
    "Cf",
    "Es",
    "Fm",
    "Md",
    "No",
    "Lr"
  ]
]

// Flat list of elements, used for validation and cleaning up of the
// selectedElements list.
const elementList = []
for (const elementRow of elementTable) {
  for (const elementName of elementRow) {
    if (elementName === "" || elementName === "*") {
      continue
    } else {
      elementList.push(elementName)
    }
  }
}

// TODO: move template to external file to make it more readable, see
// http://codebeerstartups.com/2012/12/how-to-improve-templates-in-backbone-js-learning-backbone-js/
const tableTemplate = _.template(
  "<% for (let elementRow of elementTable) { " +
    "print(\"<div class='periodic-table-row'>\"); " +
    "for (let elementName of elementRow) { " +
    'if ( (elementName === "") || (elementName == "*" ) || (elementName == "#" ) ) { %>' +
    '  <span class="periodic-table-empty noselect" style="width: <%= elementWidth %>; height: <%= elementWidth %>;"><%= elementName %></span>' +
    "<% } else { %>" +
    '  <span class="<% if (disabledElements.includes(elementName)) { print(" periodic-table-disabled"); } else { print(" periodic-table-entry"); }%> ' +
    ' noselect element-<%= elementName %><% if (selectedElements.includes(elementName) && (! disabledElements.includes(elementName)) ) { print(" elementOn"); } %>" ' +
    'style="width: <%= elementWidth %>; height: <%= elementWidth %>; ' +
    'border-color: <% if (disabled) { colors = borderColor.replace(/[^\\d,]/g, "").split(","); ' +
    "red = Math.round(255 - 0.38 * ( 255 - parseInt(colors[0], 10) )); " +
    "green = Math.round(255 - 0.38 * ( 255 - parseInt(colors[1], 10) )); " +
    "blue = Math.round(255 - 0.38 * ( 255 - parseInt(colors[2], 10) )); " +
    'print("rgb(" + red.toString(10) + "," + green.toString(10) + "," + blue.toString(10) + ")"); ' +
    "} else { print(borderColor); } %>; " +
    "background-color: <% if (disabledElements.includes(elementName)) { color = disabledColor; } " +
    "else if (selectedElements.includes(elementName)) { " +
    "i = selectedElements.indexOf(elementName); color = selectedColors[selectedStates[i]]; " +
    "} else { color = unselectedColor; } " +
    'if (disabled) { colors = color.replace(/[^\\d,]/g, "").split(","); ' +
    "red = Math.round(255 - 0.38 * ( 255 - parseInt(colors[0], 10) )); " +
    "green = Math.round(255 - 0.38 * ( 255 - parseInt(colors[1], 10) )); " +
    "blue = Math.round(255 - 0.38 * ( 255 - parseInt(colors[2], 10) )); " +
    'print("rgb(" + red.toString(10) + "," + green.toString(10) + "," + blue.toString(10) + ")"); ' +
    '} else { print(color); } %>"' +
    // 'title="state: <% if (selectedElements.includes(elementName)) { i = selectedElements.indexOf(elementName); print(selectedStates[i]);} '+
    // 'else if (disabledElements.includes(elementName)){print("disabled");} else {print("unselected");} %>" ><% '+
    "><% print(displayNamesReplacements[elementName] || elementName); %></span>" +
    '<% } }; print("</div>"); } %>'
)

class PeriodicTableView {

  constructor({ el, model }) {
    this.el = el
    this.model = model
  }


  render() {
    // add event listener

    // I render the widget
    this.rerenderScratch()

    // I bind on_change events
    this.model.on("change:selected_elements", this.rerenderScratch, this)
    this.model.on("change:disabled_elements", this.rerenderScratch, this)
    this.model.on(
      "change:display_names_replacements",
      this.rerenderScratch,
      this
    )
    this.model.on("change:border_color", this.rerenderScratch, this)
    this.model.on("change:width", this.rerenderScratch, this)
    this.model.on("change:disabled", this.rerenderScratch, this)
  }

  rerenderScratch() {
    //         Re-render full widget when the list of selected elements
    //         changed from python
    const selectedElements = this.model.get("selected_elements")
    const disabledElements = this.model.get("disabled_elements")
    const disabledColor = this.model.get("disabled_color")
    const unselectedColor = this.model.get("unselected_color")
    const selectedColors = this.model.get("selected_colors")
    const newSelectedColors = selectedColors.slice()
    const elementWidth = this.model.get("width")
    const borderColor = this.model.get("border_color")

    let newSelectedElements = []
    const newSelectedStates = []

    if ("Du" in selectedElements) {
      return
    }

    for (const key in selectedElements) {
      newSelectedElements.push(key)
      newSelectedStates.push(selectedElements[key])
    }

    if (newSelectedElements.length !== newSelectedStates.length) {
      return
    }

    //         Here I want to clean up the two elements lists, to avoid
    //         to have unknown elements in the selectedElements, and
    //         to remove disabled Elements from the selectedElements list.
    //         I use s variable to check if anything changed, so I send
    //         back the data to python only if needed

    const selectedElementsLength = newSelectedElements.length
    //         Remove disabled elements from the selectedElements list
    newSelectedElements = _.difference(newSelectedElements, disabledElements)
    //         Remove unknown elements from the selectedElements list
    newSelectedElements = _.intersection(newSelectedElements, elementList)

    const changed = newSelectedElements.length !== selectedElementsLength

    //         call the update (to python) only if I actually removed/changed
    //         something
    if (changed) {
      //             Make a copy before setting
      // while (newSelectedElements.length > newSelectedStates.length){
      //   newSelectedStates.push(0);
      // };

      for (const key in selectedElements) {
        if (!newSelectedElements.includes(key)) {
          delete selectedElements[key]
        }
      }

      this.model.set("selected_elements", selectedElements)
      this.touch()
    }

    //         Render the full widget using the template
    this.el.innerHTML =
      '<div class="periodic-table-body">' +
      tableTemplate({
        elementTable: elementTable,
        displayNamesReplacements: this.model.get("display_names_replacements"),
        selectedElements: newSelectedElements,
        disabledElements: disabledElements,
        disabledColor: disabledColor,
        unselectedColor: unselectedColor,
        selectedColors: newSelectedColors,
        selectedStates: newSelectedStates,
        elementWidth: elementWidth,
        borderColor: borderColor,
        disabled: this.model.get("disabled")
      }) +
      "</div>"

    function myFunction(event) {
      console.log("tttttt")
      const classNames = _.map(event.target.classList, a => {
        return a
      })
      const elementName = _.chain(classNames)
        .filter(a => {
          return a.startsWith("element-")
        })
        .map(a => {
          return a.slice("element-".length)
        })
        .first()
        .value()

      const isOn = _.includes(classNames, "elementOn")
      const isDisabled = _.includes(classNames, "periodic-table-disabled")
      // If this button is disabled, do not do anything
      // (Actually, this function should not be triggered if the button
      // is disabled, this is just a safety measure)

      const states = this.model.get("states")
      const disabled = this.model.get("disabled")

      if (disabled) {
        return
      }

      // Check if we understood which element we are
      if (typeof elementName !== "undefined") {
        const currentList = this.model.get("selected_elements")
        // NOTE! it is essential to duplicate the list,
        // otherwise the value will not be updated.

        let newList = []
        const newStatesList = []

        for (const key in currentList) {
          newList.push(key)
          newStatesList.push(currentList[key])
        }

        const num = newList.indexOf(elementName)

        if (isOn) {
          // remove the element from the selected_elements

          if (newStatesList[num] < states - 1) {
            newStatesList[num]++
            currentList[elementName] = newStatesList[num]
          } else {
            newList = _.without(newList, elementName)
            newStatesList.splice(num, 1)
            delete currentList[elementName]
            // Swap CSS state
            event.target.classList.remove("elementOn")
          }
        } else if (!isDisabled) {
          // add the element from the selected_elements
          newList.push(elementName)
          newStatesList.push(0)
          currentList[elementName] = 0
          // Swap CSS state
          event.target.classList.add("elementOn")
        } else {
          return
        }

        // Update the model (send back data to python)
        // I have to make some changes, since there is some issue
        // for Dict in Traitlets, which cannot trigger the update
        this.model.set("selected_elements", { Du: 0 })
        this.touch()
        this.model.set("selected_elements", currentList)
        this.touch()
      }
    }

    this.elementEntries = this.el.querySelectorAll(".periodic-table-entry")

    // add listenter to each element
    for (const elementEntry of this.elementEntries) {
      console.log("tttt")
      elementEntry.addEventListener("click", myFunction.bind(this))
    }
  }

  destroy() {
    // TODO: remove event listeners
  }
}

function modelWithSerializers(model, serializers) {
  return {
    get(key) {
      const value = model.get(key);
      const serializer = serializers[key];
      if (serializer) return serializer.deserialize(value);
      return value;
    },
    set(key, value) {
      const serializer = serializers[key];
      if (serializer) value = serializer.serialize(value);
      model.set(key, value);
    },
    on: model.on.bind(model),
    save_changes: model.save_changes.bind(model),
    send: model.send.bind(model),
  }
}

async function render({ model, el }) {
  const view = new PeriodicTableView({
    el: el,
    model: modelWithSerializers(model, {
      // TODO: add serializers
    }),
  });
  view.render();
  return () => view.destroy();
}

export default { render }