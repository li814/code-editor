
import {
    MatchDecorator,
    Decoration,
    DecorationSet,
    EditorView,
    ViewPlugin,
    ViewUpdate,
    WidgetType
} from "@codemirror/view";

export const decorationPlugin = () => {
    // 集成 WidgetType
    class PlaceholderWidget extends WidgetType {
        name:string
        constructor(name:string) {
            super()
            this.name = name
        }
          eq(other: PlaceholderWidget) {
            return this.name == other.name
        }
        // 创建标签样式
        toDOM(view: EditorView): HTMLElement {
            let elt = document.createElement("span")
            elt.style.cssText = `
                border: 1px solid blue;
                border-radius: 4px;
                padding: 0 3px;
                background: lightblue;
            `
            elt.textContent = this.name
            return elt
        }
        ignoreEvent(event: Event): boolean {
            return false
        }
    }
    // 匹配
    const placeholderMatcher = new MatchDecorator({
        regexp: /\[\[(\w+)\]\]/g,
        decoration: match => Decoration.replace({
            widget: new PlaceholderWidget(match[1]),
        })
    })
    const placeholders = ViewPlugin.fromClass(class {
        placeholders: DecorationSet
        constructor(view: EditorView) {
            this.placeholders = placeholderMatcher.createDeco(view)
        }
        update(update: ViewUpdate) {
            this.placeholders = placeholderMatcher.updateDeco(update, this.placeholders)
        }
        
    }, {
        decorations: instance => instance.placeholders,
        provide: plugin => EditorView.atomicRanges.of(view => {
            return view.plugin(plugin)?.placeholders || Decoration.none
        })
    })
    return placeholders
}