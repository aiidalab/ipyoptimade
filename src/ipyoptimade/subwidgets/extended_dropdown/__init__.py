import anywidget
import pathlib
from ipywidgets.widgets.widget_selection import _Selection


class ExtendedDropdown(anywidget.AnyWidget, _Selection):
    _esm = pathlib.Path(__file__).parent / "index.js"
    # _css = pathlib.Path(__file__).parent / "index.css"
