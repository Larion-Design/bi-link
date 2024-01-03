import React, { useCallback, useRef } from 'react'
import { createReactEditorJS } from 'react-editor-js'
import Table from '@editorjs/table'
import Paragraph from '@editorjs/paragraph'
import List from '@editorjs/list'
import Warning from '@editorjs/warning'
import LinkTool from '@editorjs/link'
import Header from '@editorjs/header'
import Quote from '@editorjs/quote'
import Marker from '@editorjs/marker'
import CheckList from '@editorjs/checklist'
import Delimiter from '@editorjs/delimiter'
import SimpleImage from '@editorjs/simple-image'

export const tools = {
  paragraph: Paragraph,
  table: Table,
  list: List,
  warning: Warning,
  linkTool: LinkTool,
  header: Header,
  quote: Quote,
  marker: Marker,
  checklist: CheckList,
  delimiter: Delimiter,
  simpleImage: SimpleImage,
}

const toolNames = {
  Text: 'Paragraf',
  Heading: 'Titlu',
  List: 'Lista',
  Warning: 'Avertisment',
  Checklist: 'Lista 2',
  Quote: 'Citat',
  Delimiter: 'Delimitator',
  Table: 'Tabel',
  Link: 'Link',
  Marker: 'Marcaj',
  Bold: 'Bold',
  Italic: 'Italic',
  'Simple Image': 'Imagine',
}

const ReactEditorJS = createReactEditorJS()

type EditorInstance = Parameters<Parameters<typeof ReactEditorJS>[0]['onInitialize']>[0]

type Props = {
  data: unknown[]
}

export const Editor: React.FunctionComponent<Props> = ({ data }) => {
  const editor = useRef<EditorInstance | null>(null)

  const onInitialize = useCallback((instance: EditorInstance) => {
    editor.current = instance
  }, [])

  const save = useCallback(async () => editor.current?.save(), [editor.current])
  const clear = useCallback(async () => editor.current?.clear(), [editor.current])
  const setData = useCallback(async (blocks) => editor.current.render(blocks), [editor.current])

  return (
    <>
      <ReactEditorJS
        i18n={{
          messages: {
            toolNames,
          },
        }}
        onInitialize={onInitialize}
        tools={tools}
        inlineToolbar={true}
        defaultValue={{
          blocks: data.map(({ value, type }) => ({
            type,
            data: value,
          })),
        }}
      />
    </>
  )
}
