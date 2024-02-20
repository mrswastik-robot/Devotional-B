
'use client'

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";

import ListItem from "@tiptap/extension-list-item";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";



import {
  FaBold,
  FaHeading,
  FaItalic,
  FaListOl,
  FaListUl,
  FaQuoteLeft,
  FaRedo,
  FaStrikethrough,
  FaUnderline,
  FaUndo,
} from "react-icons/fa";

const MenuBar = ({ editor }) => {

  if (!editor) {
    return null;
  }

  return (
    <div className="pb-5 flex items-left px-4 border rounded-lg py-3 mt-4 gap-x-4">
      <div className=" flex gap-4">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "is_active" : ""}
        >
          <FaBold />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "is_active" : ""}
        >
          <FaItalic />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive("underline") ? "is_active" : ""}
        >
          <FaUnderline />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive("strike") ? "is_active" : ""}
        >
          <FaStrikethrough />
        </button>

      </div>
      
    </div>
  );
};

// const extensions = [
//   Color.configure({ types: [TextStyle.name, ListItem.name] }),
//   TextStyle.configure({ types: [ListItem.name] }),
//   StarterKit.configure({
//     bulletList: {
//       keepMarks: true,
//       keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
//     },
//     orderedList: {
//       keepMarks: true,
//       keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
//     },
//   })
// ];

export const Tiptap = ({ setDescription }) => {
  const editor = useEditor({
    extensions: [StarterKit, Underline ,
      Placeholder.configure({
        placeholder: "Write ...",
        placeholderClassName: "text-gray-400",
        emptyNodeText: "Write ...",
        
      }),
    ],
    content: ``,
    editorProps: {
      attributes: {
        class: "prose rounded-lg border border-input   ring-offset-2 disabled:opacity-50  min-h-[10rem] p-4 py-[8rem]",
      },
    },
    

    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setDescription(html);
      // console.log("HTML", html);
    },
  });

  return (
    <div className="">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} className=" min-h-[15rem] rounded-lg"  />
    </div>
  );
};