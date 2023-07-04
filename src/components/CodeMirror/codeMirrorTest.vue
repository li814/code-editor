<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { basicSetup } from 'codemirror'
import { EditorView, keymap, ViewUpdate } from '@codemirror/view'
import { indentWithTab } from '@codemirror/commands'
import { EditorState } from '@codemirror/state'
import { javascript, esLint, javascriptLanguage, scopeCompletionSource } from "@codemirror/lang-javascript";
import { lintGutter, linter } from "@codemirror/lint";
import Linter from "eslint4b-prebuilt";

import { decorationPlugin } from './decModule'

const editorPanel = ref<HTMLElement | null>(null)
let editor: any = null

// 自定义快捷键
function commandKeyMap(tag: any) {
	return keymap.of([{
		key: 'Ctrl-m',
		run() {
			console.log('tag', tag)
			return false // 若返回false，则会继续执行默认的快捷键
		}
	}])
}
function listenerView(update: ViewUpdate) {
	const { docChanged } = update
	// 判断文档是否更改
	if (docChanged) {
		console.log('update', update)
	}
}

let state = EditorState.create({
	doc: `console.log('hello')`, // 初始化模板
	extensions: [
		basicSetup,
		javascript(),
		javascriptLanguage.data.of({
			autocomplete: scopeCompletionSource(window)
		}),
		lintGutter(),
		linter(esLint(new Linter())),
		keymap.of([indentWithTab]),
		commandKeyMap('A'),
		EditorView.updateListener.of(listenerView),
		// 插入样式块
		decorationPlugin()
	],
})
// 添加标记
function addMark() {
	let transaction = editor.state.update({ changes: { from: editor.state.doc.length, insert: ` [[name]]` } })
	editor.dispatch(transaction)
}
onMounted(() => {
	editor = new EditorView({
		state: state,
		parent: editorPanel.value!
	})
})
onBeforeUnmount(() => {
	editor.destroy()
})
</script>
<template>
	<div class="main">
		<div class="btn" @click="addMark">添加name</div>
		<div class="contain" ref="editorPanel"></div>
	</div>
</template>
<style lang="less" scoped>
.main {
	.btn {
		width: 120px;
		height: 30px;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 20px;
		border: 1px solid #ccc;
		cursor: pointer;
	}

	.contain {
		width: 500px;
		height: 200px;
		// border: 1px solid #ccc;
	}
}
</style>